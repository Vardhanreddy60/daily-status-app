require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logRoutes = require("./routes/logs");
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://daily-status-frontend.onrender.com"
];

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/daily-status";

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

// ✅ Log every incoming request
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url} — ${new Date().toLocaleTimeString()}`);
  next();
});

app.use("/api/logs", logRoutes);

app.get("/api/health", (req, res) => res.json({
  status: "ok",
  db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  dbName: mongoose.connection.name,
  host: mongoose.connection.host,
}));

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected to:", mongoose.connection.host);
    console.log("📦 Database name:", mongoose.connection.name);
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => { console.error("❌ MongoDB error:", err.message); process.exit(1); });
