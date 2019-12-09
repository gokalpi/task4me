/**
 * Fields in a request to update a Task.
 */
export interface UpdateTaskRequest {
  name: string;
  dueDate: string;
  done: boolean
}
