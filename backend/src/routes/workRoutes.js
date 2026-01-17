// backend/src/routes/workRoutes.js
// Purpose: Define routes for work opportunities (internships and jobs)
// Maps URLs to controller functions

const express = require('express');
const router = express.Router();
const workController = require('../controllers/workController');
const { strictLimiter, readLimiter } = require('../middleware/rateLimiter');

/**
 * Internship Routes
 * Base path: /api/internships
 */

// Create new internship
// POST /api/internships
router.post('/internships', strictLimiter, workController.createInternship);

// Get all internships with filters
// GET /api/internships?page=1&limit=10&city=Bangalore
router.get('/internships', readLimiter, workController.getInternships);

// Get featured internships (for homepage)
// GET /api/internships/featured?limit=4
router.get('/internships/featured', readLimiter, workController.getFeaturedInternships);

/**
 * Job Routes
 * Base path: /api/jobs
 */

// Create new job
// POST /api/jobs
router.post('/jobs', strictLimiter, workController.createJob);

// Get all jobs with filters
// GET /api/jobs?page=1&limit=10&experience=0-1
router.get('/jobs', readLimiter, workController.getJobs);

// Get featured jobs (for homepage)
// GET /api/jobs/featured?limit=4
router.get('/jobs/featured', readLimiter, workController.getFeaturedJobs);

/**
 * Shared Work Routes
 * Base path: /api/work
 */

// Get opportunities by organization
// GET /api/work/organization/Google
router.get('/work/organization/:name', readLimiter, workController.getByOrganization);

// Get opportunities expiring soon
// GET /api/work/expiring?days=7
router.get('/work/expiring', readLimiter, workController.getExpiringSoon);

module.exports = router;