const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Future routes will be added here
// const opportunityRoutes = require('./opportunityRoutes');
// router.use('/opportunities', opportunityRoutes);

module.exports = router;