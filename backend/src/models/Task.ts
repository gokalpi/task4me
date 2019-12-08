export interface Task {
  projectId: string;
  taskId: string;
  userId: string;
  name: string;
  dueDate: string;
  createdAt: string;
  done: boolean;
  attachmentUrl?: string;
}
