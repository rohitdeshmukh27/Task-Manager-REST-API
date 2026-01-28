# 🔐 Supabase Authentication - Complete Integration Roadmap

## 📋 Manual Implementation Guide for Task Manager API

Integrate **complete authentication** into your existing Task Manager API:

- **Signup** - Register new users
- **Login** - Authenticate users
- **Forgot Password** - Password reset via email
- **Email Verification** - Confirm user accounts
- **JWT Tokens** - Secure API access

**Time to Complete:** 4-5 hours

---

# 🎯 Understanding JWT & Access Tokens

## What is JWT (JSON Web Token)?

```
┌─────────────────────────────────────────────────────────────────┐
│                         JWT STRUCTURE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.                         │
│   ─────────────────────────────────────                          │
│                    HEADER (Base64)                               │
│                                                                  │
│   eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJvaGl0In0.             │
│   ─────────────────────────────────────────────────              │
│                    PAYLOAD (Base64)                              │
│                                                                  │
│   SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c                   │
│   ─────────────────────────────────────────────                  │
│                    SIGNATURE (Encrypted)                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### JWT Components Explained:

| Part          | Purpose                | Example Content                                                    |
| ------------- | ---------------------- | ------------------------------------------------------------------ |
| **Header**    | Algorithm & token type | `{"alg": "HS256", "typ": "JWT"}`                                   |
| **Payload**   | User data & claims     | `{"sub": "user-id", "email": "user@email.com", "exp": 1234567890}` |
| **Signature** | Verification hash      | Created using secret key                                           |

### Supabase Token Types:

| Token             | Purpose                | Lifespan         | Storage             |
| ----------------- | ---------------------- | ---------------- | ------------------- |
| **Access Token**  | Authorize API requests | 1 hour (default) | Memory/localStorage |
| **Refresh Token** | Get new access tokens  | 7 days (default) | httpOnly cookie     |

---

## How Supabase Auth Flow Works:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

1. SIGNUP FLOW:
   ┌──────────┐    POST /auth/signup     ┌──────────────┐
   │  Client  │ ──────────────────────►  │  Your API    │
   └──────────┘   (email + password)     └──────────────┘
                                                │
                                                ▼
                                    ┌──────────────────────┐
                                    │  Supabase Auth       │
                                    │  ────────────────    │
                                    │  • Creates user      │
                                    │  • Sends verify email│
                                    │  • Returns tokens    │
                                    └──────────────────────┘
                                                │
   ┌──────────┐   { access_token,     ┌──────────────┐
   │  Client  │ ◄───refresh_token }─── │  Your API    │
   └──────────┘                        └──────────────┘

2. LOGIN FLOW:
   ┌──────────┐    POST /auth/login      ┌──────────────┐
   │  Client  │ ──────────────────────►  │  Your API    │
   └──────────┘   (email + password)     └──────────────┘
                                                │
                                                ▼
                                    ┌──────────────────────┐
                                    │  Supabase Auth       │
                                    │  ────────────────    │
                                    │  • Validates creds   │
                                    │  • Generates JWT     │
                                    │  • Returns session   │
                                    └──────────────────────┘

3. PROTECTED ROUTE ACCESS:
   ┌──────────┐  GET /api/tasks          ┌──────────────┐
   │  Client  │ ─────────────────────►   │  Your API    │
   └──────────┘  Authorization:          └──────────────┘
                 Bearer <access_token>           │
                                                 ▼
                                    ┌──────────────────────┐
                                    │  Auth Middleware     │
                                    │  ────────────────    │
                                    │  • Extract token     │
                                    │  • Verify with       │
                                    │    Supabase          │
                                    │  • Attach user to    │
                                    │    request           │
                                    └──────────────────────┘
```

---

# 🏗️ Updated Architecture

