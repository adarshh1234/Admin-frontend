import { useMemo } from 'react';
import type { TaskActivity, TaskComment } from '../../types/taskmite';
import { PRIORITY_CONFIG, STATUS_CONFIG } from './taskConstants';

interface TaskActivityFeedProps {
  activities: TaskActivity[];
  comments: TaskComment[];
  users?: { id: number; name?: string; username: string; displayName?: string }[];
  onDeleteComment?: (commentId: number) => Promise<void>;
}

type TimelineItem =
  | { kind: 'activity'; date: string; data: TaskActivity }
  | { kind: 'comment'; date: string; data: TaskComment };

export function TaskActivityFeed({
  activities,
  comments,
  users = [],
  onDeleteComment,
}: TaskActivityFeedProps) {
  const usersMap = useMemo(() => {
    const map = new Map<number, string>();
    map.set(1, 'Labeeb EEE');
    map.set(2, 'Dr. Sarah Mitchell');
    map.set(3, 'John Miller');
    map.set(4, 'Priya Sharma');
    users.forEach((u) => map.set(u.id, u.displayName || u.name || u.username));
    return map;
  }, [users]);

  function getUserLabel(userId: number) {
    const u = usersMap.get(userId);
    if (u) return u;
    return `User #${userId}`;
  }

  function formatDate(iso: string) {
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  }

  // Merge activities and comments chronologically
  const timelineItems: TimelineItem[] = useMemo(() => {
    const items: TimelineItem[] = [];

    activities.forEach((act) => {
      items.push({ kind: 'activity', date: act.createdAt, data: act });
    });

    comments.forEach((com) => {
      items.push({ kind: 'comment', date: com.createdAt, data: com });
    });

    items.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return items;
  }, [activities, comments]);

  if (timelineItems.length === 0) {
    return (
      <div
        style={{
          padding: '24px 16px',
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 13,
          background: '#f8fafc',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
        }}
      >
        No activity or comments on this task yet.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
      {timelineItems.map((item, index) => {
        if (item.kind === 'activity') {
          const act = item.data;
          const actorName = getUserLabel(act.userId);

          let icon = 'fa-history';
          let iconColor = '#64748b';
          let iconBg = '#f1f5f9';
          let text: React.ReactNode = null;

          switch (act.type) {
            case 'CREATED':
              icon = 'fa-plus';
              iconColor = '#16a34a';
              iconBg = '#f0fdf4';
              text = (
                <span>
                  <strong>{actorName}</strong> created this task.
                </span>
              );
              break;

            case 'STATUS_CHANGED':
              icon = 'fa-exchange-alt';
              iconColor = '#2563eb';
              iconBg = '#eff6ff';
              {
                const oldLabel = act.oldValue
                  ? STATUS_CONFIG[act.oldValue as keyof typeof STATUS_CONFIG]?.label || act.oldValue
                  : 'Open';
                const newLabel = act.newValue
                  ? STATUS_CONFIG[act.newValue as keyof typeof STATUS_CONFIG]?.label || act.newValue
                  : 'Resolved';
                text = (
                  <span>
                    <strong>{actorName}</strong> changed status from{' '}
                    <span style={{ fontWeight: 600, color: '#475569' }}>{oldLabel}</span> to{' '}
                    <span style={{ fontWeight: 600, color: '#2563eb' }}>{newLabel}</span>.
                  </span>
                );
              }
              break;

            case 'PRIORITY_CHANGED':
              icon = 'fa-flag';
              iconColor = '#ea580c';
              iconBg = '#fff7ed';
              {
                const oldLabel = act.oldValue
                  ? PRIORITY_CONFIG[act.oldValue as keyof typeof PRIORITY_CONFIG]?.label || act.oldValue
                  : 'Normal';
                const newLabel = act.newValue
                  ? PRIORITY_CONFIG[act.newValue as keyof typeof PRIORITY_CONFIG]?.label || act.newValue
                  : 'High';
                text = (
                  <span>
                    <strong>{actorName}</strong> updated priority from{' '}
                    <span style={{ fontWeight: 600, color: '#475569' }}>{oldLabel}</span> to{' '}
                    <span style={{ fontWeight: 600, color: '#ea580c' }}>{newLabel}</span>.
                  </span>
                );
              }
              break;

            case 'ASSIGNED':
              icon = 'fa-user-check';
              iconColor = '#4f46e5';
              iconBg = '#eef2ff';
              {
                const targetName = act.newValue
                  ? getUserLabel(Number(act.newValue))
                  : 'None';
                text = (
                  <span>
                    <strong>{actorName}</strong> assigned this task to{' '}
                    <span style={{ fontWeight: 600, color: '#4f46e5' }}>{targetName}</span>.
                  </span>
                );
              }
              break;

            case 'SUBSCRIBER_ADDED':
              icon = 'fa-bell';
              iconColor = '#0891b2';
              iconBg = '#ecfeff';
              {
                const subName = act.newValue
                  ? getUserLabel(Number(act.newValue))
                  : 'User';
                text = (
                  <span>
                    <strong>{actorName}</strong> added subscriber{' '}
                    <span style={{ fontWeight: 600, color: '#0891b2' }}>{subName}</span>.
                  </span>
                );
              }
              break;

            case 'SUBSCRIBER_REMOVED':
              icon = 'fa-bell-slash';
              iconColor = '#64748b';
              iconBg = '#f1f5f9';
              text = (
                <span>
                  <strong>{actorName}</strong> removed a subscriber.
                </span>
              );
              break;

            case 'TAG_ADDED':
              icon = 'fa-tag';
              iconColor = '#7c3aed';
              iconBg = '#f5f3ff';
              text = (
                <span>
                  <strong>{actorName}</strong> attached tag{' '}
                  <span style={{ fontWeight: 600, color: '#7c3aed' }}>#{act.newValue || 'tag'}</span>.
                </span>
              );
              break;

            case 'TAG_REMOVED':
              icon = 'fa-tag';
              iconColor = '#64748b';
              iconBg = '#f1f5f9';
              text = (
                <span>
                  <strong>{actorName}</strong> removed a tag.
                </span>
              );
              break;

            default:
              text = (
                <span>
                  <strong>{actorName}</strong> updated this task.
                </span>
              );
              break;
          }

          return (
            <div
              key={`activity-${act.id || index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 12px',
                background: '#fafbfc',
                borderRadius: 6,
                border: '1px solid #f1f5f9',
                fontSize: 13,
                color: '#334155',
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: iconBg,
                  color: iconColor,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 11,
                  flexShrink: 0,
                }}
              >
                <i className={`fas ${icon}`} />
              </div>
              <div style={{ flex: 1 }}>{text}</div>
              <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>
                {formatDate(act.createdAt)}
              </span>
            </div>
          );
        }

        // Comment
        const com = item.data;
        const authorName = getUserLabel(com.userId);

        return (
          <div
            key={`comment-${com.id || index}`}
            style={{
              background: '#ffffff',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            {/* Comment Header */}
            <div
              style={{
                background: '#f8fafc',
                padding: '10px 14px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: '#2563eb',
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                  {authorName}
                </span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>commented</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  {formatDate(com.createdAt)}
                </span>
                {onDeleteComment && (
                  <button
                    type="button"
                    title="Delete comment"
                    onClick={() => onDeleteComment(com.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: 12,
                      padding: 2,
                    }}
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
                )}
              </div>
            </div>

            {/* Comment Body */}
            <div
              style={{
                padding: '12px 16px',
                fontSize: 13,
                color: '#334155',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
              }}
            >
              {com.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
