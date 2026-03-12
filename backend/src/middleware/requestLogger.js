/**
 * Request Logger Middleware
 *
 * Logs every incoming request.
 */

const logger = require("../utils/logger");

module.exports = (req, res, next) => {

  logger.info({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });

  next();
};