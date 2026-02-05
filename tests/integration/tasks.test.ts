import { ReportBaseOptions } from "./../../node_modules/@types/istanbul-lib-report/index.d";
import { Priority } from "./../../src/interfaces/task.interface";
// ===============================
// TASK API INTEGRATION TESTS
// ===============================

import request from "supertest";
import express from "express";
import taskRoutes from "../../src/routes/taskRoutes";
import { authenticate, requireVerifiedEmail } from "../../src/middleware/authMiddleware";

// Create test app
const app = express();
app.use(express.json());
app.use("/api/tasks", taskRoutes);

// Mock the auth middleware for testing
jest.mock("../../src/middleware/authMiddleware.ts", () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { id: "test-user-id", emaiil: "test@example.com" };
    next();
  },
  requireVerifiedEmail: (req: any, res: any, next: any) => next(),
}));

// Mock the task service
jest.mock("../../src/services/taskService.ts");
import * as TaskService from "../../src/services/taskService";
import { error } from "node:console";
import { hasUncaughtExceptionCaptureCallback } from "node:process";

describe("Task API Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =======================
  // GET /api/tasks Tests
  // =======================
  describe("GET /api/tasks", () => {
    it("should return all tasks with 200 status", async () => {
      // Arrange
      const mockTasks = [
        { id: "1", title: "Task 1", status: "pending", priority: "low" },
        { id: "2", title: "Task 2", status: "completed", priority: "high" },
      ];

      (TaskService.getAllTasks as jest.Mock).mockResolvedValue({
        data: mockTasks,
        error: null,
        count: 2,
      });

      // Act
      const response = await request(app)
        .get("/api/tasks")
        .expect("Content-Type", /json/)
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });

    it("should filter tasks by status query param", async () => {
      // Arrange
      (TaskService.getAllTasks as jest.Mock).mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      // Act
      await request(app).get("/api/tasks?status=pending").expect(200);

      // Assert
      expect(TaskService.getAllTasks).toHaveBeenCalledWith(
        expect.objectContaining({ status: "pending" })
      );
    });

    it("should return 400 for invalid status", async () => {
      // Act
      const response = await request(app).get("/api/tasks?status=invalid").expect(400);

      // Assert
      expect(response.body.success).toBe(false);
    });

    it("should handle service errors", async () => {
      // Arrange
      (TaskService.getAllTasks as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "Database error" },
        count: null,
      });

      // Act
      const response = await request(app).get("/api/tasks").expect(500);

      // Assert
      expect(response.body.success).toBe(false);
    });
  });

  // ==========================
  // GET /api/tasks/:id Tests
  // ==========================
  describe("GET /api/tasks/:id", () => {
    it("should return a tasks by valid UUID", async () => {
      // Arrange
      const mockTask = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Test Task",
        status: "pending",
        priority: "medium",
      };

      (TaskService.getTaskById as jest.Mock).mockResolvedValue({
        data: mockTask,
        error: null,
      });

      // Act
      const response = await request(app).get(`/api/tasks/${mockTask.id}`).expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(mockTask.id);
    });

    it("should return 400 for invalid UUID format", async () => {
      // Act
      const response = await request(app).get("/api/tasks/invalid-uuid").expect(400);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Validation failed");
    });

    it("should return 404 for non-existent task", async () => {
      // Arrange
      (TaskService.getTaskById as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });

      // Act
      const response = await request(app)
        .get("/api/tasks/123e4567-e89b-12d3-a456-426614174000")
        .expect(404);

      // Assert
      expect(response.body.success).toBe(false);
    });
  });

  // ============================
  // POST /api/tasks Tests
  // ============================
  describe("POST /api/tasks", () => {
    it("should create a new task with valid data", async () => {
      // Arrange
      const newTask = {
        title: "New Task",
        description: "Task description",
        priority: "high",
      };

      const createdTask = {
        id: "new-task-id",
        ...newTask,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (TaskService.createTask as jest.Mock).mockResolvedValue({
        data: createdTask,
        error: null,
      });

      // Act
      const response = await request(app)
        .post("/api/tasks")
        .send(newTask)
        .expect("Content-Type", /json/)
        .expect(201);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(newTask.title);
    });

    it("should return 400 when title is missing", async () => {
      // Act
      const response = await request(app)
        .post("/api/tasks")
        .send({ description: "No title" })
        .expect(400);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Validation failed");
    });

    it("should return 400 for invalid priority", async () => {
      // Act
      const response = await request(app)
        .post("/api/tasks")
        .send({ title: "Task", priority: "invalid" })
        .expect(400);

      // Assert
      expect(response.body.success).toBe(false);
    });
  });

  // ========================
  // PUT /api/tasks/:id
  // ========================
  describe("PUT /api/tasks:id", () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000";

    it("should update a task successfully", async () => {
      // Arrange
      const updates = { title: "Updated Title", status: "completed" };
      const updatedTask = {
        id: validUUID,
        ...updates,
        priority: "medium",
        description: "Test description",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (TaskService.updateTask as jest.Mock).mockResolvedValue({
        data: updatedTask,
        error: null,
      });

      // Act
      const response = await request(app).put(`/api/tasks/${validUUID}`).send(updates).expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updates.title);
    });

    it("should return 400 for invalid status value", async () => {
      // Act
      const response = await request(app)
        .put(`/api/tasks/${validUUID}`)
        .send({ status: "invalid-status" })
        .expect(400);

      // Assert
      expect(response.body.success).toBe(false);
    });

    it("should return 400 for empty update body", async () => {
      // Act
      const response = await request(app).put(`/api/tasks/${validUUID}`).send({}).expect(400);

      // Assert
      expect(response.body.success).toBe(false);
    });
  });

  // ===============================
  // DELETE /api/tasks/:id Tests
  // ===============================
  describe("DELETE /api/tasks/:id", () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000";

    it("should delete a task successfully", async () => {
      // Arrange
      const deleteTask = {
        id: validUUID,
        title: "Delete Task",
      };

      (TaskService.deleteTask as jest.Mock).mockResolvedValue({
        data: deleteTask,
        error: null,
      });

      // Act
      const response = await request(app).delete(`/api/tasks/${validUUID}`).expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("deleted");
    });

    it("should return 404 for non-existent task", async () => {
      // Arrange
      (TaskService.deleteTask as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });

      // Act
      const response = await request(app).delete(`/api/tasks/${validUUID}`).expect(404);

      // Assert
      expect(response.body.success).toBe(false);
    });
  });
});
