// =====================
// TASK CONTROLLER - Request Handlers
// =====================

import { Request, Response, NextFunction } from "express";
import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskQueryParams,
  ApiResponse,
} from "../interfaces/task.interface";
import * as TaskService from "../services/taskService";
import { asyncHandler } from "../middleware/errorHandler";

// ==========================================
// GET ALL TASKS
// ==========================================
// No try-catch needed! asyncHandler handles errors automatically

export const getAllTasks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const queryParams: TaskQueryParams = {
      status: req.query.status as any,
      priority: req.query.priority as any,
      search: req.query.search as string,
      sort_by: req.query.sort_by as
        | "created_at"
        | "updated_at"
        | "due_date"
        | "priority"
        | undefined,
      order: req.query.order as "asc" | "desc",
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const { data, error, count } = await TaskService.getAllTasks(queryParams);

    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Failed to fetch tasks",
        error: error.message,
      };
      res.status(500).json(response);
      return;
    }

    const response: ApiResponse<Task[]> = {
      success: true,
      message: `Found ${data?.length || 0} task(s)`,
      data: data || [],
      count: count || 0,
    };

    res.status(200).json(response);
  }
);

// ==========================================
// GET TASK BY ID
// ==========================================

export const getTaskById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const { data, error } = await TaskService.getTaskById(id as string);

    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Failed to fetch task",
        error: error.message,
      };
      res.status(500).json(response);
      return;
    }

    if (!data) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Task not found",
        error: `No task found with ID: ${id}`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      success: true,
      message: "Task retrieved successfully",
      data,
    };

    res.status(200).json(response);
  }
);

// ==========================================
// CREATE TASK
// ==========================================

export const createTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const taskData: CreateTaskDTO = req.body;

    const { data, error } = await TaskService.createTask(taskData);

    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Failed to create task",
        error: error.message,
      };
      res.status(500).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      success: true,
      message: "Task created successfully",
      data: data!,
    };

    res.status(201).json(response);
  }
);

// ==========================================
// UPDATE TASK
// ==========================================

export const updateTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const updates: UpdateTaskDTO = req.body;

    const { data, error } = await TaskService.updateTask(id as string, updates);

    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Failed to update task",
        error: error.message,
      };
      res.status(500).json(response);
      return;
    }

    if (!data) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Task not found",
        error: `No task found with ID: ${id}`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      success: true,
      message: "Task updated successfully",
      data,
    };

    res.status(200).json(response);
  }
);

// ==========================================
// DELETE TASK
// ==========================================

export const deleteTask = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const { data, error } = await TaskService.deleteTask(id as string);

    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Failed to delete task",
        error: error.message,
      };
      res.status(500).json(response);
      return;
    }

    if (!data) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Task not found",
        error: `No task found with ID: ${id}`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      success: true,
      message: "Task deleted successfully",
      data,
    };

    res.status(200).json(response);
  }
);

// ==========================================
// GET TASK STATS
// ==========================================

export const getTaskStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const stats = await TaskService.getTaskStats();

    if (!stats) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Failed to fetch task statistics",
        error: "Could not retrieve stats",
      };
      res.status(500).json(response);
      return;
    }

    const response: ApiResponse<typeof stats> = {
      success: true,
      message: "Task statistics retrieved successfully",
      data: stats,
    };

    res.status(200).json(response);
  }
);
