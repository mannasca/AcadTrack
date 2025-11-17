// ===============================
// FORCE ONLY BACKEND .ENV
// ===============================
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Get runtime file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ONLY backend/.env
dotenv.config({
  path: path.join(__dirname, ".env"),
  override: true
});

// Debug log
console.log(">>> USING ENV FILE:", path.join(__dirname, ".env"));
console.log(">>> MONGO_URI:", process.env.MONGO_URI);

// ===============================
// IMPORTS
// ===============================
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

// ===============================
// APP INITIALIZATION
// ===============================
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// CONNECT DATABASE
// ===============================
connectDB();

// ===============================
// ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🔥 Server running on port ${PORT}`);
  console.log("🔥 Connected DB should be:", process.env.MONGO_URI);
});
