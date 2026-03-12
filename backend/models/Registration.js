const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  college: { type: String },
});

const registrationSchema = new mongoose.Schema(
  {
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: true,
    },
    teamName: { type: String, required: true },
    leaderName: { type: String, required: true },
    leaderEmail: { type: String, required: true },
    college: { type: String, required: true },
    teamMembers: [teamMemberSchema],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', registrationSchema);
