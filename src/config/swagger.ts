// ============================================
// SWAGGER CONFIGURATION - API Documentation
// ============================================

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Swagger/OpenAPI configuration
 */
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager REST API",
      version: "1.0.0",
      description: `
A complete Task Manager REST API built with Node.js, Express, TypeScript, and Supabase.

## Features
- 📋 Full CRUD operations for tasks
- 🔐 JWT-based authentication
- 🛡️ Rate limiting and security headers
- 📊 Task statistics and filtering

## Authentication
Most endpoints require authentication via JWT token.
Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your-access-token>
\`\`\`
      `,
      contact: {
        name: "API Support",
        email: "support@taskmanager.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.taskmanager.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Tasks",
        description: "Task management endpoints",
      },
      {
        name: "Authentication",
        description: "User authentication endpoints",
      },
      {
        name: "Health",
        description: "API health check endpoints",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        // Task Schema
        Task: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique task identifier",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            title: {
              type: "string",
              description: "Task title",
              example: "Complete project documentation",
            },
            description: {
              type: "string",
              nullable: true,
              description: "Detailed task description",
              example: "Write comprehensive API documentation with examples",
            },
            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
              description: "Current task status",
              example: "pending",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "Task priority level",
              example: "medium",
            },
            due_date: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Task due date",
              example: "2024-12-31T23:59:59Z",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        // Create Task DTO
        CreateTaskDTO: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "Task title (required)",
              example: "New Task",
            },
            description: {
              type: "string",
              description: "Task description (optional)",
              example: "Task details here",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              default: "medium",
              description: "Task priority (optional)",
            },
            due_date: {
              type: "string",
              format: "date",
              description: "Due date in ISO format (optional)",
              example: "2024-12-31",
            },
          },
        },
        // Update Task DTO
        UpdateTaskDTO: {
          type: "object",
          minProperties: 1,
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 255,
            },
            description: {
              type: "string",
            },
            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
            },
            due_date: {
              type: "string",
              format: "date",
            },
          },
        },
        // User Schema
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            email: {
              type: "string",
              format: "email",
            },
            email_confirmed_at: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            created_at: {
              type: "string",
              format: "date-time",
            },
          },
        },
        // Login DTO
        LoginDTO: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "SecurePassword123",
            },
          },
        },
        // Signup DTO
        SignupDTO: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "newuser@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "SecurePassword123",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
          },
        },
        // API Response
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            message: {
              type: "string",
            },
            data: {
              type: "object",
            },
            error: {
              type: "string",
            },
          },
        },
        // Error Response
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "An error occurred",
            },
            error: {
              type: "string",
              example: "Error details here",
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Unauthorized",
                error: "No token provided",
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        ValidationError: {
          description: "Validation failed",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        RateLimitError: {
          description: "Too many requests",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              example: {
                success: false,
                message: "Too many requests",
                error: "Rate limit exceeded. Please wait.",
              },
            },
          },
        },
      },
    },
    // ============================================
    // PATHS - API Endpoints
    // ============================================
    paths: {
      "/api/auth/signup": {
        post: {
          summary: "Register a new user",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SignupDTO",
                },
                example: {
                  email: "newuser@example.com",
                  password: "MyPassword123",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "User registered successfully",
            },
            "400": {
              description: "Validation error",
            },
            "429": {
              description: "Rate limit exceeded (3 requests per hour)",
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          summary: "Login user and get JWT token",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginDTO",
                },
                example: {
                  email: "user@example.com",
                  password: "MyPassword123",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Login successful - Returns access_token",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          user: {
                            $ref: "#/components/schemas/User",
                          },
                          session: {
                            type: "object",
                            properties: {
                              access_token: { type: "string" },
                              token_type: { type: "string" },
                              expires_in: { type: "number" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Invalid credentials",
            },
            "429": {
              description: "Rate limit exceeded (5 requests per 15 minutes)",
            },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          summary: "Logout user",
          tags: ["Authentication"],
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Logout successful",
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
          },
        },
      },
      "/api/auth/me": {
        get: {
          summary: "Get current user profile",
          tags: ["Authentication"],
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "User profile retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                      data: {
                        $ref: "#/components/schemas/User",
                      },
                    },
                  },
                },
              },
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
          },
        },
      },
      "/api/auth/forgot-password": {
        post: {
          summary: "Request password reset email",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                    },
                  },
                },
                example: {
                  email: "user@example.com",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Password reset email sent",
            },
            "429": {
              description: "Rate limit exceeded (3 requests per hour)",
            },
          },
        },
      },
      "/api/auth/refresh": {
        post: {
          summary: "Refresh access token",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["refresh_token"],
                  properties: {
                    refresh_token: {
                      type: "string",
                    },
                  },
                },
                example: {
                  refresh_token: "your-refresh-token-here",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Token refreshed successfully",
            },
            "401": {
              description: "Invalid refresh token",
            },
          },
        },
      },
      "/api/auth/reset-password": {
        post: {
          summary: "Reset password",
          tags: ["Authentication"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["password"],
                  properties: {
                    password: {
                      type: "string",
                      minLength: 6,
                    },
                  },
                },
                example: {
                  password: "NewSecurePassword123",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Password reset successful",
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
          },
        },
      },
      "/api/auth/resend-verification": {
        post: {
          summary: "Resend email verification",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                    },
                  },
                },
                example: {
                  email: "user@example.com",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Verification email sent",
            },
          },
        },
      },
      // ============================================
      // TASK ENDPOINTS
      // ============================================
      "/api/tasks": {
        get: {
          summary: "Get all tasks",
          description: "Retrieve all tasks with optional filtering, sorting, and pagination",
          tags: ["Tasks"],
          parameters: [
            {
              in: "query",
              name: "status",
              schema: {
                type: "string",
                enum: ["pending", "in-progress", "completed"],
              },
              description: "Filter by task status",
            },
            {
              in: "query",
              name: "priority",
              schema: {
                type: "string",
                enum: ["low", "medium", "high"],
              },
              description: "Filter by task priority",
            },
            {
              in: "query",
              name: "search",
              schema: {
                type: "string",
              },
              description: "Search in title and description",
            },
            {
              in: "query",
              name: "sort_by",
              schema: {
                type: "string",
                enum: ["created_at", "updated_at", "due_date", "priority"],
              },
              description: "Field to sort by",
            },
            {
              in: "query",
              name: "order",
              schema: {
                type: "string",
                enum: ["asc", "desc"],
              },
              description: "Sort order",
            },
            {
              in: "query",
              name: "limit",
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 100,
              },
              description: "Number of results to return",
            },
            {
              in: "query",
              name: "offset",
              schema: {
                type: "integer",
                minimum: 0,
              },
              description: "Number of results to skip",
            },
          ],
          responses: {
            "200": {
              description: "List of tasks",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Task",
                        },
                      },
                      count: { type: "integer" },
                    },
                  },
                },
              },
            },
            "400": {
              $ref: "#/components/responses/ValidationError",
            },
          },
        },
        post: {
          summary: "Create a new task",
          description: "Create a new task (requires authentication)",
          tags: ["Tasks"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateTaskDTO",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Task created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                      data: {
                        $ref: "#/components/schemas/Task",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              $ref: "#/components/responses/ValidationError",
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "429": {
              $ref: "#/components/responses/RateLimitError",
            },
          },
        },
      },
      "/api/tasks/stats": {
        get: {
          summary: "Get task statistics",
          description: "Retrieve statistics about all tasks (counts by status, priority, etc.)",
          tags: ["Tasks"],
          responses: {
            "200": {
              description: "Task statistics",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                          byStatus: { type: "object" },
                          byPriority: { type: "object" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/tasks/{id}": {
        get: {
          summary: "Get task by ID",
          description: "Retrieve a single task by its UUID",
          tags: ["Tasks"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
              description: "Task UUID",
            },
          ],
          responses: {
            "200": {
              description: "Task details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        $ref: "#/components/schemas/Task",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              $ref: "#/components/responses/ValidationError",
            },
            "404": {
              $ref: "#/components/responses/NotFoundError",
            },
          },
        },
        put: {
          summary: "Update a task",
          description: "Update an existing task by ID (requires authentication)",
          tags: ["Tasks"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
              description: "Task UUID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateTaskDTO",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Task updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                      data: {
                        $ref: "#/components/schemas/Task",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              $ref: "#/components/responses/ValidationError",
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "404": {
              $ref: "#/components/responses/NotFoundError",
            },
          },
        },
        delete: {
          summary: "Delete a task",
          description: "Delete a task by ID (requires authentication)",
          tags: ["Tasks"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
              description: "Task UUID",
            },
          ],
          responses: {
            "200": {
              description: "Task deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            "400": {
              $ref: "#/components/responses/ValidationError",
            },
            "401": {
              $ref: "#/components/responses/UnauthorizedError",
            },
            "404": {
              $ref: "#/components/responses/NotFoundError",
            },
          },
        },
      },
    },
  },
  // Don't use apis array - define all paths manually above
  apis: [],
};

// Generate OpenAPI specification
const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Setup Swagger documentation
 */
export const setupSwagger = (app: Application): void => {
  // Swagger UI options
  const swaggerUiOptions: swaggerUi.SwaggerUiOptions = {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Task Manager API Docs",
  };

  // Serve Swagger UI
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUiOptions),
  );

  // Serve raw OpenAPI spec as JSON
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("📚 Swagger docs available at /api/docs");
};

export default swaggerSpec;
