const rateLimit = require('express-rate-limit');

// Skip rate limiting in test environment
const skipRateLimit = process.env.NODE_ENV === 'test' || process.env.DISABLE_RATE_LIMIT === 'true';

// General API rate limiter (applied to all /api routes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  skip: () => skipRateLimit,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiter for write operations (POST, PUT, DELETE)
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: () => skipRateLimit,
  message: {
    status: 'error',
    message: 'Too many write requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Read operations rate limiter (more lenient)
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  skip: () => skipRateLimit,
  message: {
    status: 'error',
    message: 'Too many read requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth rate limiter (for login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    status: 'error',
    message: 'Too many authentication attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Batch operations rate limiter (very strict)
const batchLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 batch requests per hour
  message: {
    status: 'error',
    message: 'Too many batch requests. Limit: 10 per hour.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  apiLimiter,
  strictLimiter,
  readLimiter,
  authLimiter,
  batchLimiter
};