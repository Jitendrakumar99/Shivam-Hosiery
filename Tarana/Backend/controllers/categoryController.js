const Category = require('../models/Category');
const Product = require('../models/Product');
const { clearCache } = require('../middlewares/cache');
// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const { status, parent, populateChildren } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    if (parent !== undefined) {
      query.parent = parent === 'null' || parent === '' ? null : parent;
    }

    let categoriesQuery = Category.find(query)
      .populate('parent', 'name slug')
      .sort({ name: 1 });

    // If populateChildren is true, also populate the children virtual field
    if (populateChildren === 'true') {
      categoriesQuery = categoriesQuery.populate('children');
    }

    const categories = await categoriesQuery;

    // Enforce rule: subcategories must not expose images
    const sanitized = categories.map((c) => {
      const obj = c.toObject ? c.toObject() : c;
      const isSubCategory = !!(obj.parent);
      if (isSubCategory) {
        return { ...obj, image: '' };
      }
      return obj;
    });

    res.json({
      success: true,
      count: sanitized.length,
      data: sanitized
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category?.parent ? { ...category.toObject(), image: '' } : category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    // Enforce rule: subcategories must not store image
    if (req.body?.parent) {
      req.body.image = '';
    }
    const category = await Category.create(req.body);

    clearCache('/api/categories');

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const prevName = category.name;
    const wasParentCategory = !category.parent;
    
    // Enforce rule: subcategories must not store image
    if (category.parent) {
      req.body.image = '';
    }
    
    // If this was a parent category, ensure parent stays null (don't allow converting parent to subcategory)
    // Only allow parent field changes if explicitly set to null or if it was already a subcategory
    if (wasParentCategory && req.body.parent !== null && req.body.parent !== undefined) {
      // Don't allow changing a parent category to a subcategory
      delete req.body.parent;
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    clearCache('/api/categories');
    clearCache(`/api/categories/${req.params.id}`);
    clearCache('/api/products');

    // If category name changed, sync embedded category name in products
    if (prevName !== category.name) {
      await Product.updateMany(
        { 'category.id': category._id },
        { $set: { 'category.name': category.name } }
      );
      clearCache('/api/products');
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await category.deleteOne();

    clearCache('/api/categories');
    clearCache(`/api/categories/${req.params.id}`);
    clearCache('/api/products');

    res.json({
      success: true,
      message: 'Category deleted'
    });
  } catch (error) {
    next(error);
  }
};
