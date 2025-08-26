export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}

export interface AppData {
  tasks: Task[];
  user: User;
}

export type TaskFormData = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted'>;

export type NotificationType = 'success' | 'error' | 'info';