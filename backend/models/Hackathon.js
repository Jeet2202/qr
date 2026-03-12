const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    organizerName: {
      type: String,
      default: "",
    },
    venue: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
    time: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hackathon", hackathonSchema);
