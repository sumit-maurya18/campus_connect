// Purpose: Database operations for work opportunities (internships and jobs)
// Extends BaseOpportunityModel with work-specific functionality

const BaseOpportunityModel = require('./baseOpportunityModel');
const { query } = require('../config/database');

/**
 * Work Opportunity Model
 * Handles internships and jobs (opportunities_work table)
 */
class WorkOpportunityModel extends BaseOpportunityModel {
  constructor() {
    super('opportunities_work', 'work_type');
  }

  /**
   * Create work opportunity with automatic deduplication
   * 
   * If apply_url already exists for this work_type:
   * - Updates existing record
   * - Refreshes last_seen_date
   * - Reactivates if was expired
   * 
   * @param {Object} data - Opportunity data
   * @param {string} workType - 'internship' or 'job'
   * @returns {Promise<Object>} Created/updated opportunity with action flag
   */
  async create(data, workType) {
    const sql = `
      INSERT INTO opportunities_work (
        work_type, title, apply_url, city, country, work_style,
        organization, company, image_url, stipend, duration,
        salary, experience, skills, who_can_apply, deadline,
        tags, source, external_id, is_verified, is_featured
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
      )
      ON CONFLICT (work_type, apply_url) 
      DO UPDATE SET
        last_seen_date = NOW(),
        status = CASE 
          WHEN opportunities_work.status = 'expired' THEN 'active'
          ELSE opportunities_work.status
        END,
        title = EXCLUDED.title,
        city = EXCLUDED.city,
        country = EXCLUDED.country,
        work_style = EXCLUDED.work_style,
        organization = EXCLUDED.organization,
        company = EXCLUDED.company,
        deadline = EXCLUDED.deadline,
        tags = EXCLUDED.tags,
        stipend = EXCLUDED.stipend,
        duration = EXCLUDED.duration,
        salary = EXCLUDED.salary,
        experience = EXCLUDED.experience,
        skills = EXCLUDED.skills,
        updated_at = NOW()
      RETURNING *, 
        CASE WHEN xmax = 0 THEN 'created' ELSE 'updated' END as action
    `;

    const values = [
      workType,
      data.title,
      data.apply_url,
      data.city || null,
      data.country || null,
      data.work_style || null,
      data.organization || null,
      data.company || data.organization || null, // company defaults to organization
      data.image_url || null,
      data.stipend || null,
      data.duration || null,
      data.salary || null,
      data.experience || null,
      data.skills || null,
      data.who_can_apply || null,
      data.deadline || null,
      data.tags || null,
      data.source || 'manual',
      data.external_id || null,
      data.is_verified || false,
      data.is_featured || false
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Find all work opportunities with pagination and filters
   * 
   * @param {Object} filters - Query filters
   * @param {number} page - Page number (1-indexed)
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Data and pagination info
   */
  async findAll(filters = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // Build WHERE clause from filters
    const { whereClause, values, paramIndex } = this.buildWhereClause(filters);
    
    // Build ORDER BY clause
    const orderClause = this.buildOrderClause(filters.sort, filters.order);

    // Get total count for pagination
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
   * Used by scrapers to insert multiple opportunities at once
   * 
   * @param {Array} opportunities - Array of opportunity objects
   * @returns {Promise<Array>} Results with status for each
   */
  async bulkUpsert(opportunities) {
    const results = [];
    
    // Process each opportunity
    for (const opp of opportunities) {
      try {
        const result = await this.create(opp, opp.work_type);
        
        results.push({
          id: result.id,
          type: result.work_type,
          table: 'opportunities_work',
          status: result.action, // 'created' or 'updated'
          url: result.apply_url
        });
      } catch (err) {
        results.push({
          url: opp.apply_url,
          type: opp.work_type,
          table: 'opportunities_work',
          status: 'failed',
          error: err.message
        });
      }
    }

    return results;
  }

  /**
   * Get work opportunities by company/organization
   * 
   * @param {string} organizationName - Company/organization name
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Opportunities from that organization
   */
  async findByOrganization(organizationName, limit = 10) {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE (
        LOWER(organization) LIKE LOWER($1) 
        OR LOWER(company) LIKE LOWER($1)
      )
      AND status = 'active'
      ORDER BY posted_date DESC
      LIMIT $2
    `;

    const result = await query(sql, [`%${organizationName}%`, limit]);
    return result.rows;
  }

  /**
   * Find opportunities expiring soon
   * Useful for reminders/notifications
   * 
   * @param {number} daysFromNow - Days to look ahead
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Expiring opportunities
   */
  async findExpiringSoon(daysFromNow = 7, limit = 20) {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE status = 'active'
        AND deadline IS NOT NULL
        AND deadline BETWEEN NOW() AND NOW() + INTERVAL '${daysFromNow} days'
      ORDER BY deadline ASC
      LIMIT $1
    `;

    const result = await query(sql, [limit]);
    return result.rows;
  }

  /**
   * Get featured work opportunities
   * Used for homepage
   * 
   * @param {string} workType - 'internship' or 'job'
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Featured opportunities
   */
  async getFeatured(workType, limit = 4) {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE work_type = $1
        AND status = 'active'
        AND is_featured = true
      ORDER BY posted_date DESC
      LIMIT $2
    `;

    const result = await query(sql, [workType, limit]);
    return result.rows;
  }
}

// Export singleton instance
module.exports = new WorkOpportunityModel();