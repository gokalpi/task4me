import * as uuid from "uuid";

import { Project } from "../models/Project";
import { ProjectAccess } from "../dataLayer/projectsAccess";
import { CreateProjectRequest } from "../requests/CreateProjectRequest";
import { UpdateProjectRequest } from "../requests/UpdateProjectRequest";

const projectAccess = new ProjectAccess();

export async function getProjectById(projectId: string): Promise<Project> {
  if (!projectId) throw new Error("No projectId found");

  return await projectAccess.getProjectById(projectId);
}

export async function getAllProjectsByUser(userId: string) {
  if (!userId) throw new Error("No userId found");

  return await projectAccess.getAllProjectsByUser(userId);
}

export async function createProject(
  createProjectRequest: CreateProjectRequest,
  userId: string
): Promise<Project> {
  if (!userId) throw new Error("No userId found");
  
  const newProject = {
    projectId: uuid.v4(),
    userId,
    ...createProjectRequest,
    createdAt: new Date().toISOString(),
    createdBy: userId
  };

  await projectAccess.createProject(newProject);

  return newProject;
}

export async function updateProject(
  updateProjectRequest: UpdateProjectRequest,
  projectId: string,
  userId: string
) {
  if (!projectId) throw new Error("No projectId found");
  if (!userId) throw new Error("No userId found");

  console.log("updateProject Business layer", updateProjectRequest, projectId, userId)
  await projectAccess.updateProject(projectId, userId, updateProjectRequest);
}

export async function deleteProject(projectId: string) {
  if (!projectId) throw new Error("No projectId found");

  await projectAccess.deleteProject(projectId);
}

export async function projectExists(projectId: string): Promise<boolean> {
  if (!projectId) throw new Error("No projectId found");

  return await projectAccess.projectExists(projectId);
}
