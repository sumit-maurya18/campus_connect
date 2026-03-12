/**
 * BaseOpportunityModel
 *
 * Shared database operations for opportunity tables.
 */

const { query } = require("../config/database");

class BaseOpportunityModel {

  constructor(tableName, typeField) {
    this.tableName = tableName;
    this.typeField = typeField;
  }

  async findById(id) {

    const sql = `
      SELECT *
      FROM ${this.tableName}
      WHERE id = $1
    `;

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

    const allowedFields = [
      "title","city","country","work_style","organization","company",
      "image_url","deadline","tags","stipend","duration","salary",
      "experience","skills","who_can_apply","team_size","fees","perks",
      "event_date","learning_type","domain","is_verified","is_featured","status"
    ];

    const setClause = [];
    const values = [];

    let paramIndex = 1;

    for (const field of Object.keys(updates)) {

      if (!allowedFields.includes(field)) continue;

      setClause.push(`${field} = $${paramIndex}`);
      values.push(updates[field]);
      paramIndex++;
    }

    if (!setClause.length) {
      throw new Error("No valid fields to update");
    }

    setClause.push("updated_at = NOW()");
    values.push(id);

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClause.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(sql, values);

    if (!result.rows.length) {
      throw new Error("Opportunity not found");
    }

    return result.rows[0];
  }

  async delete(id, hardDelete = false) {

    if (hardDelete) {

      const sql = `
        DELETE FROM ${this.tableName}
        WHERE id = $1
        RETURNING id
      `;

      const result = await query(sql, [id]);

      if (!result.rows.length) {
        throw new Error("Opportunity not found");
      }

      return result.rows[0];
    }

    const sql = `
      UPDATE ${this.tableName}
      SET status='archived',updated_at=NOW()
      WHERE id=$1
      RETURNING id
    `;

    const result = await query(sql, [id]);

    if (!result.rows.length) {
      throw new Error("Opportunity not found");
    }

    return result.rows[0];
  }

  async getStats() {

    const sql = `
      SELECT
        ${this.typeField} as type,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status='active') as active,
        COUNT(*) FILTER (WHERE status='expired') as expired,
        COUNT(*) FILTER (WHERE status='archived') as archived,
        COUNT(*) FILTER (WHERE is_featured=true) as featured,
        COUNT(*) FILTER (WHERE is_verified=true) as verified
      FROM ${this.tableName}
      GROUP BY ${this.typeField}
    `;

    const result = await query(sql);

    return result.rows;
  }

  buildWhereClause(filters = {}) {

    const conditions = [];
    const values = [];

    let paramIndex = 1;

    if (filters.type) {
      conditions.push(`${this.typeField}=$${paramIndex}`);
      values.push(filters.type);
      paramIndex++;
    }

    if (filters.status) {
      conditions.push(`status=$${paramIndex}`);
      values.push(filters.status);
      paramIndex++;
    } else if (!filters.includeInactive) {
      conditions.push(`status=$${paramIndex}`);
      values.push("active");
      paramIndex++;
    }

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

    if (filters.search) {

      conditions.push(`
        to_tsvector('english', title || ' ' || COALESCE(organization,''))
        @@ plainto_tsquery('english',$${paramIndex})
      `);

      values.push(filters.search);
      paramIndex++;
    }

    const whereClause =
      conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    return { whereClause, values, paramIndex };
  }

  buildOrderClause(sort="posted_date",order="desc") {

    const allowedSort=[
      "posted_date","deadline","view_count","created_at","event_date","title"
    ];

    const sortField=allowedSort.includes(sort)?sort:"posted_date";

    const direction=order==="asc"?"ASC":"DESC";

    return `ORDER BY ${sortField} ${direction}`;
  }

}

module.exports = BaseOpportunityModel;