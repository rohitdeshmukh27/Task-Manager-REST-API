// ============================================
// EXPRESS APPLICATION - Main ENTRY POINT
// ============================================

import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";

// Route imports
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Middleware imports
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { applySecurityMiddleware } from "./middleware/security.js";
import { generalLimiter } from "./config/rateLimiter.js";
import { setupSwagger } from "./config/swagger.js";

// Load environment variables FIRST
dotenv.config();

// Create Express application
const app: Application = express();

// Port configuration
const PORT: number = parseInt(process.env.PORT || "3000", 10);
const NODE_ENV: string = process.env.NODE_ENV || "development";

// ============================================
// SECURITY MIDDLEWARE (Apply FIRST)
// ============================================

// Apply Helmet, Compression, and Morgan
applySecurityMiddleware(app);

// Apply general rate limiter to all requests
app.use(generalLimiter);

// ===========================
// BODY PARSING MIDDLEWARE
// ===========================

app.use(express.json({ limit: "10kb" })); // Limit body size for security
app.use(express.urlencoded({ extended: true }));

// ===========================
// CORS HEADERS
// ===========================

app.use((req: Request, res: Response, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// ===========================
// SWAGGER API DOCUMENTATION
// ===========================

setupSwagger(app);

// ==================
// ROUTES
// ==================

// Health Check (no rate limit applied via skip)
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🚀 Task Manager API is running!",
    version: "1.0.0",
    environment: NODE_ENV,
    documentation: "/api/docs",
  });
});

// API documentation
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Task Manager API Documentation",
    version: "1.0.0",
    database: "Supabase (PostgreSQL)",
    security: {
      helmet: "Enabled (15+ security headers)",
      rateLimit: "100 requests per 15 minutes",
      compression: "Enabled (gzip)",
    },
    endpoints: [
      { method: "GET", path: "/api/tasks", description: "Get all tasks" },
      {
        method: "GET",
        path: "/api/tasks/stats",
        description: "Get task statistics",
      },
      { method: "GET", path: "/api/tasks/:id", description: "Get task by ID" },
      {
        method: "POST",
        path: "/api/tasks",
        description: "Create new task (Auth required)",
      },
      {
        method: "PUT",
        path: "/api/tasks/:id",
        description: "Update task (Auth required)",
      },
      {
        method: "DELETE",
        path: "/api/tasks/:id",
        description: "Delete task (Auth required)",
      },
    ],
    authEndpoints: [
      {
        method: "POST",
        path: "/api/auth/signup",
        description: "Register new user",
        rateLimit: "3/hour",
      },
      {
        method: "POST",
        path: "/api/auth/login",
        description: "Login user",
        rateLimit: "5/15min",
      },
      {
        method: "POST",
        path: "/api/auth/logout",
        description: "Logout user (Auth required)",
      },
      {
        method: "POST",
        path: "/api/auth/forgot-password",
        description: "Request password reset",
        rateLimit: "3/hour",
      },
      {
        method: "POST",
        path: "/api/auth/reset-password",
        description: "Set new password (Auth required)",
      },
      {
        method: "GET",
        path: "/api/auth/me",
        description: "Get current user (Auth required)",
      },
      {
        method: "POST",
        path: "/api/auth/refresh",
        description: "Refresh access token",
      },
      {
        method: "POST",
        path: "/api/auth/resend-verification",
        description: "Resend verification email",
      },
    ],
  });
});

// Mount auth routes
app.use("/api/auth", authRoutes);

// Mount task routes
app.use("/api/tasks", taskRoutes);

// ============================================
// ERROR HANDLING
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log("");
  console.log("╔════════════════════════════════════════════╗");
  console.log("║  🚀 Task Manager API Server Started!       ║");
  console.log("╠════════════════════════════════════════════╣");
  console.log(`║  📍 URL: http://localhost:${PORT}             ║`);
  console.log(`║  📚 Docs: http://localhost:${PORT}/api          ║`);
  console.log(`║  🌍 Environment: ${NODE_ENV.padEnd(20)}  ║`);
  console.log("║  💾 Database: Supabase PostgreSQL          ║");
  console.log("║  🛡️  Security: Helmet + Rate Limiting       ║");
  console.log("╚════════════════════════════════════════════╝");
  console.log("");
});

export default app;
