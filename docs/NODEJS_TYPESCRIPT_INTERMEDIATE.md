# 📚 Node.js & TypeScript - Intermediate Concepts

## 🎯 Building Real Applications

**Prerequisites:** Complete NODEJS_TYPESCRIPT_BASICS.md
**Time to Complete:** 3-4 hours

---

# 🟡 SECTION 1: Advanced TypeScript

---

## 1.1 Generics

Generics let you write **reusable code** that works with different types.

```typescript
// ============================================
// WHY GENERICS?
// ============================================

// Without generics - need separate functions for each type
function getFirstString(arr: string[]): string {
  return arr[0];
}

function getFirstNumber(arr: number[]): number {
  return arr[0];
}

// With generics - ONE function for ALL types
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

// Usage - TypeScript infers the type
const firstString = getFirst(["a", "b", "c"]); // Type: string
const firstNumber = getFirst([1, 2, 3]); // Type: number
const firstUser = getFirst([{ name: "John" }]); // Type: { name: string }

// ============================================
// GENERIC INTERFACES
// ============================================

// Generic API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: Date;
}

// Use with different data types
const userResponse: ApiResponse<{ id: number; name: string }> = {
  success: true,
  data: { id: 1, name: "John" },
  message: "User fetched",
  timestamp: new Date(),
};

const productsResponse: ApiResponse<string[]> = {
  success: true,
  data: ["Apple", "Banana"],
  message: "Products fetched",
  timestamp: new Date(),
};

// ============================================
// GENERIC CONSTRAINTS
// ============================================

// T must have a 'length' property
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(`Length: ${item.length}`);
}

logLength("Hello"); // ✅ string has length
logLength([1, 2, 3]); // ✅ array has length
logLength({ length: 10 }); // ✅ object has length
// logLength(123);          // ❌ number doesn't have length

// ============================================
// MULTIPLE GENERIC TYPES
// ============================================

function createPair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const pair1 = createPair("age", 25); // Type: [string, number]
const pair2 = createPair(1, "first"); // Type: [number, string]

// Generic with keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "John", age: 25 };
const name = getProperty(person, "name"); // Type: string
const age = getProperty(person, "age"); // Type: number
// getProperty(person, "email"); // ❌ Error: "email" doesn't exist
```

---

## 1.2 Type Guards and Narrowing

```typescript
// ============================================
// typeof TYPE GUARD
// ============================================

function processValue(value: string | number): string {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    return value.toUpperCase();
  } else {
    // TypeScript knows value is number here
    return value.toFixed(2);
  }
}

// ============================================
// instanceof TYPE GUARD
// ============================================

class Dog {
  bark(): void {
    console.log("Woof!");
  }
}

class Cat {
  meow(): void {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    animal.bark(); // TypeScript knows it's Dog
  } else {
    animal.meow(); // TypeScript knows it's Cat
  }
}

// ============================================
// 'in' TYPE GUARD
// ============================================

interface Car {
  drive(): void;
  wheels: number;
}

interface Boat {
  sail(): void;
  propellers: number;
}

function move(vehicle: Car | Boat): void {
  if ("drive" in vehicle) {
    vehicle.drive(); // It's a Car
  } else {
    vehicle.sail(); // It's a Boat
  }
}

// ============================================
// CUSTOM TYPE GUARDS
// ============================================

interface User {
  type: "user";
  name: string;
  email: string;
}

interface Admin {
  type: "admin";
  name: string;
  permissions: string[];
}

// Custom type guard function
function isAdmin(person: User | Admin): person is Admin {
  return person.type === "admin";
}

function greetPerson(person: User | Admin): void {
  console.log(`Hello, ${person.name}`);

  if (isAdmin(person)) {
    // TypeScript knows person is Admin here
    console.log(`Permissions: ${person.permissions.join(", ")}`);
  }
}
```

---

## 1.3 Utility Types

TypeScript provides built-in utility types for common transformations.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// ============================================
// PARTIAL - Make all properties optional
// ============================================

