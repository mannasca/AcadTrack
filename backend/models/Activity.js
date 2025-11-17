import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    course: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
