# 📚 Node.js & TypeScript - Advanced Concepts

## 🎯 Production-Ready Development

**Prerequisites:** Complete BASICS and INTERMEDIATE guides
**Time to Complete:** 4-5 hours

---

# 🔴 SECTION 1: Advanced TypeScript Patterns

---

## 1.1 Mapped Types

```typescript
// ============================================
// CREATING MAPPED TYPES
// ============================================

// Original interface
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Make all properties optional
type Optional<T> = {
  [K in keyof T]?: T[K];
};

type OptionalUser = Optional<User>;
// { id?: number; name?: string; email?: string; age?: number }

// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableUser = Nullable<User>;
// { id: number | null; name: string | null; ... }

// Make all properties readonly
type Immutable<T> = {
  readonly [K in keyof T]: T[K];
};

// ============================================
// CONDITIONAL MAPPED TYPES
// ============================================

// Make only string properties optional
type OptionalStrings<T> = {
  [K in keyof T]: T[K] extends string ? T[K] | undefined : T[K];
};

// Get only properties of a specific type
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type UserStringKeys = StringKeys<User>; // "name" | "email"

// ============================================
// TEMPLATE LITERAL TYPES
// ============================================

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = "/users" | "/products" | "/orders";

// Combine to create all possible routes
type APIRoute = `${HTTPMethod} ${Endpoint}`;
// "GET /users" | "GET /products" | "GET /orders" | "POST /users" | ...

// Event handler types
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

// ============================================
// RECURSIVE TYPES
// ============================================

// Deep readonly (works on nested objects)
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface Config {
  api: {
    url: string;
    timeout: number;
  };
  features: {
    darkMode: boolean;
  };
}

type ImmutableConfig = DeepReadonly<Config>;
// All nested properties are readonly

// JSON type (recursive)
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };
```

---

## 1.2 Declaration Merging and Module Augmentation

```typescript
// ============================================
// EXTENDING EXPRESS TYPES
// ============================================

// Extend Request to include custom properties
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      requestId?: string;
      startTime?: number;
    }
  }
}

// Now TypeScript knows about req.user, req.requestId, etc.
import { Request, Response } from "express";

function handler(req: Request, res: Response) {
  // No TypeScript errors!
  const userId = req.user?.id;
  const requestId = req.requestId;
}

// ============================================
// EXTENDING EXISTING INTERFACES
// ============================================

// Original interface (from a library)
interface Window {
  // browser's Window interface
}

// Add custom properties
interface Window {
  myCustomProperty: string;
  myCustomMethod(): void;
}

// ============================================
// MODULE AUGMENTATION
// ============================================

// Extend a third-party module
declare module "express-serve-static-core" {
  interface Request {
    customField: string;
  }
}

// Extend Node's process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }
}

// Now process.env is typed!
const port = process.env.PORT; // TypeScript knows it's string
```

---

## 1.3 Decorators (Experimental)

```typescript
// Enable in tsconfig.json: "experimentalDecorators": true

// ============================================
// CLASS DECORATOR
// ============================================

function Controller(path: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      basePath = path;
    };
  };
}

@Controller("/api/users")
class UserController {
  // basePath will be "/api/users"
}

// ============================================
// METHOD DECORATOR
// ============================================

function LogExecution(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    console.log(`Executing ${propertyKey} with args:`, args);
    const start = Date.now();

    const result = await originalMethod.apply(this, args);

    console.log(`${propertyKey} completed in ${Date.now() - start}ms`);
    return result;
  };

  return descriptor;
}

class UserService {
  @LogExecution
  async findUser(id: string) {
    // Method execution will be logged
    return { id, name: "John" };
  }
}

// ============================================
// PROPERTY DECORATOR
// ============================================

function Required(target: any, propertyKey: string) {
  let value: any;

  const getter = () => value;
  const setter = (newVal: any) => {
    if (newVal === undefined || newVal === null) {
      throw new Error(`${propertyKey} is required`);
    }
    value = newVal;
  };

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
  });
}

class User {
  @Required
  name!: string;

  email!: string;
}

// ============================================
// PARAMETER DECORATOR
// ============================================

function Validate(
  target: any,
  propertyKey: string,
  parameterIndex: number
) {
  // Store metadata about which parameters need validation
  const existingParams: number[] =
    Reflect.getMetadata("validate_params", target, propertyKey) || [];
  existingParams.push(parameterIndex);
  Reflect.defineMetadata("validate_params", existingParams, target, propertyKey);
}

class OrderService {
  createOrder(@Validate orderId: string, @Validate userId: string) {
    // Parameters marked for validation
  }
}
```

