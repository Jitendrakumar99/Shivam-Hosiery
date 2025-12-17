const DeliveryZone = require('../models/DeliveryZone');

// @desc    Get all delivery zones (public - used by frontend checkout)
// @route   GET /api/delivery-zones
// @access  Public
exports.getZones = async (req, res, next) => {
  try {
    const zones = await DeliveryZone.find({ status: 'active' }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: zones.length,
      data: zones,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create delivery zone
// @route   POST /api/delivery-zones
// @access  Private/Admin
exports.createZone = async (req, res, next) => {
  try {
    const zone = await DeliveryZone.create(req.body);

    res.status(201).json({
      success: true,
      data: zone,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery zone
// @route   PUT /api/delivery-zones/:id
// @access  Private/Admin
exports.updateZone = async (req, res, next) => {
  try {
    let zone = await DeliveryZone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Delivery zone not found',
      });
    }

    zone = await DeliveryZone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: zone,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete delivery zone
// @route   DELETE /api/delivery-zones/:id
// @access  Private/Admin
exports.deleteZone = async (req, res, next) => {
  try {
    const zone = await DeliveryZone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Delivery zone not found',
      });
    }

    await zone.deleteOne();

    res.json({
      success: true,
      message: 'Delivery zone deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


