const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  hackathonId: { type: String, required: true },
  participantId: { type: String, required: true }, // e.g. P001
  name: { type: String, required: true },
  email: { type: String, required: true },
  college: { type: String, required: true },
  team: { type: String, required: true },
  status: { type: String, enum: ['Verified', 'Pending'], default: 'Pending' },
  joined: { type: String, required: true } // e.g. "Mar 5"
}, { timestamps: true });

module.exports = mongoose.model('Participant', participantSchema);
