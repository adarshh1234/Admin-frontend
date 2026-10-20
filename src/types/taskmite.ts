export type TaskStatus =
  | 'OPEN'
  | 'RESOLVED'
  | 'WONT_FIX'
  | 'INVALID'
  | 'SPITE';

export type TaskPriority =
  | 'UNBREAK_NOW'
  | 'NEEDS_TRIAGE'
  | 'HIGH'
  | 'NORMAL'
  | 'LOW'
  | 'WISHLIST';

export type TaskVisibility = 'ALL_USERS' | 'CUSTOM';

export interface Task {
  id: number;
  taskNumber: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  visibility: TaskVisibility;
  createdById: number;
  assignedToId: number | null;
  parentTaskId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  visibility?: TaskVisibility;
  assignedToId?: number;
  parentTaskId?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  visibility?: TaskVisibility;
  assignedToId?: number | null;
  parentTaskId?: number | null;
}

export type TaskActivityType =
  | 'CREATED'
  | 'UPDATED'
  | 'ASSIGNED'
  | 'STATUS_CHANGED'
  | 'PRIORITY_CHANGED'
  | 'TAG_ADDED'
  | 'TAG_REMOVED'
  | 'SUBSCRIBER_ADDED'
  | 'SUBSCRIBER_REMOVED'
  | 'COMMENT_ADDED';

export interface TaskActivity {
  id?: number;
  taskId: number;
  userId: number;
  type: TaskActivityType;
  oldValue: string | null;
  newValue: string | null;
  comment: string | null;
  createdAt: string;
}

export interface TaskComment {
  id: number;
  taskId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskSubscriber {
  taskId: number;
  userId: number;
  createdAt?: string;
}

export interface Tag {
  id: number;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskTag {
  taskId: number;
  tagId: number;
}
