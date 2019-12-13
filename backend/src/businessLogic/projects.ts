import * as uuid from "uuid";

import { Project } from "../models/Project";
import { ProjectAccess } from "../dataLayer/projectsAccess";
import { CreateProjectRequest } from "../requests/CreateProjectRequest";
import { UpdateProjectRequest } from "../requests/UpdateProjectRequest";

const projectAccess = new ProjectAccess();

export async function getProjectById(id: string): Promise<Project> {
  if (!id) throw new Error("No id found");

  return await projectAccess.getProjectById(id);
}

export async function getAllProjects() {
  return await projectAccess.getAllProjects();
}

export async function createProject(
  createProjectRequest: CreateProjectRequest,
  userId: string
): Promise<Project> {
  if (!userId) throw new Error("No userId found");
  
  const newProject = {
    id: uuid.v4(),
    ...createProjectRequest,
    createdAt: new Date().toISOString(),
    createdBy: userId
  };

  await projectAccess.createProject(newProject);

  return newProject;
}

export async function updateProject(
  updateProjectRequest: UpdateProjectRequest,
  id: string,
  userId: string
) {
  if (!id) throw new Error("No id found");
  if (!userId) throw new Error("No userId found");

  await projectAccess.updateProject(id, userId, updateProjectRequest);
}

export async function deleteProject(id: string) {
  if (!id) throw new Error("No id found");

  await projectAccess.deleteProject(id);
}

export async function projectExists(id: string): Promise<boolean> {
  if (!id) throw new Error("No id found");

  return await projectAccess.projectExists(id);
}
