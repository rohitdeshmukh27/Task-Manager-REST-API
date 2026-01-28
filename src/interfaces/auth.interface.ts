// ==============================================
// AUTH INTERFACE - TypeScript Type Definitions
// ==============================================

// User Object returns from supabase

export interface User {
  id: string; // UUID from supabse
  email: string; // user's email
  email_confirmed_at?: string; // null if not verified
  created_at: string; // Account creation timestamp
  updated_at: string; // Last update timestamp
}

// Session Object from supabase

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at?: number; // seconds untill access token exprires
  token_type: string; //usally "bearer"
  user: User; //the authenticated user
}

// DTO for user signup
export interface SignupDTO {
  email: string;
  password: string;
  name?: string; //optional user display name
}

// DTO for user login
export interface LoginDTO {
  email: string;
  password: string;
}

//DTO for password reset request
export interface ForgotPasswordDTO {
  email: string;
}

// DTO for setting new password
export interface ResetPasswordDTO {
  password: string;
}

// Auth API response wrapper
export interface AuthResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Extended Express Request with user info
export interface AuthenticatedRequest extends Request {
  user?: User;
  accessToken?: string;
}
