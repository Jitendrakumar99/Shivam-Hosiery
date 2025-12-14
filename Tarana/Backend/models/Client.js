const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  logo: {
    type: String
  },
  websiteUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for search
clientSchema.index({ name: 'text' });
clientSchema.index({ status: 1, category: 1 });

module.exports = mongoose.model('Client', clientSchema);

