// =====================
// TASK CONTROLLER - Request Handlers
// =====================

import { Request, Response, NextFunction, response } from "express";
import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskQueryParams,
  ApiResponse,
} from "../interfaces/task.interface";
import * as TaskService from "../services/taskService";
import { REPL_MODE_STRICT } from "node:repl";
/* 
=====================
    GET ALL TASKS
=====================

GET /api/tasks
Query params: ?status=completed&priority=high&search=keyword&sort_by=created_at&order=desc&limit=10&offset=0
*/

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //extract query parameters
    const queryParams: TaskQueryParams = {
      status: req.query.status as any,
      priority: req.query.priority as any,
      search: req.query.search as any,
      sort_by: req.query.sort_by as any,
      order: req.query.order as any,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined,
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
  } catch (error) {
    next(error);
  }
};

// ====================
// GET TASK by ID
// ====================

// GET /api/tasks/:id
export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const { data, error } = await TaskService.getTaskById(id);

    if (error || !data) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Task not found",
        error: `No task found with id: ${id}`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      success: true,
      message: "task retrieved successfully",
      data,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==========================
// CREATE NEW TASK
// ==========================

// POST /api/tasks
// Body : {title,description?,priority?,due_date?}

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const taskData: CreateTaskDTO = req.body;

    const { data, error } = await TaskService.createTask(taskData);

    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Failed to create task",
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      success: true,
      message: "task created successfully",
      data: data!,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// ===============================
// update task
// ===============================

// put api/tasks/:id
// Body: {title?,description?,status?,priority?,due_date?}

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const updates: UpdateTaskDTO = req.body;

    //check if task exists first
    const { data: exisitingTask } = await TaskService.getTaskById(id);

    if (!exisitingTask) {
      const response: ApiResponse<null> = {
        success: false,
        message: "task not found",
        error: `no task found with id ${id}`,
      };
      res.status(404).json(response);
      return;
    }

    const { data, error } = await TaskService.updateTask(id, updates);
    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: "failed to update task",
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      success: true,
      message: "Task updated successfully",
      data: data!,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ====================================
// DELETE TASK
// ====================================
// DELETE /api/tasks/:id

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const { data, error } = await TaskService.deleteTask(id);

    if (error || !data) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Task not found",
        error: `No task found with ID : ${id}`,
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
  } catch (error) {
    next(error);
  }
};

// =======================
// GET TASK STATISTICS
// =======================

// GET /api/tasks/stats

export const getTaskStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await TaskService.getTaskStats();

    if (!stats) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Failed to get statistics",
        error: "Could not retrieve task statistics",
      };
      res.status(500).json(response);
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task statistics retrieved",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
