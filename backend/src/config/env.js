require("dotenv").config();

const logger = require("../utils/logger");

const usingNeon = !!process.env.DATABASE_URL;

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  apiSecretKey: process.env.API_SECRET_KEY,

  database: usingNeon
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432"),
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      },

  cors: {
    origin: (process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .filter(Boolean)
      .concat([
        "http://localhost:3000",
        "https://hoppscotch.io"
      ])
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100")
  },

  pagination: {
    defaultLimit: 10,
    maxLimit: 50
  }
};

// --------------------------------------------
// Required variables check
// --------------------------------------------
if (!usingNeon) {
  const required = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"];
  const missing = required.filter(v => !process.env[v]);

  if (missing.length > 0 && config.nodeEnv !== "development") {
    logger.error("Missing environment variables:", missing);
    process.exit(1);
  }
} else {
  if (!process.env.DATABASE_URL) {
    logger.error("DATABASE_URL is required in production");
    process.exit(1);
  }
}

config.isDevelopment = () => config.nodeEnv === "development";
config.isProduction = () => config.nodeEnv === "production";

module.exports = config;