import React from 'react';
import type { TaskPropertiesCardProps } from './types';
import type { TaskPriority, TaskStatus } from '../../../types/taskmite';
import { PRIORITY_CONFIG, STATUS_CONFIG, TASK_PRIORITIES, TASK_STATUSES } from '../taskConstants';

export const TaskPropertiesCard: React.FC<TaskPropertiesCardProps> = ({
  task,
  authorName,
  onUpdateField,
}) => {
  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        padding: 16,
      }}
    >
      <h4
        style={{
          margin: '0 0 14px',
          fontSize: 13,
          fontWeight: 700,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        Task Properties
      </h4>

      {/* Status Select */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
          Status
        </label>
        <select
          className="form-control"
          value={task.status}
          onChange={(e) => onUpdateField({ status: e.target.value as TaskStatus })}
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
      </div>

      {/* Priority Select */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
          Priority
        </label>
        <select
          className="form-control"
          value={task.priority}
          onChange={(e) => onUpdateField({ priority: e.target.value as TaskPriority })}
        >
          {TASK_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_CONFIG[p].label}
            </option>
          ))}
        </select>
      </div>

      {/* Assignee Select */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
          Assigned To
        </label>
        <select
          className="form-control"
          value={task.assignedToId ?? ''}
          onChange={(e) =>
            onUpdateField({
              assignedToId: e.target.value ? Number(e.target.value) : null,
            })
          }
        >
          <option value="">Unassigned</option>
          <option value="1">Labeeb EEE (@labeeb.eee)</option>
          <option value="2">Dr. Sarah Mitchell (@sarah.mitchell)</option>
          <option value="3">John Miller (@john.manager)</option>
          <option value="4">Priya Sharma (@priya.hr)</option>
        </select>
      </div>

      {/* Author */}
      <div style={{ marginBottom: 14, fontSize: 12 }}>
        <span style={{ color: '#64748b', display: 'block', marginBottom: 2 }}>Created By:</span>
        <span style={{ fontWeight: 600, color: '#1e293b' }}>{authorName || `User #${task.createdById}`}</span>
      </div>

      {/* Dates */}
      <div style={{ fontSize: 12, color: '#94a3b8' }}>
        <div>Created: {formatDate(task.createdAt)}</div>
        <div>Updated: {formatDate(task.updatedAt)}</div>
      </div>
    </div>
  );
};