---

## 1.4 Discriminated Unions and Exhaustive Checks

```typescript
// ============================================
// DISCRIMINATED UNIONS
// ============================================

// Each type has a unique "type" property (discriminant)
interface SuccessResponse {
  type: "success";
  data: any;
  statusCode: number;
}

interface ErrorResponse {
  type: "error";
  error: string;
  statusCode: number;
}

interface LoadingResponse {
  type: "loading";
}

type ApiResponse = SuccessResponse | ErrorResponse | LoadingResponse;

function handleResponse(response: ApiResponse): string {
  switch (response.type) {
    case "success":
      // TypeScript knows response is SuccessResponse
      return `Data: ${JSON.stringify(response.data)}`;

    case "error":
      // TypeScript knows response is ErrorResponse
      return `Error: ${response.error}`;

    case "loading":
      // TypeScript knows response is LoadingResponse
      return "Loading...";
  }
}

// ============================================
// EXHAUSTIVE CHECKS
// ============================================

// Ensure all cases are handled
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      // If you add a new shape and forget to handle it,
      // TypeScript will error here
      return assertNever(shape);
  }
}

// ============================================
// REAL-WORLD EXAMPLE: Action Handlers
// ============================================

type Action =
  | { type: "CREATE_USER"; payload: { name: string; email: string } }
  | { type: "UPDATE_USER"; payload: { id: string; updates: Partial<User> } }
  | { type: "DELETE_USER"; payload: { id: string } }
  | { type: "FETCH_USERS"; payload: null };

function reducer(state: User[], action: Action): User[] {
  switch (action.type) {
    case "CREATE_USER":
      // TypeScript knows payload has name and email
      return [...state, { ...action.payload, id: "new-id" }];

    case "UPDATE_USER":
      // TypeScript knows payload has id and updates
      return state.map((user) =>
        user.id === action.payload.id
          ? { ...user, ...action.payload.updates }
          : user
      );

    case "DELETE_USER":
      return state.filter((user) => user.id !== action.payload.id);

    case "FETCH_USERS":
      return state;

    default:
      return assertNever(action);
  }
}
```

---

# 🔴 SECTION 2: Advanced Node.js Patterns

---

## 2.1 Dependency Injection

```typescript
// ============================================
// WITHOUT DEPENDENCY INJECTION (tightly coupled)
// ============================================

// ❌ Bad: UserController directly creates UserService
class BadUserController {
  private userService = new UserService(); // Tightly coupled!

  async getUser(id: string) {
    return this.userService.findById(id);
  }
}

// ============================================
// WITH DEPENDENCY INJECTION (loosely coupled)
// ============================================

// Define interface for the service
interface IUserService {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(data: CreateUserDTO): Promise<User>;
}

// Implement the interface
class UserService implements IUserService {
  async findById(id: string): Promise<User | null> {
    // Real database call
    return null;
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async create(data: CreateUserDTO): Promise<User> {
    return {} as User;
  }
}

// Controller receives service via constructor
class UserController {
  constructor(private userService: IUserService) {}

  async getUser(id: string) {
    return this.userService.findById(id);
  }
}

// Inject dependency when creating controller
const userService = new UserService();
const userController = new UserController(userService);

// ============================================
// BENEFITS: Easy to test with mock
// ============================================

class MockUserService implements IUserService {
  async findById(id: string): Promise<User | null> {
    return { id, name: "Mock User", email: "mock@test.com" };
  }

  async findAll(): Promise<User[]> {
    return [{ id: "1", name: "Mock", email: "mock@test.com" }];
  }

  async create(data: CreateUserDTO): Promise<User> {
    return { id: "new", ...data };
  }
}

// In tests, inject mock service
const mockService = new MockUserService();
const testController = new UserController(mockService);

// ============================================
// SIMPLE DI CONTAINER
// ============================================

class Container {
  private services = new Map<string, any>();

  register<T>(name: string, instance: T): void {
    this.services.set(name, instance);
  }

  resolve<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service as T;
  }
}

// Usage
const container = new Container();

// Register services
container.register("userService", new UserService());
container.register(
  "userController",
  new UserController(container.resolve<IUserService>("userService"))
);

// Resolve when needed
const controller = container.resolve<UserController>("userController");
```

