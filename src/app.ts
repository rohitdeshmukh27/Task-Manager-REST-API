// ============================================
// EXPRESS APPLICATION - Main ENTRY POINT
// ============================================

import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";

// load en var first
dotenv.config();

// create express application
const app: Application = express();

// Port configuration
const PORT: number = parseInt(process.env.PORT || "3000", 10);
const NODE_ENV: string = process.env.NODE_ENV || "development";

// ===========================
// MIDDLEWARE SETUP
// ===========================

app.use(express.json({ limit: "10kb" })); // limit body size for security

// parse URL - encoded middleware
app.use(express.urlencoded({ extended: true }));

// request loggin middleware
app.use((req: Request, res: Response, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// CORS headers
app.use((req: Request, res: Response, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// ==================
// ROUTES
// ==================

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🚀 Task Manager API is running!",
    version: "1.0.0",
    environment: NODE_ENV,
    documentation: "/api",
  });
});

// API documentation
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Task Manager API Documentation",
    version: "1.0.0",
    database: "Supabase (PostgreSQL)",
    endpoints: [
      { method: "GET", path: "/api/tasks", description: "Get all tasks" },
      {
        method: "GET",
        path: "/api/tasks/stats",
        description: "Get task statistics",
      },
      { method: "GET", path: "/api/tasks/:id", description: "Get task by ID" },
      { method: "POST", path: "/api/tasks", description: "Create new task" },
      { method: "PUT", path: "/api/tasks/:id", description: "Update task" },
      { method: "DELETE", path: "/api/tasks/:id", description: "Delete task" },
    ],
    authEndpoints: [
      {
        method: "POST",
        path: "/api/auth/signup",
        description: "Register new user",
      },
      { method: "POST", path: "/api/auth/login", description: "Login user" },
      {
        method: "POST",
        path: "/api/auth/logout",
        description: "Logout user(auth required)",
      },
      {
        method: "POST",
        path: "/api/auth/forgot-password",
        description: "Request password reset",
      },
      {
        method: "POST",
        path: "/api/auth/reset-password",
        description: "Set new password",
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
    queryParams: {
      status: "Filter by status (pending, in-process, completed)",
      priority: "Filter by priority (low, medium, high)",
      search: "Search in title and description",
      sort_by: "Sort by field (created_at, updated_at, due_date, priority)",
      order: "Sort order (asc, desc)",
      limit: "Number of results (1-100)",
      offset: "Offset for pagination",
    },
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
  console.log("╚════════════════════════════════════════════╝");
  console.log("");
});

export default app;
