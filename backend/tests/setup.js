// Test environment setup
process.env.NODE_ENV = 'test';
process.env.PORT = 5001;
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/opportunity_portal_test';

// Disable rate limiting in tests
process.env.DISABLE_RATE_LIMIT = 'true';

// Global test timeout
jest.setTimeout(30000);

// Track if pool has been closed
let poolClosed = false;

// Clean up after ALL tests complete
afterAll(async () => {
  // Only close pool once
  if (!poolClosed) {
    const { pool } = require('../src/config/database');
    if (pool) {
      try {
        await pool.end();
        poolClosed = true;
      } catch (err) {
        // Ignore errors if pool already closed
        if (!err.message.includes('Called end on pool more than once')) {
          console.error('Error closing pool:', err);
        }
      }
    }
  }
  
  // Give time for cleanup
  await new Promise(resolve => setTimeout(resolve, 500));
});