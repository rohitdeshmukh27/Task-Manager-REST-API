// ============================================
// TASK SERVICE UNIT TESTS
// ============================================

import * as TaskService from "../../../src/services/taskService";
import supabase from "../../../src/config/supabase";

// Mock the Supabase client
jest.mock("../../../src/config/supabase", () => ({
  from: jest.fn(),
}));

describe("TaskService", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // getAllTasks Tests
  // ==========================================
  describe("getAllTasks", () => {
    it("should return all tasks successfully", async () => {
      // Arrange: Setup mock data
      const mockTasks = [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          title: "Test Task 1",
          description: "Description 1",
          status: "pending",
          priority: "medium",
          due_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "223e4567-e89b-12d3-a456-426614174001",
          title: "Test Task 2",
          description: "Description 2",
          status: "completed",
          priority: "high",
          due_date: "2024-12-31",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      // Setup mock chain
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
      };

      // Final return value
      mockQuery.order.mockResolvedValue({
        data: mockTasks,
        error: null,
        count: 2,
      });

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      // Act: Call the function
      const result = await TaskService.getAllTasks({});

      // Assert: Check results
      expect(supabase.from).toHaveBeenCalledWith("tasks");
      expect(result.data).toHaveLength(2);
      expect(result.error).toBeNull();
      expect(result.count).toBe(2);
    });

    it("should filter tasks by status", async () => {
      // Arrange
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
      };

      mockQuery.order.mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      // Act
      await TaskService.getAllTasks({ status: "pending" });

      // Assert
      expect(mockQuery.eq).toHaveBeenCalledWith("status", "pending");
    });

    it("should handle database errors", async () => {
      // Arrange
      const mockError = {
        message: "Database connection failed",
        code: "CONNECTION_ERROR",
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
      };

      mockQuery.order.mockResolvedValue({
        data: null,
        error: mockError,
        count: null,
      });

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      // Act
      const result = await TaskService.getAllTasks({});

      // Assert
      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  // ==========================================
  // getTaskById Tests
  // ==========================================
  describe("getTaskById", () => {
    it("should return a single task by ID", async () => {
      // Arrange
      const mockTask = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        priority: "medium",
        due_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockTask,
          error: null,
        }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      // Act
      const result = await TaskService.getTaskById(mockTask.id);

      // Assert
      expect(supabase.from).toHaveBeenCalledWith("tasks");
      expect(mockQuery.eq).toHaveBeenCalledWith("id", mockTask.id);
      expect(result.data).toEqual(mockTask);
      expect(result.error).toBeNull();
    });

    it("should return error for non-existent task", async () => {
      // Arrange
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "No rows found", code: "PGRST116" },
        }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      // Act
      const result = await TaskService.getTaskById("non-existent-id");

      // Assert
      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  // ==========================================
  // createTask Tests
  // ==========================================
  describe("createTask", () => {
    it("should create a new task successfully", async () => {
      // Arrange
      const newTaskData = {
        title: "New Task",
        description: "New Description",
        priority: "high" as const,
      };

      const createdTask = {
        id: "new-task-id",
        ...newTaskData,
        status: "pending",
        due_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: createdTask,
          error: null,
        }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      // Act
      const result = await TaskService.createTask(newTaskData);

      // Assert
      expect(mockQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: newTaskData.title,
          description: newTaskData.description,
          priority: newTaskData.priority,
          status: "pending",
        }),
      );
      expect(result.data).toEqual(createdTask);
      expect(result.error).toBeNull();
    });
  });

  // ==========================================
  // updateTask Tests
  // ==========================================
  describe("updateTask", () => {
    it("should update an existing task", async () => {
      // Arrange
      const taskId = "123e4567-e89b-12d3-a456-426614174000";
      const updates = {
        title: "Updated Title",
        status: "completed" as const,
      };

      const updatedTask = {
        id: taskId,
        title: updates.title,
        description: "Original description",
        status: updates.status,
        priority: "medium",
        due_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: updatedTask,
          error: null,
        }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      // Act
      const result = await TaskService.updateTask(taskId, updates);

      // Assert
      expect(mockQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          title: updates.title,
          status: updates.status,
        }),
      );
      expect(mockQuery.eq).toHaveBeenCalledWith("id", taskId);
      expect(result.data?.status).toBe("completed");
    });
  });

  // ==========================================
  // deleteTask Tests
  // ==========================================
  describe("deleteTask", () => {
    it("should delete an existing task", async () => {
      // Arrange
      const taskId = "123e4567-e89b-12d3-a456-426614174000";
      const existingTask = {
        id: taskId,
        title: "Task to delete",
        description: null,
        status: "pending",
        priority: "low",
        due_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Mock getTaskById first (to get existing task)
      const selectMock = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: existingTask,
          error: null,
        }),
      };

      // Mock delete
      const deleteMock = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      // Setup from() to return different mocks based on call
      let callCount = 0;
      (supabase.from as jest.Mock).mockImplementation(() => {
        callCount++;
        return callCount === 1 ? selectMock : deleteMock;
      });

      // Act
      const result = await TaskService.deleteTask(taskId);

      // Assert
      expect(result.data).toEqual(existingTask);
      expect(result.error).toBeNull();
    });
  });
});