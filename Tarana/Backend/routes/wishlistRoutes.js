const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middlewares/auth');
const { cache } = require('../middlewares/cache');

// All routes require authentication
router.use(protect);

router.get('/', cache(300), getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);

module.exports = router;

