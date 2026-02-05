// ============================
// RATE LIMITER CONFIGURATION
// ============================
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { Request, Response } from "express";

/**
 * General API rate Limiter
 * Applies to all routes by default
 *
 * 100 request per 15 min per IP
 */
export const generalLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min in milliseconds
  max: 100, // Limit each IP to 100 request per window

  // Response when limit is execeeded
  message: {
    success: false,
    message: "Too many requests, Please try again later",
    error: "Rate limit exceeded. Please wait 15 minutes",
    retryAfter: "15 Minutes",
  },

  // HTTP Status code when limit exceeded
  statusCode: 429,

  // Headers to send with rate limit info
  standardHeaders: true, // Returns rate limit infor in `RateLimit-* headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers (deprecated)

  // Skip rate limiting for certain request (optional)
  skip: (req: Request) => {
    // Skip rate limiting for health check endpoint
    if (req.path === "/" || req.path === "/health") {
      return true;
    }
    return false;
  },

  // Note: Using default keyGenerator (IP address) which properly handles IPv6
  // If you need custom logic, use the standardHeaders and legacyHeaders options

  // Handler when rate limit is exceeded
  handler: (req: Request, res: Response) => {
    console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip} on ${req.path}`);

    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later.",
      error:
        "You have exceeded the rate limit. Please wait before making more requests",
      retryAfter: res.getHeader("Retry-After"),
    });
  },
});

/**
 * Strict rate limiter for authenticaton endpoints
 * Prevents brute force attacks on login
 *
 * 5 requests per 15 min per IP
 */
export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // Only 5 attempts

  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
    error: "Account temporarily locked due to multiple failed attempts",
    retryAfter: "15 minutes",
  },

  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,

  // Skip successful requests (only count failed attempts)
  skipSuccessfulRequests: false,

  handler: (req: Request, res: Response) => {
    console.warn;
    `🔐 Auth rate limit exceeded for IP: ${req.ip}`;

    res.status(429).json({
      success: false,
      message: "Too many authentication atttempts",
      error: "Please wait 15 minutes before trying again",
      retryAfter: res.getHeader("Retry-After"),
    });
  },
});

/**
 * Very strict limiter for signup
 * Prevents mass account creation
 *
 * 3 requests per hour per IP
 */
export const signupLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 signups per hour

  message: {
    success: false,
    message: "Too many accounts created, please try again later",
    error: "Signup limits reached. Please wait 1 hour.",
    retryAfter: "1 Hour",
  },

  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req: Request, res: Response) => {
    console.warn(`📝 Signup rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: "Too many signup attempts",
      error: "Please wait 1 hour before creating another account",
      retryAfter: res.getHeader("Retry-After"),
    });
  },
});

/**
 * Password reset limiter
 * Prevents email spam
 *
 * 3 requests per hour per IP
 */
export const passwordResetLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,

  message: {
    success: false,
    message: "Too many password reset requests",
    error: "Please check your email or wait 1 hour",
    retryAfter: "1 hour",
  },

  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Create task limiter
 * Prevents spam task creation
 *
 * 30 Tasks per hour per IP
 */
export const createTaskLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,

  message: {
    success: false,
    message: "Task creation limit reached.",
    error: "You can create up to 30 tasks per hour",
    retryAfter: "1 hour",
  },
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
});
