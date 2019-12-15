/**
 * Fields in a request to create a Task.
 */
export interface CreateTaskRequest {
  projectId: string;
  name: string;
  dueDate: string;
}
