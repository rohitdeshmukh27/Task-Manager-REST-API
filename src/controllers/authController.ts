// ============================================
// AUTH CONTROLLER - Request Handlers
// ============================================

import { Request, Response, NextFunction } from "express";
import * as AuthService from "../services/authService";
import {
  SignupDTO,
  LoginDTO,
  AuthResponse,
  User,
  Session,
} from "../interfaces/auth.interface";

// ==================
// SIGNUP
// ==================
// POST /api/auth/signup
// Body: { email, password, name? }

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const signupData: SignupDTO = req.body;

    const { data, error } = await AuthService.signup(signupData);

    if (error) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Signup failed",
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    // Check if email confirmation is required
    // If session is null, email confirmation is enabled
    const requiresConfirmation = data.session === null;

    const response: AuthResponse<{
      user: User | null;
      session: Session | null;
    }> = {
      success: true,
      message: requiresConfirmation
        ? "Signup successful! Please check your email to verify your account."
        : "Signup successful!",
      data: {
        user: data.user,
        session: data.session,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================
// LOGIN
// ==================
// POST /api/auth/login
// Body: { email, password }

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const loginData: LoginDTO = req.body;

    const { data, error } = await AuthService.login(loginData);

    if (error) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Login failed",
        error: error.message,
      };
      res.status(401).json(response);
      return;
    }

    const response: AuthResponse<{
      user: User | null;
      session: Session | null;
    }> = {
      success: true,
      message: "Login successful!",
      data: {
        user: data.user,
        session: data.session,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================
// LOGOUT
// ==================
// POST /api/auth/logout

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { error } = await AuthService.logout();

    if (error) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Logout failed",
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: AuthResponse<null> = {
      success: true,
      message: "Logged out successfully",
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================
// FORGOT PASSWORD
// ==================
// POST /api/auth/forgot-password
// Body: { email }

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;

    const { error } = await AuthService.forgotPassword(email);

    if (error) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Failed to send reset email",
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    // Always return success to prevent email enumeration
    const response: AuthResponse<null> = {
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================
// RESET PASSWORD
// ==================
// POST /api/auth/reset-password
// Body: { password }
// Note: User must have valid session from reset link

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { password } = req.body;

    const { data, error } = await AuthService.resetPassword(password);

    if (error) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Password reset failed",
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: AuthResponse<{ user: User | null }> = {
      success: true,
      message:
        "Password reset successful! You can now login with your new password.",
      data: { user: data.user },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================
// GET CURRENT USER
// ==================
// GET /api/auth/me
// Requires: Authentication

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // User is attached by authenticate middleware
    const response: AuthResponse<{ user: User }> = {
      success: true,
      message: "User retrieved successfully",
      data: { user: req.user! },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================
// REFRESH TOKEN
// ==================
// POST /api/auth/refresh
// Body: { refresh_token }

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Refresh token required",
        error: "No refresh token provided",
      };
      res.status(400).json(response);
      return;
    }

    const { data, error } = await AuthService.refreshSession(refresh_token);

    if (error) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Token refresh failed",
        error: error.message,
      };
      res.status(401).json(response);
      return;
    }

    const response: AuthResponse<{ session: Session | null }> = {
      success: true,
      message: "Token refreshed successfully",
      data: { session: data.session },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ==================
// RESEND VERIFICATION EMAIL
// ==================
// POST /api/auth/resend-verification
// Body: { email }

export const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Email required",
        error: "Please provide an email address",
      };
      res.status(400).json(response);
      return;
    }

    const { error } = await AuthService.resendVerificationEmail(email);

    if (error) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Failed to resend verification email",
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: AuthResponse<null> = {
      success: true,
      message: "Verification email sent! Please check your inbox.",
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};