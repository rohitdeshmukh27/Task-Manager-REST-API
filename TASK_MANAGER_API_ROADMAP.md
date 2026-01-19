# 🚀 Task Manager REST API - Complete Roadmap with Supabase

## 📋 Real-World Implementation Guide

Build a **production-ready Task Manager REST API** using:

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Supabase** - PostgreSQL database (cloud-hosted)
- **UUID** - Unique ID generation

**Time to Complete:** 3-4 hours

---

# 🎯 Why Supabase?

| Feature                | Benefit                                |
| ---------------------- | -------------------------------------- |
| **PostgreSQL**         | Industry-standard relational database  |
| **Free Tier**          | 500MB database, unlimited API requests |
| **Auto-generated API** | REST + GraphQL out of the box          |
| **Real-time**          | Live data subscriptions                |
| **Authentication**     | Built-in user management               |
| **Dashboard**          | Visual database management             |

---

# 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                          │
│                    (Postman / Thunder Client)                   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                          EXPRESS SERVER                         │
│                         (src/app.ts)                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      MIDDLEWARE                          │   │
│  │  • JSON Parser (express.json())                         │   │
│  │  • Request Logger                                       │   │
│  │  • CORS Headers                                         │   │
│  │  • Error Handler                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                           ROUTES                                │
│                    (src/routes/taskRoutes.ts)                   │
│                                                                 │
│  GET    /api/tasks          → Get all tasks                    │
│  GET    /api/tasks/:id      → Get task by ID                   │
│  POST   /api/tasks          → Create new task                  │
│  PUT    /api/tasks/:id      → Update task                      │
│  DELETE /api/tasks/:id      → Delete task                      │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         CONTROLLERS                             │
│                (src/controllers/taskController.ts)              │
│                                                                 │
│  • getAllTasks()    - Fetch from Supabase                      │
│  • getTaskById()    - Query by UUID                            │
│  • createTask()     - Insert into database                     │
│  • updateTask()     - Update row in database                   │
│  • deleteTask()     - Remove from database                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE SERVICE                           │
│                (src/services/supabaseService.ts)                │
│                                                                 │
│  • Supabase client initialization                              │
│  • Database query methods                                      │
│  • Type-safe CRUD operations                                   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ☁️ SUPABASE CLOUD                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   PostgreSQL Database                    │   │
│  │                                                         │   │
│  │   TABLE: tasks                                          │   │
│  │   ├── id (UUID, Primary Key)                            │   │
│  │   ├── title (VARCHAR)                                   │   │
│  │   ├── description (TEXT)                                │   │
│  │   ├── status (VARCHAR)                                  │   │
│  │   ├── priority (VARCHAR)                                │   │
│  │   ├── due_date (TIMESTAMP)                              │   │
│  │   ├── created_at (TIMESTAMP)                            │   │
│  │   └── updated_at (TIMESTAMP)                            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

# 📁 Project Structure

```
task-manager-api/
│
├── 📁 src/
│   │
│   ├── 📁 config/
│   │   └── supabase.ts            # Supabase client configuration
│   │
│   ├── 📁 interfaces/
│   │   └── task.interface.ts      # TypeScript type definitions
│   │
│   ├── 📁 services/
│   │   └── taskService.ts         # Database operations
│   │
│   ├── 📁 controllers/
│   │   └── taskController.ts      # Request handlers
│   │
│   ├── 📁 middleware/
│   │   ├── errorHandler.ts        # Global error handling
│   │   └── validateTask.ts        # Input validation
│   │
│   ├── 📁 routes/
│   │   └── taskRoutes.ts          # API endpoint definitions
│   │
│   └── app.ts                     # Main entry point
│
├── .env                           # Environment variables (NEVER commit!)
├── .env.example                   # Example environment file
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Project documentation
```

---

# 🛠️ STEP-BY-STEP IMPLEMENTATION

---

## PHASE 1: SUPABASE SETUP

---

### STEP 1: Create Supabase Account

1. Go to **https://supabase.com**
2. Click **Start your project** (free)
3. Sign up with GitHub or email
4. Create a new project:
   - **Project name:** `task-manager`
   - **Database password:** (save this somewhere safe!)
   - **Region:** Choose closest to you
