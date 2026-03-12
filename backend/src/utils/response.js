/**
 * Standard API response helpers
 *
 * Ensures every API returns a consistent structure.
 */

exports.success = (res, data, status = 200, meta = {}) => {
  res.status(status).json({
    success: true,
    data,
    ...meta
  });
};

exports.error = (res, message, status = 500, details = null) => {
  res.status(status).json({
    success: false,
    error: message,
    ...(details && { details })
  });
};