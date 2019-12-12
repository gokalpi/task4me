export interface Task {
  projectId: string;
  taskId: string;
  userId: string;
  name: string;
  dueDate: string;
  done: boolean;
  createdAt: string;
  createdBy: string;
  modifiedAt?: string;
  modifiedBy?: string;
  attachmentUrl?: string;
}
