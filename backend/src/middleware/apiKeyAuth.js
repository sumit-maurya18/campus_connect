const { apiSecretKey } = require('../config/env');

module.exports = function apiKeyAuth(req, res, next) {
  // Skip if no key is configured (safety — forces you to set it)
  if (!apiSecretKey) {
    return res.status(500).json({ success: false, error: 'API key not configured on server' });
  }

  const incoming = req.headers['x-api-key'];

  if (!incoming || incoming !== apiSecretKey) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  next();
};