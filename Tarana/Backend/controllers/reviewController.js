const Review = require('../models/Review');
const Product = require('../models/Product');
const { clearCache } = require('../middlewares/cache');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
exports.getReviews = async (req, res, next) => {
  try {
    const { status, sort = '-createdAt' } = req.query;
    const { startIndex, limit } = req.pagination || { startIndex: 0, limit: 10 };

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const reviews = await Review.find(query)
      .populate('productId', 'title name images')
      .skip(startIndex)
      .limit(limit)
      .sort(sort);

    const total = await Review.countDocuments(query);

    // Transform reviews to include product info in the format expected by admin
    const formattedReviews = reviews.map(review => {
      const reviewObj = review.toObject();
      return {
        ...reviewObj,
        product: reviewObj.productId
      };
    });

    res.json({
      success: true,
      count: formattedReviews.length,
      pagination: {
        currentPage: Math.floor(startIndex / limit) + 1,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      },
      data: formattedReviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const { status = 'approved', sort = '-createdAt' } = req.query;
    const { startIndex, limit } = req.pagination || { startIndex: 0, limit: 10 };

    const query = { productId: req.params.productId };
    if (status) {
      query.status = status;
    }

    const reviews = await Review.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort(sort);

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      count: reviews.length,
      pagination: {
        currentPage: Math.floor(startIndex / limit) + 1,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      },
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment, images } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      'user.id': req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Create review
    const review = await Review.create({
      productId,
      user: {
        id: req.user.id,
        name: req.user.name
      },
      rating,
      title,
      comment,
      images: images || [],
      verifiedPurchase: false // TODO: Check if user purchased this product
    });

    // Update product rating
    await updateProductRating(productId);

    clearCache(`/api/reviews/product/${productId}`);
    clearCache(`/api/products/${productId}`);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const { rating, title, comment, images } = req.body;

    review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, title, comment, images, status: 'pending' },
      { new: true, runValidators: true }
    );

    // Update product rating
    await updateProductRating(review.productId);

    clearCache(`/api/reviews/product/${review.productId}`);
    clearCache(`/api/products/${review.productId}`);

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const productId = review.productId;
    await review.deleteOne();

    // Update product rating
    await updateProductRating(productId);

    clearCache(`/api/reviews/product/${productId}`);
    clearCache(`/api/products/${productId}`);

    res.json({
      success: true,
      message: 'Review deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review status (Admin)
// @route   PUT /api/reviews/:id/status
// @access  Private/Admin
exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('productId', 'title name images');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update product rating
    await updateProductRating(review.productId);

    clearCache(`/api/reviews/product/${review.productId}`);

    const reviewObj = review.toObject();
    const formattedReview = {
      ...reviewObj,
      product: reviewObj.productId
    };

    res.json({
      success: true,
      data: formattedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add admin reply to review
// @route   PUT /api/reviews/:id/reply
// @access  Private/Admin
exports.addAdminReply = async (req, res, next) => {
  try {
    const { message } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        adminReply: {
          message,
          repliedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    ).populate('productId', 'title name images');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    clearCache(`/api/reviews/product/${review.productId}`);

    const reviewObj = review.toObject();
    const formattedReview = {
      ...reviewObj,
      product: reviewObj.productId
    };

    res.json({
      success: true,
      data: formattedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike review
// @route   PUT /api/reviews/:id/like
// @access  Private
exports.likeReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Dislike review
// @route   PUT /api/reviews/:id/dislike
// @access  Private
exports.dislikeReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { dislikes: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update product rating
async function updateProductRating(productId) {
  try {
    const reviews = await Review.find({ productId, status: 'approved' });

    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        'rating.average': 0,
        'rating.count': 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
      return;
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / reviews.length;

    // Calculate rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });

    await Product.findByIdAndUpdate(productId, {
      'rating.average': Math.round(average * 10) / 10,
      'rating.count': reviews.length,
      ratingDistribution: distribution
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}
