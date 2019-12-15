/**
 * Fields in a request to update a Task.
 */
export interface UpdateTaskRequest {
  projectId: string;
  name: string;
  dueDate: string;
  done: boolean
}
