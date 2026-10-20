import { useMemo, useState } from 'react';
import type { Task, TaskStatus } from '../../types/taskmite';
import { PRIORITY_CONFIG } from './taskConstants';

interface TaskBoardProps {
  tasks: Task[];
  users?: { id: number; name?: string; username: string; displayName?: string }[];
  onSelectTask: (task: Task) => void;
  onUpdateTaskStatus: (taskId: number, newStatus: TaskStatus) => Promise<void>;
  onOpenCreateModal: () => void;
}

interface ColumnDef {
  id: string;
  title: string;
  badgeColor: string;
  badgeBg: string;
  filter: (t: Task) => boolean;
}

export function TaskBoard({
  tasks,
  users = [],
  onSelectTask,
  onUpdateTaskStatus,
  onOpenCreateModal,
}: TaskBoardProps) {
  const [boardSearch, setBoardSearch] = useState('');

  const usersMap = useMemo(() => {
    const map = new Map<number, string>();
    map.set(1, 'Labeeb EEE');
    map.set(2, 'Dr. Sarah Mitchell');
    map.set(3, 'John Miller');
    map.set(4, 'Priya Sharma');
    users.forEach((u) => map.set(u.id, u.displayName || u.name || u.username));
    return map;
  }, [users]);

  const columns: ColumnDef[] = [
    {
      id: 'TRIAGE',
      title: 'Needs Triage',
      badgeColor: '#ea580c',
      badgeBg: '#fff7ed',
      filter: (t) => t.status === 'OPEN' && t.priority === 'NEEDS_TRIAGE',
    },
    {
      id: 'URGENT',
      title: 'Unbreak Now / High',
      badgeColor: '#dc2626',
      badgeBg: '#fef2f2',
      filter: (t) =>
        t.status === 'OPEN' &&
        (t.priority === 'UNBREAK_NOW' || t.priority === 'HIGH'),
    },
    {
      id: 'BACKLOG',
      title: 'Open / Backlog',
      badgeColor: '#2563eb',
      badgeBg: '#eff6ff',
      filter: (t) =>
        t.status === 'OPEN' &&
        t.priority !== 'NEEDS_TRIAGE' &&
        t.priority !== 'UNBREAK_NOW' &&
        t.priority !== 'HIGH',
    },
    {
      id: 'RESOLVED',
      title: 'Resolved / Closed',
      badgeColor: '#16a34a',
      badgeBg: '#f0fdf4',
      filter: (t) => t.status !== 'OPEN',
    },
  ];

  const filteredTasks = useMemo(() => {
    const q = boardSearch.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (t) =>
        `t${t.taskNumber}`.includes(q) ||
        t.title.toLowerCase().includes(q) ||
        (t.description?.toLowerCase().includes(q) ?? false),
    );
  }, [tasks, boardSearch]);

  function getUserLabel(userId: number | null) {
    if (!userId) return null;
    return usersMap.get(userId) || `User #${userId}`;
  }

  return (
    <div>
      {/* Board Controls */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          padding: '12px 16px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ position: 'relative', minWidth: 260, flex: 1, maxWidth: 380 }}>
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
            placeholder="Search workboard cards..."
            value={boardSearch}
            onChange={(e) => setBoardSearch(e.target.value)}
            style={{ paddingLeft: 34 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>
            Workboard: <strong>{tasks.length}</strong> total tasks
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenCreateModal}
          >
            <i className="fas fa-plus" style={{ marginRight: 6 }} /> New Task
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {columns.map((col) => {
          const colTasks = filteredTasks.filter(col.filter);

          return (
            <div
              key={col.id}
              style={{
                background: '#f8fafc',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 450,
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  borderRadius: '10px 10px 0 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                    {col.title}
                  </h4>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: col.badgeColor,
                      background: col.badgeBg,
                      padding: '2px 8px',
                      borderRadius: 12,
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Card List */}
              <div
                style={{
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  flex: 1,
                  overflowY: 'auto',
                }}
              >
                {colTasks.length === 0 ? (
                  <div
                    style={{
                      padding: '36px 12px',
                      textAlign: 'center',
                      color: '#94a3b8',
                      fontSize: 13,
                      border: '1px dashed #cbd5e1',
                      borderRadius: 8,
                      margin: '8px 0',
                    }}
                  >
                    No tasks in this column
                  </div>
                ) : (
                  colTasks.map((t) => {
                    const pConf = PRIORITY_CONFIG[t.priority] || { label: t.priority, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: 'fa-minus' };
                    const assignee = getUserLabel(t.assignedToId);

                    return (
                      <div
                        key={t.id}
                        onClick={() => onSelectTask(t)}
                        style={{
                          background: '#ffffff',
                          borderRadius: 8,
                          border: '1px solid #e2e8f0',
                          borderLeft: `4px solid ${pConf.color}`,
                          padding: '12px 14px',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                        }}
                      >
                        {/* Top: Monogram & Priority */}
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
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: 12,
                              color: '#2563eb',
                            }}
                          >
                            T{t.taskNumber}
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: pConf.color,
                              background: pConf.bg,
                              border: `1px solid ${pConf.border}`,
                              padding: '2px 6px',
                              borderRadius: 4,
                            }}
                          >
                            <i className={`fas ${pConf.icon}`} style={{ marginRight: 3 }} />
                            {pConf.label}
                          </span>
                        </div>

                        {/* Title */}
                        <h5
                          style={{
                            margin: '0 0 8px',
                            fontSize: 13,
                            fontWeight: 600,
                            color: t.status !== 'OPEN' ? '#64748b' : '#0f172a',
                            textDecoration: t.status !== 'OPEN' ? 'line-through' : 'none',
                            lineHeight: 1.35,
                          }}
                        >
                          {t.title}
                        </h5>

                        {/* Bottom: Assignee & Quick Actions */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 10,
                            paddingTop: 8,
                            borderTop: '1px solid #f1f5f9',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            {assignee ? (
                              <>
                                <div
                                  style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    background: '#eff6ff',
                                    color: '#2563eb',
                                    display: 'grid',
                                    placeItems: 'center',
                                    fontSize: 10,
                                    fontWeight: 700,
                                  }}
                                >
                                  {assignee.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: 11, color: '#475569', fontWeight: 500 }}>
                                  {assignee}
                                </span>
                              </>
                            ) : (
                              <span style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>
                                Unassigned
                              </span>
                            )}
                          </div>

                          {/* Quick stage advance */}
                          <div
                            style={{ display: 'flex', gap: 4 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {t.status === 'OPEN' ? (
                              <button
                                type="button"
                                title="Resolve Task"
                                onClick={() => onUpdateTaskStatus(t.id, 'RESOLVED')}
                                style={{
                                  background: '#f0fdf4',
                                  border: '1px solid #bbf7d0',
                                  color: '#16a34a',
                                  borderRadius: 4,
                                  padding: '2px 6px',
                                  cursor: 'pointer',
                                  fontSize: 10,
                                  fontWeight: 600,
                                }}
                              >
                                <i className="fas fa-check" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                title="Reopen Task"
                                onClick={() => onUpdateTaskStatus(t.id, 'OPEN')}
                                style={{
                                  background: '#eff6ff',
                                  border: '1px solid #bfdbfe',
                                  color: '#2563eb',
                                  borderRadius: 4,
                                  padding: '2px 6px',
                                  cursor: 'pointer',
                                  fontSize: 10,
                                  fontWeight: 600,
                                }}
                              >
                                Reopen
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
