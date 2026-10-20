import React from 'react';
import type { CandidateEditModalProps } from './types';
import type { AccountStatus, VerificationStatus } from '../../../types/platformUsers';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';

export const CandidateEditModal: React.FC<CandidateEditModalProps> = ({
  isOpen,
  editForm,
  onEditFormChange,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

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
          maxWidth: 580,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          padding: '24px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: 14,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
            {editForm.id ? `Edit Candidate: ${editForm.name}` : 'Add New Candidate'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 18, color: '#94a3b8', cursor: 'pointer' }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
              Full Name *
            </label>
            <Input
              required
              value={editForm.name || ''}
              onChange={(e) => onEditFormChange({ ...editForm, name: e.target.value })}
              placeholder="e.g. Aarav Sharma"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Email Address *
              </label>
              <Input
                required
                type="email"
                value={editForm.email || ''}
                onChange={(e) => onEditFormChange({ ...editForm, email: e.target.value })}
                placeholder="aarav@example.com"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Phone Number
              </label>
              <Input
                value={editForm.phone || ''}
                onChange={(e) => onEditFormChange({ ...editForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Location / City
              </label>
              <Input
                value={editForm.location || ''}
                onChange={(e) => onEditFormChange({ ...editForm, location: e.target.value })}
                placeholder="Bengaluru, Karnataka"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Experience Summary
              </label>
              <Input
                value={editForm.experience || ''}
                onChange={(e) => onEditFormChange({ ...editForm, experience: e.target.value })}
                placeholder="e.g. 2.5 yrs Experience"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Degree / Qualification
              </label>
              <Input
                value={editForm.education || ''}
                onChange={(e) => onEditFormChange({ ...editForm, education: e.target.value })}
                placeholder="B.Tech Computer Science"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                College / University
              </label>
              <Input
                value={editForm.college || ''}
                onChange={(e) => onEditFormChange({ ...editForm, college: e.target.value })}
                placeholder="IIT Kharagpur"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Account Status
              </label>
              <select
                value={editForm.accountStatus || 'Active'}
                onChange={(e) =>
                  onEditFormChange({ ...editForm, accountStatus: e.target.value as AccountStatus })
                }
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Verification Status
              </label>
              <select
                value={editForm.verificationStatus || 'Pending'}
                onChange={(e) =>
                  onEditFormChange({ ...editForm, verificationStatus: e.target.value as VerificationStatus })
                }
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13 }}
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
              Bio / Summary
            </label>
            <textarea
              rows={3}
              value={editForm.bio || ''}
              onChange={(e) => onEditFormChange({ ...editForm, bio: e.target.value })}
              placeholder="Short professional summary..."
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <i className="fas fa-save" style={{ marginRight: 6 }} /> Save Candidate
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