5. Wait 2-3 minutes for project to be ready

---

### STEP 2: Get API Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGciOiJIUzI1...` (long string)

```
📝 Save these credentials:

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

---

### STEP 3: Create Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL and click **Run**:

```sql
-- =============================================
-- CREATE TASKS TABLE
-- =============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

-- =============================================
-- AUTO-UPDATE updated_at TRIGGER
-- =============================================

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

INSERT INTO tasks (title, description, status, priority, due_date) VALUES
    ('Learn TypeScript', 'Complete TypeScript fundamentals course', 'completed', 'high', NOW() + INTERVAL '7 days'),
    ('Build REST API', 'Create Task Manager API with Express and Supabase', 'in-progress', 'high', NOW() + INTERVAL '14 days'),
    ('Learn PostgreSQL', 'Study PostgreSQL basics and advanced queries', 'pending', 'medium', NOW() + INTERVAL '21 days'),
    ('Setup CI/CD', 'Configure GitHub Actions for deployment', 'pending', 'low', NOW() + INTERVAL '30 days'),
    ('Write Documentation', 'Create comprehensive API documentation', 'pending', 'medium', NOW() + INTERVAL '10 days');

-- Verify data
SELECT * FROM tasks;
```

4. You should see 5 sample tasks created!

---

### STEP 4: Enable Row Level Security (RLS) - Optional for now

```sql
-- For now, disable RLS to allow public access
-- (In production, you'd enable RLS with proper policies)
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
```

---

## PHASE 2: PROJECT SETUP

---

### STEP 5: Create Project Folder

```bash
# Navigate to your workspace
cd "c:\Users\Rohit\Documents\Unique Schools Internship\Mini Project"

# Create project folder
mkdir task-manager-api

# Enter the folder
cd task-manager-api
```

---

### STEP 6: Initialize npm Project

```bash
npm init -y
```

---

### STEP 7: Install Dependencies

```bash
# Production dependencies
npm install express @supabase/supabase-js dotenv uuid

# Development dependencies
npm install -D typescript ts-node-dev @types/express @types/node @types/uuid
```

### Package Explanation:

| Package                 | Purpose                              |
| ----------------------- | ------------------------------------ |
| `express`               | Web framework for Node.js            |
| `@supabase/supabase-js` | Supabase JavaScript client           |
| `dotenv`                | Load environment variables from .env |
| `uuid`                  | Generate unique IDs                  |
| `typescript`            | TypeScript compiler                  |
| `ts-node-dev`           | Run TypeScript with hot reload       |
| `@types/*`              | TypeScript type definitions          |

---

### STEP 8: Create package.json

📁 **File:** `package.json`

```json
{
  "name": "task-manager-api",
  "version": "1.0.0",
  "description": "A REST API for managing tasks with TypeScript, Express, and Supabase",
  "main": "dist/app.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js"
  },
  "keywords": ["typescript", "express", "rest-api", "supabase", "postgresql"],
  "author": "Rohit",
  "license": "ISC",
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/uuid": "^9.0.7",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.2"
  }
}
```

---

### STEP 9: Create tsconfig.json

📁 **File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

### STEP 10: Create Environment Files

📁 **File:** `.env.example` (Commit this to git)

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Server Configuration
PORT=3000
NODE_ENV=development
```

📁 **File:** `.env` (NEVER commit this!)

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server Configuration
PORT=3000
NODE_ENV=development
```

⚠️ **Replace the values with YOUR actual Supabase credentials from Step 2!**

---

### STEP 11: Create .gitignore

📁 **File:** `.gitignore`

```gitignore
# Dependencies
node_modules/

# Build output
dist/

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

---

### STEP 12: Create Folder Structure

```bash
# Create all folders
mkdir src
mkdir src\config
mkdir src\interfaces
mkdir src\services
mkdir src\controllers
mkdir src\middleware
mkdir src\routes
```

---

## PHASE 3: CORE IMPLEMENTATION

---

### STEP 13: Create Supabase Configuration

📁 **File:** `src/config/supabase.ts`

```typescript
// ============================================
// SUPABASE CLIENT CONFIGURATION
// ============================================

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get environment variables
const supabaseUrl: string = process.env.SUPABASE_URL || "";
const supabaseAnonKey: string = process.env.SUPABASE_ANON_KEY || "";

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables!");
  console.error("Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in .env");
  process.exit(1);
}

// Create Supabase client
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Export client
export default supabase;

// Log connection status (for debugging)
console.log("✅ Supabase client initialized");
console.log(`📍 Connected to: ${supabaseUrl}`);
```

### 💡 Key Concepts:

- **dotenv** = Loads `.env` file into `process.env`
- **createClient** = Supabase SDK function to create client
- **process.exit(1)** = Exit app if config is missing

---

### STEP 14: Create Task Interface

📁 **File:** `src/interfaces/task.interface.ts`

```typescript
// ============================================
// TASK INTERFACE - TypeScript Type Definitions
// ============================================

/**
 * Priority levels for tasks
 */
export type Priority = "low" | "medium" | "high";

/**
 * Status of a task
 */
export type TaskStatus = "pending" | "in-progress" | "completed";

/**
 * Main Task interface
 * Matches the database schema exactly
 */
export interface Task {
  id: string; // UUID from database
  title: string; // Task title (required)
  description: string | null; // Optional description
  status: TaskStatus; // Current status
  priority: Priority; // Priority level
  due_date: string | null; // ISO date string or null
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * DTO (Data Transfer Object) for creating a new task
 * Only includes fields that can be set by the user
 */
export interface CreateTaskDTO {
  title: string; // Required
  description?: string; // Optional
  priority?: Priority; // Optional (defaults to 'medium')
  due_date?: string; // Optional (ISO date string)
}

/**
 * DTO for updating an existing task
 * All fields are optional
 */
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  due_date?: string;
}

/**
 * Query parameters for filtering tasks
 */
export interface TaskQueryParams {
  status?: TaskStatus;
  priority?: Priority;
  search?: string;
  sort_by?: "created_at" | "updated_at" | "due_date" | "priority";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

/**
 * API Response wrapper for consistent responses
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  count?: number; // For paginated responses
}

/**
 * Database error type
 */
export interface DatabaseError {
  code: string;
  message: string;
  details?: string;
}
```

### 💡 Database vs Interface:

| Database Column | Interface Property | Note                          |
| --------------- | ------------------ | ----------------------------- |
| `due_date`      | `due_date`         | Match exactly!                |
| `created_at`    | `created_at`       | PostgreSQL returns ISO string |
| NULL values     | `string \| null`   | TypeScript union type         |

---

### STEP 15: Create Task Service

📁 **File:** `src/services/taskService.ts`

```typescript
// ============================================
// TASK SERVICE - Database Operations
// ============================================

import supabase from "../config/supabase";
import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskQueryParams,
} from "../interfaces/task.interface";

// Table name constant
const TABLE_NAME = "tasks";

/**
 * Get all tasks with optional filtering, sorting, and pagination
 */
export const getAllTasks = async (
  params: TaskQueryParams = {}
): Promise<{ data: Task[] | null; error: any; count: number | null }> => {
  // Start building query
  let query = supabase.from(TABLE_NAME).select("*", { count: "exact" }); // Get total count

  // Apply filters
  if (params.status) {
    query = query.eq("status", params.status);
  }

  if (params.priority) {
    query = query.eq("priority", params.priority);
  }

  if (params.search) {
    // Search in title and description (case-insensitive)
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%`
    );
  }

  // Apply sorting
  const sortColumn = params.sort_by || "created_at";
  const sortOrder = params.order === "asc" ? true : false;
  query = query.order(sortColumn, { ascending: sortOrder });

  // Apply pagination
  if (params.limit) {
    query = query.limit(params.limit);
  }

  if (params.offset) {
    query = query.range(
      params.offset,
      params.offset + (params.limit || 10) - 1
    );
  }

  const { data, error, count } = await query;

  return { data, error, count };
};

/**
 * Get single task by ID
 */
export const getTaskById = async (
  id: string
): Promise<{ data: Task | null; error: any }> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("id", id)
    .single(); // Expect exactly one row

  return { data, error };
};

/**
 * Create new task
 */
export const createTask = async (
  taskData: CreateTaskDTO
): Promise<{ data: Task | null; error: any }> => {
  // Prepare insert data
  const insertData = {
    title: taskData.title,
    description: taskData.description || null,
    priority: taskData.priority || "medium",
    due_date: taskData.due_date || null,
    status: "pending", // Default status
  };

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(insertData)
    .select() // Return the inserted row
    .single();

  return { data, error };
};

/**
 * Update existing task
 */
export const updateTask = async (
  id: string,
  updates: UpdateTaskDTO
): Promise<{ data: Task | null; error: any }> => {
  // Build update object (only include provided fields)
  const updateData: Partial<Task> = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined)
    updateData.description = updates.description;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.priority !== undefined) updateData.priority = updates.priority;
  if (updates.due_date !== undefined) updateData.due_date = updates.due_date;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};

/**
 * Delete task
 */
export const deleteTask = async (
  id: string
): Promise<{ data: Task | null; error: any }> => {
  // First get the task to return it
  const { data: existingTask } = await getTaskById(id);

  if (!existingTask) {
    return { data: null, error: { message: "Task not found" } };
  }

  const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

  if (error) {
    return { data: null, error };
  }

  return { data: existingTask, error: null };
};

/**
 * Get task statistics
 */
export const getTaskStats = async (): Promise<{
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
} | null> => {
  try {
    const { count: total } = await supabase
      .from(TABLE_NAME)
      .select("*", { count: "exact", head: true });

    const { count: pending } = await supabase
      .from(TABLE_NAME)
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: inProgress } = await supabase
      .from(TABLE_NAME)
      .select("*", { count: "exact", head: true })
      .eq("status", "in-progress");

    const { count: completed } = await supabase
      .from(TABLE_NAME)
      .select("*", { count: "exact", head: true })
      .eq("status", "completed");

    return {
      total: total || 0,
      pending: pending || 0,
      inProgress: inProgress || 0,
      completed: completed || 0,
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    return null;
  }
};
```

### 💡 Supabase Query Methods:

| Method                   | SQL Equivalent            | Purpose                 |
| ------------------------ | ------------------------- | ----------------------- |
| `.select('*')`           | `SELECT *`                | Get columns             |
| `.eq('col', val)`        | `WHERE col = val`         | Exact match             |
| `.ilike('col', '%val%')` | `WHERE col ILIKE '%val%'` | Case-insensitive search |
| `.or('...')`             | `WHERE ... OR ...`        | Multiple conditions     |
| `.order('col')`          | `ORDER BY col`            | Sort results            |
| `.limit(n)`              | `LIMIT n`                 | Limit rows              |
| `.range(a, b)`           | `OFFSET a LIMIT b-a+1`    | Pagination              |
| `.insert({})`            | `INSERT INTO`             | Add row                 |
| `.update({})`            | `UPDATE ... SET`          | Modify row              |
| `.delete()`              | `DELETE FROM`             | Remove row              |
| `.single()`              | -                         | Expect one row          |

---

### STEP 16: Create Task Controller

📁 **File:** `src/controllers/taskController.ts`

```typescript
// ============================================
// TASK CONTROLLER - Request Handlers
// ============================================

import { Request, Response, NextFunction } from "express";
import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskQueryParams,
  ApiResponse,
} from "../interfaces/task.interface";
import * as TaskService from "../services/taskService";

// ============================================
// GET ALL TASKS
// ============================================
/**
 * GET /api/tasks
 * Query params: ?status=completed&priority=high&search=keyword&sort_by=created_at&order=desc&limit=10&offset=0
 */
export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract query parameters
    const queryParams: TaskQueryParams = {
      status: req.query.status as any,
      priority: req.query.priority as any,
      search: req.query.search as string,
      sort_by: req.query.sort_by as any,
      order: req.query.order as any,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined,
    };

    const { data, error, count } = await TaskService.getAllTasks(queryParams);

    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Failed to fetch tasks",
        error: error.message,
      };
      res.status(500).json(response);
      return;
    }

    const response: ApiResponse<Task[]> = {
      success: true,
      message: `Found ${data?.length || 0} task(s)`,
      data: data || [],
      count: count || 0,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET TASK BY ID
// ============================================
/**
 * GET /api/tasks/:id
 */
export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await TaskService.getTaskById(id);

    if (error || !data) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Task not found",
        error: `No task found with ID: ${id}`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      success: true,
      message: "Task retrieved successfully",
      data,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ============================================
// CREATE NEW TASK
// ============================================
/**
 * POST /api/tasks
 * Body: { title, description?, priority?, due_date? }
 */
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const taskData: CreateTaskDTO = req.body;

    const { data, error } = await TaskService.createTask(taskData);

    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Failed to create task",
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      success: true,
      message: "Task created successfully",
      data: data!,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE TASK
// ============================================
/**
 * PUT /api/tasks/:id
 * Body: { title?, description?, status?, priority?, due_date? }
 */
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: UpdateTaskDTO = req.body;

    // Check if task exists first
    const { data: existingTask } = await TaskService.getTaskById(id);

    if (!existingTask) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Task not found",
        error: `No task found with ID: ${id}`,
      };
      res.status(404).json(response);
      return;
    }

    const { data, error } = await TaskService.updateTask(id, updates);

    if (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Failed to update task",
        error: error.message,
      };
      res.status(400).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      success: true,
      message: "Task updated successfully",
      data: data!,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ============================================
// DELETE TASK
// ============================================
/**
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await TaskService.deleteTask(id);

    if (error || !data) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Task not found",
        error: `No task found with ID: ${id}`,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      success: true,
      message: "Task deleted successfully",
      data,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET TASK STATISTICS
// ============================================
/**
 * GET /api/tasks/stats
 */
export const getTaskStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await TaskService.getTaskStats();

    if (!stats) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Failed to get statistics",
        error: "Could not retrieve task statistics",
      };
      res.status(500).json(response);
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task statistics retrieved",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
```

### 💡 Async/Await with Express:

- Controllers are now `async` functions
- Use `await` for database calls
- Always wrap in `try-catch`
- Return type is `Promise<void>`

---

### STEP 17: Create Validation Middleware

📁 **File:** `src/middleware/validateTask.ts`

```typescript
// ============================================
// VALIDATION MIDDLEWARE
// ============================================

import { Request, Response, NextFunction } from "express";
import {
  ApiResponse,
  Priority,
  TaskStatus,
} from "../interfaces/task.interface";

// Valid values for validation
const VALID_PRIORITIES: Priority[] = ["low", "medium", "high"];
const VALID_STATUSES: TaskStatus[] = ["pending", "in-progress", "completed"];

/**
 * Validate task creation request
 */
export const validateCreateTask = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, priority, due_date } = req.body;

  // Check if title exists and is not empty
  if (!title || typeof title !== "string" || title.trim() === "") {
    const response: ApiResponse<null> = {
      success: false,
      message: "Validation failed",
      error: "Title is required and must be a non-empty string",
    };
    res.status(400).json(response);
    return;
  }

  // Check title length
  if (title.length > 255) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Validation failed",
      error: "Title must be 255 characters or less",
    };
    res.status(400).json(response);
    return;
  }

  // Validate priority if provided
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Validation failed",
      error: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`,
    };
    res.status(400).json(response);
    return;
  }

  // Validate due_date format if provided
  if (due_date) {
    const date = new Date(due_date);
    if (isNaN(date.getTime())) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Validation failed",
        error: "Invalid date format for due_date. Use ISO format: YYYY-MM-DD",
      };
      res.status(400).json(response);
      return;
    }
  }

  // Validation passed
  next();
};

