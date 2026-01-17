// backend/src/middleware/errorHandler.js
// Purpose: Centralized error handling for all API routes
// Catches all errors and formats them consistently

const config = require('../config/env');

/**
 * Error Handler Middleware
 * This is Express's error handling middleware
 * It must have 4 parameters (err, req, res, next)
 * 
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Log error details (for debugging)
  console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('❌ Error occurred:');
  console.error('  Path:', req.method, req.path);
  console.error('  Message:', err.message);
  console.error('  Code:', err.code);
  
  if (config.isDevelopment()) {
    console.error('  Stack:', err.stack);
  }
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Handle specific PostgreSQL errors
  if (err.code) {
    // Duplicate key violation (unique constraint)
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Duplicate entry',
        message: 'An opportunity with this URL already exists for this type',
        ...(config.isDevelopment() && { details: err.detail })
      });
    }

    // Foreign key violation
    if (err.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'Invalid reference',
        message: 'Referenced record does not exist',
        ...(config.isDevelopment() && { details: err.detail })
      });
    }

    // Not null violation
    if (err.code === '23502') {
      return res.status(400).json({
        success: false,
        error: 'Missing required field',
        message: `Field '${err.column}' is required`,
        ...(config.isDevelopment() && { details: err.detail })
      });
    }

    // Invalid text representation (bad UUID format, etc.)
    if (err.code === '22P02') {
      return res.status(400).json({
        success: false,
        error: 'Invalid format',
        message: 'Invalid data format provided',
        ...(config.isDevelopment() && { details: err.message })
      });
    }
  }

  // Handle validation errors (from our validators)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors || [{ message: err.message }]
    });
  }

  // Handle "not found" errors
  if (err.message && err.message.toLowerCase().includes('not found')) {
    return res.status(404).json({
      success: false,
      error: 'Not found',
      message: err.message
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Internal Server Error' : message,
    message: statusCode === 500 ? 'An unexpected error occurred' : message,
    ...(config.isDevelopment() && { 
      stack: err.stack,
      details: err 
    })
  });
};

/**
 * Not Found Handler
 * Handles requests to non-existent routes
 * Should be placed AFTER all route definitions
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
    availableRoutes: {
      health: 'GET /api/health',
      internships: 'GET /api/internships',
      jobs: 'GET /api/jobs',
      hackathons: 'GET /api/hackathons',
      scholarships: 'GET /api/scholarships',
      learning: 'GET /api/learning'
    }
  });
};

/**
 * Async Error Wrapper
 * Wraps async route handlers to catch errors automatically
 * 
 * Usage:
 * router.get('/path', asyncHandler(async (req, res) => {
 *   // Your async code here
 * }));
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};