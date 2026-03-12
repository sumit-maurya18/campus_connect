/**
 * PostgreSQL Database Layer
 *
 * Responsibilities:
 * - connection pooling
 * - query execution
 * - transaction support
 * - slow query logging
 */

const { Pool } = require("pg");
const config = require("./env");
const logger = require("../utils/logger");

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,

  ssl: config.isProduction()
    ? { rejectUnauthorized: false }
    : false
});

pool.on("connect", () => {
  logger.info("Database connection established");
});

pool.on("error", err => {
  logger.error("Unexpected database error", err);
  process.exit(1);
});

const query = async (text, params) => {
  const start = Date.now();

  try {
    const result = await pool.query(text, params);

    const duration = Date.now() - start;

    if (duration > 100) {
      logger.warn({
        msg: "Slow query detected",
        duration,
        query: text.slice(0, 80)
      });
    }

    return result;

  } catch (err) {
    logger.error({
      msg: "Database query failed",
      query: text,
      params,
      error: err.message
    });

    throw err;
  }
};

const transaction = async callback => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");

    return result;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;

  } finally {
    client.release();
  }
};

const testConnection = async () => {
  try {
    await query("SELECT NOW()");
    return true;
  } catch {
    return false;
  }
};

const closeConnection = async () => {
  await pool.end();
};

module.exports = {
  pool,
  query,
  transaction,
  testConnection,
  closeConnection
};