/**
 * Validate task update request
 */
export const validateUpdateTask = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, status, priority, due_date } = req.body;

  // Check if at least one field is provided
  if (Object.keys(req.body).length === 0) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Validation failed",
      error: "At least one field is required for update",
    };
    res.status(400).json(response);
    return;
  }

  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      const response: ApiResponse<null> = {
        success: false,
        message: "Validation failed",
        error: "Title must be a non-empty string",
      };
      res.status(400).json(response);
      return;
    }
    if (title.length > 255) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Validation failed",
        error: "Title must be 255 characters or less",
      };
      res.status(400).json(response);
      return;
    }
  }

  // Validate status if provided
  if (status && !VALID_STATUSES.includes(status)) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Validation failed",
      error: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
    };
    res.status(400).json(response);
    return;
  }

  // Validate priority if provided
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Validation failed",
      error: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`,
    };
    res.status(400).json(response);
    return;
  }

  // Validate due_date if provided
  if (due_date) {
    const date = new Date(due_date);
    if (isNaN(date.getTime())) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Validation failed",
        error: "Invalid date format for due_date",
      };
      res.status(400).json(response);
      return;
    }
  }

  next();
};

/**
 * Validate UUID format for task ID
 */
export const validateTaskId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  // UUID v4 regex pattern
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(id)) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Validation failed",
      error: "Invalid task ID format. Must be a valid UUID",
    };
    res.status(400).json(response);
    return;
  }

  next();
};

/**
 * Validate query parameters
 */
export const validateQueryParams = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { status, priority, limit, offset, order } = req.query;

  // Validate status if provided
  if (status && !VALID_STATUSES.includes(status as TaskStatus)) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Validation failed",
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
    };
    res.status(400).json(response);
    return;
  }

  // Validate priority if provided
  if (priority && !VALID_PRIORITIES.includes(priority as Priority)) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Validation failed",
      error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(", ")}`,
    };
    res.status(400).json(response);
    return;
  }

  // Validate limit
  if (
    limit &&
    (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)
  ) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Validation failed",
      error: "Limit must be a number between 1 and 100",
    };
    res.status(400).json(response);
    return;
  }

  // Validate offset
  if (offset && (isNaN(Number(offset)) || Number(offset) < 0)) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Validation failed",
      error: "Offset must be a non-negative number",
    };
    res.status(400).json(response);
    return;
  }

  // Validate order
  if (order && !["asc", "desc"].includes(order as string)) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Validation failed",
      error: 'Order must be either "asc" or "desc"',
    };
    res.status(400).json(response);
    return;
  }

  next();
};
```

---

### STEP 18: Create Error Handler Middleware

📁 **File:** `src/middleware/errorHandler.ts`

```typescript
// ============================================
// ERROR HANDLER MIDDLEWARE
// ============================================

