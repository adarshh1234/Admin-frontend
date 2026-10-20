import React from 'react';
import type { CandidateDetailModalProps } from './types';
import { AccountStatusBadge, VerificationBadge } from '../PlatformStatusBadge';
import { Button } from '../../common/Button';
import { useToast } from '../../../hooks/useToast';

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  isOpen,
  candidate,
  onClose,
  onVerifyStatus,
}) => {
  const { showToast } = useToast();

  if (!isOpen || !candidate) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 680,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          padding: '24px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 20,
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {candidate.avatar || candidate.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                {candidate.name}
              </h2>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                <AccountStatusBadge status={candidate.accountStatus} />
                <VerificationBadge status={candidate.verificationStatus} />
                <span style={{ fontSize: 12, color: '#64748b' }}>Registered {candidate.registrationDate}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 20, color: '#94a3b8', cursor: 'pointer' }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Profile Completion Bar */}
        <div
          style={{
            background: '#f8fafc',
            padding: '14px 18px',
            borderRadius: 10,
            marginBottom: 20,
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#334155',
              marginBottom: 6,
            }}
          >
            <span>Profile Completion Score</span>
            <span style={{ color: '#2563eb' }}>{candidate.profileCompletion}%</span>
          </div>
          <div style={{ width: '100%', height: 8, background: '#e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
            <div
              style={{
                width: `${candidate.profileCompletion}%`,
                height: '100%',
                background: candidate.profileCompletion > 80 ? '#16a34a' : '#2563eb',
                borderRadius: 10,
              }}
            />
          </div>
        </div>

        {/* Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Contact Information
            </h4>
            <div style={{ background: '#fafcff', padding: 12, borderRadius: 8, border: '1px solid #e9edf4', fontSize: 13 }}>
              <div style={{ marginBottom: 6 }}>
                <strong>Email:</strong> {candidate.email}
              </div>
              <div style={{ marginBottom: 6 }}>
                <strong>Phone:</strong> {candidate.phone}
              </div>
              <div>
                <strong>Location:</strong> {candidate.location}
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Education &amp; Experience
            </h4>
            <div style={{ background: '#fafcff', padding: 12, borderRadius: 8, border: '1px solid #e9edf4', fontSize: 13 }}>
              <div style={{ marginBottom: 6 }}>
                <strong>Degree:</strong> {candidate.education}
              </div>
              <div style={{ marginBottom: 6 }}>
                <strong>College:</strong> {candidate.college}
              </div>
              <div>
                <strong>Experience:</strong> {candidate.experience} ({candidate.experienceYears} yrs)
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {candidate.bio && (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Candidate Bio / Overview
            </h4>
            <div style={{ background: '#fafcff', padding: 14, borderRadius: 8, border: '1px solid #e9edf4', fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
              {candidate.bio}
            </div>
          </div>
        )}

        {/* Skills */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Key Technical &amp; Domain Skills
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {candidate.skills.map((s) => (
              <span
                key={s}
                style={{
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '4px 12px',
                  borderRadius: 16,
                  fontSize: 12,
                  fontWeight: 600,
                  border: '1px solid #bfdbfe',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Resume File */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Uploaded Resume
          </h4>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '10px 16px',
              borderRadius: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="fas fa-file-pdf" style={{ color: '#ef4444', fontSize: 18 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                  {candidate.resumeName || 'Candidate_Resume.pdf'}
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{candidate.resumeSize || '1.2 MB'}</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast(`Opening ${candidate.resumeName || 'Resume'}…`, 'info')}
            >
              <i className="fas fa-download" style={{ marginRight: 4 }} /> Preview &amp; Download
            </Button>
          </div>
        </div>

        {/* Verification Actions Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f1f5f9',
            padding: '14px 18px',
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <div style={{ fontSize: 12.5, color: '#475569' }}>
            <strong>Verification Status:</strong> {candidate.verificationStatus}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {candidate.verificationStatus !== 'Verified' && (
              <Button
                variant="primary"
                size="sm"
                style={{ background: '#16a34a', borderColor: '#16a34a' }}
                onClick={() => onVerifyStatus(candidate, 'Verified')}
              >
                <i className="fas fa-check" style={{ marginRight: 4 }} /> Approve &amp; Verify
              </Button>
            )}
            {candidate.verificationStatus !== 'Rejected' && (
              <Button
                variant="outline"
                size="sm"
                style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                onClick={() => onVerifyStatus(candidate, 'Rejected')}
              >
                <i className="fas fa-times" style={{ marginRight: 4 }} /> Reject Verification
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
