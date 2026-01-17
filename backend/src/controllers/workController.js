// backend/src/controllers/workController.js
// Purpose: Handle HTTP requests for work opportunities (internships and jobs)
// Controllers are the "glue" between routes and models

const workModel = require('../models/workOpportunityModel');
const { validateWorkOpportunity, validatePagination } = require('../utils/validators');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Create a new internship
 * POST /api/internships
 * 
 * @route POST /api/internships
 * @access Public
 */
exports.createInternship = asyncHandler(async (req, res) => {
  // Validate input data
  const validation = validateWorkOpportunity(req.body, 'internship');
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.errors
    });
  }

  // Create opportunity in database
  const opportunity = await workModel.create(req.body, 'internship');
  
  // Send response
  res.status(201).json({
    success: true,
    data: opportunity,
    message: `Internship ${opportunity.action}d successfully`
  });
});

/**
 * Create a new job
 * POST /api/jobs
 * 
 * @route POST /api/jobs
 * @access Public
 */
exports.createJob = asyncHandler(async (req, res) => {
  // Validate input
  const validation = validateWorkOpportunity(req.body, 'job');
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.errors
    });
  }

  // Create in database
  const opportunity = await workModel.create(req.body, 'job');
  
  res.status(201).json({
    success: true,
    data: opportunity,
    message: `Job ${opportunity.action}d successfully`
  });
});

/**
 * Get all internships with filters and pagination
 * GET /api/internships
 * 
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 50)
 * - city: Filter by city
 * - country: Filter by country
 * - work_style: Filter by work style (remote/hybrid/onsite)
 * - skills: Comma-separated skills
 * - search: Search in title/organization
 * - sort: Sort field (posted_date, deadline, view_count)
 * - order: Sort order (asc, desc)
 * 
 * @route GET /api/internships
 * @access Public
 */
exports.getInternships = asyncHandler(async (req, res) => {
  // Validate and sanitize pagination
  const { page, limit } = validatePagination(req.query.page, req.query.limit);
  
  // Build filters object
  const filters = {
    ...req.query,
    work_type: 'internship', // Force type to internship
    sort: req.query.sort || 'posted_date',
    order: req.query.order || 'desc'
  };
  
  // Get data from database
  const result = await workModel.findAll(filters, page, limit);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    filters: {
      work_type: 'internship',
      city: req.query.city,
      country: req.query.country,
      work_style: req.query.work_style,
      skills: req.query.skills,
      search: req.query.search
    }
  });
});

/**
 * Get all jobs with filters and pagination
 * GET /api/jobs
 * 
 * @route GET /api/jobs
 * @access Public
 */
exports.getJobs = asyncHandler(async (req, res) => {
  const { page, limit } = validatePagination(req.query.page, req.query.limit);
  
  const filters = {
    ...req.query,
    work_type: 'job', // Force type to job
    sort: req.query.sort || 'posted_date',
    order: req.query.order || 'desc'
  };
  
  const result = await workModel.findAll(filters, page, limit);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    filters: {
      work_type: 'job',
      city: req.query.city,
      country: req.query.country,
      work_style: req.query.work_style,
      experience: req.query.experience,
      search: req.query.search
    }
  });
});

/**
 * Get featured internships (for homepage)
 * GET /api/internships/featured
 * 
 * @route GET /api/internships/featured
 * @access Public
 */
exports.getFeaturedInternships = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const featured = await workModel.getFeatured('internship', limit);
  
  res.json({
    success: true,
    data: featured,
    count: featured.length
  });
});

/**
 * Get featured jobs (for homepage)
 * GET /api/jobs/featured
 * 
 * @route GET /api/jobs/featured
 * @access Public
 */
exports.getFeaturedJobs = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const featured = await workModel.getFeatured('job', limit);
  
  res.json({
    success: true,
    data: featured,
    count: featured.length
  });
});

/**
 * Get opportunities by organization
 * GET /api/work/organization/:name
 * 
 * @route GET /api/work/organization/:name
 * @access Public
 */
exports.getByOrganization = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  
  const opportunities = await workModel.findByOrganization(name, limit);
  
  res.json({
    success: true,
    data: opportunities,
    organization: name,
    count: opportunities.length
  });
});

/**
 * Get opportunities expiring soon
 * GET /api/work/expiring
 * 
 * @route GET /api/work/expiring
 * @access Public
 */
exports.getExpiringSoon = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const limit = parseInt(req.query.limit) || 20;
  
  const opportunities = await workModel.findExpiringSoon(days, limit);
  
  res.json({
    success: true,
    data: opportunities,
    expiringIn: `${days} days`,
    count: opportunities.length
  });
});