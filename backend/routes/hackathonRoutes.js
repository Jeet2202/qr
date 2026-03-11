const express = require('express');
const router = express.Router();
const { 
  getHackathonDetails,
  updateSettings,
  getDashboardData
} = require('../controllers/hackathonController');
const { protect, requireRole } = require('../middleware/auth');

// Base route is /api/organizer/hackathons

// GET: Fetch dashboard data
router.get('/dashboard', protect, requireRole('organizer', 'admin'), getDashboardData);

// GET: Fetch event data
router.get('/:id', protect, requireRole('organizer', 'admin'), getHackathonDetails);

// PUT: Update registration and submission toggles
router.put('/:id/settings', protect, requireRole('organizer', 'admin'), updateSettings);

module.exports = router;
