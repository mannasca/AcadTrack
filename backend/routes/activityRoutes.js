import express from "express";
import {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected
router.use(protect);

router.post("/create", createActivity);
router.get("/", getActivities);
router.get("/:id", getActivity);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);

export default router;
