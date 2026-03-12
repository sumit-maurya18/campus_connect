/**
 * Centralized Logger
 *
 * Why this exists:
 * - Avoid console.log scattered everywhere
 * - Structured logs for production monitoring
 * - Compatible with log collectors (Datadog, ELK, etc.)
 */

const pino = require("pino");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: process.env.NODE_ENV === "development"
    ? {
        target: "pino-pretty",
        options: {
          colorize: true
        }
      }
    : undefined
});

module.exports = logger;