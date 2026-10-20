import React from 'react';
import type { TaskSubscribersCardProps } from './types';

export const TaskSubscribersCard: React.FC<TaskSubscribersCardProps> = ({
  subscribers,
  isSubscribed,
  selectedSubUserId,
  getUserLabel,
  onToggleSubscribe,
  onSelectedSubUserChange,
  onAddOtherSubscriber,
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
        <h4
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Subscribers
        </h4>
        <button
          type="button"
          onClick={onToggleSubscribe}
          style={{
            background: 'none',
            border: 'none',
            color: isSubscribed ? '#dc2626' : '#2563eb',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {isSubscribed ? 'Unsubscribe' : '+ Subscribe Me'}
        </button>
      </div>

      {/* Subscriber List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {subscribers.length === 0 ? (
          <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No subscribers.</span>
        ) : (
          subscribers.map((sub) => {
            const name = getUserLabel(sub.userId);
            return (
              <div
                key={sub.userId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  color: '#334155',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <i className="fas fa-bell" style={{ fontSize: 10, color: '#0891b2' }} />
                  <span>{name}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add other subscriber */}
      <div style={{ display: 'flex', gap: 6 }}>
        <select
          className="form-control"
          style={{ fontSize: 12, padding: '4px 8px' }}
          value={selectedSubUserId}
          onChange={(e) => onSelectedSubUserChange(e.target.value)}
        >
          <option value="">Add user...</option>
          <option value="1">Labeeb EEE</option>
          <option value="2">Dr. Sarah Mitchell</option>
          <option value="3">John Miller</option>
          <option value="4">Priya Sharma</option>
        </select>
        <button
          type="button"
          className="btn-outline"
          disabled={!selectedSubUserId}
          onClick={onAddOtherSubscriber}
          style={{ fontSize: 12, padding: '4px 8px' }}
        >
          Add
        </button>
      </div>
    </div>
  );
};
