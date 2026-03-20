/**
 * Entry point for the backend server.
 *
 * Responsibilities:
 * 1. Load environment variables
 * 2. Initialize database pool
 * 3. Start HTTP server
 * 4. Handle graceful shutdown
 */

require("dotenv").config();

const app = require("./app");
const config = require("./config/env");
const {
  initDatabase,
  closeConnection
} = require("./config/database");

const logger = require("./utils/logger");

const PORT = config.port;

let shuttingDown = false;

const startServer = async () => {
  try {
    // ----------------------------------
    // Initialize database pool
    // ----------------------------------
    await initDatabase();

    // ----------------------------------
    // Start HTTP server
    // ----------------------------------
    const server = app.listen(PORT, () => {
      logger.info(`
🚀 Campus Connect Backend Server
-----------------------------------------
📡 Port:        ${PORT}
🌍 Environment: ${config.nodeEnv}
📍 URL:         http://localhost:${PORT}
🏥 Health:      http://localhost:${PORT}/api/health
-----------------------------------------
      `);
    });

    // ----------------------------------
    // Graceful shutdown
    // ----------------------------------
    const gracefulShutdown = async (signal) => {
      if (shuttingDown) return;
      shuttingDown = true;

      logger.info(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        try {
          await closeConnection();
          logger.info("Database connection closed");
          logger.info("Server shutdown complete");
          process.exit(0);
        } catch (err) {
          logger.error("Error during shutdown", err);
          process.exit(1);
        }
      });

      setTimeout(async () => {
        logger.error("Forced shutdown after timeout");
        await closeConnection();
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);

    // ----------------------------------
    // Global error handlers
    // ----------------------------------
    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception", err);
      process.exit(1);
    });

    process.on("unhandledRejection", (err) => {
      logger.error("Unhandled Promise Rejection", err);
      server.close(() => process.exit(1));
    });

  } catch (err) {
    logger.error("Server failed to start", err);
    process.exit(1);
  }
};

startServer();