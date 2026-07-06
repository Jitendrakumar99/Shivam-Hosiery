const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const { clearCache } = require('../middlewares/cache');
const {
  sanitizeProductForPublic,
  getTotalStock,
  isLowStock,
  LOW_STOCK_THRESHOLD,
} = require('../utils/inventory');

const notifyAdminsLowStockIfNeeded = async (product, previousTotal = null) => {
  const currentTotal = getTotalStock(product);
  if (currentTotal >= LOW_STOCK_THRESHOLD) return;
  if (previousTotal !== null && previousTotal < LOW_STOCK_THRESHOLD) return;

  try {
    const admins = await User.find({ role: 'admin', isActive: { $ne: false } }).select('_id');
    await Promise.all(
      admins.map((admin) =>
        Notification.create({
          user: admin._id,
          type: 'system',
          title: 'Low Stock Alert',
          message: `"${product.title}" has ${currentTotal} unit(s) left (below ${LOW_STOCK_THRESHOLD}).`,
          link: '/products',
        })
      )
    );
  } catch (error) {
    console.error('Failed to send low stock notifications:', error);
  }
};

const isAdminRequest = (req) => req.user?.role === 'admin';

const formatProductResponse = (product, req) => {
  const withStockMeta = (doc) => ({
    ...doc,
    totalStock: getTotalStock(doc),
    lowStock: isLowStock(doc),
  });

  if (isAdminRequest(req)) {
    const doc = product.toObject ? product.toObject() : product;
    return withStockMeta(doc);
  }
  return sanitizeProductForPublic(product);
};