```
task-manager-api/
│
├── 📁 src/
│   │
│   ├── 📁 config/
│   │   └── supabase.ts            # Supabase client (EXISTING)
│   │
│   ├── 📁 interfaces/
│   │   ├── task.interface.ts      # Task types (EXISTING)
│   │   └── auth.interface.ts      # [NEW] Auth type definitions
│   │
│   ├── 📁 services/
│   │   ├── taskService.ts         # Task DB operations (EXISTING)
│   │   └── authService.ts         # [NEW] Auth operations
│   │
│   ├── 📁 controllers/
│   │   ├── taskController.ts      # Task handlers (EXISTING)
│   │   └── authController.ts      # [NEW] Auth handlers
│   │
│   ├── 📁 middleware/
│   │   ├── errorHandler.ts        # Error handling (EXISTING)
│   │   ├── validateTask.ts        # Task validation (EXISTING)
│   │   ├── authMiddleware.ts      # [NEW] JWT verification
│   │   └── validateAuth.ts        # [NEW] Auth input validation
│   │
│   ├── 📁 routes/
│   │   ├── taskRoutes.ts          # Task routes (EXISTING - MODIFY)
│   │   └── authRoutes.ts          # [NEW] Auth routes
│   │
│   └── app.ts                     # Entry point (MODIFY)
│
├── .env                           # Add new auth variables
└── .env.example                   # Document new variables
```

---

# 🛠️ STEP-BY-STEP IMPLEMENTATION

---

## PHASE 1: SUPABASE DASHBOARD SETUP

---

### STEP 1: Enable Email Authentication

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Providers**
3. Ensure **Email** provider is enabled
4. Configure settings:
   - ✅ Enable email confirmations
   - ✅ Enable password recovery

---

### STEP 2: Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize templates for:
   - **Confirm signup** - Email verification
   - **Reset password** - Password reset link
   - **Magic link** - Passwordless login (optional)

---

### STEP 3: Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000` (for development)
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/reset-password`

---

### STEP 4: Update Environment Variables

📁 **File:** `.env`

```env
# Supabase Configuration (EXISTING)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Server Configuration (EXISTING)
PORT=3000
NODE_ENV=development

# [NEW] JWT Configuration
JWT_SECRET=your-jwt-secret-here

# [NEW] Frontend URLs for redirects
FRONTEND_URL=http://localhost:3000
PASSWORD_RESET_URL=http://localhost:3000/reset-password
```

📁 **File:** `.env.example` (update)

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-jwt-secret-here

# Frontend URLs
FRONTEND_URL=http://localhost:3000
PASSWORD_RESET_URL=http://localhost:3000/reset-password
```

---

## PHASE 2: CREATE AUTH INTERFACES

---

### STEP 5: Create Auth Interface File

📁 **File:** `src/interfaces/auth.interface.ts`

```typescript
// ============================================
// AUTH INTERFACE - TypeScript Type Definitions
// ============================================

/**
 * User object returned from Supabase
 */
export interface User {
  id: string; // UUID from Supabase
  email: string; // User's email
  email_confirmed_at?: string; // Null if not verified
  created_at: string; // Account creation timestamp
  updated_at: string; // Last update timestamp
}

/**
 * Session object from Supabase
 */
export interface Session {
  access_token: string; // JWT for API access
  refresh_token: string; // Token to get new access token
  expires_in: number; // Seconds until access token expires
  expires_at?: number; // Unix timestamp of expiration
  token_type: string; // Usually "bearer"
  user: User; // The authenticated user
}

/**
 * DTO for user signup
 */
export interface SignupDTO {
  email: string;
  password: string;
  name?: string; // Optional user display name
}

/**
 * DTO for user login
 */
export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * DTO for password reset request
 */
export interface ForgotPasswordDTO {
  email: string;
}

/**
 * DTO for setting new password
 */
export interface ResetPasswordDTO {
  password: string;
}

/**
 * Auth API response wrapper
 */
export interface AuthResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Extended Express Request with user info
 */
export interface AuthenticatedRequest extends Request {
  user?: User;
  accessToken?: string;
}
```

### 💡 Key Concepts:

- **User** = Basic user info from Supabase auth
- **Session** = Contains tokens + user after login
- **DTO** = Data Transfer Object (what client sends)

---

## PHASE 3: CREATE AUTH SERVICE

---

### STEP 6: Create Auth Service File

