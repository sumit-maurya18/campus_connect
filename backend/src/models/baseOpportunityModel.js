// Purpose: Base class for shared database operations
// Both WorkOpportunityModel and EventOpportunityModel extend this

const { query } = require('../config/database');

/**
 * Base Model for Opportunity Operations
 */
class BaseOpportunityModel {
    constructor(tableName, typeField) {
        this.tableName = tableName;
        this.typeField = typeField;
    }

    async findById(id) {
        const sql = `SELECT * FROM ${this.tableName} WHERE id = $1`;
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    }

    async incrementViewCount(id) {
        const sql = `
      UPDATE ${this.tableName}
      SET view_count = view_count + 1,
          updated_at = NOW()
      WHERE id = $1
      RETURNING view_count
    `;
        const result = await query(sql, [id]);
        return result.rows[0];
    }

    async update(id, updates) {
        const setClause = [];
        const values = [];
        let paramIndex = 1;

        const allowedFields = [
            'title', 'city', 'country', 'work_style', 'organization',
            'company', 'image_url', 'deadline', 'tags', 'stipend',
            'duration', 'salary', 'experience', 'skills', 'who_can_apply',
            'team_size', 'fees', 'perks', 'event_date', 'learning_type',
            'domain', 'is_verified', 'is_featured', 'status'
        ];

        Object.keys(updates).forEach(field => {
            if (allowedFields.includes(field) && updates[field] !== undefined) {
                setClause.push(`${field} = $${paramIndex}`);
                values.push(updates[field]);
                paramIndex++;
            }
        });

        if (setClause.length === 0) {
            throw new Error('No valid fields to update');
        }

        setClause.push('updated_at = NOW()');
        values.push(id);

        const sql = `
      UPDATE ${this.tableName}
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

        const result = await query(sql, values);

        if (result.rows.length === 0) {
            throw new Error('Opportunity not found');
        }

        return result.rows[0];
    }

    async delete(id, hardDelete = false) {
        if (hardDelete) {
            const sql = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`;
            const result = await query(sql, [id]);

            if (result.rows.length === 0) {
                throw new Error('Opportunity not found');
            }

            return result.rows[0];
        } else {
            const sql = `
        UPDATE ${this.tableName}
        SET status = 'archived', updated_at = NOW()
        WHERE id = $1
        RETURNING id
      `;
            const result = await query(sql, [id]);

            if (result.rows.length === 0) {
                throw new Error('Opportunity not found');
            }

            return result.rows[0];
        }
    }

    async markExpired(condition) {
        const sql = `
      UPDATE ${this.tableName}
      SET status = 'expired', updated_at = NOW()
      WHERE status = 'active' AND ${condition}
      RETURNING id, title, ${this.typeField}
    `;

        const result = await query(sql);
        return result.rows;
    }

    async getStats() {
        const sql = `
      SELECT 
        ${this.typeField} as type,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE status = 'expired') as expired,
        COUNT(*) FILTER (WHERE status = 'archived') as archived,
        COUNT(*) FILTER (WHERE is_featured = true) as featured,
        COUNT(*) FILTER (WHERE is_verified = true) as verified
      FROM ${this.tableName}
      GROUP BY ${this.typeField}
    `;

        const result = await query(sql);
        return result.rows;
    }

    /**
     * Build WHERE clause from filters
     * FIXED: Now properly returns paramIndex for subsequent parameters
     */
    buildWhereClause(filters) {
        const conditions = [];
        const values = [];
        let paramIndex = 1;

        // Type filter
        if (filters.type) {
            conditions.push(`${this.typeField} = $${paramIndex}`);
            values.push(filters.type);
            paramIndex++;
        }

        // Status filter (default to active)
        if (filters.status) {
            conditions.push(`status = $${paramIndex}`);
            values.push(filters.status);
            paramIndex++;
        } else if (!filters.includeInactive) {
            conditions.push(`status = $${paramIndex}`);
            values.push('active');
            paramIndex++;
        }

        // Location filters
        if (filters.city) {
            conditions.push(`LOWER(city) LIKE LOWER($${paramIndex})`);
            values.push(`%${filters.city}%`);
            paramIndex++;
        }

        if (filters.country) {
            conditions.push(`LOWER(country) LIKE LOWER($${paramIndex})`);
            values.push(`%${filters.country}%`);
            paramIndex++;
        }

        // Work style filter
        if (filters.work_style) {
            conditions.push(`work_style = $${paramIndex}`);
            values.push(filters.work_style);
            paramIndex++;
        }

        // Featured/Verified filters
        if (filters.featured === 'true' || filters.featured === true) {
            conditions.push(`is_featured = true`);
        }

        if (filters.verified === 'true' || filters.verified === true) {
            conditions.push(`is_verified = true`);
        }

        // Full-text search
        if (filters.search) {
            conditions.push(`
        (to_tsvector('english', title || ' ' || COALESCE(organization, '') || ' ' || COALESCE(company, '')) 
        @@ plainto_tsquery('english', $${paramIndex}))
      `);
            values.push(filters.search);
            paramIndex++;
        }

        // Tags filter
        if (filters.tags) {
            const tagsArray = Array.isArray(filters.tags) 
                ? filters.tags 
                : filters.tags.split(',').map(t => t.trim());
            conditions.push(`tags && $${paramIndex}`);
            values.push(tagsArray);
            paramIndex++;
        }

        // Skills filter
        if (filters.skills) {
            const skillsArray = Array.isArray(filters.skills)
                ? filters.skills
                : filters.skills.split(',').map(s => s.trim());
            conditions.push(`skills && $${paramIndex}`);
            values.push(skillsArray);
            paramIndex++;
        }

        // Domain filter
        if (filters.domain) {
            const domainArray = Array.isArray(filters.domain)
                ? filters.domain
                : filters.domain.split(',').map(d => d.trim());
            conditions.push(`domain && $${paramIndex}`);
            values.push(domainArray);
            paramIndex++;
        }

        // Fees filter
        if (filters.fees) {
            conditions.push(`fees = $${paramIndex}`);
            values.push(filters.fees);
            paramIndex++;
        }

        // Deadline filters
        if (filters.deadline) {
            const now = new Date();

            switch (filters.deadline) {
                case 'upcoming':
                    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                    conditions.push(`deadline BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
                    values.push(now, thirtyDays);
                    paramIndex += 2;
                    break;

                case 'this_week':
                    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                    conditions.push(`deadline BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
                    values.push(now, sevenDays);
                    paramIndex += 2;
                    break;

                case 'this_month':
                    const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                    conditions.push(`deadline BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
                    values.push(now, monthFromNow);
                    paramIndex += 2;
                    break;
            }
        }

        // FIXED: Return proper WHERE clause
        const whereClause = conditions.length > 0 
            ? 'WHERE ' + conditions.join(' AND ') 
            : '';

        return {
            whereClause,
            values,
            paramIndex // This is now the NEXT available parameter index
        };
    }

    buildOrderClause(sort = 'posted_date', order = 'desc') {
        const validSortFields = [
            'posted_date',
            'deadline',
            'view_count',
            'created_at',
            'event_date',
            'title'
        ];

        const validOrders = ['asc', 'desc'];

        const safeSort = Array.isArray(sort) ? sort[0] : sort;
        const safeOrder = Array.isArray(order) ? order[0] : order;

        const sortField = validSortFields.includes(safeSort)
            ? safeSort
            : 'posted_date';

        const sortOrder =
            typeof safeOrder === 'string' &&
            validOrders.includes(safeOrder.toLowerCase())
                ? safeOrder.toUpperCase()
                : 'DESC';

        return `ORDER BY ${sortField} ${sortOrder}`;
    }
}

module.exports = BaseOpportunityModel;