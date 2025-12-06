const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  updateContactStatus
} = require('../controllers/contactController');
const { protect, authorize } = require('../middlewares/auth');
const { paginate } = require('../middlewares/pagination');
const { cache } = require('../middlewares/cache');
const Contact = require('../models/Contact');

// Public route
router.post('/', createContact);

// Admin routes
router.get('/', protect, authorize('admin'), paginate(Contact), cache(300), getContacts);
router.put('/:id/status', protect, authorize('admin'), updateContactStatus);

module.exports = router;

