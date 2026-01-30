// =============================
// TASK ROUTES - API end points defination
// =============================

import { Router } from "express";
import * as TaskController from "../controllers/taskController";
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
  validateQueryParams,
} from "../middleware/validateTask";
import {
  authenticate,
  requireVerifiedEmail,
} from "../middleware/authMiddleware";

// create router instance
const router = Router();

// ====================================
// Route definations
// ====================================

// GET /api/tasks/stats
// Get task statistics
// Note: this must come before /:id route
router.get("/stats", TaskController.getTaskStats);

// GET /api/tasks
// Get all tasks (with optional filtering)
router.get("/", validateQueryParams, TaskController.getAllTasks);

// GET /api/tasks/:id
// Get task by ID
router.get("/:id", validateTaskId, TaskController.getTaskById);

// POST /api/tasks
// Create new task (Protected)
router.post("/", authenticate, validateCreateTask, TaskController.createTask);

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

// Export router
export default router;