import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../interfaces/task.interface";

/**
 * Custom error class with status code
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async handler wrapper
 * Eliminates try-catch boilerplate in controllers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error("❌ Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Determine status code
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  const response: ApiResponse<null> = {
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : "An error occurred",
    error:
      process.env.NODE_ENV === "development" ? message : "Something went wrong",
  };

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response: ApiResponse<null> = {
    success: false,
    message: "Route not found",
    error: `Cannot ${req.method} ${req.originalUrl}`,
  };

  res.status(404).json(response);
};
```

---

### STEP 19: Create Routes

📁 **File:** `src/routes/taskRoutes.ts`

```typescript
// ============================================
// TASK ROUTES - API Endpoint Definitions
// ============================================

import { Router } from "express";
import * as TaskController from "../controllers/taskController";
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
  validateQueryParams,
} from "../middleware/validateTask";

// Create router instance
const router = Router();

// ============================================
// ROUTE DEFINITIONS
// ============================================

/**
 * GET /api/tasks/stats
 * Get task statistics
 * NOTE: This must come before /:id route!
 */
router.get("/stats", TaskController.getTaskStats);

/**
 * GET /api/tasks
 * Get all tasks (with optional filtering)
 * Query: ?status=completed&priority=high&search=keyword&sort_by=created_at&order=desc&limit=10&offset=0
 */
