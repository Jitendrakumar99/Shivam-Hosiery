const express = require('express');
const router = express.Router();
const {
  createCustomization,
  getCustomizations,
  getCustomization,
  updateCustomizationStatus
} = require('../controllers/customizationController');
const { protect, authorize } = require('../middlewares/auth');
const { paginate } = require('../middlewares/pagination');
const { cache } = require('../middlewares/cache');
const Customization = require('../models/Customization');

// All routes require authentication
router.use(protect);

router.post('/', createCustomization);
router.get('/', paginate(Customization), cache(300), getCustomizations);
router.get('/:id', cache(300), getCustomization);
router.put('/:id/status', authorize('admin'), updateCustomizationStatus);

module.exports = router;

