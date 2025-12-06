const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { cache } = require('../middlewares/cache');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, cache(300), getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;

