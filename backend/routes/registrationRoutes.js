const express = require('express');
const router = express.Router();
const { registerTeam, getRegistrations } = require('../controllers/registrationController');

// POST register a team
router.post('/', registerTeam);

// GET registrations for a hackathon
router.get('/:hackathonId', getRegistrations);

module.exports = router;
