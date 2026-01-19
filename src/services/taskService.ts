// ============================
// TASK SERVICE - Database Operations
// ============================

import supabase from "../config/supabase";
import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskQueryParams,
} from "../interfaces/task.interface";

//table name constant
const TABLE_NAME = "tasks";

// Get all tasks with optional filtering, sorting and pagination

export const getAllTasks = async (
  params: TaskQueryParams = {}
): Promise<{ data: Task[] | null; error: any; count: number | null }> => {
  // start building query
  let query = supabase.from(TABLE_NAME).select("*", { count: "exact" }); //get total count

  // apply filters
  if (params.status) {
    query = query.eq("status", params.status);
  }

  if (params.priority) {
    query = query.eq("priority", params.priority);
  }

  if (params.search) {
    // search in title and description(case insensitive)
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%`
    );
  }

  // apply sorting
  const sortColumn = params.sort_by || "created_at";
  const sortOrder = params.order === "asc" ? true : false;

  query = query.order(sortColumn, { ascending: sortOrder });

  // apply pagination
  if (params.limit) {
    query = query.limit(params.limit);
  }

  if (params.offset) {
    query = query.range(
      params.offset,
      params.offset + ((params.limit || 10) - 1)
    );
  }

  const { data, error, count } = await query;
  return { data, error, count };
};

// get single task by id

export const getTaskById = async (
  id: string
): Promise<{ data: Task | null; error: any }> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("id", id)
    .single(); //expect axactly one row

  return { data, error };
};

//create new task

export const createTask = async (
  taskData: CreateTaskDTO
): Promise<{ data: Task | null; error: any }> => {
  // prepare inset data
  const insertData = {
    title: taskData.title,
    description: taskData.description || null,
    priority: taskData.priority,
    due_date: taskData.due_date || null,
    status: "pending", // default status
  };

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(insertData)
    .select() // returns the inserted row
    .single();

  return { data, error };
};

// update exisiting task

export const updateTask = async (
  id: string,
  updates: UpdateTaskDTO
): Promise<{ data: Task | null; error: any }> => {
  //build update object (only include provided fields)
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

// delete task
export const deleteTask = async (
  id: string
): Promise<{ data: Task | null; error: any }> => {
  //first get the task to return it
  const { data: existingTask } = await getTaskById(id);

  if (!existingTask) {
    return { data: null, error: { message: "task not found" } };
  }

  const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

  if (error) {
    return { data: null, error };
  }

  return { data: existingTask, error: null };
};

// get task statistics

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
      .eq("status", "in-process");

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
    console.log("Error getting stats: ", error);
    return null;
  }
};
