// =================================================
// AUTH SERVICE - Supabase Authentication Operations
// =================================================

import supabase from "../config/supabase";
import {
  User,
  Session,
  SignupDTO,
  LoginDTO,
  ForgotPasswordDTO,
} from "../interfaces/auth.interface";

/*
Register a new user

@param signupData - email and password
@return User and session if sucessful
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
      data: { name: signupData.name || null },
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

/*
Sign in exsisting user with email and password

@param LoginData - Email and password
@return User and session with tokens
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
 * @param email - users email address
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
 * Update user's password (After reset)
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
 * @param refreshToken - the refresh token
 */
export const refreshSession = async (
  refreshToken: string,
): Promise<{
  data: { session: Session | null };
  error: any;
}> => {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });
  return {
    data: { session: data.session as Session | null },
    error,
  };
};

/**
 * Resent verification email
 *
 * @param email - user's email
 */
export const resendVerificationEmail = async (
  email: string,
): Promise<{
  error: any;
}> => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email,
    options: {
      emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
    },
  });
  return { error };
};
