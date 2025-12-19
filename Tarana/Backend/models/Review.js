const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending'
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  dislikes: {
    type: Number,
    default: 0,
    min: 0
  },
  adminReply: {
    message: {
      type: String,
      default: ''
    },
    repliedAt: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Index for queries
reviewSchema.index({ productId: 1, status: 1 });
reviewSchema.index({ 'user.id': 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
