export interface UpdateTaskRequest {
  projectId: string;
  name: string;
  dueDate: string;
  done: boolean;
}