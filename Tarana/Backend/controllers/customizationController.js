const Customization = require('../models/Customization');
const { clearCache } = require('../middlewares/cache');

// @desc    Create customization request
// @route   POST /api/customizations
// @access  Private
exports.createCustomization = async (req, res, next) => {
  try {
    const customization = await Customization.create({
      ...req.body,
      user: req.user.id
    });

    clearCache('/api/customizations');

    res.status(201).json({
      success: true,
      data: customization
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user customizations
// @route   GET /api/customizations
// @access  Private
exports.getCustomizations = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { startIndex, limit } = req.pagination || { startIndex: 0, limit: 10 };

    const query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }
    if (status) {
      query.status = status;
    }

    const customizations = await Customization.find(query)
      .populate('user', 'name email')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Customization.countDocuments(query);

    res.json({
      success: true,
      count: customizations.length,
      pagination: {
        currentPage: Math.floor(startIndex / limit) + 1,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      },
      data: customizations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customization
// @route   GET /api/customizations/:id
// @access  Private
exports.getCustomization = async (req, res, next) => {
  try {
    const customization = await Customization.findById(req.params.id)
      .populate('user', 'name email');

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: 'Customization not found'
      });
    }

    if (req.user.role !== 'admin' && customization.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      data: customization
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customization status
// @route   PUT /api/customizations/:id/status
// @access  Private/Admin
exports.updateCustomizationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const customization = await Customization.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: 'Customization not found'
      });
    }

    clearCache('/api/customizations');
    clearCache(`/api/customizations/${req.params.id}`);

    res.json({
      success: true,
      data: customization
    });
  } catch (error) {
    next(error);
  }
};

