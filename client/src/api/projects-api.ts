import Axios from "axios";

import { apiEndpoint } from "../config";
import { Project } from "../types/Project";
import { CreateProjectRequest } from "../types/CreateProjectRequest";
import { UpdateProjectRequest } from "../types/UpdateProjectRequest";

export async function getProjects(idToken: string): Promise<Project[]> {
  console.log("Fetching projects");

  const response = await Axios.get(`${apiEndpoint}/projects`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`
    }
  });
  console.log("Projects:", response.data);
  return response.data.items;
}

export async function createProject(
  idToken: string,
  newProject: CreateProjectRequest
): Promise<Project> {
  const response = await Axios.post(
    `${apiEndpoint}/projects`,
    JSON.stringify(newProject),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      }
    }
  );
  return response.data.item;
}

export async function patchProject(
  idToken: string,
  projectId: string,
  updatedProject: UpdateProjectRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/projects/${projectId}`,
    JSON.stringify(updatedProject),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      }
    }
  );
}

export async function deleteProject(
  idToken: string,
  projectId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/projects/${projectId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`
    }
  });
}

export async function getUploadUrl(
  idToken: string,
  projectId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/projects/${projectId}/attachment`,
    "",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      }
    }
  );
  return response.data.uploadUrl;
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file);
}