router.get("/", validateQueryParams, TaskController.getAllTasks);

/**
 * GET /api/tasks/:id
 * Get single task by ID
 */
router.get("/:id", validateTaskId, TaskController.getTaskById);

/**
 * POST /api/tasks
 * Create new task
 * Body: { title, description?, priority?, due_date? }
 */
router.post("/", validateCreateTask, TaskController.createTask);

/**
 * PUT /api/tasks/:id
 * Update existing task
 * Body: { title?, description?, status?, priority?, due_date? }
 */
router.put(
  "/:id",
  validateTaskId,
  validateUpdateTask,
  TaskController.updateTask
);

/**
 * DELETE /api/tasks/:id
 * Delete task
 */
router.delete("/:id", validateTaskId, TaskController.deleteTask);

// Export router
export default router;
```

### ⚠️ Important Route Order:

- `/stats` MUST come before `/:id`
- Otherwise Express thinks "stats" is an ID!

---

### STEP 20: Create Main App Entry Point

📁 **File:** `src/app.ts`

```typescript
// ============================================
// EXPRESS APPLICATION - Main Entry Point
// ============================================

import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

// Load environment variables FIRST
dotenv.config();

// Create Express application
const app: Application = express();

// Port configuration
const PORT: number = parseInt(process.env.PORT || "3000", 10);
const NODE_ENV: string = process.env.NODE_ENV || "development";

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Parse JSON request bodies
app.use(express.json({ limit: "10kb" })); // Limit body size for security

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// CORS headers
app.use((req: Request, res: Response, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🚀 Task Manager API is running!",
    version: "1.0.0",
    environment: NODE_ENV,
    documentation: "/api",
  });
});

