const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  // Flexible name field - supports both 'fullName' (Tarana) and 'name' (Shivam)
  fullName: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  // Tarana specific fields
  inquiryType: {
    type: String,
    enum: ['product', 'bulk', 'customization', 'support', 'other'],
    default: null
  },
  // Shivam specific fields
  company: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  // Track which project submitted the form
  source: {
    type: String,
    enum: ['tarana', 'shivam'],
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);

