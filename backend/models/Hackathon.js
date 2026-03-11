const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  hackathonId: { type: String, required: true, unique: true }, // e.g., HF-001
  title: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Completed', 'Upcoming'], default: 'Active' },
  deadline: { type: String, required: true },
  prize: { type: String, required: true },
  regLink: { type: String, required: true },
  
  // Phase management
  phases: [{
    label: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['done', 'active', 'upcoming'], default: 'upcoming' }
  }],

  // Tracks / Themes
  tracks: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    teams: { type: Number, default: 0 }
  }],

  // Settings
  settings: {
    regOpen: { type: Boolean, default: true },
    subsOpen: { type: Boolean, default: true }
  }

}, { timestamps: true });

module.exports = mongoose.model('Hackathon', hackathonSchema);
