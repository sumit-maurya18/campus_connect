// backend/src/routes/opportunityRoutes.js
// Purpose: Cross-table routes (operations that work on both tables)
// Get/Update/Delete by ID regardless of type

const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const { strictLimiter, readLimiter } = require('../middleware/rateLimiter');

/**
 * Cross-Table Routes
 * These routes work on both work and event opportunities
 * Base path: /api/opportunities
 */

// Get single opportunity by ID
// GET /api/opportunities/:id
// Works on both work and event tables
router.get('/opportunities/:id', readLimiter, opportunityController.getById);

// Update opportunity by ID
// PATCH /api/opportunities/:id
// Works on both tables
router.patch('/opportunities/:id', strictLimiter, opportunityController.update);

// Delete opportunity by ID
// DELETE /api/opportunities/:id
// Hard delete for work, soft delete for events
router.delete('/opportunities/:id', strictLimiter, opportunityController.delete);

// Get statistics across all opportunities
// GET /api/opportunities/stats
router.get('/opportunities/stats', readLimiter, opportunityController.getStats);

module.exports = router;