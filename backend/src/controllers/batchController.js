const batchService = require("../services/batchService");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * POST /api/opportunities/batch
 */
exports.batchCreate = asyncHandler(async (req, res) => {

  const { source, opportunities } = req.body;

  if (!Array.isArray(opportunities)) {
    return res.status(400).json({
      success: false,
      error: "opportunities must be an array"
    });
  }

  if (opportunities.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Batch cannot be empty"
    });
  }

  if (opportunities.length > 500) {
    return res.status(400).json({
      success: false,
      error: "Maximum batch size is 500"
    });
  }

  const result = await batchService.batchCreate(source, opportunities);

  res.json({
    success: true,
    ...result
  });
});