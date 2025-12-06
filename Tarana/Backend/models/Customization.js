const mongoose = require('mongoose');

const customizationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  productType: {
    type: String,
    required: true,
    enum: ['safety-vest', 'safety-jacket', 'coverall']
  },
  primaryColor: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  reflectiveTape: {
    type: Boolean,
    default: false
  },
  companyLogo: {
    type: String
  },
  logoPlacement: {
    type: String,
    enum: ['Front Center', 'Back Center', 'Left Chest', 'Right Chest', 'Sleeve']
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  estimatedPrice: {
    type: Number
  },
  previewImage: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'processing', 'completed'],
    default: 'draft'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customization', customizationSchema);

