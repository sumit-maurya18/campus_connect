const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const config = require("./config/env");
const routes = require("./routes");

const apiKeyAuth = require("./middleware/apiKeyAuth");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

const logger = require("./utils/logger");

const app = express();

app.use(helmet());
app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info({
    method: req.method,
    path: req.originalUrl
  });
  next();
});

/**
 * HEALTH ROUTE (MUST BE BEFORE LIMITER & API KEY)
 * Render uses this
 */
app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

/**
 * CORS
 */
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

/**
 * Rate limiting
 */
app.use("/api", apiLimiter);

/**
 * API key protection
 */
app.use("/api", apiKeyAuth);

/**
 * Root route
 */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Campus Connect API"
  });
});

/**
 * API routes
 */
app.use("/api", routes);

/**
 * 404
 */
app.use(notFoundHandler);

/**
 * Global error handler
 */
app.use(errorHandler);

module.exports = app;