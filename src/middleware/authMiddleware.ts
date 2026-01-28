// ===============================================
// AUTH MIDDLEWARE - Protect routes with JWT
// ===============================================

import { Request, Response, NextFunction, response } from "express";
import * as AuthService from "../services/authService";
import { User, AuthResponse } from "../interfaces/auth.interface";
import { resourceLimits } from "node:worker_threads";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      accessToken?: string;
    }
  }
}

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header
 * Attaches user to request if valid
 */

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Access denied",
        error: "No authorization header provided",
      };
      res.status(401).json(response);
      return;
    }

    // Check Bearer format
    if (!authHeader.startsWith("Bearer")) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Access denied",
        error: "Invalid authorization format. Use Bearer <token>",
      };
      res.status(401).json(response);
      return;
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Access denied",
        error: "No Token provided",
      };
      res.status(401).json(response);
      return;
    }

    // Verify token with supabase
    const { data, error } = await AuthService.getUserFromToken(token);

    if (error || !data.user) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Access denied",
        error: "Invalid or expired token",
      };
      res.status(401).json(response);
      return;
    }

    //Attach user and token to request
    req.user = data.user;
    req.accessToken = token;

    //Continue to next middle ware/route
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication
 * Attaches user if token valid, but doesn't block if missing
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const { data } = await AuthService.getUserFromToken(token);
        if (data.user) {
          req.user = data.user;
          req.accessToken = token;
        }
      }
    }
    next();
  } catch (error) {
    // Continue even if token verification fails
    next();
  }
};
/**
 * Check if user's email is verified
 * Use after authenticate middleware
 */

export const requireVerifiedEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    const response: AuthResponse<null> = {
      success: false,
      message: "Access denied",
      error: "Authentication required",
    };
    res.status(401).json(response);
    return;
  }

  if (!req.user.email_confirmed_at) {
    const response: AuthResponse<null> = {
      success: false,
      message: "Email not verified",
      error: "Please verify your email before accessing this resource",
    };
    res.status(403).json(response);
    return;
  }
  next();
};
