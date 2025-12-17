const express = require('express');
const router = express.Router();
const {
  getZones,
  createZone,
  updateZone,
  deleteZone,
} = require('../controllers/deliveryZoneController');
const { protect, authorize } = require('../middlewares/auth');
const { cache } = require('../middlewares/cache');

// Public route - used by frontend to determine shipping availability and cost
router.get('/', cache(300), getZones);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createZone);
router.put('/:id', updateZone);
router.delete('/:id', deleteZone);

module.exports = router;


