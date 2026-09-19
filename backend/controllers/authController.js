const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

const COOKIE_NAME = process.env.COOKIE_NAME || 'ms_token';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const cookieOptions = () => ({
  httpOnly: true, // not readable by client-side JS - mitigates XSS token theft
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax', // reasonable CSRF protection for a same-site SPA
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, keep in sync with JWT_EXPIRES_IN
});

const sendAuthResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res
    .status(statusCode)
    .cookie(COOKIE_NAME, token, cookieOptions())
    .json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
};

// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are all required.' });
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with that email already exists.' });
  }

  const user = await User.create({ name, email, password });
  sendAuthResponse(user, 201, res);
});

// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  const passwordMatches = user ? await user.comparePassword(password) : false;

  if (!user || !passwordMatches) {
    // Same message either way so we don't reveal which emails are registered
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  sendAuthResponse(user, 200, res);
});

// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: 0 });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: { id: req.user._id, name: req.user.name, email: req.user.email } });
});

module.exports = { register, login, logout, getMe };
