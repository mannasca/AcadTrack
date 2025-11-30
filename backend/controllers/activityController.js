import Activity from "../models/Activity.js";

// CREATE ACTIVITY - ADMIN ONLY
export const createActivity = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create activities" });
    }

    const { title, description, course, date, status, userId } = req.body;

    // Validation
    if (!title || !course || !date) {
      return res.status(400).json({ message: "Title, course, and date are required" });
    }

    // Use provided userId or default to current user (for admin creating for themselves)
    const activityUserId = userId || req.user._id;

    const activity = await Activity.create({
      user: activityUserId,
      title: title.trim(),
      description: description?.trim() || "",
      course: course.trim(),
      date: new Date(date),
      status: status || "Pending",
    });

    res.status(201).json({ 
      message: "Activity created successfully", 
      activity 
    });
  } catch (error) {
    console.error("Create activity error:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET ALL ACTIVITIES - USERS SEE ALL ACTIVITIES CREATED BY ADMINS, ADMINS SEE ALL
export const getActivities = async (req, res) => {
  try {
    let activities;

    if (req.user.role === "admin") {
      // Admin can see all activities
      activities = await Activity.find()
        .populate("user", "firstname lastname email")
        .sort({ date: -1 });
    } else {
      // Regular users can see all activities (tracked by admins for them)
      activities = await Activity.find()
        .populate("user", "firstname lastname email")
        .sort({ date: -1 });
    }
    
    res.json(activities);
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET ONE ACTIVITY - ALL USERS CAN VIEW ALL ACTIVITIES
export const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate("user", "firstname lastname email");
    
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // All authenticated users can view all activities
    res.json(activity);
  } catch (error) {
    console.error("Get activity error:", error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE ACTIVITY - ADMIN ONLY
export const updateActivity = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update activities" });
    }

    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Update fields
    if (req.body.title) activity.title = req.body.title.trim();
    if (req.body.description) activity.description = req.body.description.trim();
    if (req.body.course) activity.course = req.body.course.trim();
    if (req.body.date) activity.date = new Date(req.body.date);
    if (req.body.status) activity.status = req.body.status;

    await activity.save();

    res.json({ 
      message: "Activity updated successfully", 
      activity 
    });
  } catch (error) {
    console.error("Update activity error:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE ACTIVITY - ADMIN ONLY
export const deleteActivity = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete activities" });
    }

    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Delete activity error:", error);
    res.status(500).json({ error: error.message });
  }
};
