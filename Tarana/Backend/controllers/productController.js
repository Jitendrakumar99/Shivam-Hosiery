const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const { clearCache } = require('../middlewares/cache');

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
    const { category, categoryId, categorySlug, parentId, parentSlug, parent, search, status = 'active' } = req.query;
    const { startIndex, limit } = req.pagination || { startIndex: 0, limit: 10 };

    // Base product match (product status)
    const baseMatch = { status };

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
      // Exclude products with missing category or inactive category
      { $match: { 'categoryDoc.status': 'active' } },
    ];

    // Search by product title + subcategory name + parent category name
    if (escapedSearch) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: escapedSearch, $options: 'i' } },
            { description: { $regex: escapedSearch, $options: 'i' } },
            { shortDescription: { $regex: escapedSearch, $options: 'i' } },
            { 'categoryDoc.name': { $regex: escapedSearch, $options: 'i' } },
            { 'parentDoc.name': { $regex: escapedSearch, $options: 'i' } },
          ]
        }
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

    if (!search) {
      pipeline.push({ $skip: startIndex });
      pipeline.push({ $limit: limit });
    }

    const [products, totalAgg] = await Promise.all([
      Product.aggregate(pipeline),
      Product.aggregate([...countPipeline, { $count: 'total' }])
    ]);

    const total = totalAgg[0]?.total || 0;

    res.json({
      success: true,
      count: products.length,
      pagination: search ? null : {
        currentPage: Math.floor(startIndex / limit) + 1,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      },
      data: products
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
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    clearCache('/api/products');

    res.status(201).json({
      success: true,
      data: product
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
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    clearCache('/api/products');
    clearCache(`/api/products/${req.params.id}`);

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
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

