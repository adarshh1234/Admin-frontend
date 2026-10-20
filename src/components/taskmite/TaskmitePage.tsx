import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../services/taskmiteApiClient';
import { taskmiteService } from '../../services/taskmite.service';
import type { Task, TaskStatus } from '../../types/taskmite';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskBoard } from './TaskBoard';
import { TaskList } from './TaskList';
import { TaskWorkspace } from './TaskWorkspace';

interface TaskmitePageProps {
  currentView: 'list' | 'board';
  onSelectView: (view: 'list' | 'board') => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  searchQuery?: string;
  onStatsChange?: (openCount: number, totalCount: number) => void;
}

export function TaskmitePage({
  currentView,
  onSelectView,
  isCreateModalOpen,
  setIsCreateModalOpen,
  searchQuery = '',
  onStatsChange,
}: TaskmitePageProps) {
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const tasksData = await taskmiteService.getTasks();
      setTasks(tasksData);
    } catch {
      showToast('Failed to load tasks from server.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Stat metrics
  const stats = useMemo(() => {
    const total = tasks.length;
    const open = tasks.filter((t) => t.status === 'OPEN').length;
    const unbreakNow = tasks.filter(
      (t) => t.status === 'OPEN' && t.priority === 'UNBREAK_NOW',
    ).length;
    const resolved = tasks.filter((t) => t.status === 'RESOLVED').length;
    return { total, open, unbreakNow, resolved };
  }, [tasks]);

  useEffect(() => {
    if (onStatsChange) {
      onStatsChange(stats.open, stats.total);
    }
  }, [stats.open, stats.total, onStatsChange]);

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        `t${t.taskNumber}`.includes(q),
    );
  }, [tasks, searchQuery]);

  function handleTaskCreated(newTask: Task) {
    setTasks((prev) => [newTask, ...prev]);
    setSelectedTask(newTask);
  }

  function handleTaskUpdated(updated: Task) {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    if (selectedTask && selectedTask.id === updated.id) {
      setSelectedTask(updated);
    }
  }

  function handleTaskDeleted(taskId: number) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }
  }

  async function handleQuickResolve(taskToResolve: Task) {
    try {
      const updated = await taskmiteService.updateTask(taskToResolve.id, {
        status: 'RESOLVED',
      });
      handleTaskUpdated(updated);
      showToast(`Task T${taskToResolve.taskNumber} marked as Resolved.`, 'success');
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : 'Failed to resolve task.';
      showToast(msg, 'error');
    }
  }

  async function handleUpdateTaskStatus(taskId: number, newStatus: TaskStatus) {
    try {
      const updated = await taskmiteService.updateTask(taskId, {
        status: newStatus,
      });
      handleTaskUpdated(updated);
      showToast(`Task updated to ${newStatus}.`, 'success');
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : 'Failed to update task.';
      showToast(msg, 'error');
    }
  }

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', paddingBottom: 48 }}>
      {selectedTask ? (
        <TaskWorkspace
          task={selectedTask}
          allTasks={tasks}
          onBack={() => setSelectedTask(null)}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
          onTaskCreated={handleTaskCreated}
        />
      ) : (
        <div>
          {/* Header Panel */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              padding: '20px 24px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 20,
                }}
              >
                <i className="fas fa-check-double" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                  Taskmite
                </h1>
                <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                  Task & work item tracking, workboards, and developer issue engine.
                </p>
              </div>
            </div>

            {/* View Mode Toggle & New Task button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  display: 'flex',
                  background: '#f1f5f9',
                  borderRadius: 6,
                  padding: 3,
                }}
              >
                <button
                  type="button"
                  onClick={() => onSelectView('list')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 4,
                    border: 'none',
                    background: currentView === 'list' ? '#ffffff' : 'transparent',
                    color: currentView === 'list' ? '#0f172a' : '#64748b',
                    fontWeight: currentView === 'list' ? 600 : 500,
                    fontSize: 12,
                    cursor: 'pointer',
                    boxShadow: currentView === 'list' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  <i className="fas fa-list" />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectView('board')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 4,
                    border: 'none',
                    background: currentView === 'board' ? '#ffffff' : 'transparent',
                    color: currentView === 'board' ? '#0f172a' : '#64748b',
                    fontWeight: currentView === 'board' ? 600 : 500,
                    fontSize: 12,
                    cursor: 'pointer',
                    boxShadow: currentView === 'board' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  <i className="fas fa-columns" />
                  <span>Workboard</span>
                </button>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <i className="fas fa-plus" style={{ marginRight: 6 }} />
                New Task
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Tasks</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                  {stats.total}
                </h3>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 16,
                }}
              >
                <i className="fas fa-tasks" />
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Open Tasks</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 700, color: '#16a34a' }}>
                  {stats.open}
                </h3>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#f0fdf4',
                  color: '#16a34a',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 16,
                }}
              >
                <i className="fas fa-circle-notch" />
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: stats.unbreakNow > 0 ? '4px solid #dc2626' : undefined,
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 12,
                    color: stats.unbreakNow > 0 ? '#dc2626' : '#64748b',
                    fontWeight: 600,
                  }}
                >
                  Unbreak Now!
                </span>
                <h3
                  style={{
                    margin: '4px 0 0',
                    fontSize: 22,
                    fontWeight: 700,
                    color: stats.unbreakNow > 0 ? '#dc2626' : '#0f172a',
                  }}
                >
                  {stats.unbreakNow}
                </h3>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#fef2f2',
                  color: '#dc2626',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 16,
                }}
              >
                <i className="fas fa-fire" />
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Resolved</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 700, color: '#0284c7' }}>
                  {stats.resolved}
                </h3>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#f0f9ff',
                  color: '#0284c7',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 16,
                }}
              >
                <i className="fas fa-check-circle" />
              </div>
            </div>
          </div>

          {/* Main Content (List or Workboard) */}
          {currentView === 'list' ? (
            <TaskList
              tasks={filteredTasks}
              isLoading={isLoading}
              onSelectTask={setSelectedTask}
              onQuickResolve={handleQuickResolve}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          ) : (
            <TaskBoard
              tasks={filteredTasks}
              onSelectTask={setSelectedTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          )}
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}
