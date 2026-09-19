/**
 * Catches errors thrown/passed to next() anywhere in the app and
 * returns a consistent, client-safe JSON shape.
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  let message = err.message || 'Something went wrong on the server.';

  // Mongoose validation errors -> 400 with field-level messages
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Mongoose bad ObjectId -> 400
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}.`;
  }

  // Mongo duplicate key (e.g. email already registered) -> 409
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `That ${field} is already in use.`;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

// Wraps async route handlers so rejected promises reach errorHandler
// without needing a try/catch in every controller function.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { errorHandler, asyncHandler };
