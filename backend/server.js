require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

const path = require("path");

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/verification"));
app.use("/api/organizer/events", require("./routes/eventRoutes"));
app.use("/api/organizer/hackathons", require("./routes/hackathonRoutes"));

// Serve uploaded proof documents (protected per route in verification.js)
app.use("/uploads", require("express").static(path.join(__dirname, "uploads")));

// Health check
app.get("/", (req, res) => res.json({ status: "HackFlow API running 🚀" }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
