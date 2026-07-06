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
const { uploadClientLogo, processClientLogo } = require('../middlewares/upload');

// Public routes
router.get('/', cache(300), getClients);
router.get('/:id', cache(300), getClient);

// Admin routes
router.post('/', protect, authorize('admin'), uploadClientLogo, processClientLogo, createClient);
router.put('/:id', protect, authorize('admin'), uploadClientLogo, processClientLogo, updateClient);
router.delete('/:id', protect, authorize('admin'), deleteClient);

module.exports = router;

