// ===================================
// VALIDATION MIDDLEWARE UNIT TESTS
// ===================================

import { Request, Response, NextFunction } from "express";
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
  validateQueryParams,
} from "../../../src/middleware/validateTask";

// Mock express requst/response
const mockRequest = (data: Partial<Request> = {}): Partial<Request> => ({
  body: {},
  params: {},
  query: {},
  ...data,
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

describe("Task Validation Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================
  // validateCreateTask Tests
  // ============================

  describe("ValidateCreateTask", () => {
    it("should pass with valid task date", () => {
      // Arrange
      const req = mockRequest({
        body: {
          title: "Valid Task",
          description: "Description",
          priority: "medium",
        },
      });
      const res = mockResponse();

      // Act
      validateCreateTask(req as Request, res as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail when title is missing", () => {
      // Arrange
      const req = mockRequest({
        body: { description: "No title" },
      });
      const res = mockResponse();

      // Act
      validateCreateTask(req as Request, res as Response, mockNext);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false }),
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when title is empty string", () => {
      // Arrange
      const req = mockRequest({
        body: { title: "" },
      });
      const res = mockResponse();

      // Act
      validateCreateTask(req as Request, res as Response, mockNext);

      // Assert
      validateCreateTask(req as Request, res as Response, mockNext);
    });

    it("should fail when title is too long", () => {
      // Arrange
      const req = mockRequest({
        body: { title: "a".repeat(256) }, // 256 characters
      });
      const res = mockResponse();

      // Act
      validateCreateTask(req as Request, res as Response, mockNext);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should fail with invalid priority", () => {
      // Arrange
      const req = mockRequest({
        body: { title: "Task", priority: "invalid" },
      });
      const res = mockResponse();

      // Act
      validateCreateTask(req as Request, res as Response, mockNext);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should accept all valid priority values", () => {
      const priorities = ["low", "medium", "high"];

      priorities.forEach((priority) => {
        // Arrange
        const req = mockRequest({
          body: { title: "Task", priority },
        });
        const res = mockResponse();
        const next = jest.fn();

        // Act
        validateCreateTask(req as Request, res as Response, next);

        // Assert
        expect(next).toHaveBeenCalled();
      });
    });
  });

  // ==========================================
  // validateTaskId Tests
  // ==========================================
  describe("validateTaskId", () => {
    it("should pass with valid UUID", () => {
      // Arrange
      const req = mockRequest({
        params: { id: "123e4567-e89b-12d3-a456-426614174000" },
      });
      const res = mockResponse();

      // Act
      validateTaskId(req as Request, res as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
    });

    it("should fail with invalid UUID", () => {
      // Arrange
      const req = mockRequest({
        params: { id: "invalid-uuid" },
      });
      const res = mockResponse();

      // Act
      validateTaskId(req as Request, res as Response, mockNext);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should fail with empty ID", () => {
      // Arrange
      const req = mockRequest({
        params: { id: "" },
      });
      const res = mockResponse();

      // Act
      validateTaskId(req as Request, res as Response, mockNext);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ==========================================
  // validateQueryParams Tests
  // ==========================================
  describe("validateQueryParams", () => {
    it("should pass with no query params", () => {
      // Arrange
      const req = mockRequest({ query: {} });
      const res = mockResponse();

      // Act
      validateQueryParams(req as Request, res as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
    });

    it("should pass with valid query params", () => {
      // Arrange
      const req = mockRequest({
        query: {
          status: "pending",
          priority: "high",
          limit: "10",
          offset: "0",
        },
      });
      const res = mockResponse();

      // Act
      validateQueryParams(req as Request, res as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
    });

    it("should fail with invalid status", () => {
      // Arrange
      const req = mockRequest({
        query: { status: "invalid" },
      });
      const res = mockResponse();

      // Act
      validateQueryParams(req as Request, res as Response, mockNext);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should fail with negative limit", () => {
      // Arrange
      const req = mockRequest({
        query: { limit: "-5" },
      });
      const res = mockResponse();

      // Act
      validateQueryParams(req as Request, res as Response, mockNext);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
