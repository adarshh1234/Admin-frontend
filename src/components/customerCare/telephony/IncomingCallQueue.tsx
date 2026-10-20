import React from 'react';
import { Button } from '../../common/Button';
import type { IncomingCallCandidate } from './telephonyTypes';

interface IncomingCallQueueProps {
  incomingQueue: IncomingCallCandidate[];
  onAcceptCall: (candidate: IncomingCallCandidate) => void;
  onRejectCall: (candidate: IncomingCallCandidate) => void;
  onSimulateIncomingCall: () => void;
}

export const IncomingCallQueue: React.FC<IncomingCallQueueProps> = ({
  incomingQueue,
  onAcceptCall,
  onRejectCall,
  onSimulateIncomingCall,
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        padding: '20px 24px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
            Incoming Customer Queue ({incomingQueue.length})
          </h3>
          {incomingQueue.length > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: 12 }}>
              Live Inbound Feed
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onSimulateIncomingCall}
          style={{ fontSize: 12, padding: '6px 12px', gap: 6 }}
        >
          <i className="fas fa-plus" />
          <span>Enqueue Test Caller</span>
        </Button>
      </div>

      {incomingQueue.length === 0 ? (
        <div style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
          <i className="fas fa-phone-slash" style={{ fontSize: 28, marginBottom: 8, display: 'block', color: '#cbd5e1' }} />
          No incoming callers currently waiting in queue. Agent line is ready to receive calls.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {incomingQueue.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {item.customerAvatar}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>{item.customerName}</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: item.customerTier === 'Enterprise' ? '#fef3c7' : '#e0f2fe',
                        color: item.customerTier === 'Enterprise' ? '#92400e' : '#0369a1',
                      }}
                    >
                      {item.customerTier}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    <i className="fas fa-phone" style={{ marginRight: 4, fontSize: 10 }} />
                    {item.customerPhone} • {item.customerCompany}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                    <strong>Query:</strong> {item.reason}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onRejectCall(item)}
                  style={{ fontSize: 12, padding: '7px 14px', color: '#dc2626', borderColor: '#fca5a5' }}
                >
                  Decline
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => onAcceptCall(item)}
                  style={{ fontSize: 12.5, padding: '7px 16px', background: '#16a34a', borderColor: '#16a34a', gap: 6 }}
                >
                  <i className="fas fa-phone-alt" />
                  <span>Attend Call</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