// Helper function to normalize category name
const normalizeCategory = (category) => {
  if (!category) return null;
  // If category is object (e.g. from query parser or mistake), try to get name or return null
  if (typeof category !== 'string') {
    return category.name || category.toString();
  }

  // Convert URL format to database format
  const categoryMap = {
    'safety-vests': 'Safety Vests',
    'safety-jackets': 'Safety Jackets',
    'coveralls': 'Coveralls',
    'safety vests': 'Safety Vests',
    'safety jackets': 'Safety Jackets'
  };

  // Check if it's already in the correct format
  const validCategories = ['Safety Vests', 'Safety Jackets', 'Coveralls'];
  if (validCategories.includes(category)) {
    return category;
  }

  // Try to match from categoryMap (case-insensitive)
  const lowerCategory = category.toLowerCase().replace(/\+/g, ' ').replace(/-/g, ' ');
  for (const [key, value] of Object.entries(categoryMap)) {
    if (key.toLowerCase() === lowerCategory || value.toLowerCase() === lowerCategory) {
      return value;
    }
  }

  // If no match, try direct case-insensitive match
  const matched = validCategories.find(cat =>
    cat.toLowerCase() === lowerCategory ||
    cat.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase().replace(/\s+/g, '-')
  );

  return matched || category; // Return original if no match found
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      categoryId,
      categorySlug,
      parentId,
      parentSlug,
      parent,
      search,
      status,
    } = req.query;
    const isAdmin = isAdminRequest(req);
    const requestedLimit = parseInt(req.query.limit, 10);
    const maxLimit = isAdmin ? 500 : 100;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = !isNaN(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, maxLimit)
      : (isAdmin ? 100 : 20);
    const startIndex = (page - 1) * limit;

    // Product status filter (admin can list all / inactive)
    let baseMatch;
    const statusParam = status || (isAdmin ? 'all' : 'active');
    if (isAdmin && statusParam === 'all') {
      baseMatch = { status: { $in: ['active', 'inactive'] } };
    } else if (statusParam === 'inactive') {
      baseMatch = { status: 'inactive' };
    } else {
      baseMatch = { status: 'active' };
    }

    // We'll apply search after category lookups so we can search by subcategory + parent category too.
    const escapedSearch = search ? search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : null;

    // Category filter settings
    const categoryFilters = [];
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      categoryFilters.push({ 'categoryDoc._id': new mongoose.Types.ObjectId(categoryId) });
    }
    if (categorySlug) {
      categoryFilters.push({ 'categoryDoc.slug': categorySlug.toString().toLowerCase() });
    }
    if (category) {
      const normalizedCategory = normalizeCategory(category);
      categoryFilters.push({ 'categoryDoc.name': normalizedCategory });
    }

    // Parent category filters (include products whose category is the parent itself or a child with that parent)
    const parentFilters = [];
    if (parentId && mongoose.Types.ObjectId.isValid(parentId)) {
      const pid = new mongoose.Types.ObjectId(parentId);
      parentFilters.push({ 'categoryDoc.parent': pid });
      parentFilters.push({ 'categoryDoc._id': pid });
    }
    if (parentSlug) {
      const ps = parentSlug.toString().toLowerCase();
      // We'll also join parent category to filter by its slug reliably
      parentFilters.push({ 'categoryDoc.slug': ps });
      parentFilters.push({ 'parentDoc.slug': ps });
    }
    if (parent) {
      const normalizedParent = normalizeCategory(parent);
      parentFilters.push({ 'categoryDoc.name': normalizedParent });
      parentFilters.push({ 'parentDoc.name': normalizedParent });
    }

    const pipeline = [
      { $match: { ...baseMatch } },
      // Join categories to enforce category status filtering
      {
        $lookup: {
          from: 'categories',
          localField: 'category.id',
          foreignField: '_id',
          as: 'categoryDoc'
        }
      },
      { $unwind: { path: '$categoryDoc', preserveNullAndEmptyArrays: true } },
      // Lookup parent category for parent-based filtering
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryDoc.parent',
          foreignField: '_id',
          as: 'parentDoc'
        }
      },
      { $unwind: { path: '$parentDoc', preserveNullAndEmptyArrays: true } },
      // Allow products with no category or with active category
      {
        $match: {
          $or: [
            { 'categoryDoc.status': 'active' },
            { 'categoryDoc': { $exists: false } },
            { 'categoryDoc': null }
          ]
        }
      },
    ];

    // Storefront: hide products tied to inactive categories (allow missing category)
    if (!isAdmin) {
      pipeline.push({
        $match: {
          $or: [{ 'categoryDoc.status': 'active' }, { categoryDoc: null }],
        },
      });
    }

    // Search across title, description, SKU, category, and variants
    if (escapedSearch) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: escapedSearch, $options: 'i' } },
            { description: { $regex: escapedSearch, $options: 'i' } },
            { shortDescription: { $regex: escapedSearch, $options: 'i' } },
            { sku: { $regex: escapedSearch, $options: 'i' } },
            { 'category.name': { $regex: escapedSearch, $options: 'i' } },
            { 'categoryDoc.name': { $regex: escapedSearch, $options: 'i' } },
            { 'parentDoc.name': { $regex: escapedSearch, $options: 'i' } },
            { 'variants.size': { $regex: escapedSearch, $options: 'i' } },
            { 'variants.color': { $regex: escapedSearch, $options: 'i' } },
            { 'variants.sku': { $regex: escapedSearch, $options: 'i' } },
          ],
        },
      });
    }

    if (categoryFilters.length > 0) {
      pipeline.push({ $match: { $or: categoryFilters } });
    }
    if (parentFilters.length > 0) {
      pipeline.push({ $match: { $or: parentFilters } });
    }

    // Sorting and pagination
    pipeline.push({ $sort: { createdAt: -1 } });
    const countPipeline = pipeline.map(stage => ({ ...stage }));

    pipeline.push({ $skip: startIndex });
    pipeline.push({ $limit: limit });

    const [products, totalAgg] = await Promise.all([
      Product.aggregate(pipeline),
      Product.aggregate([...countPipeline, { $count: 'total' }]),
    ]);

    const total = totalAgg[0]?.total || 0;

    const formattedProducts = products.map((p) => formatProductResponse(p, req));

    res.json({
      success: true,
      count: formattedProducts.length,
      pagination: {
        currentPage: page,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        totalItems: total,
        itemsPerPage: limit,
      },
      data: formattedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Ensure product's category is active
    if (product.category?.id) {
      const cat = await Category.findById(product.category.id).select('status');
      if (!cat || cat.status !== 'active') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
    } else {
      // No category id -> hide product
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: formatProductResponse(product, req)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    let productData = req.body;

    // If data is sent as a string (common with FormData), parse it
    if (typeof req.body.data === 'string') {
      productData = JSON.parse(req.body.data);
    }
    if (req.body.images && req.body.images.length > 0) {
      // Merge with existing images if any (e.g. from a copied product or URL)
      productData.images = [...(productData.images || []), ...req.body.images];
    }

    const product = await Product.create(productData);

    await product.save();
    clearCache('/api/products');

    if (isLowStock(product)) {
      await notifyAdminsLowStockIfNeeded(product);
    }

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    next(error);
  }
};

// @desc    Create products in bulk
// @route   POST /api/products/bulk
// @access  Private/Admin
exports.createProductsBulk = async (req, res, next) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of products'
      });
    }

    // Use Product.create instead of insertMany to trigger pre-save hooks (like handle generation)
    const createdProducts = await Product.create(products);

    clearCache('/api/products');

    res.status(201).json({
      success: true,
      count: createdProducts.length,
      data: createdProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let productData = req.body;

    // If data is sent as a string (common with FormData), parse it
    if (typeof req.body.data === 'string') {
      productData = JSON.parse(req.body.data);
    }

    const gst_percentage = productData.gst_percentage;

    // Validate GST percentage if provided
    if (gst_percentage !== undefined && (gst_percentage < 0 || isNaN(gst_percentage))) {
      return res.status(400).json({
        success: false,
        message: 'GST percentage must be a non-negative number.'
      });
    }

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const previousTotal = getTotalStock(existingProduct);

    // If images were uploaded and processed by middleware
    if (req.body.images && req.body.images.length > 0) {
      // Merge with existing images (the ones user kept in the form)
      productData.images = [...(productData.images || []), ...req.body.images];
    }

    // Update fields on existing document to ensure 'save' hook runs
    Object.keys(productData).forEach(key => {
      existingProduct[key] = productData[key];
    });

    const product = await existingProduct.save();

    clearCache('/api/products');

    if (isLowStock(product)) {
      await notifyAdminsLowStockIfNeeded(product, previousTotal);
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    clearCache('/api/products');
    clearCache(`/api/products/${req.params.id}`);

    res.json({
      success: true,
      message: 'Product deleted'
    });
  } catch (error) {
    next(error);
  }
};