📁 **File:** `src/services/authService.ts`

```typescript
// ============================================
// AUTH SERVICE - Supabase Authentication Operations
// ============================================

import supabase from "../config/supabase";
import {
  User,
  Session,
  SignupDTO,
  LoginDTO,
  ForgotPasswordDTO,
} from "../interfaces/auth.interface";

/**
 * Register a new user
 *
 * @param signupData - Email and password
 * @returns User and session if successful
 */
export const signup = async (
  signupData: SignupDTO,
): Promise<{
  data: { user: User | null; session: Session | null };
  error: any;
}> => {
  const { data, error } = await supabase.auth.signUp({
    email: signupData.email,
    password: signupData.password,
    options: {
      data: {
        name: signupData.name || null,
      },
      // Redirect URL after email confirmation
      emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
    },
  });

  return {
    data: {
      user: data.user as User | null,
      session: data.session as Session | null,
    },
    error,
  };
};

/**
 * Sign in existing user with email and password
 *
 * @param loginData - Email and password
 * @returns User and session with tokens
 */
export const login = async (
  loginData: LoginDTO,
): Promise<{
  data: { user: User | null; session: Session | null };
  error: any;
}> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginData.email,
    password: loginData.password,
  });

  return {
    data: {
      user: data.user as User | null,
      session: data.session as Session | null,
    },
    error,
  };
};

/**
 * Sign out user (invalidate session)
 */
export const logout = async (): Promise<{ error: any }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Send password reset email
 *
 * @param email - User's email address
 */
export const forgotPassword = async (
  email: string,
): Promise<{ error: any }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.PASSWORD_RESET_URL}`,
  });

  return { error };
};

/**
 * Update user's password (after reset)
 *
 * @param newPassword - The new password
 */
export const resetPassword = async (
  newPassword: string,
): Promise<{ data: { user: User | null }; error: any }> => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return {
    data: { user: data.user as User | null },
    error,
  };
};

/**
 * Get user from access token
 * Used in auth middleware to verify requests
 *
 * @param accessToken - JWT access token
 */
export const getUserFromToken = async (
  accessToken: string,
): Promise<{ data: { user: User | null }; error: any }> => {
  const { data, error } = await supabase.auth.getUser(accessToken);

  return {
    data: { user: data.user as User | null },
    error,
  };
};

/**
 * Refresh access token using refresh token
 *
 * @param refreshToken - The refresh token
 */
export const refreshSession = async (
  refreshToken: string,
): Promise<{ data: { session: Session | null }; error: any }> => {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  return {
    data: { session: data.session as Session | null },
    error,
  };
};

/**
 * Resend verification email
 *
 * @param email - User's email
 */
export const resendVerificationEmail = async (
  email: string,
): Promise<{ error: any }> => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email,
    options: {
      emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
    },
  });

  return { error };
};
```

### 💡 Supabase Auth Methods Explained:

| Method                    | Purpose                 | Returns                              |
| ------------------------- | ----------------------- | ------------------------------------ |
| `signUp()`                | Register new user       | User + Session (if no email confirm) |
| `signInWithPassword()`    | Login with credentials  | User + Session with tokens           |
| `signOut()`               | Invalidate session      | Nothing                              |
| `resetPasswordForEmail()` | Send reset email        | Nothing                              |
| `updateUser()`            | Update password/profile | Updated user                         |
| `getUser()`               | Verify token & get user | User data                            |
| `refreshSession()`        | Get new access token    | New session                          |

---

## PHASE 4: CREATE AUTH MIDDLEWARE

---

### STEP 7: Create Auth Middleware

📁 **File:** `src/middleware/authMiddleware.ts`

```typescript
// ============================================
// AUTH MIDDLEWARE - Protect Routes with JWT
// ============================================

