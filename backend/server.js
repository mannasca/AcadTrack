import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

// Enable aggressive compression middleware - reduces response sizes
app.use(compression({
  level: 9, // Maximum compression level
  threshold: 512, // Compress everything > 512 bytes
  filter: (req, res) => {
    // Compress all response types
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  // Support multiple compression types for better client compatibility
  type: [
    'application/json',
    'application/javascript',
    'text/html',
    'text/css',
    'text/plain',
    'text/xml',
    'application/xml',
    'application/xml+rss',
    'text/javascript'
  ]
}));

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://acadtrack.netlify.app",
        "https://acadtrack.vercel.app",
        "https://acadtrack.onrender.com"
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// IMPORTANT — Must come BEFORE routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Optimize response headers for performance and caching
app.use((req, res, next) => {
  // Cache control headers - aggressive caching for static assets
  if (req.url.includes('/assets/') || req.url.endsWith('.js') || req.url.endsWith('.css')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year for hashed assets
  } else if (req.url.includes('/api/')) {
    res.setHeader('Cache-Control', 'public, max-age=60'); // 1 minute cache for APIs
  } else {
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes default
  }
  
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
});

// Routes
import authRoutes from "./routes/authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);

// Health check endpoint (for Render wake-up / monitoring)
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend is healthy", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => res.send("Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