// API documentation
app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Task Manager API Documentation",
    version: "1.0.0",
    database: "Supabase (PostgreSQL)",
    endpoints: [
      { method: "GET", path: "/api/tasks", description: "Get all tasks" },
      {
        method: "GET",
        path: "/api/tasks/stats",
        description: "Get task statistics",
      },
      { method: "GET", path: "/api/tasks/:id", description: "Get task by ID" },
      { method: "POST", path: "/api/tasks", description: "Create new task" },
      { method: "PUT", path: "/api/tasks/:id", description: "Update task" },
      { method: "DELETE", path: "/api/tasks/:id", description: "Delete task" },
    ],
    queryParams: {
      status: "Filter by status (pending, in-progress, completed)",
      priority: "Filter by priority (low, medium, high)",
      search: "Search in title and description",
      sort_by: "Sort by field (created_at, updated_at, due_date, priority)",
      order: "Sort order (asc, desc)",
      limit: "Number of results (1-100)",
      offset: "Offset for pagination",
    },
  });
});

// Mount task routes
app.use("/api/tasks", taskRoutes);

// ============================================
// ERROR HANDLING
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log("");
  console.log("╔════════════════════════════════════════════╗");
  console.log("║  🚀 Task Manager API Server Started!       ║");
  console.log("╠════════════════════════════════════════════╣");
  console.log(`║  📍 URL: http://localhost:${PORT}             ║`);
  console.log(`║  📚 Docs: http://localhost:${PORT}/api          ║`);
  console.log(`║  🌍 Environment: ${NODE_ENV.padEnd(20)}  ║`);
  console.log("║  💾 Database: Supabase PostgreSQL          ║");
  console.log("╚════════════════════════════════════════════╝");
  console.log("");
});