import { Request, Response, NextFunction } from "express";
import * as AuthService from "../services/authService";
import { User, AuthResponse } from "../interfaces/auth.interface";

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
 * Middleware to verify JWT access token
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
    if (!authHeader.startsWith("Bearer ")) {
      const response: AuthResponse<null> = {
        success: false,
        message: "Access denied",
        error: "Invalid authorization format. Use: Bearer <token>",
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
        error: "No token provided",
      };
      res.status(401).json(response);
      return;
    }

    // Verify token with Supabase
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

    // Attach user and token to request
    req.user = data.user;
    req.accessToken = token;

    // Continue to next middleware/route
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

    if (authHeader && authHeader.startsWith("Bearer ")) {
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
```

### 💡 How Token Extraction Works:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
               ──────  ───────────────────────────────────────
               Prefix                    Token
```

---

### STEP 8: Create Auth Validation Middleware

📁 **File:** `src/middleware/validateAuth.ts`

```typescript
// ============================================
// AUTH VALIDATION MIDDLEWARE
// ============================================

import { Request, Response, NextFunction } from "express";
import { AuthResponse } from "../interfaces/auth.interface";

/**
 * Validate signup request body
 */
export const validateSignup = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password, name } = req.body;
  const errors: string[] = [];

  // Email validation
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

  // Password validation
  if (!password) {
    errors.push("Password is required");
  } else if (typeof password !== "string") {
    errors.push("Password must be a string");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  } else if (password.length > 72) {
    errors.push("Password must not exceed 72 characters");
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
      message: "Validation failed",
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
```

---

## PHASE 5: CREATE AUTH CONTROLLER

---

### STEP 9: Create Auth Controller

📁 **File:** `src/controllers/authController.ts`

```typescript
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
```

---

## PHASE 6: CREATE AUTH ROUTES

---

### STEP 10: Create Auth Routes

📁 **File:** `src/routes/authRoutes.ts`

```typescript
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

// Create router instance
const router = Router();

// ====================================
// PUBLIC ROUTES (No authentication required)
// ====================================

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

// ====================================
// PROTECTED ROUTES (Authentication required)
// ====================================

// POST /api/auth/logout
// Logout user
router.post("/logout", authenticate, AuthController.logout);

// GET /api/auth/me
// Get current user profile
router.get("/me", authenticate, AuthController.getCurrentUser);

// POST /api/auth/reset-password
// Set new password (requires auth from reset link)
router.post(
  "/reset-password",
  authenticate,
  validateResetPassword,
  AuthController.resetPassword,
);

// Export router
export default router;
```

---

## PHASE 7: UPDATE EXISTING FILES

---

### STEP 11: Update app.ts

📁 **File:** `src/app.ts`

Add auth routes to your existing app.ts:

```typescript
// Add this import at the top with other imports
import authRoutes from "./routes/authRoutes";

// Add auth routes BEFORE task routes (around line 95-96)
// Mount auth routes
app.use("/api/auth", authRoutes);

// Mount task routes (EXISTING)
app.use("/api/tasks", taskRoutes);
```

**Full changes:**

```diff
 import express, { Application, Request, Response } from "express";
 import dotenv from "dotenv";
 import taskRoutes from "./routes/taskRoutes";
+import authRoutes from "./routes/authRoutes";
 import { errorHandler, notFoundHanler } from "./middleware/errorHandler";

 // ... rest of your code ...

+// Mount auth routes
+app.use("/api/auth", authRoutes);

 // Mount task routes
 app.use("/api/tasks", taskRoutes);
```

---

### STEP 12: Protect Task Routes (Optional)

📁 **File:** `src/routes/taskRoutes.ts`

To protect all task routes with authentication:

```typescript
import {
  authenticate,
  requireVerifiedEmail,
} from "../middleware/authMiddleware";

// Option 1: Protect entire router
router.use(authenticate); // Add at the top after imports

// Option 2: Protect individual routes
router.post("/", authenticate, validateCreateTask, TaskController.createTask);
router.put(
  "/:id",
  authenticate,
  validateTaskId,
  validateUpdateTask,
  TaskController.updateTask,
);
router.delete("/:id", authenticate, validateTaskId, TaskController.deleteTask);

// Option 3: Also require verified email
router.post(
  "/",
  authenticate,
  requireVerifiedEmail,
  validateCreateTask,
  TaskController.createTask,
);
```

---

### STEP 13: Update API Documentation

📁 **File:** `src/app.ts`

Update the `/api` endpoint to include auth endpoints:

```typescript
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Task Manager API Documentation",
    version: "1.0.0",
    database: "Supabase (PostgreSQL)",
    authEndpoints: [
      {
        method: "POST",
        path: "/api/auth/signup",
        description: "Register new user",
      },
      { method: "POST", path: "/api/auth/login", description: "Login user" },
      {
        method: "POST",
        path: "/api/auth/logout",
        description: "Logout user (Auth required)",
      },
      {
        method: "POST",
        path: "/api/auth/forgot-password",
        description: "Request password reset",
      },
      {
        method: "POST",
        path: "/api/auth/reset-password",
        description: "Set new password",
      },
      {
        method: "GET",
        path: "/api/auth/me",
        description: "Get current user (Auth required)",
      },
      {
        method: "POST",
        path: "/api/auth/refresh",
        description: "Refresh access token",
      },
      {
        method: "POST",
        path: "/api/auth/resend-verification",
        description: "Resend verification email",
      },
    ],
    taskEndpoints: [
      // ... existing endpoints
    ],
  });
});
```

---

# 🧪 TESTING WITH POSTMAN/THUNDER CLIENT

---

## Test 1: Signup

```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!",
  "name": "Test User"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Signup successful! Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "email_confirmed_at": null
    },
    "session": null
  }
}
```

---

## Test 2: Login

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "user": { ... },
    "session": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "abc123...",
      "expires_in": 3600,
      "token_type": "bearer"
    }
  }
}
```

---

## Test 3: Access Protected Route

```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Test 4: Forgot Password

