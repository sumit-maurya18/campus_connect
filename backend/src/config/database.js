const { Pool } = require("pg");
const config = require("./env");
const logger = require("../utils/logger");

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    })
  : new Pool({
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: config.isProduction() ? { rejectUnauthorized: false } : false
    });

pool.on("error", err => {
  logger.error("Unexpected database error", err);
});

async function initDatabase() {
  try {
    await pool.query("SELECT 1");
    logger.info("Database pool initialized");
  } catch (err) {
    logger.error("Database initialization failed", err);
    process.exit(1);
  }
}

const query = async (text, params) => {
  const start = Date.now();

  try {
    const result = await pool.query(text, params);

    const duration = Date.now() - start;

    if (duration > 300) {
      logger.warn({
        msg: "Slow query detected",
        duration,
        query: text.replace(/\s+/g, " ").slice(0, 120)
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

    const result = await callback({
      query: (text, params) => client.query(text, params)
    });

    await client.query("COMMIT");

    return result;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;

  } finally {
    client.release();
  }
};

const closeConnection = async () => {
  await pool.end();
};

module.exports = {
  pool,
  query,
  transaction,
  initDatabase,
  closeConnection
};