const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, logout, getMe } = require('../controllers/authController');
const protect = require('../middleware/auth');

const router = express.Router();

// Throttle auth endpoints to slow down credential-stuffing / brute force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
