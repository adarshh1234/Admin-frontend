import type {
  CreateTaskRequest,
  Tag,
  Task,
  TaskActivity,
  TaskComment,
  TaskSubscriber,
  TaskTag,
  UpdateTaskRequest,
} from '../types/taskmite';
import { apiRequest } from './taskmiteApiClient';

export const taskmiteService = {
  // Tasks
  getTasks() {
    return apiRequest<Task[]>('/tasks');
  },

  getTask(id: number) {
    return apiRequest<Task>(`/tasks/${id}`);
  },

  createTask(payload: CreateTaskRequest) {
    return apiRequest<Task>('/tasks', {
      method: 'POST',
      body: payload,
    });
  },

  updateTask(id: number, payload: UpdateTaskRequest) {
    return apiRequest<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: payload,
    });
  },

  deleteTask(id: number) {
    return apiRequest<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // Activities (Transactions timeline)
  getActivities(taskId: number) {
    return apiRequest<TaskActivity[]>(`/tasks/${taskId}/activities`);
  },

  // Comments
  getComments(taskId: number) {
    return apiRequest<TaskComment[]>(`/tasks/${taskId}/comments`);
  },

  createComment(taskId: number, content: string) {
    return apiRequest<TaskComment>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: { content },
    });
  },

  deleteComment(taskId: number, commentId: number) {
    return apiRequest<{ message: string }>(
      `/tasks/${taskId}/comments/${commentId}`,
      {
        method: 'DELETE',
      },
    );
  },

  // Subscribers
  getSubscribers(taskId: number) {
    return apiRequest<TaskSubscriber[]>(`/tasks/${taskId}/subscribers`);
  },

  addSubscriber(taskId: number, userId: number) {
    return apiRequest<TaskSubscriber>(`/tasks/${taskId}/subscribers`, {
      method: 'POST',
      body: { userId },
    });
  },

  removeSubscriber(taskId: number, userId: number) {
    return apiRequest<{ message: string }>(
      `/tasks/${taskId}/subscribers/${userId}`,
      {
        method: 'DELETE',
      },
    );
  },

  // Tags
  getTags() {
    return apiRequest<Tag[]>('/tags');
  },

  createTag(name: string, description?: string) {
    return apiRequest<Tag>('/tags', {
      method: 'POST',
      body: { name, description },
    });
  },

  getTaskTags(taskId: number) {
    return apiRequest<TaskTag[]>(`/tasks/${taskId}/tags`);
  },

  addTagToTask(taskId: number, tagId: number) {
    return apiRequest<TaskTag>(`/tasks/${taskId}/tags`, {
      method: 'POST',
      body: { tagId },
    });
  },

  removeTagFromTask(taskId: number, tagId: number) {
    return apiRequest<{ message: string }>(
      `/tasks/${taskId}/tags/${tagId}`,
      {
        method: 'DELETE',
      },
    );
  },
};

export default taskmiteService;
