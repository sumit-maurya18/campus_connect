// backend/src/config/env.js
require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'campus_connect',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
  
  // CORS Configuration
  //'https://hoppscotch.io' for hopscotch API testing
  cors: {
    origin: 
    [
    process.env.CORS_ORIGIN,
    'http://localhost:3000',
    'https://hoppscotch.io',
  ]
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  
  // Pagination
  pagination: {
    defaultLimit: 10,
    maxLimit: 50,
  },
  
  // Cleanup Configuration
  cleanup: {
    workRetentionDays: 5, // Delete work opps after 5 days
    eventArchiveDays: 7,  // Archive events 7 days after expiry
    staleDetectionDays: 14, // Mark as stale if not seen in 14 days
  }
};

// Validation
const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

const missingEnvVars = requiredEnvVars.filter(
  varName => !process.env[varName]
);

if (missingEnvVars.length > 0 && process.env.NODE_ENV !== 'development') {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

config.isDevelopment = () => config.nodeEnv === 'development';
config.isProduction = () => config.nodeEnv === 'production';


module.exports = config;