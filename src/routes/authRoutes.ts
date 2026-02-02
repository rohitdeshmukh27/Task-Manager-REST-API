// =============================
// AUTH ROUTES - API Endpoints
// =============================

import { Router } from "express";
import * as AuthController from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";
import {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "../middleware/validateAuth";
import {
  authLimiter,
  signupLimiter,
  passwordResetLimiter,
} from "../config/rateLimiter";

// Create router instance
const router = Router();

// ====================================
// PUBLIC ROUTES (No authentication required)
// ====================================

// POST /api/auth/signup
// Register new user - STRICT RATE LIMIT (3/hour)
router.post("/signup", signupLimiter, validateSignup, AuthController.signup);

// POST /api/auth/login
// Login existing user - STRICT RATE LIMIT (5/15min)
router.post("/login", authLimiter, validateLogin, AuthController.login);

// POST /api/auth/forgot-password
// Request password reset email - STRICT RATE LIMIT (3/hour)
router.post(
  "/forgot-password",
  passwordResetLimiter,
  validateForgotPassword,
  AuthController.forgotPassword,
);

// POST /api/auth/refresh
// Refresh access token - Uses general limiter
router.post("/refresh", AuthController.refreshToken);

// POST /api/auth/resend-verification
// Resend email verification - Uses general limiter
router.post("/resend-verification", AuthController.resendVerification);

// ====================================
// PROTECTED ROUTES (Authentication required)
// ====================================

// POST /api/auth/logout
router.post("/logout", authenticate, AuthController.logout);

// GET /api/auth/me
router.get("/me", authenticate, AuthController.getCurrentUser);

// POST /api/auth/reset-password
router.post(
  "/reset-password",
  authenticate,
  validateResetPassword,
  AuthController.resetPassword,
);

export default router;