---

## 2.2 Repository Pattern

```typescript
// ============================================
// GENERIC REPOSITORY INTERFACE
// ============================================

interface IRepository<T, CreateDTO, UpdateDTO> {
  findAll(options?: FindOptions): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findOne(criteria: Partial<T>): Promise<T | null>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<boolean>;
  count(criteria?: Partial<T>): Promise<number>;
}

interface FindOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

// ============================================
// BASE REPOSITORY IMPLEMENTATION
// ============================================

abstract class BaseRepository<T, CreateDTO, UpdateDTO>
  implements IRepository<T, CreateDTO, UpdateDTO>
{
  constructor(
    protected db: any, // Your database client
    protected tableName: string
  ) {}

  async findAll(options: FindOptions = {}): Promise<T[]> {
    let query = this.db.from(this.tableName).select("*");

    if (options.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.order === "asc",
      });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.db
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  async findOne(criteria: Partial<T>): Promise<T | null> {
    let query = this.db.from(this.tableName).select("*");

    for (const [key, value] of Object.entries(criteria)) {
      query = query.eq(key, value);
    }

    const { data, error } = await query.single();
    if (error) return null;
    return data;
  }

  async create(data: CreateDTO): Promise<T> {
    const { data: created, error } = await this.db
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created;
  }

  async update(id: string, data: UpdateDTO): Promise<T> {
    const { data: updated, error } = await this.db
      .from(this.tableName)
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.db.from(this.tableName).delete().eq("id", id);

    return !error;
  }

  async count(criteria?: Partial<T>): Promise<number> {
    let query = this.db
      .from(this.tableName)
      .select("*", { count: "exact", head: true });

    if (criteria) {
      for (const [key, value] of Object.entries(criteria)) {
        query = query.eq(key, value);
      }
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }
}

// ============================================
// SPECIFIC REPOSITORY WITH CUSTOM METHODS
// ============================================

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface CreateUserDTO {
  name: string;
  email: string;
  role?: string;
}

interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: string;
}

class UserRepository extends BaseRepository<User, CreateUserDTO, UpdateUserDTO> {
  constructor(db: any) {
    super(db, "users");
  }

  // Custom methods specific to User
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email } as Partial<User>);
  }

  async findByRole(role: string): Promise<User[]> {
    const { data, error } = await this.db
      .from(this.tableName)
      .select("*")
      .eq("role", role);

    if (error) throw error;
    return data;
  }

  async countByRole(role: string): Promise<number> {
    return this.count({ role } as Partial<User>);
  }
}

// Usage
const userRepo = new UserRepository(db);
const admins = await userRepo.findByRole("admin");
const user = await userRepo.findByEmail("john@example.com");
```

---

## 2.3 Error Handling Strategies

```typescript
// ============================================
// CUSTOM ERROR CLASSES
// ============================================

class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;

  constructor(
    message: string,
    statusCode: number,
    code: string = "INTERNAL_ERROR"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with id '${id}' not found`
      : `${resource} not found`;
    super(message, 404, "NOT_FOUND");
  }
}

class ValidationError extends AppError {
  public readonly errors: string[];

