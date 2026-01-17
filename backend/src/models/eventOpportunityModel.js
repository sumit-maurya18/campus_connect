// Purpose: Database operations for event opportunities
// Handles hackathons, learning programs, and scholarships

const BaseOpportunityModel = require('./baseOpportunityModel');
const { query } = require('../config/database');

/**
 * Event Opportunity Model
 * Handles hackathons, learning programs, scholarships (opportunities_event table)
 */
class EventOpportunityModel extends BaseOpportunityModel {
  constructor() {
    super('opportunities_event', 'event_type');
  }

  /**
   * Create event opportunity with automatic deduplication
   * 
   * @param {Object} data - Opportunity data
   * @param {string} eventType - 'hackathon', 'learning', or 'scholarship'
   * @returns {Promise<Object>} Created/updated opportunity with action flag
   */
  async create(data, eventType) {
    const sql = `
      INSERT INTO opportunities_event (
        event_type, title, apply_url, city, country,
        organization, image_url, team_size, fees, perks,
        event_date, learning_type, deadline, tags, domain,
        source, external_id, is_verified, is_featured
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      )
      ON CONFLICT (event_type, apply_url) 
      DO UPDATE SET
        last_seen_date = NOW(),
        status = CASE 
          WHEN opportunities_event.status IN ('expired', 'archived') THEN 'active'
          ELSE opportunities_event.status
        END,
        title = EXCLUDED.title,
        city = EXCLUDED.city,
        country = EXCLUDED.country,
        organization = EXCLUDED.organization,
        deadline = EXCLUDED.deadline,
        event_date = EXCLUDED.event_date,
        tags = EXCLUDED.tags,
        domain = EXCLUDED.domain,
        team_size = EXCLUDED.team_size,
        fees = EXCLUDED.fees,
        perks = EXCLUDED.perks,
        updated_at = NOW()
      RETURNING *, 
        CASE WHEN xmax = 0 THEN 'created' ELSE 'updated' END as action
    `;

    const values = [
      eventType,
      data.title,
      data.apply_url,
      data.city || null,
      data.country || null,
      data.organization || null,
      data.image_url || null,
      data.team_size || null,
      data.fees || null,
      data.perks || null,
      data.event_date || null,
      data.learning_type || null,
      data.deadline || null,
      data.tags || null,
      data.domain || null,
      data.source || 'manual',
      data.external_id || null,
      data.is_verified || false,
      data.is_featured || false
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Find all event opportunities with pagination and filters
   * 
   * @param {Object} filters - Query filters
   * @param {number} page - Page number (1-indexed)
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Data and pagination info
   */
  async findAll(filters = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { whereClause, values, paramIndex } = this.buildWhereClause(filters);
    const orderClause = this.buildOrderClause(filters.sort, filters.order);

    // Get total count
    const countSql = `SELECT COUNT(*) FROM ${this.tableName} ${whereClause}`;
    const countResult = await query(countSql, values);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    values.push(limit, offset);
    const dataSql = `
      SELECT * FROM ${this.tableName}
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const dataResult = await query(dataSql, values);

    return {
      data: dataResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    };
  }

  /**
   * Bulk upsert for batch operations
   * 
   * @param {Array} opportunities - Array of opportunity objects
   * @returns {Promise<Array>} Results with status for each
   */
  async bulkUpsert(opportunities) {
    const results = [];
    
    for (const opp of opportunities) {
      try {
        const result = await this.create(opp, opp.event_type);
        
        results.push({
          id: result.id,
          type: result.event_type,
          table: 'opportunities_event',
          status: result.action,
          url: result.apply_url
        });
      } catch (err) {
        results.push({
          url: opp.apply_url,
          type: opp.event_type,
          table: 'opportunities_event',
          status: 'failed',
          error: err.message
        });
      }
    }

    return results;
  }

  /**
   * Find upcoming events (by event_date)
   * 
   * @param {number} daysFromNow - Days to look ahead
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Upcoming events
   */
  async findUpcoming(daysFromNow = 30, limit = 20) {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE status = 'active'
        AND event_date IS NOT NULL
        AND event_date BETWEEN NOW() AND NOW() + INTERVAL '${daysFromNow} days'
      ORDER BY event_date ASC
      LIMIT $1
    `;

    const result = await query(sql, [limit]);
    return result.rows;
  }

  /**
   * Find free events (unpaid)
   * 
   * @param {string} eventType - Optional filter by type
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Free events
   */
  async findFreeEvents(eventType = null, limit = 20) {
    let sql = `
      SELECT * FROM ${this.tableName}
      WHERE status = 'active'
        AND fees = 'unpaid'
    `;

    const values = [];
    
    if (eventType) {
      sql += ` AND event_type = $1`;
      values.push(eventType);
    }

    sql += ` ORDER BY posted_date DESC LIMIT $${values.length + 1}`;
    values.push(limit);

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get featured events
   * Used for homepage
   * 
   * @param {string} eventType - 'hackathon', 'learning', or 'scholarship'
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Featured events
   */
  async getFeatured(eventType, limit = 4) {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE event_type = $1
        AND status = 'active'
        AND is_featured = true
      ORDER BY posted_date DESC
      LIMIT $2
    `;

    const result = await query(sql, [eventType, limit]);
    return result.rows;
  }

  /**
   * Find events by domain (AI, Web3, etc.)
   * 
   * @param {Array} domains - Array of domain names
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Events matching domains
   */
  async findByDomain(domains, limit = 20) {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE status = 'active'
        AND domain && $1
      ORDER BY posted_date DESC
      LIMIT $2
    `;

    const result = await query(sql, [domains, limit]);
    return result.rows;
  }
}

// Export singleton instance
module.exports = new EventOpportunityModel();