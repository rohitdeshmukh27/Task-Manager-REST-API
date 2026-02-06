// =============================
// AUTH ROUTES - API Endpoints
// =============================

import { Router } from "express";
import * as AuthController from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "../middleware/validateAuth.js";
import { authLimiter, signupLimiter, passwordResetLimiter } from "../config/rateLimiter.js";

// Create router instance
const router = Router();

// ====================================
// PUBLIC ROUTES (No authentication required)
// ====================================

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupDTO'
 *           example:
 *             email: "newuser@example.com"
 *             password: "MyPassword123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       429:
 *         description: Rate limit exceeded (3 requests per hour)
 */
router.post("/signup", signupLimiter, validateSignup, AuthController.signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDTO'
 *           example:
 *             email: "user@example.com"
 *             password: "MyPassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     session:
 *                       type: object
 *                       properties:
 *                         access_token:
 *                           type: string
 *                         token_type:
 *                           type: string
 *                         expires_in:
 *                           type: number
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Rate limit exceeded (5 requests per 15 minutes)
 */
router.post("/login", authLimiter, validateLogin, AuthController.login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       429:
 *         description: Rate limit exceeded (3 requests per hour)
 */
router.post(
  "/forgot-password",
  passwordResetLimiter,
  validateForgotPassword,
  AuthController.forgotPassword
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *             example:
 *               refresh_token: "your-refresh-token-here"
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post("/refresh", AuthController.refreshToken);

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resend email verification
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: "user@example.com"
 *     responses:
 *       200:
 *         description: Verification email sent
 */
router.post("/resend-verification", AuthController.resendVerification);

// ====================================
// PROTECTED ROUTES (Authentication required)
// ====================================

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/logout", authenticate, AuthController.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/me", authenticate, AuthController.getCurrentUser);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password (requires authentication)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *             example:
 *               password: "NewSecurePassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/reset-password", authenticate, validateResetPassword, AuthController.resetPassword);

export default router;
