// =============================
// TASK ROUTES - API Endpoints
// =============================

import { Router } from "express";
import * as TaskController from "../controllers/taskController";
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
  validateQueryParams,
} from "../middleware/validateTask";
import { authenticate } from "../middleware/authMiddleware";
import { createTaskLimiter } from "../config/rateLimiter";

// Create router instance
const router = Router();

// ====================================
// PUBLIC ROUTES (Read operations)
// ====================================

// GET /api/tasks/stats
// Get task statistics
router.get("/stats", TaskController.getTaskStats);

// GET /api/tasks
// Get all tasks (with optional filtering)
router.get("/", validateQueryParams, TaskController.getAllTasks);

// GET /api/tasks/:id
// Get task by ID
router.get("/:id", validateTaskId, TaskController.getTaskById);

// ====================================
// PROTECTED ROUTES (Write operations)
// ====================================

// POST /api/tasks
// Create new task (Protected + Rate Limited)
router.post(
  "/",
  authenticate,
  createTaskLimiter,
  validateCreateTask,
  TaskController.createTask,
);

// PUT /api/tasks/:id
// Update existing task (Protected)
router.put(
  "/:id",
  authenticate,
  validateTaskId,
  validateUpdateTask,
  TaskController.updateTask,
);

// DELETE /api/tasks/:id
// Delete task (Protected)
router.delete("/:id", authenticate, validateTaskId, TaskController.deleteTask);

export default router;