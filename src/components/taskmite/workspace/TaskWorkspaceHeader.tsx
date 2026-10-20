import React from 'react';
import type { TaskWorkspaceHeaderProps } from './types';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../taskConstants';

export const TaskWorkspaceHeader: React.FC<TaskWorkspaceHeaderProps> = ({
  task,
  assigneeName,
  onBack,
  onUpdateField,
  onDeleteTask,
}) => {
  const pConf = PRIORITY_CONFIG[task.priority] || {
    label: task.priority,
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: 'fa-minus',
  };
  const sConf = STATUS_CONFIG[task.status] || {
    label: task.status,
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    isOpen: true,
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          className="btn-outline"
          onClick={onBack}
          style={{ fontSize: 12, padding: '6px 12px' }}
        >
          <i className="fas fa-arrow-left" style={{ marginRight: 6 }} /> Back to Tasks
        </button>

        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 16,
            fontWeight: 800,
            color: '#2563eb',
            background: '#eff6ff',
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid #bfdbfe',
          }}
        >
          T{task.taskNumber}
        </span>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 12,
            fontWeight: 600,
            color: sConf.color,
            background: sConf.bg,
            border: `1px solid ${sConf.border}`,
            padding: '3px 10px',
            borderRadius: 12,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: sConf.color,
            }}
          />
          {sConf.label}
        </span>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 12,
            fontWeight: 700,
            color: pConf.color,
            background: pConf.bg,
            border: `1px solid ${pConf.border}`,
            padding: '3px 10px',
            borderRadius: 6,
          }}
        >
          <i className={`fas ${pConf.icon}`} />
          {pConf.label}
        </span>

        {assigneeName && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
              fontWeight: 500,
              color: '#334155',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '3px 10px',
              borderRadius: 12,
            }}
          >
            <i className="fas fa-user" style={{ fontSize: 10, color: '#64748b' }} />
            {assigneeName}
          </span>
        )}
      </div>

      {/* Header Right Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {task.assignedToId !== 1 && (
          <button
            type="button"
            className="btn-outline"
            onClick={() => onUpdateField({ assignedToId: 1 })}
            style={{ fontSize: 12 }}
          >
            <i className="fas fa-hand-paper" style={{ marginRight: 6, color: '#4f46e5' }} />
            Assign to me
          </button>
        )}

        {task.status === 'OPEN' ? (
          <button
            type="button"
            className="btn-outline"
            onClick={() => onUpdateField({ status: 'RESOLVED' })}
            style={{ fontSize: 12, color: '#16a34a', borderColor: '#bbf7d0' }}
          >
            <i className="fas fa-check" style={{ marginRight: 6 }} /> Close as Resolved
          </button>
        ) : (
          <button
            type="button"
            className="btn-outline"
            onClick={() => onUpdateField({ status: 'OPEN' })}
            style={{ fontSize: 12 }}
          >
            <i className="fas fa-undo" style={{ marginRight: 6 }} /> Reopen Task
          </button>
        )}

        <button
          type="button"
          className="btn-outline"
          onClick={onDeleteTask}
          title="Delete Task"
          style={{ fontSize: 12, color: '#dc2626', borderColor: '#fecaca' }}
        >
          <i className="fas fa-trash-alt" />
        </button>
      </div>
    </div>
  );
};
