const Brand = require('../models/Brand');
const { paginate } = require('../middlewares/pagination');

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = async (req, res, next) => {
  try {
    const { status = 'active', search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const brands = await Brand.find(query)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: brands.length,
      data: brands
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Public
exports.getBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create brand
// @route   POST /api/brands
// @access  Private/Admin
exports.createBrand = async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);

    res.status(201).json({
      success: true,
      data: brand
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Brand name already exists'
      });
    }
    next(error);
  }
};

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
exports.updateBrand = async (req, res, next) => {
  try {
    let brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Brand name already exists'
      });
    }
    next(error);
  }
};

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    await brand.deleteOne();

    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

