// backend/src/controllers/eventController.js
// Purpose: Handle HTTP requests for event opportunities
// Handles hackathons, learning programs, and scholarships

const eventModel = require('../models/eventOpportunityModel');
const { validateEventOpportunity, validatePagination } = require('../utils/validators');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Create a new hackathon
 * POST /api/hackathons
 * 
 * @route POST /api/hackathons
 * @access Public
 */
exports.createHackathon = asyncHandler(async (req, res) => {
  const validation = validateEventOpportunity(req.body, 'hackathon');
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.errors
    });
  }

  const opportunity = await eventModel.create(req.body, 'hackathon');
  
  res.status(201).json({
    success: true,
    data: opportunity,
    message: `Hackathon ${opportunity.action}d successfully`
  });
});

/**
 * Create a new scholarship
 * POST /api/scholarships
 * 
 * @route POST /api/scholarships
 * @access Public
 */
exports.createScholarship = asyncHandler(async (req, res) => {
  const validation = validateEventOpportunity(req.body, 'scholarship');
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.errors
    });
  }

  const opportunity = await eventModel.create(req.body, 'scholarship');
  
  res.status(201).json({
    success: true,
    data: opportunity,
    message: `Scholarship ${opportunity.action}d successfully`
  });
});

/**
 * Create a new learning program
 * POST /api/learning
 * 
 * @route POST /api/learning
 * @access Public
 */
exports.createLearning = asyncHandler(async (req, res) => {
  const validation = validateEventOpportunity(req.body, 'learning');
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.errors
    });
  }

  const opportunity = await eventModel.create(req.body, 'learning');
  
  res.status(201).json({
    success: true,
    data: opportunity,
    message: `Learning program ${opportunity.action}d successfully`
  });
});

/**
 * Get all hackathons with filters and pagination
 * GET /api/hackathons
 * 
 * @route GET /api/hackathons
 * @access Public
 */
exports.getHackathons = asyncHandler(async (req, res) => {
  const { page, limit } = validatePagination(req.query.page, req.query.limit);
  
  const filters = {
    ...req.query,
    type: 'hackathon',
    sort: req.query.sort || 'posted_date',
    order: req.query.order || 'desc'
  };
  
  const result = await eventModel.findAll(filters, page, limit);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    filters: {
      event_type: 'hackathon',
      city: req.query.city,
      fees: req.query.fees,
      domain: req.query.domain
    }
  });
});

/**
 * Get all scholarships with filters and pagination
 * GET /api/scholarships
 * 
 * @route GET /api/scholarships
 * @access Public
 */
exports.getScholarships = asyncHandler(async (req, res) => {
  const { page, limit } = validatePagination(req.query.page, req.query.limit);
  
  const filters = {
    ...req.query,
    type: 'scholarship',
    sort: req.query.sort || 'posted_date',
    order: req.query.order || 'desc'
  };
  
  const result = await eventModel.findAll(filters, page, limit);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    filters: {
      event_type: 'scholarship',
      city: req.query.city,
      fees: req.query.fees
    }
  });
});

/**
 * Get all learning programs with filters and pagination
 * GET /api/learning
 * 
 * @route GET /api/learning
 * @access Public
 */
exports.getLearning = asyncHandler(async (req, res) => {
  const { page, limit } = validatePagination(req.query.page, req.query.limit);
  
  const filters = {
    ...req.query,
    type: 'learning',
    sort: req.query.sort || 'posted_date',
    order: req.query.order || 'desc'
  };
  
  const result = await eventModel.findAll(filters, page, limit);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    filters: {
      event_type: 'learning',
      learning_type: req.query.learning_type,
      fees: req.query.fees
    }
  });
});

/**
 * Get featured hackathons (for homepage)
 * GET /api/hackathons/featured
 * 
 * @route GET /api/hackathons/featured
 * @access Public
 */
exports.getFeaturedHackathons = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const featured = await eventModel.getFeatured('hackathon', limit);
  
  res.json({
    success: true,
    data: featured,
    count: featured.length
  });
});

/**
 * Get featured learning programs (for homepage)
 * GET /api/learning/featured
 * 
 * @route GET /api/learning/featured
 * @access Public
 */
exports.getFeaturedLearning = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const featured = await eventModel.getFeatured('learning', limit);
  
  res.json({
    success: true,
    data: featured,
    count: featured.length
  });
});

/**
 * Get upcoming events (by event_date)
 * GET /api/events/upcoming
 * 
 * @route GET /api/events/upcoming
 * @access Public
 */
exports.getUpcoming = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const limit = parseInt(req.query.limit) || 20;
  
  const events = await eventModel.findUpcoming(days, limit);
  
  res.json({
    success: true,
    data: events,
    upcomingIn: `${days} days`,
    count: events.length
  });
});

/**
 * Get free events (fees = unpaid)
 * GET /api/events/free
 * 
 * @route GET /api/events/free
 * @access Public
 */
exports.getFreeEvents = asyncHandler(async (req, res) => {
  const eventType = req.query.type || null;
  const limit = parseInt(req.query.limit) || 20;
  
  const events = await eventModel.findFreeEvents(eventType, limit);
  
  res.json({
    success: true,
    data: events,
    count: events.length
  });
});