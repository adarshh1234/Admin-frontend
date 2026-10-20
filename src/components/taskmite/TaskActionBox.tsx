import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import type { TaskPriority, TaskStatus } from '../../types/taskmite';
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from './taskConstants';

interface TaskActionBoxProps {
  currentStatus: TaskStatus;
  currentPriority: TaskPriority;
  isSubmitting: boolean;
  onSubmit: (data: {
    comment?: string;
    newStatus?: TaskStatus;
    newPriority?: TaskPriority;
  }) => Promise<void>;
}

export function TaskActionBox({
  currentStatus,
  currentPriority,
  isSubmitting,
  onSubmit,
}: TaskActionBoxProps) {
  const { showToast } = useToast();
  const [comment, setComment] = useState('');
  const [statusAction, setStatusAction] = useState<TaskStatus | 'NO_CHANGE'>('NO_CHANGE');
  const [priorityAction, setPriorityAction] = useState<TaskPriority | 'NO_CHANGE'>('NO_CHANGE');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedComment = comment.trim();
    const hasStatusChange = statusAction !== 'NO_CHANGE' && statusAction !== currentStatus;
    const hasPriorityChange = priorityAction !== 'NO_CHANGE' && priorityAction !== currentPriority;

    if (!trimmedComment && !hasStatusChange && !hasPriorityChange) {
      showToast('Please enter a comment or choose an action to apply.', 'info');
      return;
    }

    await onSubmit({
      comment: trimmedComment || undefined,
      newStatus: hasStatusChange ? statusAction : undefined,
      newPriority: hasPriorityChange ? priorityAction : undefined,
    });

    setComment('');
    setStatusAction('NO_CHANGE');
    setPriorityAction('NO_CHANGE');
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        padding: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <i className="fas fa-comment-dots" style={{ color: '#2563eb' }} />
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
          Add Comment & Update Task
        </h4>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Comment textarea */}
        <div style={{ marginBottom: 12 }}>
          <textarea
            className="form-control"
            placeholder="Write a comment, note reproduction steps, or mention other tasks (e.g. T42)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        {/* Action Controls Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            paddingTop: 8,
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Status change select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                Status:
              </span>
              <select
                className="form-control"
                style={{ width: 'auto', fontSize: 12, padding: '4px 8px' }}
                value={statusAction}
                onChange={(e) => setStatusAction(e.target.value as TaskStatus | 'NO_CHANGE')}
              >
                <option value="NO_CHANGE">Leave Status as {STATUS_CONFIG[currentStatus]?.label || currentStatus}</option>
                {TASK_STATUSES.filter((s) => s !== currentStatus).map((s) => (
                  <option key={s} value={s}>
                    Change Status to {STATUS_CONFIG[s]?.label || s}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority change select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                Priority:
              </span>
              <select
                className="form-control"
                style={{ width: 'auto', fontSize: 12, padding: '4px 8px' }}
                value={priorityAction}
                onChange={(e) => setPriorityAction(e.target.value as TaskPriority | 'NO_CHANGE')}
              >
                <option value="NO_CHANGE">Leave Priority as {PRIORITY_CONFIG[currentPriority]?.label || currentPriority}</option>
                {TASK_PRIORITIES.filter((p) => p !== currentPriority).map((p) => (
                  <option key={p} value={p}>
                    Change Priority to {PRIORITY_CONFIG[p]?.label || p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {currentStatus === 'OPEN' && statusAction === 'NO_CHANGE' && (
              <button
                type="button"
                className="btn-outline"
                onClick={() => setStatusAction('RESOLVED')}
                style={{ fontSize: 12, padding: '6px 12px' }}
              >
                <i className="fas fa-check" style={{ marginRight: 4, color: '#16a34a' }} />
                Set to Resolved
              </button>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{ fontSize: 13, padding: '6px 16px' }}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: 6 }} /> Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane" style={{ marginRight: 6 }} /> Submit Action
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
