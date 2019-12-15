import * as uuid from "uuid";

import { Task } from "../models/Task";
import { TaskAccess } from "../dataLayer/tasksAccess";
import { CreateTaskRequest } from "../requests/CreateTaskRequest";
import { UpdateTaskRequest } from "../requests/UpdateTaskRequest";
import { getSignedUrl, getAttachmentUrl } from "../utils/s3Utils";

const taskAccess = new TaskAccess();

export async function getTaskById(
  taskId: string
): Promise<Task> {
  if (!taskId) throw new Error("No taskId found");

  return await taskAccess.getTaskById(taskId);
}

export async function getAllUserTasksByProject(userId: string, projectId: string) {
  return await taskAccess.getAllUserTasksByProject(userId, projectId);
}

export async function createTask(
  createTaskRequest: CreateTaskRequest,
  userId: string
): Promise<Task> {
  if (!userId) throw new Error("No userId found");

  const newTask = {
    taskId: uuid.v4(),
    userId,
    ...createTaskRequest,
    done: false,
    createdAt: new Date().toISOString(),
    createdBy: userId
  };

  await taskAccess.createTask(newTask);

  return newTask;
}

export async function updateTask(
  updateTaskRequest: UpdateTaskRequest,
  taskId: string,
  userId: string
) {
  if (!taskId) throw new Error("No taskId found");

  await taskAccess.updateTask(taskId, userId, updateTaskRequest);
}

export async function deleteTask(taskId: string) {
  if (!taskId) throw new Error("No taskId found");

  await taskAccess.deleteTask(taskId);
}

export async function taskExists(
  taskId: string
): Promise<boolean> {
  if (!taskId) throw new Error("No taskId found");

  return await taskAccess.taskExists(taskId);
}

export async function generateAttachmentUrl(taskId: string) {
  if (!taskId) throw new Error("No taskId found");

  const signedUrl = await getSignedUrl(taskId)
  const downloadUrl = await getAttachmentUrl(taskId);

  await taskAccess.updateAttachmentUrl(
    taskId,
    downloadUrl
  );

  return signedUrl;
}
