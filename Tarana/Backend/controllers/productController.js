const Product = require('../models/Product');
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
    const { category, search, status = 'active' } = req.query;
    const { startIndex, limit } = req.pagination || { startIndex: 0, limit: 10 };

    // Build query
    const query = { status };
    if (category) {
      const normalizedCategory = normalizeCategory(category);
      query['category.name'] = normalizedCategory;
    }
    if (search) {
      // Use regex for case-insensitive partial matching instead of text search
      // Escape special regex characters
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
        { shortDescription: { $regex: escapedSearch, $options: 'i' } }
      ];
    }

    // When searching, skip pagination to show all results
    let products;
    if (search) {
      products = await Product.find(query)
        .sort({ createdAt: -1 });
    } else {
      products = await Product.find(query)
        .skip(startIndex)
        .limit(limit)
        .sort({ createdAt: -1 });
    }

    const total = await Product.countDocuments(query);

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

    if (!product) {
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

