const express = require('express');
const router = express.Router();
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');
const { protect, authorize } = require('../middlewares/auth');
const { cache } = require('../middlewares/cache');

// Public routes
router.get('/', cache(300), getClients);
router.get('/:id', cache(300), getClient);

// Admin routes
router.post('/', protect, authorize('admin'), createClient);
router.put('/:id', protect, authorize('admin'), updateClient);
router.delete('/:id', protect, authorize('admin'), deleteClient);

module.exports = router;

