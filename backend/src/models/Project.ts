export interface Project {
  projectId: string;
  name: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  modifiedAt?: string;
  modifiedBy?: string;
}
