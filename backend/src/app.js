// backend/src/app.js
// Purpose: Express application configuration
// Sets up middleware, routes, and error handling

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/env');
const routes = require('./routes');
const apiKeyAuth = require('./middleware/apiKeyAuth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Create Express application
const app = express();

/**
 * Security Middleware
 * Helmet sets various HTTP headers for security
 */
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts (needed for some tools)
  crossOriginEmbedderPolicy: false
}));

/**
 * CORS Configuration
 * Allow requests from frontend domain
 * Only whitelisted origins can access API from browsers
 */
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, curl during dev)
    // Remove this if you want to block curl/Postman too
    if (!origin) return callback(null, true);

    if (config.cors.origin.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

/**
 * Rate Limiting
 * Apply to all /api/* routes
 */
app.use('/api', apiLimiter);

/**
 * API Key Authentication
 * Applies to ALL /api routes
 */
app.use('/api', apiKeyAuth);

/**
 * Body Parsing Middleware
 * Parse JSON and URL-encoded request bodies
 */
app.use(express.json({ limit: '10mb' })); // Allow up to 10MB JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request Logging (Development Only)
 * Log all incoming requests in development
 */
if (config.isDevelopment()) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

/**
 * Root Route
 * GET /
 * Redirect to API documentation
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Campus Connect API',
    documentation: '/api',
    health: '/api/health'
  });
});

/**
 * Mount API Routes
 * All routes are prefixed with /api
 */
app.use('/api', routes);

/**
 * 404 Handler
 * Catch requests to non-existent routes
 * Must be placed AFTER all route definitions
 */
app.use(notFoundHandler);

/**
 * Error Handler
 * Catch and format all errors
 * Must have 4 parameters and be placed last
 */
app.use(errorHandler);

module.exports = app;