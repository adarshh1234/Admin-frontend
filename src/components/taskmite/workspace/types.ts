import type { Task, Tag, TaskSubscriber } from '../../../types/taskmite';

export interface TaskWorkspaceProps {
  task: Task;
  allTasks: Task[];
  users?: { id: number; name?: string; username: string; displayName?: string }[];
  onBack: () => void;
  onTaskUpdated: (updated: Task) => void;
  onTaskDeleted: (taskId: number) => void;
  onTaskCreated: (newTask: Task) => void;
}

export interface TaskWorkspaceHeaderProps {
  task: Task;
  assigneeName: string | null;
  onBack: () => void;
  onUpdateField: (fields: Partial<Task>) => void;
  onDeleteTask: () => void;
}

export interface TaskHierarchyCardProps {
  parentTask: Task | null;
  subtasks: Task[];
  onOpenAddSubtask: () => void;
}

export interface TaskPropertiesCardProps {
  task: Task;
  authorName: string | null;
  onUpdateField: (fields: Partial<Task>) => void;
}

export interface TaskTagsCardProps {
  attachedTags: Tag[];
  isAddingTag: boolean;
  newTagName: string;
  onNewTagNameChange: (val: string) => void;
  onCreateAndAddTag: (e: React.FormEvent) => void;
  onRemoveTag: (tagId: number) => void;
}

export interface TaskSubscribersCardProps {
  subscribers: TaskSubscriber[];
  isSubscribed: boolean;
  selectedSubUserId: string;
  getUserLabel: (userId: number | null) => string | null;
  onToggleSubscribe: () => void;
  onSelectedSubUserChange: (val: string) => void;
  onAddOtherSubscriber: () => void;
}
