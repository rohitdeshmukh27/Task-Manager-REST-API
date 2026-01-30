// ==============================
// ERROR HANDLER MIDDLEWARE
// ==============================

import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../interfaces/task.interface";

// Custom error class with status code
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async handler wrapper
// eliminates try catch boilerplate in controllers

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global errror handling middleware

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  //log error for debugging
  console.log("Error: ", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  //determine status code
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  const response: ApiResponse<null> = {
    success: false,
    message: statusCode === 500 ? "internal server error" : "an error occurred",
    error:
      process.env.NODE_ENV === "development" ? message : "something went wrong",
  };
  res.status(statusCode).json(response);
};

// 404 Not Found handler

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const response: ApiResponse<null> = {
    success: false,
    message: "Route not found",
    error: `Cannot ${req.method} ${req.originalUrl}`,
  };
  res.status(404).json(response);
};
