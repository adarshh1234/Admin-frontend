import type { TaskPriority, TaskStatus, TaskVisibility } from '../../types/taskmite';

export interface PriorityMeta {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
  badgeBg: string;
}

export const PRIORITY_CONFIG: Record<TaskPriority, PriorityMeta> = {
  UNBREAK_NOW: {
    label: 'Unbreak Now!',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    icon: 'fa-fire',
    badgeBg: '#dc2626',
  },
  NEEDS_TRIAGE: {
    label: 'Needs Triage',
    color: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa',
    icon: 'fa-exclamation-circle',
    badgeBg: '#ea580c',
  },
  HIGH: {
    label: 'High',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    icon: 'fa-angle-double-up',
    badgeBg: '#d97706',
  },
  NORMAL: {
    label: 'Normal',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: 'fa-minus',
    badgeBg: '#2563eb',
  },
  LOW: {
    label: 'Low',
    color: '#64748b',
    bg: '#f8fafc',
    border: '#e2e8f0',
    icon: 'fa-angle-down',
    badgeBg: '#64748b',
  },
  WISHLIST: {
    label: 'Wishlist',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    icon: 'fa-star',
    badgeBg: '#7c3aed',
  },
};

export interface StatusMeta {
  label: string;
  color: string;
  bg: string;
  border: string;
  isOpen: boolean;
}

export const STATUS_CONFIG: Record<TaskStatus, StatusMeta> = {
  OPEN: {
    label: 'Open',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    isOpen: true,
  },
  RESOLVED: {
    label: 'Resolved',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    isOpen: false,
  },
  WONT_FIX: {
    label: "Won't Fix",
    color: '#64748b',
    bg: '#f8fafc',
    border: '#cbd5e1',
    isOpen: false,
  },
  INVALID: {
    label: 'Invalid',
    color: '#94a3b8',
    bg: '#f1f5f9',
    border: '#cbd5e1',
    isOpen: false,
  },
  SPITE: {
    label: 'Out of Spite',
    color: '#e11d48',
    bg: '#fff1f2',
    border: '#fecdd3',
    isOpen: false,
  },
};

export const TASK_STATUSES: TaskStatus[] = [
  'OPEN',
  'RESOLVED',
  'WONT_FIX',
  'INVALID',
  'SPITE',
];

export const TASK_PRIORITIES: TaskPriority[] = [
  'UNBREAK_NOW',
  'NEEDS_TRIAGE',
  'HIGH',
  'NORMAL',
  'LOW',
  'WISHLIST',
];

export const TASK_VISIBILITIES: TaskVisibility[] = ['ALL_USERS', 'CUSTOM'];
