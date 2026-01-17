/**
 * Entry point for the backend server.
 *
 * Responsibilities of this file:
 * 1. Load environment variables
 * 2. Validate core dependencies (DB connectivity)
 * 3. Start the HTTP server
 * 4. Handle graceful shutdown and fatal errors
 *
 * NOTE:
 * - Business logic does NOT belong here
 * - Database internals are NOT accessed directly
 * - Configuration is delegated to config modules
 */

// --------------------------------------------------
// Load environment variables FIRST
// --------------------------------------------------
// This must run before importing any file that
// reads from process.env (config, database, app, etc.)
require('dotenv').config();

// --------------------------------------------------
// Core imports
// --------------------------------------------------
const app = require('./app');                 // Express application
const config = require('./config/env');       // Centralized environment/config logic
const {
  testConnection,
  closeConnection
} = require('./config/database');              // DB lifecycle helpers

// --------------------------------------------------
// Server configuration
// --------------------------------------------------
const PORT = config.port;

// --------------------------------------------------
// Server bootstrap function
// --------------------------------------------------
/**
 * Starts the backend server.
 *
 * Flow:
 * 1. Verify database connectivity
 * 2. Start HTTP server
 * 3. Register shutdown & error handlers
 */
const startServer = async () => {
  try {
    // ----------------------------------------------
    // Step 1: Verify database connection
    // ----------------------------------------------
    const connected = await testConnection();

    if (!connected) {
      console.error('❌ Failed to connect to database');
      process.exit(1); // Fail fast: app is useless without DB
    }

    // ----------------------------------------------
    // Step 2: Start HTTP server
    // ----------------------------------------------
    const server = app.listen(PORT, () => {
      console.log(`
🚀 Campus Connect Backend Server
-----------------------------------------
📡 Port:        ${PORT}
🌍 Environment: ${config.nodeEnv}
📍 URL:         http://localhost:${PORT}
🏥 Health:      http://localhost:${PORT}/api/health
-----------------------------------------
      `);
    });

    // ----------------------------------------------
    // Step 3: Graceful shutdown handling
    // ----------------------------------------------
    /**
     * Handles clean shutdown of the application.
     * Ensures:
     * - No new HTTP connections are accepted
     * - Existing connections are completed
     * - Database pool is closed properly
     */
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      // Stop accepting new HTTP connections
      server.close(async () => {
        try {
          // Close database connections
          await closeConnection();
          console.log('✅ Database connection closed');
          console.log('✅ Server shutdown complete');
          process.exit(0);
        } catch (err) {
          console.error('❌ Error during shutdown:', err);
          process.exit(1);
        }
      });

      // Safety net: force exit if shutdown hangs
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // OS-level termination signals
    process.on('SIGINT', gracefulShutdown);   // Ctrl + C
    process.on('SIGTERM', gracefulShutdown);  // Docker / cloud shutdown

    // ----------------------------------------------
    // Global error handlers (last line of defense)
    // ----------------------------------------------

    /**
     * Catches synchronous exceptions not handled elsewhere.
     * Example: programming errors, undefined access, etc.
     */
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err);
      process.exit(1);
    });

    /**
     * Catches rejected promises that were not awaited/handled.
     * Common in async-heavy backends.
     */
    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Promise Rejection:', err);
      server.close(() => process.exit(1));
    });

  } catch (err) {
    // Any failure during startup is fatal
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
};

// --------------------------------------------------
// Start the application
// --------------------------------------------------
startServer();
