/**
 * API Key Authentication Middleware
 *
 * Protects backend from unauthorized usage
 * Public: GET requests
 * Protected: POST, PUT, PATCH, DELETE
 */

const crypto = require("crypto");
const { apiSecretKey } = require("../config/env");

module.exports = function apiKeyAuth(req, res, next) {

  // --------------------------------------------
  // Allow all GET requests (public APIs)
  // --------------------------------------------
  if (req.method === "GET") {
    return next();
  }

  // --------------------------------------------
  // API key must exist
  // --------------------------------------------
  if (!apiSecretKey) {
    return res.status(500).json({
      success: false,
      error: "API key not configured"
    });
  }

  const incoming = req.headers["x-api-key"];

  if (!incoming) {
    return res.status(401).json({
      success: false,
      error: "Missing API key"
    });
  }

  // --------------------------------------------
  // Safe API key comparison
  // --------------------------------------------
  const valid =
    incoming.length === apiSecretKey.length &&
    crypto.timingSafeEqual(
      Buffer.from(incoming),
      Buffer.from(apiSecretKey)
    );

  if (!valid) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized"
    });
  }

  next();
};