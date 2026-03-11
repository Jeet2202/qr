const Hackathon = require('../models/Hackathon');
const Participant = require('../models/Participant');
const Activity = require('../models/Activity');
const EventTeam = require('../models/EventTeam'); // Reusing from the Event Management tab
const User = require('../models/User');

/* ────────────────────────────────────────────────────────────────────────────
   GET /api/organizer/hackathons/:id
   Fetch full details for the Manage Hackathon overview
──────────────────────────────────────────────────────────────────────────── */
const getHackathonDetails = async (req, res) => {
  try {
    const hackId = req.params.id;
    
    // In a real app we'd just findOne. If it doesn't exist, we'll return a 404
    // But to ensure the frontend doesn't break if empty, we'll return default shape
    const hackathon = await Hackathon.findOne({ hackathonId: hackId });
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    const participants = await Participant.find({ hackathonId: hackId }).sort({ createdAt: -1 });
    const activities = await Activity.find({ hackathonId: hackId }).sort({ createdAt: -1 }).limit(10);
    const teams = await EventTeam.find({ hackathonId: hackId }).sort({ createdAt: -1 });

    res.json({
      hackathon,
      participants,
      activities,
      teams
    });
  } catch (err) {
    console.error('[getHackathonDetails]', err);
    res.status(500).json({ message: 'Server error retrieving hackathon details' });
  }
};

/* ────────────────────────────────────────────────────────────────────────────
   PUT /api/organizer/hackathons/:id/settings
   Update event registration and submission toggles
──────────────────────────────────────────────────────────────────────────── */
const updateSettings = async (req, res) => {
  try {
    const hackId = req.params.id;
    const { regOpen, subsOpen } = req.body;

    const hackathon = await Hackathon.findOne({ hackathonId: hackId });
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });

    if (regOpen !== undefined) hackathon.settings.regOpen = regOpen;
    if (subsOpen !== undefined) hackathon.settings.subsOpen = subsOpen;

    await hackathon.save();

    res.json({ settings: hackathon.settings });
  } catch (err) {
    console.error('[updateSettings]', err);
    res.status(500).json({ message: 'Error updating hackathon settings' });
  }
};

/* ────────────────────────────────────────────────────────────────────────────
   GET /api/organizer/hackathons/dashboard
   Fetch aggregated data for the Organizer Dashboard
──────────────────────────────────────────────────────────────────────────── */
const getDashboardData = async (req, res) => {
  try {
    const hackathons = await Hackathon.find().sort({ createdAt: -1 });
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(10);
    const participantsCount = await Participant.countDocuments();
    // Assuming we don't have a Submissions model yet, we'll mock that stat
    // Or we could count Teams as proxy for Submissions if needed. 
    // Let's use Teams count.
    const teamsCount = await EventTeam.countDocuments();
    
    // Status metrics
    const pendingCount = hackathons.filter(h => h.status === 'Draft' || h.status === 'Pending').length;

    const stats = {
      totalHackathons: hackathons.length,
      totalParticipants: participantsCount,
      totalSubmissions: teamsCount, // mock as team count for now
      totalPending: pendingCount
    };

    // Fetch User Profile
    const userId = req.user?.id || req.user?.userId; // Depends on how jwt payload is structured
    let userProfile = null;
    if (userId) {
      userProfile = await User.findById(userId).select('-password');
    }

    res.json({
      stats,
      hackathons,
      activities,
      user: userProfile
    });
  } catch (err) {
    console.error('[getDashboardData]', err);
    res.status(500).json({ message: 'Error retrieving dashboard data' });
  }
};

module.exports = {
  getHackathonDetails,
  updateSettings,
  getDashboardData
};
