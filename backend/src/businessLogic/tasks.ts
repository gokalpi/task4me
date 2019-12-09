import * as uuid from "uuid";

import { Task } from "../models/Task";
import { TaskAccess } from "../dataLayer/tasksAccess";
import { CreateTaskRequest } from "../requests/CreateTaskRequest";
import { UpdateTaskRequest } from "../requests/UpdateTaskRequest";

const taskAccess = new TaskAccess();

export async function getTaskById(
  projectId: string,
  taskId: string
): Promise<Task> {
  if (!!projectId) throw new Error("No projectId found");
  if (!!taskId) throw new Error("No taskId found");

  return await taskAccess.getTaskById(projectId, taskId);
}

export async function getAllTasksByProject(projectId: string) {
  return await taskAccess.getAllTasksByProject(projectId);
}

export async function createTask(
  createTaskRequest: CreateTaskRequest
): Promise<Task> {
  const newTask = {
    id: uuid.v4(),
    ...createTaskRequest,
    createdAt: new Date().toISOString()
  };

  await taskAccess.createTask(newTask);

  return newTask;
}

export async function updateTask(
  updateTaskRequest: UpdateTaskRequest,
  projectId: string,
  taskId: string
) {
  if (!!projectId) throw new Error("No projectId found");
  if (!!taskId) throw new Error("No taskId found");

  await taskAccess.updateTask(projectId, taskId, updateTaskRequest);
}

export async function deleteTask(projectId: string, taskId: string) {
  if (!!projectId) throw new Error("No projectId found");
  if (!!taskId) throw new Error("No taskId found");

  await taskAccess.deleteTask(projectId, taskId);
}

export async function taskExists(
  projectId: string,
  taskId: string
): Promise<boolean> {
  if (!!projectId) throw new Error("No projectId found");
  if (!!taskId) throw new Error("No taskId found");

  return await taskAccess.taskExists(projectId, taskId);
}
