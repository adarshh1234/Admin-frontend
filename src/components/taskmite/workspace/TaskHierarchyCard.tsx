import React from 'react';
import type { TaskHierarchyCardProps } from './types';
import { STATUS_CONFIG } from '../taskConstants';

export const TaskHierarchyCard: React.FC<TaskHierarchyCardProps> = ({
  parentTask,
  subtasks,
  onOpenAddSubtask,
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        padding: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-sitemap" style={{ color: '#2563eb' }} />
          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
            Hierarchy & Subtasks
          </h4>
        </div>
        <button
          type="button"
          className="btn-outline"
          onClick={onOpenAddSubtask}
          style={{ fontSize: 11, padding: '4px 8px' }}
        >
          <i className="fas fa-plus" style={{ marginRight: 4 }} /> Add Subtask
        </button>
      </div>

      {parentTask && (
        <div
          style={{
            background: '#f8fafc',
            borderRadius: 6,
            padding: '8px 12px',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
          }}
        >
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Parent:</span>
          <span
            style={{
              fontFamily: 'monospace',
              fontWeight: 700,
              color: '#2563eb',
            }}
          >
            T{parentTask.taskNumber}
          </span>
          <span style={{ color: '#1e293b', fontWeight: 500 }}>{parentTask.title}</span>
        </div>
      )}

      {subtasks.length === 0 ? (
        <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
          No subtasks attached to this task.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {subtasks.map((st) => (
            <div
              key={st.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                background: '#f8fafc',
                borderRadius: 6,
                border: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#2563eb',
                  }}
                >
                  T{st.taskNumber}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: st.status !== 'OPEN' ? '#64748b' : '#1e293b',
                    textDecoration: st.status !== 'OPEN' ? 'line-through' : 'none',
                  }}
                >
                  {st.title}
                </span>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 4,
                  color: STATUS_CONFIG[st.status]?.color || '#16a34a',
                  background: STATUS_CONFIG[st.status]?.bg || '#f0fdf4',
                }}
              >
                {STATUS_CONFIG[st.status]?.label || st.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
