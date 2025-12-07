import express from "express";
import {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes protected - requires authentication
router.use(protect);

// All authenticated users - GET routes (before parameterized routes)
router.get("/", getActivities);

// Admin-only routes with specific paths (before parameterized :id route)
router.post("/create", authorize("admin"), createActivity);

// Parameterized routes (must come last)
router.get("/:id", getActivity);
router.put("/:id", authorize("admin"), updateActivity);
router.delete("/:id", authorize("admin"), deleteActivity);

export default router;
