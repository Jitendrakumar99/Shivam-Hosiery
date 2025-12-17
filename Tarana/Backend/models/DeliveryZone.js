const mongoose = require('mongoose');

const deliveryZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Zone name is required'],
      trim: true,
    },
    pincodes: [
      {
        type: String,
        trim: true,
      },
    ],
    deliveryCharge: {
      type: Number,
      required: [true, 'Delivery charge is required'],
      min: 0,
      default: 0,
    },
    estimatedDays: {
      type: Number,
      required: [true, 'Estimated days is required'],
      min: 1,
      default: 1,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

deliveryZoneSchema.index({ status: 1 });
deliveryZoneSchema.index({ pincodes: 1 });

module.exports = mongoose.model('DeliveryZone', deliveryZoneSchema);