  constructor(errors: string[]) {
    super("Validation failed", 400, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

class ForbiddenError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, 403, "FORBIDDEN");
  }
}

class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

// ============================================
// RESULT TYPE PATTERN (Alternative to throwing)
// ============================================

type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Helper functions
function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// Usage
async function findUser(id: string): Promise<Result<User, AppError>> {
  const user = await userRepo.findById(id);

  if (!user) {
    return err(new NotFoundError("User", id));
  }

  return ok(user);
}

// Handling result
const result = await findUser("123");

if (result.success) {
  console.log("User found:", result.data);
} else {
  console.log("Error:", result.error.message);
}

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

import { Request, Response, NextFunction } from "express";

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };
}

function globalErrorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error
  console.error(`[Error] ${req.method} ${req.path}:`, {
    message: err.message,
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Determine status code and message
  let statusCode = 500;
  let code = "INTERNAL_ERROR";
  let message = "An unexpected error occurred";
  let details: any = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;

    if (err instanceof ValidationError) {
      details = err.errors;
    }
  }

  // Build response
  const response: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

// ============================================
// ASYNC WRAPPER
// ============================================

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

function asyncHandler(fn: AsyncHandler): AsyncHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await userService.findById(req.params.id);

    if (!user) {
      throw new NotFoundError("User", req.params.id);
    }

    res.json({ success: true, data: user });
  })
);
```

---

## 2.4 Caching Strategies

```typescript
// ============================================
// SIMPLE IN-MEMORY CACHE
// ============================================

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL: number;

  constructor(defaultTTLSeconds: number = 300) {
    this.defaultTTL = defaultTTLSeconds * 1000;

    // Clean up expired entries periodically
    setInterval(() => this.cleanup(), 60000);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds?: number): void {
    const ttl = (ttlSeconds ?? this.defaultTTL / 1000) * 1000;

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// ============================================
// CACHE-ASIDE PATTERN
// ============================================

const cache = new MemoryCache(300); // 5 min TTL

async function getUserWithCache(id: string): Promise<User | null> {
  const cacheKey = `user:${id}`;

  // Try cache first
  const cached = cache.get<User>(cacheKey);
  if (cached) {
    console.log("Cache HIT");
    return cached;
  }

  console.log("Cache MISS");

  // Fetch from database
  const user = await userRepo.findById(id);

  // Store in cache if found
  if (user) {
    cache.set(cacheKey, user);
  }

  return user;
}

// ============================================
// CACHE DECORATOR
// ============================================

function Cacheable(ttlSeconds: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;

      const cached = cache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(cacheKey, result, ttlSeconds);

      return result;
    };

    return descriptor;
  };
}

// Usage
class ProductService {
  @Cacheable(600) // Cache for 10 minutes
  async findById(id: string): Promise<Product | null> {
    return productRepo.findById(id);
  }

  @Cacheable(300) // Cache for 5 minutes
  async findPopular(): Promise<Product[]> {
    return productRepo.findPopular();
  }
}

// ============================================
// CACHE INVALIDATION
// ============================================

class CachedUserService {
  private cachePrefix = "user:";

  async findById(id: string): Promise<User | null> {
    const key = `${this.cachePrefix}${id}`;

    const cached = cache.get<User>(key);
    if (cached) return cached;

    const user = await userRepo.findById(id);
    if (user) cache.set(key, user);

    return user;
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const user = await userRepo.update(id, data);

    // Invalidate cache after update
    cache.delete(`${this.cachePrefix}${id}`);

    return user;
  }

