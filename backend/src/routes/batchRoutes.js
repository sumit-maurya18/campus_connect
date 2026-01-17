const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const { batchCreate } = require('../controllers/batchController');
const { readLimiter } = require('../middleware/rateLimiter');

// Heavily rate limited batch endpoint (10 requests per hour)
const batchLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    status: 'error',
    message: 'Too many batch requests. Limit: 10 per hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Batch operations
router.post('/opportunities/batch', batchLimiter, batchCreate);

// ❌ REMOVED — handler does not exist
// router.get('/batch/stats', readLimiter, getBatchStats);

module.exports = router;