export default app;
```

---

## PHASE 4: RUN AND TEST

---

### STEP 21: Start the Server

```bash
npm run dev
```

Expected output:

```
✅ Supabase client initialized
📍 Connected to: https://xxxxx.supabase.co

╔════════════════════════════════════════════╗
║  🚀 Task Manager API Server Started!       ║
╠════════════════════════════════════════════╣
║  📍 URL: http://localhost:3000             ║
║  📚 Docs: http://localhost:3000/api        ║
║  🌍 Environment: development               ║
║  💾 Database: Supabase PostgreSQL          ║
╚════════════════════════════════════════════╝
```

---

### STEP 22: Test All Endpoints

Use **Thunder Client** (VS Code extension) or **Postman**:

---

#### Test 1: Health Check - Works

```
GET http://localhost:3000/
```

---

#### Test 2: API Documentation - Works

```
GET http://localhost:3000/api
```

---

#### Test 3: Get All Tasks - Works

```
GET http://localhost:3000/api/tasks
```

---

#### Test 4: Get Task Statistics - Works

```
GET http://localhost:3000/api/tasks/stats
```

Expected Response:

```json
{
  "success": true,
  "message": "Task statistics retrieved",
  "data": {
    "total": 5,
    "pending": 3,
    "inProgress": 1,
    "completed": 1
  }
}
```

---

#### Test 5: Create New Task - Works

```
POST http://localhost:3000/api/tasks
Content-Type: application/json

