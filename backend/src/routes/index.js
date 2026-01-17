// backend/src/routes/index.js
// Purpose: Central router that combines all route modules
// This is the main entry point for all API routes

const express = require('express');
const router = express.Router();

// Import all route modules
const workRoutes = require('./workRoutes');
const eventRoutes = require('./eventRoutes');
const opportunityRoutes = require('./opportunityRoutes');
const batchRoutes = require('./batchRoutes');

/**
 * Health Check Route
 * GET /api/health
 * Used to verify server is running
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Campus Connect API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

/**
 * Root API Route
 * GET /api/
 * Returns available endpoints
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Campus Connect API',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      internships: {
        create: 'POST /api/internships',
        list: 'GET /api/internships',
        featured: 'GET /api/internships/featured'
      },
      jobs: {
        create: 'POST /api/jobs',
        list: 'GET /api/jobs',
        featured: 'GET /api/jobs/featured'
      },
      hackathons: {
        create: 'POST /api/hackathons',
        list: 'GET /api/hackathons',
        featured: 'GET /api/hackathons/featured'
      },
      scholarships: {
        create: 'POST /api/scholarships',
        list: 'GET /api/scholarships'
      },
      learning: {
        create: 'POST /api/learning',
        list: 'GET /api/learning',
        featured: 'GET /api/learning/featured'
      },
      opportunities: {
        getById: 'GET /api/opportunities/:id',
        update: 'PATCH /api/opportunities/:id',
        delete: 'DELETE /api/opportunities/:id',
        stats: 'GET /api/opportunities/stats'
      },
      batch: {
        create: 'POST /api/opportunities/batch',
        stats: 'GET /api/batch/stats'
      }
    },
    links: {
      github: 'https://github.com/yourusername/campus-connect',
      docs: 'https://docs.campus-connect.com'
    }
  });
});

/**
 * Mount all route modules
 * Each module handles its own set of routes
 */

// Work opportunity routes (internships and jobs)
router.use('/', workRoutes);

// Event opportunity routes (hackathons, learning, scholarships)
router.use('/', eventRoutes);

// Cross-table opportunity routes (get/update/delete by ID)
router.use('/', opportunityRoutes);

// Batch operation routes
router.use('/', batchRoutes);

/**
 * 404 Handler for API Routes
 * Catches requests to non-existent API endpoints
 */
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: {
      health: 'GET /api/health',
      root: 'GET /api/',
      internships: 'GET /api/internships',
      jobs: 'GET /api/jobs',
      hackathons: 'GET /api/hackathons',
      scholarships: 'GET /api/scholarships',
      learning: 'GET /api/learning'
    }
  });
});

module.exports = router;