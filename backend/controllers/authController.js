const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");

/* ─── Signup ─── */
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!["student", "organizer"].includes(role)) {
      return res.status(400).json({ message: "Role must be student or organizer" });
    }

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({ name, email, password, role });

    // Issue token immediately (no OTP step for now)
    const token = signToken({ id: user._id, role: user.role });

    return res.status(201).json({
      message: "Account created successfully",
      token,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

/* ─── Login ─── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken({ id: user._id, role: user.role });

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

/* ─── Admin Login (env-based, no DB) ─── */
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email.toLowerCase() !== adminEmail?.toLowerCase()) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, await bcrypt.hash(adminPassword, 12));
    // Simple string compare (admin password stored in plain in .env)
    if (password !== adminPassword) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = signToken({ id: "admin", role: "admin" });

    return res.status(200).json({
      message: "Admin login successful",
      token,
      role: "admin",
      name: "Admin",
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ message: "Server error during admin login" });
  }
};

/* ─── Get current user (protected) ─── */
exports.getMe = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(200).json({ id: "admin", name: "Admin", role: "admin" });
    }
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
