const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protects routes by requiring a valid JWT.
 * The token is read from an HTTP-only cookie so it is never exposed to
 * client-side JavaScript (mitigates XSS token theft).
 */
const protect = async (req, res, next) => {
  try {
    const cookieName = process.env.COOKIE_NAME || 'ms_token';
    const token = req.cookies?.[cookieName];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ success: false, message: 'Not authorized. Invalid token.' });
  }
};

module.exports = protect;
