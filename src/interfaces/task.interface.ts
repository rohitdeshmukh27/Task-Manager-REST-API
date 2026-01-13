// ===============================
// TASK INTERFACE - Typescript Type Defination
// ===============================

import { Interface } from "node:readline"

// Priority Level for tasks
export type Priority = "low" | "medium" | "high";

//Status of task
export type TaskStatus = "pending" | "in-process" | "completed";

//Main Task interface matches the database schema exactly
export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: Priority;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}

// DTO (Date transfer object) for creating a new task
// Only includes fields that can be set by the user

export interface CreateTaskDTO {
    title: string;
    description?: string;
    priority?: Priority | "medium";
    due_date?: string;
}


// DTO for updating an existing task
// all fields are optional

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: Priority;
    due_date?: string;
}

//Query parameters for filtering tasks
export interface TaskQueryParams {
    status?: TaskStatus;
    priority?: Priority;
    search?: string;
    sort_by?: 'created_at' | 'updated_at' | 'due_date' | 'priority';
    order?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}

// API response wrapper for consistent response

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    count?: number; //for paginated response 
}

//Database error type
export interface DatabaseError {
    code: string;
    message: string;
    details?: string;
}