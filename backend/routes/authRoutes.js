import express from "express";
import { register, login, getAllUsers } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Admin-only route to get all users
router.get("/users/all", protect, authorize("admin"), getAllUsers);

export default router;

