// backend/routes/authRoutes.js
import express from "express";
import { register, login, getAllUsers } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// GET ALL USERS (ADMIN ONLY)
router.get("/users/all", protect, adminOnly, getAllUsers);

export default router;
