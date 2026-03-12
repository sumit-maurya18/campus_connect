/**
 * Work Controller
 *
 * Handles HTTP layer for:
 * internships
 * jobs
 */

const workService = require("../services/workService");
const { validateWorkOpportunity, validatePagination } = require("../utils/validators");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * POST /api/internships
 */
exports.createInternship = asyncHandler(async (req, res) => {

  const validation = validateWorkOpportunity(req.body, "internship");

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: validation.errors
    });
  }

  const opportunity = await workService.createInternship(req.body);

  res.status(201).json({
    success: true,
    data: opportunity,
    message: `Internship ${opportunity.action}d successfully`
  });
});

/**
 * POST /api/jobs
 */
exports.createJob = asyncHandler(async (req, res) => {

  const validation = validateWorkOpportunity(req.body, "job");

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: validation.errors
    });
  }

  const opportunity = await workService.createJob(req.body);

  res.status(201).json({
    success: true,
    data: opportunity,
    message: `Job ${opportunity.action}d successfully`
  });
});

/**
 * GET /api/internships
 */
exports.getInternships = asyncHandler(async (req, res) => {

  const { page, limit } = validatePagination(req.query.page, req.query.limit);

  const filters = {
    ...req.query,
    sort: req.query.sort || "posted_date",
    order: req.query.order || "desc"
  };

  const result = await workService.getInternships(filters, page, limit);

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * GET /api/jobs
 */
exports.getJobs = asyncHandler(async (req, res) => {

  const { page, limit } = validatePagination(req.query.page, req.query.limit);

  const filters = {
    ...req.query,
    sort: req.query.sort || "posted_date",
    order: req.query.order || "desc"
  };

  const result = await workService.getJobs(filters, page, limit);

  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * GET /api/internships/featured
 */
exports.getFeaturedInternships = asyncHandler(async (req, res) => {

  const limit = parseInt(req.query.limit) || 4;

  const featured = await workService.getFeaturedInternships(limit);

  res.json({
    success: true,
    data: featured,
    count: featured.length
  });
});

/**
 * GET /api/jobs/featured
 */
exports.getFeaturedJobs = asyncHandler(async (req, res) => {

  const limit = parseInt(req.query.limit) || 4;

  const featured = await workService.getFeaturedJobs(limit);

  res.json({
    success: true,
    data: featured,
    count: featured.length
  });
});

/**
 * GET /api/work/organization/:name
 */
exports.getByOrganization = asyncHandler(async (req, res) => {

  const { name } = req.params;
  const limit = parseInt(req.query.limit) || 10;

  const opportunities = await workService.findByOrganization(name, limit);

  res.json({
    success: true,
    data: opportunities,
    organization: name,
    count: opportunities.length
  });
});

/**
 * GET /api/work/expiring
 */
exports.getExpiringSoon = asyncHandler(async (req, res) => {

  const days = parseInt(req.query.days) || 7;
  const limit = parseInt(req.query.limit) || 20;

  const opportunities = await workService.getExpiringSoon(days, limit);

  res.json({
    success: true,
    data: opportunities,
    expiringIn: `${days} days`,
    count: opportunities.length
  });
});