// backend/src/config/database.js
const { Pool } = require('pg');
const config = require('./env');

// Create PostgreSQL connection pool
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Fail after 2s if can't connect
  // For Neon serverless (uncomment when using Neon)
  // ssl: { rejectUnauthorized: false }
});

// Connection event handlers
pool.on('connect', (client) => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err, client) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

pool.on('remove', (client) => {
  console.log('🔌 Database connection removed from pool');
});

// Helper function to test connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('🔗 Database connection test successful:', result.rows[0].now);
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection test failed:', err.message);
    return false;
  }
};

// Helper function to execute query with error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries (> 100ms) - Skip in test environment
    if (duration > 100 && process.env.NODE_ENV !== 'test') {
      console.warn(`⚠️  Slow query (${duration}ms):`, text.substring(0, 50));
    }

    return result;
  } catch (err) {
    console.error('❌ Query error:', err.message);
    console.error('Query:', text);
    console.error('Params:', params);
    throw err;
  }
};

// Helper function for transactions
const transaction = async (callback) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Gracefully closes the PostgreSQL connection pool.
 * Called during application shutdown.
 */
const closeConnection = async () => {
  try {
    console.log('🔻 Closing database connection pool...');
    await pool.end();
    console.log('✅ Database connection pool closed');
  } catch (err) {
    console.error('❌ Failed to close database connection pool:', err);
    throw err;
  }
};

module.exports = {
  pool,
  query,
  transaction,
  testConnection,
  closeConnection
};