type UpdateUserDTO = Partial<User>;
// Equivalent to:
// { id?: number; name?: string; email?: string; ... }

function updateUser(id: number, updates: Partial<User>): void {
  // Can pass any subset of User properties
}

updateUser(1, { name: "New Name" }); // ✅ Only update name
updateUser(1, { email: "new@email.com", name: "John" }); // ✅ Update multiple

// ============================================
// REQUIRED - Make all properties required
// ============================================

type RequiredUser = Required<User>;
// All properties are now required (no optionals)

// ============================================
// PICK - Select specific properties
// ============================================

type UserPublicInfo = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string }

// Use for API responses (exclude password!)
function getPublicProfile(user: User): UserPublicInfo {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

// ============================================
// OMIT - Remove specific properties
// ============================================

type UserWithoutPassword = Omit<User, "password">;
// { id: number; name: string; email: string; createdAt: Date }

type CreateUserDTO = Omit<User, "id" | "createdAt">;
// { name: string; email: string; password: string }

// ============================================
// READONLY - Make all properties readonly
// ============================================

type ReadonlyUser = Readonly<User>;

const user: ReadonlyUser = {
  id: 1,
  name: "John",
  email: "john@example.com",
  password: "secret",
  createdAt: new Date(),
};

// user.name = "Jane"; // ❌ Error: Cannot assign to 'name'

// ============================================
// RECORD - Create object type with specific keys
// ============================================

type Role = "admin" | "user" | "guest";

type RolePermissions = Record<Role, string[]>;

const permissions: RolePermissions = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"],
};

// ============================================
// EXCLUDE & EXTRACT
// ============================================

type AllStatus = "pending" | "approved" | "rejected" | "cancelled";

// Remove specific types from union
type ActiveStatus = Exclude<AllStatus, "cancelled">;
// "pending" | "approved" | "rejected"

// Keep only matching types
type FinalStatus = Extract<AllStatus, "approved" | "rejected">;
// "approved" | "rejected"
```

---

## 1.4 Enums

```typescript
// ============================================
// NUMERIC ENUMS
// ============================================

enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

let move: Direction = Direction.Up;
console.log(move); // 0

// Custom values
enum StatusCode {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  ServerError = 500,
}

// ============================================
// STRING ENUMS (recommended)
// ============================================

enum TaskStatus {
  Pending = "pending",
  InProgress = "in-progress",
  Completed = "completed",
  Cancelled = "cancelled",
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

const task: Task = {
  id: "1",
  title: "Learn TypeScript",
  status: TaskStatus.Pending,
};

// Check status
if (task.status === TaskStatus.Pending) {
  console.log("Task is pending");
}

// ============================================
// CONST ENUMS (more efficient)
// ============================================

const enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// Gets inlined at compile time (no runtime object)
const method = HttpMethod.GET; // Compiles to: const method = "GET"
```

---

# 🟡 SECTION 2: Express.js Fundamentals

---

## 2.1 Express Basics

```typescript
import express, { Application, Request, Response, NextFunction } from "express";

// Create Express app
const app: Application = express();

// ============================================
// MIDDLEWARE
// ============================================

// Built-in middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Custom middleware (runs for every request)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next(); // Pass to next middleware/route
});

// ============================================
// ROUTES
// ============================================

// GET request
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

// POST request
app.post("/data", (req: Request, res: Response) => {
  const body = req.body;
  res.status(201).json({ received: body });
});

// Route with parameters
app.get("/users/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  res.json({ userId });
});

// Query parameters
app.get("/search", (req: Request, res: Response) => {
  const { q, page, limit } = req.query;
  res.json({ query: q, page, limit });
});

// ============================================
// START SERVER
// ============================================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## 2.2 Request and Response Objects

