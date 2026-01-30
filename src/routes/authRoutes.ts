// ==============================
// AUTH ROUTES - API Endpoints
// ==============================

import { Router } from "express";
import * as AuthController from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";
import {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "../middleware/validateAuth";
import { AuthError } from "@supabase/supabase-js/dist/index.cjs";

// Create router instance
const router = Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// POST /api/auth/signup
// Register new user
router.post("/signup", validateSignup, AuthController.signup);

// POST /api/auth/login
// Login existing user
router.post("/login", validateLogin, AuthController.login);

// POST /api/auth/forgot-password
// Request password reset email
router.post(
  "/forgot-password",
  validateForgotPassword,
  AuthController.forgotPassword,
);

// POST /api/auth/refresh
// Refresh access token
router.post("/refresh", AuthController.refreshToken);

// POST /api/auth/resend-verification
// Resend email verification
router.post("/resend-verification", AuthController.resendVerification);

// =============================================
// PROTECTED ROUTES (AUthentication required)
// =============================================

// POST /api/auth/logout
// Logout user
router.post("/logout", authenticate, AuthController.logout);

// GET /api/auth/me
// GET current user profile
router.get("/me", authenticate, AuthController.getCurrentUser);

// POST /api/auth/reset-password
// Set new password (requies auth from reset link)
router.post(
  "/reset-password",
  authenticate,
  validateResetPassword,
  AuthController.resetPassword,
);

// Export router
export default router;
