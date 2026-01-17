// backend/src/controllers/opportunityController.js
// Purpose: Handle cross-table operations (work across both tables)
// Get/Update/Delete by ID regardless of type

const workModel = require('../models/workOpportunityModel');
const eventModel = require('../models/eventOpportunityModel');
const { isValidUUID } = require('../utils/validators');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Get single opportunity by ID
 * Works across both tables (work and event)
 * Also increments view count
 * 
 * GET /api/opportunities/:id
 * 
 * @route GET /api/opportunities/:id
 * @access Public
 */
exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate UUID format
  if (!isValidUUID(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      message: 'ID must be a valid UUID'
    });
  }
  
  // Try work table first
  let opportunity = await workModel.findById(id);
  let category = 'work';
  let model = workModel;
  
  // If not found in work table, try event table
  if (!opportunity) {
    opportunity = await eventModel.findById(id);
    category = 'event';
    model = eventModel;
  }
  
  // If still not found, return 404
  if (!opportunity) {
    return res.status(404).json({
      success: false,
      error: 'Opportunity not found',
      message: `No opportunity found with ID: ${id}`
    });
  }
  
  // Increment view count
  await model.incrementViewCount(id);
  opportunity.view_count = (opportunity.view_count || 0) + 1;
  
  res.json({
    success: true,
    data: {
      ...opportunity,
      category // Include which table it came from
    }
  });
});

/**
 * Update opportunity by ID
 * Works across both tables
 * 
 * PATCH /api/opportunities/:id
 * 
 * @route PATCH /api/opportunities/:id
 * @access Public
 */
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Validate UUID
  if (!isValidUUID(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }
  
  // Prevent changing type fields
  if (updates.work_type || updates.event_type) {
    return res.status(400).json({
      success: false,
      error: 'Cannot change opportunity type',
      message: 'work_type and event_type cannot be modified'
    });
  }
  
  // Try work table first
  let opportunity = await workModel.findById(id);
  let model = workModel;
  
  if (!opportunity) {
    opportunity = await eventModel.findById(id);
    model = eventModel;
  }
  
  if (!opportunity) {
    return res.status(404).json({
      success: false,
      error: 'Opportunity not found'
    });
  }
  
  // Update the opportunity
  const updated = await model.update(id, updates);
  
  res.json({
    success: true,
    data: updated,
    message: 'Opportunity updated successfully'
  });
});

/**
 * Delete opportunity by ID
 * Work opportunities: Hard delete (permanent)
 * Event opportunities: Soft delete (archive)
 * 
 * DELETE /api/opportunities/:id
 * 
 * @route DELETE /api/opportunities/:id
 * @access Public
 */
exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate UUID
  if (!isValidUUID(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }
  
  // Try work table (hard delete)
  let opportunity = await workModel.findById(id);
  if (opportunity) {
    await workModel.delete(id, true); // Hard delete
    return res.status(204).send(); // No content
  }
  
  // Try event table (soft delete - archive)
  opportunity = await eventModel.findById(id);
  if (opportunity) {
    await eventModel.delete(id, false); // Soft delete
    return res.status(204).send();
  }
  
  // Not found in either table
  res.status(404).json({
    success: false,
    error: 'Opportunity not found'
  });
});

/**
 * Get statistics across all opportunities
 * GET /api/opportunities/stats
 * 
 * @route GET /api/opportunities/stats
 * @access Public
 */
exports.getStats = asyncHandler(async (req, res) => {
  const [workStats, eventStats] = await Promise.all([
    workModel.getStats(),
    eventModel.getStats()
  ]);
  
  res.json({
    success: true,
    data: {
      work: workStats,
      event: eventStats
    }
  });
});