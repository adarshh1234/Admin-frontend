import { useMemo, useState } from 'react';
import type { Task, TaskPriority } from '../../types/taskmite';
import { Loader } from '../common/Loader';
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  TASK_PRIORITIES,
} from './taskConstants';

interface TaskListProps {
  tasks: Task[];
  users?: { id: number; name?: string; username: string; displayName?: string }[];
  isLoading: boolean;
  onSelectTask: (task: Task) => void;
  onQuickResolve?: (task: Task) => void;
  onOpenCreateModal: () => void;
}

export function TaskList({
  tasks,
  users = [],
  isLoading,
  onSelectTask,
  onQuickResolve,
  onOpenCreateModal,
}: TaskListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED' | 'CLOSED'>('OPEN');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<'ALL' | 'ME' | 'UNASSIGNED'>('ALL');

  const usersMap = useMemo(() => {
    const map = new Map<number, string>();
    map.set(1, 'Labeeb EEE');
    map.set(2, 'Dr. Sarah Mitchell');
    map.set(3, 'John Miller');
    map.set(4, 'Priya Sharma');
    users.forEach((u) => map.set(u.id, u.displayName || u.name || u.username));
    return map;
  }, [users]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search
      const q = search.trim().toLowerCase();
      if (q) {
        const matchesMonogram = `t${t.taskNumber}`.includes(q);
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q) ?? false;
        if (!matchesMonogram && !matchesTitle && !matchesDesc) return false;
      }

      // Status
      if (statusFilter === 'OPEN') {
        if (t.status !== 'OPEN') return false;
      } else if (statusFilter === 'RESOLVED') {
        if (t.status !== 'RESOLVED') return false;
      } else if (statusFilter === 'CLOSED') {
        if (t.status === 'OPEN') return false;
      }

      // Priority
      if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) {
        return false;
      }

      // Assignee
      if (assigneeFilter === 'ME') {
        if (t.assignedToId !== 1) return false;
      } else if (assigneeFilter === 'UNASSIGNED') {
        if (t.assignedToId !== null) return false;
      }

      return true;
    });
  }, [tasks, search, statusFilter, priorityFilter, assigneeFilter]);

  function getUserLabel(userId: number | null) {
    if (!userId) return null;
    const u = usersMap.get(userId);
    return u || `User #${userId}`;
  }

  function formatDate(iso: string) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  }

  return (
    <div>
      {/* Search & Filter Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          padding: 16,
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* Top Controls Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Search box */}
          <div style={{ position: 'relative', minWidth: 260, flex: 1, maxWidth: 420 }}>
            <i
              className="fas fa-search"
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: 13,
              }}
            />
            <input
              className="form-control"
              placeholder="Filter tasks by monogram (T12), title, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 34 }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                <i className="fas fa-times-circle" />
              </button>
            )}
          </div>

          {/* Priority & Assignee filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: 140 }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'ALL')}
            >
              <option value="ALL">All Priorities</option>
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_CONFIG[p]?.label || p}
                </option>
              ))}
            </select>

            <select
              className="form-control"
              style={{ width: 'auto', minWidth: 140 }}
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value as 'ALL' | 'ME' | 'UNASSIGNED')}
            >
              <option value="ALL">All Assignees</option>
              <option value="ME">Assigned to Me</option>
              <option value="UNASSIGNED">Unassigned</option>
            </select>

            <button
              type="button"
              className="btn-primary"
              onClick={onOpenCreateModal}
            >
              <i className="fas fa-plus" style={{ marginRight: 6 }} /> New Task
            </button>
          </div>
        </div>

        {/* Status Tabs Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderTop: '1px solid #f1f5f9',
            paddingTop: 12,
            gap: 8,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginRight: 4 }}>
            Status:
          </span>
          {(
            [
              { key: 'OPEN', label: 'Open' },
              { key: 'RESOLVED', label: 'Resolved' },
              { key: 'CLOSED', label: 'All Closed' },
              { key: 'ALL', label: 'All Tasks' },
            ] as const
          ).map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 16,
                  border: isActive ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  background: isActive ? '#eff6ff' : '#ffffff',
                  color: isActive ? '#2563eb' : '#64748b',
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}

          <div style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>
            Showing <strong>{filteredTasks.length}</strong> of {tasks.length} tasks
          </div>
        </div>
      </div>

      {/* Task Table Container */}
      {isLoading ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            padding: 48,
          }}
        >
          <Loader label="Loading tasks..." />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            padding: '54px 20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: '#f1f5f9',
              color: '#94a3b8',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 16px',
              fontSize: 22,
            }}
          >
            <i className="fas fa-inbox" />
          </div>
          <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
            No tasks found
          </h4>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b' }}>
            {search || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
              ? 'Try adjusting your search query or filters to find what you are looking for.'
              : 'Create your first task to start tracking work in Taskmite.'}
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenCreateModal}
          >
            <i className="fas fa-plus" style={{ marginRight: 6 }} /> Create Task
          </button>
        </div>
      ) : (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  <th style={{ padding: '12px 16px', width: 90 }}>ID</th>
                  <th style={{ padding: '12px 16px', width: 100 }}>Status</th>
                  <th style={{ padding: '12px 16px', width: 140 }}>Priority</th>
                  <th style={{ padding: '12px 16px' }}>Title</th>
                  <th style={{ padding: '12px 16px', width: 160 }}>Assigned To</th>
                  <th style={{ padding: '12px 16px', width: 120 }}>Created</th>
                  <th style={{ padding: '12px 16px', width: 80, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((t) => {
                  const pConf = PRIORITY_CONFIG[t.priority] || { label: t.priority, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: 'fa-minus' };
                  const sConf = STATUS_CONFIG[t.status] || { label: t.status, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', isOpen: true };
                  const assigneeName = getUserLabel(t.assignedToId);
                  const isClosed = !sConf.isOpen;

                  return (
                    <tr
                      key={t.id}
                      onClick={() => onSelectTask(t)}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'background-color 0.12s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Monogram Badge */}
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: 13,
                            color: '#2563eb',
                            background: '#eff6ff',
                            padding: '3px 8px',
                            borderRadius: 4,
                            border: '1px solid #bfdbfe',
                            display: 'inline-block',
                          }}
                        >
                          T{t.taskNumber}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 11,
                            fontWeight: 600,
                            color: sConf.color,
                            background: sConf.bg,
                            border: `1px solid ${sConf.border}`,
                            padding: '3px 8px',
                            borderRadius: 12,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: sConf.color,
                            }}
                          />
                          {sConf.label}
                        </span>
                      </td>

                      {/* Priority */}
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 11,
                            fontWeight: 700,
                            color: pConf.color,
                            background: pConf.bg,
                            border: `1px solid ${pConf.border}`,
                            padding: '3px 8px',
                            borderRadius: 4,
                          }}
                        >
                          <i className={`fas ${pConf.icon}`} style={{ fontSize: 10 }} />
                          {pConf.label}
                        </span>
                      </td>

                      {/* Title */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: isClosed ? '#64748b' : '#1e293b',
                              textDecoration: isClosed ? 'line-through' : 'none',
                            }}
                          >
                            {t.title}
                          </span>
                          {t.parentTaskId && (
                            <span
                              style={{
                                fontSize: 10,
                                background: '#f1f5f9',
                                color: '#64748b',
                                padding: '1px 5px',
                                borderRadius: 3,
                              }}
                            >
                              Subtask
                            </span>
                          )}
                        </div>
                        {t.description && (
                          <p
                            style={{
                              margin: '2px 0 0',
                              fontSize: 12,
                              color: '#94a3b8',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: 500,
                            }}
                          >
                            {t.description}
                          </p>
                        )}
                      </td>

                      {/* Assignee */}
                      <td style={{ padding: '12px 16px' }}>
                        {assigneeName ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: '#e0e7ff',
                                color: '#4338ca',
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: 10,
                                fontWeight: 700,
                              }}
                            >
                              {assigneeName.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: 12, color: '#334155', fontWeight: 500 }}>
                              {assigneeName}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                            None
                          </span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>
                        {formatDate(t.createdAt)}
                      </td>

                      {/* Action */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {t.status === 'OPEN' && onQuickResolve ? (
                          <button
                            type="button"
                            title="Mark Resolved"
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickResolve(t);
                            }}
                            style={{
                              background: '#f0fdf4',
                              border: '1px solid #bbf7d0',
                              color: '#16a34a',
                              borderRadius: 4,
                              padding: '4px 8px',
                              cursor: 'pointer',
                              fontSize: 12,
                            }}
                          >
                            <i className="fas fa-check" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="View Task"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              fontSize: 12,
                            }}
                          >
                            <i className="fas fa-chevron-right" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
