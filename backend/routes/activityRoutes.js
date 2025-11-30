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

// Admin-only routes
router.post("/create", authorize("admin"), createActivity);
router.put("/:id", authorize("admin"), updateActivity);
router.delete("/:id", authorize("admin"), deleteActivity);

// All authenticated users
router.get("/", getActivities);
router.get("/:id", getActivity);

export default router;
