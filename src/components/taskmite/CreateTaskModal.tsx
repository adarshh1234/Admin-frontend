import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../services/taskmiteApiClient';
import { taskmiteService } from '../../services/taskmite.service';
import type { Task, TaskPriority, TaskStatus, TaskVisibility } from '../../types/taskmite';
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_VISIBILITIES,
} from './taskConstants';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
  initialParentTaskId?: number;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
  initialParentTaskId,
}: CreateTaskModalProps) {
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('NORMAL');
  const [status, setStatus] = useState<TaskStatus>('OPEN');
  const [visibility, setVisibility] = useState<TaskVisibility>('ALL_USERS');
  const [assignedToId, setAssignedToId] = useState<string>('');
  const [parentTaskId, setParentTaskId] = useState<string>(
    initialParentTaskId ? String(initialParentTaskId) : '',
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialParentTaskId) {
      setParentTaskId(String(initialParentTaskId));
    }
  }, [initialParentTaskId]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      showToast('Task title is required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newTask = await taskmiteService.createTask({
        title: trimmedTitle,
        description: description.trim() || undefined,
        priority,
        status,
        visibility,
        assignedToId: assignedToId ? Number(assignedToId) : undefined,
        parentTaskId: parentTaskId ? Number(parentTaskId) : undefined,
      });

      showToast(`Task T${newTask.taskNumber} created successfully.`, 'success');
      onTaskCreated(newTask);
      onClose();

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('NORMAL');
      setStatus('OPEN');
      setAssignedToId('');
      setParentTaskId('');
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : 'Failed to create task.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          width: '100%',
          maxWidth: 640,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafbfc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#eff6ff',
                color: '#2563eb',
                display: 'grid',
                placeItems: 'center',
                fontSize: 14,
              }}
            >
              <i className="fas fa-check-double" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Create New Task
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                Taskmite developer task & ticket tracking
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: 16,
              padding: 4,
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: 20,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
              Title *
            </label>
            <input
              className="form-control"
              placeholder="Summary of the task or bug report..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Priority selector buttons */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
              Priority
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: 8,
              }}
            >
              {TASK_PRIORITIES.map((p) => {
                const conf = PRIORITY_CONFIG[p];
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSelected ? `2px solid ${conf.color}` : '1px solid #e2e8f0',
                      background: isSelected ? conf.bg : '#ffffff',
                      color: isSelected ? conf.color : '#475569',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    <i className={`fas ${conf.icon}`} style={{ color: conf.color, width: 14 }} />
                    <span>{conf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status & Assigned To Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                Initial Status
              </label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                Assignee
              </label>
              <select
                className="form-control"
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
              >
                <option value="">Unassigned</option>
                <option value="1">Labeeb EEE (@labeeb.eee)</option>
                <option value="2">Dr. Sarah Mitchell (@sarah.mitchell)</option>
                <option value="3">John Miller (@john.manager)</option>
                <option value="4">Priya Sharma (@priya.hr)</option>
              </select>
            </div>
          </div>

          {/* Visibility & Parent Task ID Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                Visibility
              </label>
              <select
                className="form-control"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as TaskVisibility)}
              >
                {TASK_VISIBILITIES.map((v) => (
                  <option key={v} value={v}>
                    {v === 'ALL_USERS' ? 'All Users' : 'Custom'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                Parent Task ID (Optional)
              </label>
              <input
                className="form-control"
                type="number"
                placeholder="e.g. 10 (creates subtask)"
                value={parentTaskId}
                onChange={(e) => setParentTaskId(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#334155' }}>
              Description
            </label>
            <textarea
              className="form-control"
              placeholder="Provide context, reproduction steps, technical notes, or references..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {/* Footer Buttons */}
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              paddingTop: 12,
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <button
              type="button"
              className="btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{
                background: priority === 'UNBREAK_NOW' ? '#dc2626' : undefined,
                borderColor: priority === 'UNBREAK_NOW' ? '#dc2626' : undefined,
              }}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: 6 }} /> Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus" style={{ marginRight: 6 }} /> Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
