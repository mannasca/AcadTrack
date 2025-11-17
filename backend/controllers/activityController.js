import Activity from "../models/Activity.js";

// CREATE ACTIVITY
export const createActivity = async (req, res) => {
  try {
    const activity = await Activity.create({
      user: req.user._id,
      ...req.body,
    });

    res.status(201).json({ message: "Activity created", activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL ACTIVITIES OF LOGGED-IN USER
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ONE ACTIVITY
export const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE ACTIVITY
export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Activity updated", activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE ACTIVITY
export const deleteActivity = async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: "Activity deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
