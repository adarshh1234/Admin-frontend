import React from 'react';
import { Button } from '../../common/Button';
import type { IncomingCallCandidate } from './telephonyTypes';

interface IncomingCallAlertProps {
  ringingCall: IncomingCallCandidate | null;
  onAccept: (candidate: IncomingCallCandidate) => void;
  onReject: (candidate: IncomingCallCandidate) => void;
}

export const IncomingCallAlert: React.FC<IncomingCallAlertProps> = ({
  ringingCall,
  onAccept,
  onReject,
}) => {
  if (!ringingCall) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '2px solid #22c55e',
        borderRadius: 16,
        padding: '20px 24px',
        boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#22c55e',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            boxShadow: '0 0 0 8px rgba(34, 197, 94, 0.25)',
          }}
        >
          <i className="fas fa-phone-volume" />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                background: '#16a34a',
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 6,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Incoming Call · Ringing
            </span>
            <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>
              Tier: {ringingCall.customerTier}
            </span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#14532d', marginTop: 4 }}>
            {ringingCall.customerName}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#166534', display: 'flex', alignItems: 'center', gap: 12, marginTop: 2 }}>
            <span><i className="fas fa-phone" style={{ marginRight: 6 }} />{ringingCall.customerPhone}</span>
            <span>•</span>
            <span><i className="fas fa-building" style={{ marginRight: 6 }} />{ringingCall.customerCompany}</span>
          </div>
          <div style={{ fontSize: 13, color: '#15803d', marginTop: 4 }}>
            <strong>Reason:</strong> {ringingCall.reason}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button
          type="button"
          onClick={() => onReject(ringingCall)}
          style={{
            background: '#ffffff',
            border: '1px solid #f87171',
            color: '#dc2626',
            fontWeight: 700,
            fontSize: 14,
            padding: '12px 20px',
            borderRadius: 12,
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <i className="fas fa-phone-slash" />
          <span>Decline / Reject</span>
        </Button>

        <Button
          type="button"
          onClick={() => onAccept(ringingCall)}
          style={{
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 15,
            padding: '12px 28px',
            borderRadius: 12,
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <i className="fas fa-phone" />
          <span>Accept & Attend Call</span>
        </Button>
      </div>
    </div>
  );
};