```typescript
import { Request, Response } from "express";

// ============================================
// REQUEST OBJECT
// ============================================

function handleRequest(req: Request, res: Response): void {
  // URL Parameters (from route like /users/:id)
  const id = req.params.id;

  // Query Parameters (from URL like ?page=1&limit=10)
  const page = req.query.page;
  const limit = req.query.limit;

  // Request Body (from POST/PUT requests)
  const body = req.body;

  // Headers
  const authHeader = req.headers.authorization;
  const contentType = req.headers["content-type"];

  // HTTP Method
  const method = req.method; // GET, POST, PUT, DELETE

  // Full URL
  const fullUrl = req.originalUrl;

  // Client IP
  const ip = req.ip;

  res.json({ message: "Processed" });
}

// ============================================
// RESPONSE OBJECT
// ============================================

function handleResponse(req: Request, res: Response): void {
  // Set status code
  res.status(200);
  res.status(201); // Created
  res.status(400); // Bad Request
  res.status(404); // Not Found
  res.status(500); // Server Error

  // Send JSON (most common for APIs)
  res.json({ success: true, data: [] });

  // Send text
  res.send("Hello World");

  // Send with status (chained)
  res.status(201).json({ id: 1, message: "Created" });

  // Set headers
  res.setHeader("X-Custom-Header", "value");

  // Redirect
  res.redirect("/new-url");
  res.redirect(301, "/permanent-redirect");
}

// ============================================
// TYPED REQUEST BODY
// ============================================

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}

// Generic Request type: Request<Params, ResBody, ReqBody, Query>
function createUser(
  req: Request<{}, {}, CreateUserBody>,
  res: Response
): void {
  const { name, email, password } = req.body;
  // TypeScript knows these are strings!
  res.status(201).json({ name, email });
}

// Typed params
interface UserParams {
  id: string;
}

function getUser(req: Request<UserParams>, res: Response): void {
  const { id } = req.params; // TypeScript knows id is string
  res.json({ id });
}
```

---

## 2.3 Routers and Route Organization

```typescript
// ============================================
// FILE: routes/userRoutes.ts
// ============================================

import { Router, Request, Response } from "express";

const router = Router();

// GET /users
router.get("/", (req: Request, res: Response) => {
  res.json({ users: [] });
});

// GET /users/:id
router.get("/:id", (req: Request, res: Response) => {
  res.json({ user: { id: req.params.id } });
});

// POST /users
router.post("/", (req: Request, res: Response) => {
  res.status(201).json({ user: req.body });
});

// PUT /users/:id
router.put("/:id", (req: Request, res: Response) => {
  res.json({ updated: true });
});

// DELETE /users/:id
router.delete("/:id", (req: Request, res: Response) => {
  res.json({ deleted: true });
});

export default router;

// ============================================
// FILE: app.ts
// ============================================

import express from "express";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";

const app = express();

app.use(express.json());

// Mount routers
app.use("/api/users", userRoutes); // All routes prefixed with /api/users
app.use("/api/products", productRoutes);

// Result:
// GET /api/users       → userRoutes "/"
// GET /api/users/123   → userRoutes "/:id"
// POST /api/users      → userRoutes "/"
```

---

## 2.4 Middleware Patterns

```typescript
import { Request, Response, NextFunction } from "express";

// ============================================
// LOGGING MIDDLEWARE
// ============================================

const logger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} [${duration}ms]`);
  });

  next();
};

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// Custom error class
class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error handler (must have 4 parameters!)
const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  console.error(`Error: ${message}`);

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

interface ValidateOptions {
  body?: string[];
  params?: string[];
  query?: string[];
}

const validate =
  (options: ValidateOptions) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Check required body fields
    if (options.body) {
      for (const field of options.body) {
        if (!req.body[field]) {
          errors.push(`${field} is required`);
        }
      }
    }

    // Check required params
    if (options.params) {
      for (const field of options.params) {
        if (!req.params[field]) {
          errors.push(`${field} parameter is required`);
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        errors,
      });
      return;
    }

    next();
  };

// Usage:
// router.post('/', validate({ body: ['name', 'email'] }), createUser);

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: "No token provided",
    });
    return;
  }

  // Verify token (simplified example)
  try {
    // In real app: jwt.verify(token, secret)
    const decoded = { userId: "123" }; // Mock decoded token

    // Attach user to request
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
};

