const express = require('express');
const router = express.Router();
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../controllers/brandController');
const { protect, authorize } = require('../middlewares/auth');
const { cache } = require('../middlewares/cache');

// Public routes
router.get('/', cache(300), getBrands);
router.get('/:id', cache(300), getBrand);

// Admin routes
router.post('/', protect, authorize('admin'), createBrand);
router.put('/:id', protect, authorize('admin'), updateBrand);
router.delete('/:id', protect, authorize('admin'), deleteBrand);

module.exports = router;

