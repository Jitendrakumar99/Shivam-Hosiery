const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  createProductsBulk,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, authorize, optionalProtect } = require('../middlewares/auth');
const { paginate } = require('../middlewares/pagination');
const { cache } = require('../middlewares/cache');
const { uploadProducts, processImages } = require('../middlewares/upload');
const Product = require('../models/Product');

// Public routes (optional auth so admin sees inventory data)
router.get('/', optionalProtect, paginate(Product), cache(300), getProducts);
router.get('/:id', optionalProtect, cache(300), getProduct);

// Admin routes
router.post('/bulk', protect, authorize('admin'), createProductsBulk);
router.post('/', protect, authorize('admin'), uploadProducts, processImages, createProduct);
router.put('/:id', protect, authorize('admin'), uploadProducts, processImages, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;

