const eventService = require("../services/eventService");
const { validateEventOpportunity, validatePagination } = require("../utils/validators");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * POST /api/hackathons
 */
exports.createHackathon = asyncHandler(async (req, res) => {

  const validation = validateEventOpportunity(req.body, "hackathon");

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: validation.errors
    });
  }

  const opportunity = await eventService.createHackathon(req.body);

  res.status(201).json({
    success: true,
    data: opportunity,
    message: `Hackathon ${opportunity.action}d successfully`
  });
});

/**
 * POST /api/scholarships
 */
exports.createScholarship = asyncHandler(async (req, res) => {

  const validation = validateEventOpportunity(req.body, "scholarship");

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: validation.errors
    });
  }

  const opportunity = await eventService.createScholarship(req.body);

  res.status(201).json({
    success: true,
    data: opportunity
  });
});

/**
 * POST /api/learning
 */
exports.createLearning = asyncHandler(async (req, res) => {

  const validation = validateEventOpportunity(req.body, "learning");

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: validation.errors
    });
  }

  const opportunity = await eventService.createLearning(req.body);

  res.status(201).json({
    success: true,
    data: opportunity
  });
});

/**
 * GET /api/hackathons
 */
exports.getHackathons = asyncHandler(async (req, res) => {

  const { page, limit } = validatePagination(req.query.page, req.query.limit);

  const result = await eventService.getHackathons(req.query, page, limit);

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * GET /api/scholarships
 */
exports.getScholarships = asyncHandler(async (req, res) => {

  const { page, limit } = validatePagination(req.query.page, req.query.limit);

  const result = await eventService.getScholarships(req.query, page, limit);

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * GET /api/learning
 */
exports.getLearning = asyncHandler(async (req, res) => {

  const { page, limit } = validatePagination(req.query.page, req.query.limit);

  const result = await eventService.getLearning(req.query, page, limit);

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * GET /api/hackathons/featured
 */
exports.getFeaturedHackathons = asyncHandler(async (req, res) => {

  const limit = parseInt(req.query.limit) || 4;

  const featured = await eventService.getFeaturedHackathons(limit);

  res.json({
    success: true,
    data: featured,
    count: featured.length
  });
});

/**
 * GET /api/learning/featured
 */
exports.getFeaturedLearning = asyncHandler(async (req, res) => {

  const limit = parseInt(req.query.limit) || 4;

  const featured = await eventService.getFeaturedLearning(limit);

  res.json({
    success: true,
    data: featured,
    count: featured.length
  });
});

/**
 * GET /api/events/upcoming
 */
exports.getUpcoming = asyncHandler(async (req, res) => {

  const days = parseInt(req.query.days) || 30;
  const limit = parseInt(req.query.limit) || 20;

  const events = await eventService.getUpcoming(days, limit);

  res.json({
    success: true,
    data: events,
    count: events.length
  });
});

/**
 * GET /api/events/free
 */
exports.getFreeEvents = asyncHandler(async (req, res) => {

  const type = req.query.type || null;
  const limit = parseInt(req.query.limit) || 20;

  const events = await eventService.getFreeEvents(type, limit);

  res.json({
    success: true,
    data: events,
    count: events.length
  });
});