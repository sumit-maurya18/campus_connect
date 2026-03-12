const opportunityService = require("../services/opportunityService");
const { isValidUUID } = require("../utils/validators");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * GET /api/opportunities/:id
 */
exports.getById = asyncHandler(async (req, res) => {

  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).json({
      success: false,
      error: "Invalid ID format"
    });
  }

  const opportunity = await opportunityService.getById(id);

  if (!opportunity) {
    return res.status(404).json({
      success: false,
      error: "Opportunity not found"
    });
  }

  res.json({
    success: true,
    data: opportunity
  });
});

/**
 * PATCH /api/opportunities/:id
 */
exports.update = asyncHandler(async (req, res) => {

  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).json({
      success: false,
      error: "Invalid ID format"
    });
  }

  const updated = await opportunityService.update(id, req.body);

  if (!updated) {
    return res.status(404).json({
      success: false,
      error: "Opportunity not found"
    });
  }

  res.json({
    success: true,
    data: updated,
    message: "Opportunity updated successfully"
  });
});

/**
 * DELETE /api/opportunities/:id
 */
exports.delete = asyncHandler(async (req, res) => {

  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).json({
      success: false,
      error: "Invalid ID format"
    });
  }

  const result = await opportunityService.delete(id);

  if (!result) {
    return res.status(404).json({
      success: false,
      error: "Opportunity not found"
    });
  }

  res.status(204).send();
});

/**
 * GET /api/opportunities/stats
 */
exports.getStats = asyncHandler(async (req, res) => {

  const stats = await opportunityService.getStats();

  res.json({
    success: true,
    data: stats
  });
});