const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  updateReviewStatus,
  addAdminReply,
  likeReview,
  dislikeReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middlewares/auth');
const { paginate } = require('../middlewares/pagination');
const { cache } = require('../middlewares/cache');
const Review = require('../models/Review');

// Public routes
router.get('/product/:productId', paginate(Review), cache(300), getProductReviews);

// Protected routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/like', protect, likeReview);
router.put('/:id/dislike', protect, dislikeReview);

// Admin routes
router.put('/:id/status', protect, authorize('admin'), updateReviewStatus);
router.put('/:id/reply', protect, authorize('admin'), addAdminReply);

module.exports = router;
