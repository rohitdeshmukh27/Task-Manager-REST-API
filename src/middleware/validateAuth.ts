import { response } from "express";
// ============================
// AUTH VALIDATION MIDDLEWARE
// ============================

import { Request, Response, NextFunction } from "express";
import { AuthResponse } from "../interfaces/auth.interface.js";

/**
 * Validate signu request body
 */
export const validateSignup = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password, name } = req.body;
  const errors: string[] = [];

  // Email Validation
  if (!email) {
    errors.push("Email is required");
  } else if (typeof email !== "string") {
    errors.push("Email must be a string");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format");
    }
  }

  // Password Validation
  if (!password) {
    errors.push("Password is required");
  } else if (typeof password !== "string") {
    errors.push("Password must be string");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  } else if (password.length > 72) {
    errors.push("Password must not excced 72 characters");
  }

  // Name validation (optional)
  if (name !== undefined && typeof name !== "string") {
    errors.push("Name must be a string");
  }

  if (errors.length > 0) {
    const response: AuthResponse<null> = {
      success: false,
      message: "Validation failed",
      error: errors.join(", "),
    };
    res.status(400).json(response);
    return;
  }
  next();
};

/**
 * Validate login request body
 */
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password } = req.body;
  const errors: string[] = [];

  if (!email) {
    errors.push("Email is required");
  } else if (typeof email !== "string") {
    errors.push("Email must be a string");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (typeof password !== "string") {
    errors.push("Password must be a string");
  }

  if (errors.length > 0) {
    const response: AuthResponse<null> = {
      success: false,
      message: " Validation failed",
      error: errors.join(", "),
    };
    res.status(400).json(response);
    return;
  }
  next();
};

/**
 * Validate forgot password request
 */
export const validateForgotPassword = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email } = req.body;

  if (!email) {
    const response: AuthResponse<null> = {
      success: false,
      message: "Validation failed",
      error: "Email is required",
    };
    res.status(400).json(response);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const response: AuthResponse<null> = {
      success: false,
      message: "Validation failed",
      error: "Invalid email format",
    };
    res.status(400).json(response);
    return;
  }

  next();
};

/**
 * Validate reset password request
 */
export const validateResetPassword = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { password } = req.body;
  const errors: string[] = [];

  if (!password) {
    errors.push("Password is required");
  } else if (typeof password !== "string") {
    errors.push("Password must be a string");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  } else if (password.length > 72) {
    errors.push("Password must not exceed 72 characters");
  }

  if (errors.length > 0) {
    const response: AuthResponse<null> = {
      success: false,
      message: "Validation failed",
      error: errors.join(", "),
    };
    res.status(400).json(response);
    return;
  }

  next();
};
