import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../services/taskmiteApiClient';
import { taskmiteService } from '../../services/taskmite.service';
import type {
  Tag,
  Task,
  TaskActivity,
  TaskComment,
  TaskPriority,
  TaskStatus,
  TaskSubscriber,
  TaskTag,
} from '../../types/taskmite';
import { Loader } from '../common/Loader';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskActionBox } from './TaskActionBox';
import { TaskActivityFeed } from './TaskActivityFeed';
import {
  TaskWorkspaceHeader,
  TaskHierarchyCard,
  TaskPropertiesCard,
  TaskTagsCard,
  TaskSubscribersCard,
  type TaskWorkspaceProps,
} from './workspace';

export const TaskWorkspace: React.FC<TaskWorkspaceProps> = ({
  task: initialTask,
  allTasks,
  users = [],
  onBack,
  onTaskUpdated,
  onTaskDeleted,
  onTaskCreated,
}) => {
  const { showToast } = useToast();

  const [task, setTask] = useState<Task>(initialTask);
  const [activities, setActivities] = useState<TaskActivity[]>([]);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [subscribers, setSubscribers] = useState<TaskSubscriber[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [taskTags, setTaskTags] = useState<TaskTag[]>([]);

  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(initialTask.title);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editedDesc, setEditedDesc] = useState(initialTask.description || '');

  const [newTagName, setNewTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [selectedSubUserId, setSelectedSubUserId] = useState('');
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);

  useEffect(() => {
    setTask(initialTask);
    setEditedTitle(initialTask.title);
    setEditedDesc(initialTask.description || '');
  }, [initialTask]);

  const usersMap = useMemo(() => {
    const map = new Map<number, string>();
    map.set(1, 'Labeeb EEE');
    map.set(2, 'Dr. Sarah Mitchell');
    map.set(3, 'John Miller');
    map.set(4, 'Priya Sharma');
    users.forEach((u) => map.set(u.id, u.displayName || u.name || u.username));
    return map;
  }, [users]);

  function getUserLabel(userId: number | null) {
    if (!userId) return null;
    return usersMap.get(userId) || `User #${userId}`;
  }

  const loadTaskData = useCallback(async () => {
    setIsLoadingFeed(true);
    try {
      const [actData, comData, subData, allTagsData, taskTagsData] = await Promise.all([
        taskmiteService.getActivities(task.id).catch(() => []),
        taskmiteService.getComments(task.id).catch(() => []),
        taskmiteService.getSubscribers(task.id).catch(() => []),
        taskmiteService.getTags().catch(() => []),
        taskmiteService.getTaskTags(task.id).catch(() => []),
      ]);

      setActivities(actData);
      setComments(comData);
      setSubscribers(subData);
      setAvailableTags(allTagsData);
      setTaskTags(taskTagsData);
    } catch {
      showToast('Could not load some task details.', 'error');
    } finally {
      setIsLoadingFeed(false);
    }
  }, [task.id, showToast]);

  useEffect(() => {
    loadTaskData();
  }, [loadTaskData]);

  const subtasks = useMemo(() => {
    return allTasks.filter((t) => t.parentTaskId === task.id);
  }, [allTasks, task.id]);

  const parentTask = useMemo(() => {
    if (!task.parentTaskId) return null;
    return allTasks.find((t) => t.id === task.parentTaskId) || null;
  }, [allTasks, task.parentTaskId]);

  async function handleUpdateField(fields: Partial<Task>) {
    try {
      const updated = await taskmiteService.updateTask(task.id, {
        title: fields.title,
        description: fields.description ?? undefined,
        status: fields.status,
        priority: fields.priority,
        visibility: fields.visibility,
        assignedToId: fields.assignedToId !== undefined ? fields.assignedToId : undefined,
      });
      setTask(updated);
      onTaskUpdated(updated);
      const newActs = await taskmiteService.getActivities(task.id);
      setActivities(newActs);
      showToast('Task updated.', 'success');
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : 'Failed to update task.';
      showToast(msg, 'error');
    }
  }

  async function handleSaveTitle() {
    const trimmed = editedTitle.trim();
    if (!trimmed) {
      showToast('Task title cannot be empty.', 'error');
      return;
    }
    await handleUpdateField({ title: trimmed });
    setIsEditingTitle(false);
  }

  async function handleSaveDesc() {
    await handleUpdateField({ description: editedDesc.trim() || null });
    setIsEditingDesc(false);
  }

  async function handleActionSubmit({
    comment,
    newStatus,
    newPriority,
  }: {
    comment?: string;
    newStatus?: TaskStatus;
    newPriority?: TaskPriority;
  }) {
    setIsSubmittingAction(true);
    try {
      if (newStatus || newPriority) {
        const updated = await taskmiteService.updateTask(task.id, {
          status: newStatus,
          priority: newPriority,
        });
        setTask(updated);
        onTaskUpdated(updated);
      }

      if (comment) {
        await taskmiteService.createComment(task.id, comment);
      }

      const [newActs, newComments] = await Promise.all([
        taskmiteService.getActivities(task.id),
        taskmiteService.getComments(task.id),
      ]);
      setActivities(newActs);
      setComments(newComments);
      showToast('Updated task successfully.', 'success');
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : 'Failed to post update.';
      showToast(msg, 'error');
    } finally {
      setIsSubmittingAction(false);
    }
  }

  async function handleDeleteComment(commentId: number) {
    try {
      await taskmiteService.deleteComment(task.id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      showToast('Comment deleted.', 'info');
    } catch {
      showToast('Failed to delete comment.', 'error');
    }
  }

  const isSubscribed = useMemo(() => {
    return subscribers.some((s) => s.userId === 1);
  }, [subscribers]);

  async function handleToggleSubscribe() {
    try {
      if (isSubscribed) {
        await taskmiteService.removeSubscriber(task.id, 1);
        setSubscribers((prev) => prev.filter((s) => s.userId !== 1));
        showToast('Unsubscribed from task updates.', 'info');
      } else {
        const sub = await taskmiteService.addSubscriber(task.id, 1);
        setSubscribers((prev) => [...prev, sub]);
        showToast('Subscribed to task updates.', 'success');
      }
      const newActs = await taskmiteService.getActivities(task.id);
      setActivities(newActs);
    } catch {
      showToast('Failed to update subscription.', 'error');
    }
  }

  async function handleAddOtherSubscriber() {
    if (!selectedSubUserId) return;
    try {
      const sub = await taskmiteService.addSubscriber(task.id, Number(selectedSubUserId));
      setSubscribers((prev) => [...prev, sub]);
      setSelectedSubUserId('');
      const newActs = await taskmiteService.getActivities(task.id);
      setActivities(newActs);
      showToast('Subscriber added.', 'success');
    } catch {
      showToast('Failed to add subscriber.', 'error');
    }
  }

  const attachedTags = useMemo(() => {
    const attachedIds = new Set(taskTags.map((tt) => tt.tagId));
    return availableTags.filter((tag) => attachedIds.has(tag.id));
  }, [taskTags, availableTags]);

  async function handleAddTag(tagId: number) {
    try {
      const newTt = await taskmiteService.addTagToTask(task.id, tagId);
      setTaskTags((prev) => [...prev, newTt]);
      const newActs = await taskmiteService.getActivities(task.id);
      setActivities(newActs);
      showToast('Tag attached.', 'success');
    } catch {
      showToast('Failed to attach tag.', 'error');
    }
  }

  async function handleCreateAndAddTag(e: React.FormEvent) {
    e.preventDefault();
    const name = newTagName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!name) return;
    setIsAddingTag(true);
    try {
      let tag = availableTags.find((t) => t.name.toLowerCase() === name);
      if (!tag) {
        tag = await taskmiteService.createTag(name);
        setAvailableTags((prev) => [...prev, tag!]);
      }
      await handleAddTag(tag.id);
      setNewTagName('');
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : 'Failed to add tag.';
      showToast(msg, 'error');
    } finally {
      setIsAddingTag(false);
    }
  }

  async function handleRemoveTag(tagId: number) {
    try {
      await taskmiteService.removeTagFromTask(task.id, tagId);
      setTaskTags((prev) => prev.filter((tt) => tt.tagId !== tagId));
      const newActs = await taskmiteService.getActivities(task.id);
      setActivities(newActs);
      showToast('Tag removed.', 'info');
    } catch {
      showToast('Failed to remove tag.', 'error');
    }
  }

  async function handleDeleteTask() {
    if (!window.confirm(`Are you sure you want to permanently delete task T${task.taskNumber}?`)) {
      return;
    }

    try {
      await taskmiteService.deleteTask(task.id);
      showToast(`Task T${task.taskNumber} deleted.`, 'info');
      onTaskDeleted(task.id);
    } catch {
      showToast('Failed to delete task.', 'error');
    }
  }

  const assigneeName = getUserLabel(task.assignedToId);
  const authorName = getUserLabel(task.createdById);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Header */}
      <TaskWorkspaceHeader
        task={task}
        assigneeName={assigneeName}
        onBack={onBack}
        onUpdateField={handleUpdateField}
        onDeleteTask={handleDeleteTask}
      />

      {/* Main Two-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title & Description Box */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              padding: 20,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            {/* Title */}
            {isEditingTitle ? (
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input
                  className="form-control"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  style={{ fontSize: 16, fontWeight: 700 }}
                  autoFocus
                />
                <button type="button" className="btn-primary" onClick={handleSaveTitle}>
                  Save
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    setEditedTitle(task.title);
                    setIsEditingTitle(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{task.title}</h2>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: 13,
                    padding: '4px 8px',
                  }}
                  title="Edit title"
                >
                  <i className="fas fa-edit" />
                </button>
              </div>
            )}

            {/* Description Section */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#64748b',
                  }}
                >
                  Description
                </span>
                {!isEditingDesc && (
                  <button
                    type="button"
                    onClick={() => setIsEditingDesc(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      padding: 0,
                    }}
                  >
                    <i className="fas fa-edit" style={{ marginRight: 4 }} /> Edit
                  </button>
                )}
              </div>

              {isEditingDesc ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <textarea
                    className="form-control"
                    value={editedDesc}
                    onChange={(e) => setEditedDesc(e.target.value)}
                    rows={6}
                    style={{ resize: 'vertical' }}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => {
                        setEditedDesc(task.description || '');
                        setIsEditingDesc(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="button" className="btn-primary" onClick={handleSaveDesc}>
                      Save Description
                    </button>
                  </div>
                </div>
              ) : task.description ? (
                <div
                  style={{
                    fontSize: 14,
                    color: '#334155',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {task.description}
                </div>
              ) : (
                <div
                  style={{
                    color: '#94a3b8',
                    fontStyle: 'italic',
                    fontSize: 13,
                    padding: '8px 0',
                  }}
                >
                  No description provided for this task.
                </div>
              )}
            </div>
          </div>

          {/* Subtasks & Parent Task Hierarchy */}
          <TaskHierarchyCard
            parentTask={parentTask}
            subtasks={subtasks}
            onOpenAddSubtask={() => setIsSubtaskModalOpen(true)}
          />

          {/* Activity & Comment Timeline */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              padding: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fas fa-stream" style={{ color: '#2563eb' }} />
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                  History & Discussion Feed
                </h4>
              </div>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                {activities.length} transactions, {comments.length} comments
              </span>
            </div>

            {isLoadingFeed ? (
              <Loader label="Loading history..." />
            ) : (
              <TaskActivityFeed
                activities={activities}
                comments={comments}
                users={users}
                onDeleteComment={handleDeleteComment}
              />
            )}
          </div>

          {/* Action Box */}
          <TaskActionBox
            currentStatus={task.status}
            currentPriority={task.priority}
            isSubmitting={isSubmittingAction}
            onSubmit={handleActionSubmit}
          />
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Properties Card */}
          <TaskPropertiesCard
            task={task}
            authorName={authorName}
            onUpdateField={handleUpdateField}
          />

          {/* Project Tags Card */}
          <TaskTagsCard
            attachedTags={attachedTags}
            isAddingTag={isAddingTag}
            newTagName={newTagName}
            onNewTagNameChange={setNewTagName}
            onCreateAndAddTag={handleCreateAndAddTag}
            onRemoveTag={handleRemoveTag}
          />

          {/* Subscribers Card */}
          <TaskSubscribersCard
            subscribers={subscribers}
            isSubscribed={isSubscribed}
            selectedSubUserId={selectedSubUserId}
            getUserLabel={getUserLabel}
            onToggleSubscribe={handleToggleSubscribe}
            onSelectedSubUserChange={setSelectedSubUserId}
            onAddOtherSubscriber={handleAddOtherSubscriber}
          />
        </div>
      </div>

      {/* Subtask Creation Modal */}
      <CreateTaskModal
        isOpen={isSubtaskModalOpen}
        onClose={() => setIsSubtaskModalOpen(false)}
        initialParentTaskId={task.id}
        onTaskCreated={(newTask) => {
          onTaskCreated(newTask);
          setIsSubtaskModalOpen(false);
          loadTaskData();
        }}
      />
    </div>
  );
};

export default TaskWorkspace;