  async delete(id: string): Promise<void> {
    await userRepo.delete(id);

    // Invalidate cache after delete
    cache.delete(`${this.cachePrefix}${id}`);
  }
}
```

---

## 2.5 Rate Limiting

```typescript
// ============================================
// TOKEN BUCKET RATE LIMITER
// ============================================

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private maxTokens: number;
  private refillRate: number; // tokens per second

  constructor(maxTokens: number, refillRate: number) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    let entry = this.limits.get(key);

    if (!entry) {
      entry = { tokens: this.maxTokens, lastRefill: now };
      this.limits.set(key, entry);
    }

    // Refill tokens based on time passed
    const timePassed = (now - entry.lastRefill) / 1000;
    const newTokens = Math.min(
      this.maxTokens,
      entry.tokens + timePassed * this.refillRate
    );

    entry.tokens = newTokens;
    entry.lastRefill = now;

    // Check if request is allowed
    if (entry.tokens >= 1) {
      entry.tokens -= 1;
      return true;
    }

    return false;
  }

  getRemainingTokens(key: string): number {
    const entry = this.limits.get(key);
    return entry ? Math.floor(entry.tokens) : this.maxTokens;
  }
}

// ============================================
// RATE LIMIT MIDDLEWARE
// ============================================

import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
  keyGenerator?: (req: Request) => string;
}

function rateLimitMiddleware(options: RateLimitOptions) {
  const {
    windowMs,
    maxRequests,
    message = "Too many requests, please try again later",
    keyGenerator = (req) => req.ip || "unknown",
  } = options;

  const requests = new Map<string, { count: number; resetTime: number }>();

  // Cleanup expired entries
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of requests.entries()) {
      if (now > data.resetTime) {
        requests.delete(key);
      }
    }
  }, windowMs);

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator(req);
    const now = Date.now();

    let data = requests.get(key);

    if (!data || now > data.resetTime) {
      data = { count: 0, resetTime: now + windowMs };
      requests.set(key, data);
    }

    data.count++;

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - data.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(data.resetTime / 1000));

    if (data.count > maxRequests) {
      res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message,
          retryAfter: Math.ceil((data.resetTime - now) / 1000),
        },
      });
      return;
    }

    next();
  };
}

// Usage
const app = express();

// Global rate limit
app.use(
  rateLimitMiddleware({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  })
);

// Stricter limit for auth routes
app.use(
  "/api/auth",
  rateLimitMiddleware({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: "Too many login attempts, please try again later",
  })
);
```

---

# 🔴 SECTION 3: Testing

---

## 3.1 Unit Testing with Jest

```typescript
// ============================================
// INSTALL JEST
// ============================================
// npm install -D jest @types/jest ts-jest

// ============================================
// FILE: jest.config.js
// ============================================
/*
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts'],
};
*/

// ============================================
// TESTING A SERVICE
// ============================================

// FILE: services/calculator.ts
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error("Cannot divide by zero");
    }
    return a / b;
  }
}

// FILE: services/calculator.test.ts
import { Calculator } from "./calculator";

describe("Calculator", () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe("add", () => {
    it("should add two positive numbers", () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    it("should add negative numbers", () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });

    it("should add zero", () => {
      expect(calculator.add(5, 0)).toBe(5);
    });
  });

  describe("divide", () => {
    it("should divide two numbers", () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });

    it("should throw error when dividing by zero", () => {
      expect(() => calculator.divide(10, 0)).toThrow("Cannot divide by zero");
    });
  });
});

// ============================================
// MOCKING DEPENDENCIES
// ============================================

// FILE: services/userService.test.ts
import { UserService } from "./userService";
import { UserRepository } from "../repositories/userRepository";

// Mock the repository
jest.mock("../repositories/userRepository");

describe("UserService", () => {
  let userService: UserService;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // Create mock instance
    mockRepo = new UserRepository(null) as jest.Mocked<UserRepository>;
    userService = new UserService(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should return user when found", async () => {
      const mockUser = { id: "1", name: "John", email: "john@test.com" };

      mockRepo.findById.mockResolvedValue(mockUser);

      const result = await userService.findById("1");

      expect(result).toEqual(mockUser);
      expect(mockRepo.findById).toHaveBeenCalledWith("1");
      expect(mockRepo.findById).toHaveBeenCalledTimes(1);
    });

    it("should return null when user not found", async () => {
      mockRepo.findById.mockResolvedValue(null);

      const result = await userService.findById("999");

      expect(result).toBeNull();
    });

    it("should throw error when repository fails", async () => {
      mockRepo.findById.mockRejectedValue(new Error("Database error"));

      await expect(userService.findById("1")).rejects.toThrow("Database error");
    });
  });
});