```http
POST http://localhost:3000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

---

# ⚠️ IMPORTANT SECURITY NOTES

1. **Never expose JWT secrets** - Keep JWT_SECRET in .env only
2. **Always use HTTPS in production**
3. **Implement rate limiting** for auth endpoints (consider express-rate-limit)
4. **Store refresh tokens securely** - Use httpOnly cookies in production
5. **Validate email domains** if restricting users to certain domains
6. **Set appropriate token expiration** times

---

# 📚 QUICK REFERENCE

## Auth Endpoints Summary

| Method | Endpoint                        | Auth Required | Body                         |
| ------ | ------------------------------- | ------------- | ---------------------------- |
| POST   | `/api/auth/signup`              | No            | `{ email, password, name? }` |
| POST   | `/api/auth/login`               | No            | `{ email, password }`        |
| POST   | `/api/auth/logout`              | Yes           | None                         |
| POST   | `/api/auth/forgot-password`     | No            | `{ email }`                  |
| POST   | `/api/auth/reset-password`      | Yes\*         | `{ password }`               |
| GET    | `/api/auth/me`                  | Yes           | None                         |
| POST   | `/api/auth/refresh`             | No            | `{ refresh_token }`          |
| POST   | `/api/auth/resend-verification` | No            | `{ email }`                  |

\*Requires auth from reset link

---

## Files to Create

| File                                | Purpose                  |
| ----------------------------------- | ------------------------ |
| `src/interfaces/auth.interface.ts`  | Auth type definitions    |
| `src/services/authService.ts`       | Supabase auth operations |
| `src/controllers/authController.ts` | Request handlers         |
| `src/middleware/authMiddleware.ts`  | JWT verification         |
| `src/middleware/validateAuth.ts`    | Input validation         |
| `src/routes/authRoutes.ts`          | Route definitions        |

---

## Files to Modify

| File                       | Changes                        |
| -------------------------- | ------------------------------ |
| `.env`                     | Add JWT_SECRET, FRONTEND_URL   |
| `.env.example`             | Document new variables         |
| `src/app.ts`               | Import and mount auth routes   |
| `src/routes/taskRoutes.ts` | Add auth middleware (optional) |

---

# 🎉 CONGRATULATIONS!

You now have a complete authentication system with:

- ✅ User registration with email verification
- ✅ Secure login with JWT tokens
- ✅ Password reset functionality
- ✅ Protected API routes
- ✅ Token refresh mechanism

**Happy coding!** 🚀
