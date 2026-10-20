import React from 'react';
import { Button } from '../../common/Button';
import type { UserManagementComingSoonProps } from './types';

export const UserManagementComingSoon: React.FC<UserManagementComingSoonProps> = ({ onBackToDashboard }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px 80px',
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e9edf4',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        minHeight: '460px',
      }}
    >
      {/* Icon with radial glow */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 130,
            height: 130,
            background: 'radial-gradient(circle, rgba(14, 116, 144, 0.18) 0%, rgba(14, 116, 144, 0) 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 22,
            background: 'linear-gradient(180deg, #0b2546 0%, #0265c2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: 32,
            boxShadow: '0 10px 25px rgba(2, 101, 194, 0.28)',
            position: 'relative',
          }}
        >
          <i className="fas fa-users" />
        </div>
      </div>

      {/* Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 16px',
          borderRadius: 20,
          background: '#e0f2fe',
          border: '1px solid #bae6fd',
          color: '#0369a1',
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 20,
        }}
      >
        <i className="fas fa-sparkles" style={{ fontSize: 12 }} />
        Coming Soon
      </div>

      {/* Main Heading */}
      <h1
        style={{
          fontSize: 36,
          fontWeight: 800,
          color: '#091e42',
          margin: '0 0 12px 0',
          letterSpacing: '-0.02em',
          lineHeight: 1.25,
        }}
      >
        <span style={{ color: '#0066cc' }}>User Management</span> is coming soon
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: 15,
          color: '#64748b',
          maxWidth: 480,
          margin: '0 0 30px 0',
          lineHeight: 1.6,
        }}
      >
        User Management features will be available here soon.
      </p>

      {/* Back to Dashboard Button */}
      <Button
        variant="primary"
        onClick={() => {
          if (onBackToDashboard) {
            onBackToDashboard();
          } else {
            window.location.hash = '#dashboard';
          }
        }}
        style={{
          background: 'linear-gradient(180deg, #0b2546 0%, #0265c2 100%)',
          borderRadius: 24,
          padding: '11px 26px',
          fontSize: 14,
          fontWeight: 600,
          color: '#ffffff',
          border: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 6px 18px rgba(2, 101, 194, 0.28)',
          cursor: 'pointer',
        }}
      >
        <i className="fas fa-arrow-left" /> Back to Dashboard
      </Button>
    </div>
  );
};
