require("dotenv").config();

const app = require("./app");
const config = require("./config/env");
const {
  initDatabase,
  closeConnection
} = require("./config/database");

const logger = require("./utils/logger");

const PORT = process.env.PORT || config.port || 5000;

let shuttingDown = false;

const startServer = async () => {
  try {
    // Start server FIRST (important for Render)
    const server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(`
🚀 Campus Connect Backend Server
-----------------------------------------
📡 Port:        ${PORT}
🌍 Environment: ${config.nodeEnv}
🏥 Health:      /api/health
-----------------------------------------
      `);
    });

    // Connect database AFTER server starts
    initDatabase()
      .then(() => logger.info("Database connected"))
      .catch(err => logger.error("Database connection failed", err));

    // Graceful shutdown
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
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);

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