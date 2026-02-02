// ===========================================
// SECURITY MIDDLEWARE - Protection Layer
// ===========================================

import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { Application, Request, Response } from "express";

/**
 * Configure Helmet Security headers
 *
 * Helmet helps secure express apps by setting HTTP response headers
 */

export const configureHelmet = () => {
  return helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Only allow resources from same origin
        scriptSrc: ["'self'"], // Only allow scripts from same origin
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles (for error pages)
        imgSrc: ["'self'", "data:", "https:"], // Allow images from self, data URIs, HTTPS
        connectSrc: ["'self'"], // Only allow connection to same origin
        fontSrc: ["'self'"], // Only allow fonts from same origin
        objectSrc: ["'none'"], // Disallow plugins(Flash,etc)
        mediaSrc: ["'self'"], // Only allow media from same origin
        frameSrc: ["'none'"], // Disallow iframes
      },
    },

    // Prevent clickjacking
    frameguard: {
      action: "deny", // Completely deny framing
    },

    // Hide X-Powered-By header (dont reveal express)
    hidePoweredBy: true,

    // HTTP Strict Transport Security
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true, // Apply to subdomains
      preload: true, // Allow brower to preloading
    },

    // Prevent IE from executing downloads in site's context
    ieNoOpen: true,

    // Prevent MIME type sniffing
    noSniff: true,

    // Control referrer information
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },

    // XSS filter (legacy, but still useful)
    xssFilter: true,
  });
};

/**
 * Configure compression middleware
 *
 * Compresses response bodies for all requests.
 * Can reduce payload size by 70% for text-based responses.
 */

export const configureCompression = () => {
  return compression({
    // Compression level (1-9, higer = more compression but slower)
    level: 6,

    // Minimum size to compress (in bytes)
    threshold: 1024, // Don't compress responses smaller than 1KB

    // Filter function to determine if response should be compressed
    filter: (req: Request, res: Response) => {
      // Dont compress if client doesnt accept it
      if (req.headers["x-no-compression"]) {
        return false;
      }

      // Use compressions default filter
      return compression.filter(req, res);
    },
  });
};

/**
 * Configure Morgan request logger
 *
 * Logs all HTTP requests with useful information
 */
export const configureMorgan = () => {
  // Use different formats based on environment
  const format =
    process.env.NODE_ENV === "production"
      ? "combined" // Apache combined log format (for production)
      : "dev"; // Colored, concise output )for development

  return morgan(format, {
    // skip loggin for successful requests in production (optional)
    skip: (req: Request, res: Response) => {
      if (process.env.NODE_ENV === "production") {
        return res.statusCode < 400; // Only log errors in production
      }
      return false; // log everything in development
    },
  });
};

/**
 * Custom morgan format for detailed logging
 * Use this if you want more control over log format
 */
export const configureMorganCustom = () => {
  // Define custom tokens
  morgan.token("user-id", (req: Request) => {
    return (req as any).user?.id || "anonymous";
  });

  morgan.token("body", (req: Request) => {
    // Dont log sensitive data
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = "[REDACTED]";
    if (safeBody.refresh_token) safeBody.refresh_token = "[REDACTED]";
    return JSON.stringify(safeBody);
  });

  // Custom format string
  const customFormat =
    ":method :url :status :response-time ms - :user-id - :body";

  return morgan(customFormat);
};

/**
 * Apply all security middle to express app
 * Call this function in app.js
 */

export const applySecurityMiddleware = (app: Application): void => {
  // 1. Helmet (security headers) - FIRST
  app.use(configureHelmet());

  // 2. Compression - EARLY (before routes)
  app.use(configureCompression());

  // 3. Morgan Logger - EARLY (to log all requests)
  // Use custom format to see actual response size
  app.use(configureMorganCustom());

  console.log("✅ Security middleware applied (Helmet, Compression, Morgan)");
};