{
    "title": "Learn Supabase",
    "description": "Study Supabase database and authentication",
    "priority": "high",
    "due_date": "2024-02-15"
}
```

---

#### Test 6: Get Task by ID - Works

```
GET http://localhost:3000/api/tasks/{uuid}
```

(Replace `{uuid}` with actual ID from create response)

---

#### Test 7: Update Task - Works

```
PUT http://localhost:3000/api/tasks/{uuid}
Content-Type: application/json

{
    "status": "completed",
    "priority": "high"
}
```

---

#### Test 8: Delete Task - Works

```
DELETE http://localhost:3000/api/tasks/{uuid}
```

---

#### Test 9: Filter by Status - Works

```
GET http://localhost:3000/api/tasks?status=pending
```

---

#### Test 10: Filter by Priority - Works

```
GET http://localhost:3000/api/tasks?priority=high
```

---

#### Test 11: Search Tasks - Works

```
GET http://localhost:3000/api/tasks?search=typescript
```

---

#### Test 12: Sort and Paginate - Works

```
GET http://localhost:3000/api/tasks?sort_by=created_at&order=desc&limit=5&offset=0
```

---

#### Test 13: Combined Filters - Works

```
GET http://localhost:3000/api/tasks?status=pending&priority=medium&sort_by=due_date&order=asc
```

---

#### Test 14: Validation Error (No Title) - Correctly Handles Error

```
POST http://localhost:3000/api/tasks
Content-Type: application/json

{
    "description": "Missing title field"
}
```

Expected: 400 Bad Request

---

#### Test 15: Invalid UUID - Correctly Handles Error

```
GET http://localhost:3000/api/tasks/invalid-uuid
```

Expected: 400 Bad Request

---

# 📊 Complete API Reference

| Method | Endpoint           | Query Params                                            | Body                                                | Description       |
| ------ | ------------------ | ------------------------------------------------------- | --------------------------------------------------- | ----------------- |
| GET    | `/`                | -                                                       | -                                                   | Health check      |
| GET    | `/api`             | -                                                       | -                                                   | API documentation |
| GET    | `/api/tasks`       | status, priority, search, sort_by, order, limit, offset | -                                                   | Get all tasks     |
| GET    | `/api/tasks/stats` | -                                                       | -                                                   | Get statistics    |
| GET    | `/api/tasks/:id`   | -                                                       | -                                                   | Get by ID         |
| POST   | `/api/tasks`       | -                                                       | title\*, description?, priority?, due_date?         | Create task       |
| PUT    | `/api/tasks/:id`   | -                                                       | title?, description?, status?, priority?, due_date? | Update task       |
| DELETE | `/api/tasks/:id`   | -                                                       | -                                                   | Delete task       |

\*Required field

---

# 🎯 What You've Learned

1. ✅ **TypeScript** - Interfaces, types, type safety
2. ✅ **Express.js** - Routing, middleware, error handling
3. ✅ **REST API Design** - CRUD operations, status codes
4. ✅ **Supabase** - PostgreSQL, queries, real-world database
5. ✅ **Environment Variables** - Secure configuration
6. ✅ **Async/Await** - Modern JavaScript patterns
7. ✅ **Validation** - Input sanitization
8. ✅ **Project Architecture** - Clean code organization

---

# 🚀 Next Steps (Advanced)

1. 🔜 **Authentication** - Add JWT authentication
2. 🔜 **User Management** - Each user has their own tasks
3. 🔜 **Task Categories** - Group tasks by category
4. 🔜 **Real-time Updates** - Subscribe to changes
5. 🔜 **Rate Limiting** - Prevent API abuse
6. 🔜 **Logging** - Winston/Morgan for production logs
7. 🔜 **Unit Tests** - Jest testing framework
8. 🔜 **Deployment** - Vercel/Railway/Render

---

# 🏆 Congratulations!

You've built a **production-ready REST API** with a **real database**!

This project demonstrates skills used in professional development:

- Clean architecture
- Type safety
- Database integration
- Error handling
- Input validation
- API documentation

---

_Built with TypeScript, Express.js, and Supabase_
