import * as uuid from "uuid";

import { Task } from "../models/Task";
import { TaskAccess } from "../dataLayer/tasksAccess";
import { CreateTaskRequest } from "../requests/CreateTaskRequest";
import { UpdateTaskRequest } from "../requests/UpdateTaskRequest";
import { getSignedUrl, getAttachmentUrl } from "../utils/s3Utils";

const taskAccess = new TaskAccess();

export async function getTaskById(
  projectId: string,
  taskId: string
): Promise<Task> {
  if (!projectId) throw new Error("No projectId found");
  if (!taskId) throw new Error("No taskId found");

  return await taskAccess.getTaskById(projectId, taskId);
}

export async function getAllTasksByProject(projectId: string) {
  return await taskAccess.getAllTasksByProject(projectId);
}

export async function createTask(
  createTaskRequest: CreateTaskRequest,
  projectId: string,
  userId: string
): Promise<Task> {
  if (!projectId) throw new Error("No projectId found");
  if (!userId) throw new Error("No userId found");

  const newTask = {
    projectId,
    taskId: uuid.v4(),
    userId,
    ...createTaskRequest,
    done: false,
    createdAt: new Date().toISOString(),
    createdBy: userId
  };

  await taskAccess.createTask(projectId, newTask);

  return newTask;
}

export async function updateTask(
  updateTaskRequest: UpdateTaskRequest,
  projectId: string,
  taskId: string,
  userId: string
) {
  if (!projectId) throw new Error("No projectId found");
  if (!taskId) throw new Error("No taskId found");

  await taskAccess.updateTask(projectId, taskId, userId, updateTaskRequest);
}

export async function deleteTask(projectId: string, taskId: string) {
  if (!projectId) throw new Error("No projectId found");
  if (!taskId) throw new Error("No taskId found");

  await taskAccess.deleteTask(projectId, taskId);
}

export async function taskExists(
  projectId: string,
  taskId: string
): Promise<boolean> {
  if (!projectId) throw new Error("No projectId found");
  if (!taskId) throw new Error("No taskId found");

  return await taskAccess.taskExists(projectId, taskId);
}

export async function generateAttachmentUrl(projectId: string, taskId: string) {
  if (!projectId) throw new Error("No projectId found");
  if (!taskId) throw new Error("No taskId found");

  const signedUrl = await getSignedUrl(taskId);
  console.log('Signed URL', signedUrl)
  const downloadUrl = await getAttachmentUrl(taskId);
  console.log('Download URL', downloadUrl)

  await taskAccess.updateAttachmentUrl(
    projectId,
    taskId,
    downloadUrl
  );

  return signedUrl;
}
