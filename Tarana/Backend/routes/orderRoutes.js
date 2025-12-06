const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/auth');
const { paginate } = require('../middlewares/pagination');
const { cache } = require('../middlewares/cache');
const Order = require('../models/Order');

// All routes require authentication
router.use(protect);

// Don't cache orders - they change frequently and need to be fresh
router.get('/', paginate(Order), getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.put('/:id/status', authorize('admin'), updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;

