// backend/src/controllers/batchController.js
// Purpose: Handle batch operations for scrapers
// Allows creating multiple opportunities at once

const workModel = require('../models/workOpportunityModel');
const eventModel = require('../models/eventOpportunityModel');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Batch create opportunities
 * Used by scrapers to insert multiple opportunities at once
 * Automatically routes to correct table based on type
 * 
 * POST /api/opportunities/batch
 * 
 * Body:
 * {
 *   "source": "scraper_name",
 *   "opportunities": [
 *     { "type": "internship", "title": "...", "apply_url": "..." },
 *     { "type": "hackathon", "title": "...", "apply_url": "..." }
 *   ]
 * }
 * 
 * @route POST /api/opportunities/batch
 * @access Public (but rate limited)
 */
exports.batchCreate = asyncHandler(async (req, res) => {
  const { source, opportunities } = req.body;
  
  // Validate input
  if (!opportunities || !Array.isArray(opportunities)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input',
      message: 'opportunities must be an array'
    });
  }
  
  if (opportunities.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Empty batch',
      message: 'opportunities array cannot be empty'
    });
  }
  
  if (opportunities.length > 500) {
    return res.status(400).json({
      success: false,
      error: 'Batch too large',
      message: 'Maximum 500 opportunities per batch'
    });
  }
  
  // Separate opportunities by type
  const workOpps = [];
  const eventOpps = [];
  
  opportunities.forEach((opp, index) => {
    // Add source to each opportunity
    opp.source = source || 'batch';
    
    // Validate type field exists
    if (!opp.type) {
      return; // Skip invalid entries
    }
    
    // Route to appropriate array
    if (['internship', 'job'].includes(opp.type)) {
      workOpps.push({ ...opp, work_type: opp.type });
    } else if (['hackathon', 'learning', 'scholarship'].includes(opp.type)) {
      eventOpps.push({ ...opp, event_type: opp.type });
    }
  });
  
  // Process both arrays in parallel
  const [workResults, eventResults] = await Promise.all([
    workOpps.length > 0 ? workModel.bulkUpsert(workOpps) : [],
    eventOpps.length > 0 ? eventModel.bulkUpsert(eventOpps) : []
  ]);
  
  // Combine results
  const allResults = [...workResults, ...eventResults];
  
  // Calculate summary statistics
  const summary = {
    total: opportunities.length,
    created: allResults.filter(r => r.status === 'created').length,
    updated: allResults.filter(r => r.status === 'updated').length,
    failed: allResults.filter(r => r.status === 'failed').length
  };
  
  // Calculate breakdown by type
  const breakdown = {
    work: {
      internship: { created: 0, updated: 0, failed: 0 },
      job: { created: 0, updated: 0, failed: 0 }
    },
    event: {
      hackathon: { created: 0, updated: 0, failed: 0 },
      learning: { created: 0, updated: 0, failed: 0 },
      scholarship: { created: 0, updated: 0, failed: 0 }
    }
  };
  
  allResults.forEach(result => {
    const category = result.table === 'opportunities_work' ? 'work' : 'event';
    const type = result.type;
    
    if (breakdown[category] && breakdown[category][type]) {
      breakdown[category][type][result.status]++;
    }
  });
  
  // Return response
  res.status(200).json({
    success: true,
    summary,
    breakdown,
    results: allResults.length <= 100 ? allResults : undefined, // Only return details for small batches
    message: `Processed ${summary.total} opportunities: ${summary.created} created, ${summary.updated} updated, ${summary.failed} failed`
  });
});

/**
 * Get batch operation statistics
 * Useful for monitoring scraper performance
 * 
 * GET /api/batch/stats
 * 
 * @route GET /api/batch/stats
 * @access Public
 */
exports.getBatchStats = asyncHandler(async (req, res) => {
  // This would typically query a batch_operations table
  // For now, return basic stats from opportunities
  
  const workStats = await workModel.getStats();
  const eventStats = await eventModel.getStats();
  
  res.json({
    success: true,
    data: {
      work: workStats,
      event: eventStats,
      note: 'Full batch statistics coming soon'
    }
  });
});