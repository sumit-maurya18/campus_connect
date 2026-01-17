// backend/src/routes/eventRoutes.js
// Purpose: Define routes for event opportunities
// Handles hackathons, learning programs, and scholarships

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { strictLimiter, readLimiter } = require('../middleware/rateLimiter');

/**
 * Hackathon Routes
 * Base path: /api/hackathons
 */

// Create new hackathon
// POST /api/hackathons
router.post('/hackathons', strictLimiter, eventController.createHackathon);

// Get all hackathons with filters
// GET /api/hackathons?page=1&limit=10&fees=unpaid
router.get('/hackathons', readLimiter, eventController.getHackathons);

// Get featured hackathons (for homepage)
// GET /api/hackathons/featured?limit=4
router.get('/hackathons/featured', readLimiter, eventController.getFeaturedHackathons);

/**
 * Scholarship Routes
 * Base path: /api/scholarships
 */

// Create new scholarship
// POST /api/scholarships
router.post('/scholarships', strictLimiter, eventController.createScholarship);

// Get all scholarships with filters
// GET /api/scholarships?page=1&limit=10
router.get('/scholarships', readLimiter, eventController.getScholarships);

/**
 * Learning Program Routes
 * Base path: /api/learning
 */

// Create new learning program
// POST /api/learning
router.post('/learning', strictLimiter, eventController.createLearning);

// Get all learning programs with filters
// GET /api/learning?page=1&limit=10&learning_type=course
router.get('/learning', readLimiter, eventController.getLearning);

// Get featured learning programs (for homepage)
// GET /api/learning/featured?limit=4
router.get('/learning/featured', readLimiter, eventController.getFeaturedLearning);

/**
 * Shared Event Routes
 * Base path: /api/events
 */

// Get upcoming events (by event_date)
// GET /api/events/upcoming?days=30
router.get('/events/upcoming', readLimiter, eventController.getUpcoming);

// Get free events (fees = unpaid)
// GET /api/events/free?type=hackathon
router.get('/events/free', readLimiter, eventController.getFreeEvents);

module.exports = router;