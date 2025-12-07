import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =============================================================
// REGISTER USER
// =============================================================
export const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password, adminCode } = req.body;

    // Validation
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if email exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check admin code
    const adminSecret = process.env.ADMIN_SECRET_CODE || "ADMIN2025";
    const isAdmin = adminCode && adminCode.trim() === adminSecret;

    // Create new user
    const newUser = new User({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: isAdmin ? "admin" : "user",
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: `User registered successfully. ${
        isAdmin ? "Admin account created!" : "Please log in."
      }`,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Registration failed",
    });
  }
};

// =============================================================
// LOGIN USER
// =============================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "7d" }
    );

    // Backend must return { success: true, data: { token, user } }
    return res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Login failed",
    });
  }
};

// =============================================================
// GET ALL USERS (ADMIN ONLY)
// =============================================================
export const getAllUsers = async (req, res) => {
  try {
    // req.user is set by auth middleware
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can view all users" });
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Users retrieved successfully",
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch users",
    });
  }
};

// =============================================================
// GET CURRENT USER PROFILE
// =============================================================
export const getProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch profile",
    });
  }
};