// ============================================
// USING MIDDLEWARE
// ============================================

import express from "express";

const app = express();

// Global middleware (applies to all routes)
app.use(logger);
app.use(express.json());

// Route-specific middleware
app.get("/public", (req, res) => {
  res.json({ message: "Public route" });
});

app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Protected route", user: (req as any).user });
});

// Error handler (must be last!)
app.use(errorHandler);
```

---

## 2.5 Environment Variables

```typescript
// ============================================
// FILE: .env
// ============================================
/*
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://localhost:5432/mydb
API_KEY=your-secret-key
*/

// ============================================
// FILE: config/env.ts
// ============================================

import dotenv from "dotenv";

// Load .env file
dotenv.config();

// Create typed config object
interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  apiKey: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value || "";
}

export const config: Config = {
  port: parseInt(getEnvVar("PORT", false) || "3000", 10),
  nodeEnv: getEnvVar("NODE_ENV", false) || "development",
  databaseUrl: getEnvVar("DATABASE_URL"),
  apiKey: getEnvVar("API_KEY"),
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};

// ============================================
// FILE: app.ts
// ============================================

import { config } from "./config/env";

console.log(`Starting server on port ${config.port}`);
console.log(`Environment: ${config.nodeEnv}`);

if (config.isDevelopment) {
  console.log("Running in development mode");
}
```

---

# 🟡 SECTION 3: Working with Databases

---

## 3.1 Database Service Pattern

```typescript
// ============================================
// SERVICE LAYER PATTERN
// ============================================

// Interface for the data
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface CreateUserDTO {
  name: string;
  email: string;
}

interface UpdateUserDTO {
  name?: string;
  email?: string;
}

// ============================================
// FILE: services/userService.ts
// ============================================

// Import your database client (Supabase, Prisma, etc.)
import { db } from "../config/database";

class UserService {
  /**
   * Get all users
   */
  async findAll(): Promise<User[]> {
    const { data, error } = await db.from("users").select("*");

    if (error) throw error;
    return data;
  }

  /**
   * Get user by ID
   */
  async findById(id: string): Promise<User | null> {
    const { data, error } = await db
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create new user
   */
  async create(userData: CreateUserDTO): Promise<User> {
    const { data, error } = await db
      .from("users")
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update user
   */
  async update(id: string, updates: UpdateUserDTO): Promise<User> {
    const { data, error } = await db
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    const { error } = await db.from("users").delete().eq("id", id);

    if (error) throw error;
  }
}

// Export singleton instance
export const userService = new UserService();
```

---

## 3.2 Controller Pattern

```typescript
// ============================================
// FILE: controllers/userController.ts
// ============================================

import { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userService.findAll();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.create(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.update(id, req.body);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await userService.delete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
```

---

# 🎯 PRACTICE EXERCISES - INTERMEDIATE

## Exercise 1: Generic Repository

```typescript
// TODO: Create a generic Repository class that works with any entity type
// It should have methods: findAll, findById, create, update, delete
// Use generics so it can work with User, Product, Order, etc.

// Your code here:
```

## Exercise 2: Validation Middleware

```typescript
// TODO: Create a validation middleware that:
// 1. Accepts a Zod schema or custom validation rules
// 2. Validates request body
// 3. Returns detailed error messages

// Your code here:
```

## Exercise 3: Rate Limiting

```typescript
// TODO: Create a rate limiting middleware that:
// 1. Tracks requests per IP address
// 2. Limits to X requests per minute
// 3. Returns 429 status when exceeded

// Your code here:
```

---

# ✅ Intermediate Checklist

- [ ] Understand and use generics effectively
- [ ] Use type guards for type narrowing
- [ ] Apply utility types (Partial, Pick, Omit, etc.)
- [ ] Create Express routes with proper typing
- [ ] Build reusable middleware
- [ ] Organize code with controllers and services
- [ ] Handle errors consistently
- [ ] Use environment variables securely

---

**Next:** Move to `NODEJS_TYPESCRIPT_ADVANCED.md` for production-level concepts!