// ============================================
// TESTING ASYNC CODE
// ============================================

describe("Async Tests", () => {
  it("should handle promises with async/await", async () => {
    const result = await fetchData();
    expect(result).toBeDefined();
  });

  it("should handle promises with resolves", () => {
    return expect(fetchData()).resolves.toBeDefined();
  });

  it("should handle rejected promises", () => {
    return expect(fetchBadData()).rejects.toThrow("Error");
  });
});
```

---

## 3.2 Integration Testing

```typescript
// ============================================
// TESTING EXPRESS ROUTES
// ============================================

// npm install -D supertest @types/supertest

import request from "supertest";
import express from "express";
import { userRouter } from "../routes/userRoutes";

describe("User Routes", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/users", userRouter);
  });

  describe("GET /api/users", () => {
    it("should return all users", async () => {
      const response = await request(app)
        .get("/api/users")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return user by id", async () => {
      const response = await request(app).get("/api/users/1").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe("1");
    });

    it("should return 404 for non-existent user", async () => {
      const response = await request(app).get("/api/users/999").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const newUser = {
        name: "Test User",
        email: "test@example.com",
      };

      const response = await request(app)
        .post("/api/users")
        .send(newUser)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newUser.name);
      expect(response.body.data.email).toBe(newUser.email);
    });

    it("should return 400 for invalid data", async () => {
      const response = await request(app)
        .post("/api/users")
        .send({ name: "" }) // Missing required fields
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("Protected Routes", () => {
    it("should require authentication", async () => {
      const response = await request(app).delete("/api/users/1").expect(401);

      expect(response.body.error.code).toBe("UNAUTHORIZED");
    });

    it("should allow access with valid token", async () => {
      const token = "valid-jwt-token"; // Get from test setup

      const response = await request(app)
        .delete("/api/users/1")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
```

---

# 🎯 PRACTICE EXERCISES - ADVANCED

## Exercise 1: Generic Event Emitter

```typescript
// TODO: Create a type-safe event emitter
// - Define event types with their payload types
// - on(event, handler) - subscribe to event
// - off(event, handler) - unsubscribe
// - emit(event, payload) - trigger event
// TypeScript should enforce correct payload types

// Your code here:
```

## Exercise 2: API Client with Retry

```typescript
// TODO: Create an HTTP client that:
// - Supports GET, POST, PUT, DELETE
// - Implements automatic retry with exponential backoff
// - Has request/response interceptors
// - Returns typed responses

// Your code here:
```

## Exercise 3: Database Migration System

```typescript
// TODO: Create a simple migration system
// - Track which migrations have run
// - Run migrations in order
// - Support rollback
// - Type-safe migration definitions

// Your code here:
```

---

# ✅ Advanced Checklist

- [ ] Create and use mapped types
- [ ] Extend existing types with declaration merging
- [ ] Implement discriminated unions with exhaustive checks
- [ ] Apply dependency injection pattern
- [ ] Build generic repository with TypeScript
- [ ] Create custom error classes and global error handler
- [ ] Implement caching strategies
- [ ] Add rate limiting to APIs
- [ ] Write unit tests with Jest
- [ ] Create integration tests for API routes

---

# 📚 Additional Resources

## Documentation

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## Tools

- **Zod** - Runtime type validation
- **Prisma** - Type-safe ORM
- **class-validator** - Decorator-based validation
- **tsyringe** - Dependency injection container
- **pino** - Fast JSON logger

## Books

- "Effective TypeScript" by Dan Vanderkam
- "Node.js Design Patterns" by Mario Casciaro

---

**Congratulations!** 🎉 You've completed the Node.js & TypeScript learning path!

Now apply these concepts to your Task Manager API project!
