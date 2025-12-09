import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    title: { 
      type: String, 
      required: true,
      trim: true
    },
    description: { 
      type: String,
      trim: true,
      default: ""
    },
    course: { 
      type: String, 
      required: true,
      trim: true
    },
    date: { 
      type: Date,
      required: true
    },
    status: { 
      type: String, 
      default: "Pending",
      enum: ["Pending", "In Progress", "Completed"]
    },
    grades: { 
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
