import React, { useState } from 'react';
import { userService, type UserAccount } from '../../../../services/user.service';
import { Button } from '../../../common/Button';
import { Input } from '../../../common/Input';
import { ModuleAccessSelector } from '../components/ModuleAccessSelector';

interface EditUserModalProps {
  isOpen: boolean;
  user: UserAccount | null;
  isSuperAdmin: boolean;
  onClose: () => void;
  onUserUpdated: (updatedUser: UserAccount) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  user,
  isSuperAdmin,
  onClose,
  onUserUpdated,
}) => {
  if (!isOpen || !user) return null;

  const [displayName, setDisplayName] = useState(user.displayName || user.fullName || user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [department, setDepartment] = useState(user.department || 'Operations');
  const [role, setRole] = useState(user.role || 'Staff');
  const [allowedModules, setAllowedModules] = useState<number[]>(
    Array.isArray(user.allowedModules) ? user.allowedModules : [1, 2, 3, 4, 5],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStaffAccount = (isSuperAdmin ? role : user.role) === 'Staff' || (user.role !== 'Admin' && user.role !== 'Super Admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);
      const updated = await userService.updateUser(user.id || (user._id as string), {
        displayName: displayName.trim(),
        email: email.trim().toLowerCase(),
        department: department.trim(),
        role: isSuperAdmin ? role : undefined,
        allowedModules: isStaffAccount ? allowedModules : undefined,
      });

      onUserUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update user profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
              Edit Account: {user.displayName || user.fullName || user.username || 'User'}
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
              User ID: <span style={{ fontWeight: 600, color: '#0265c2' }}>{user.userId || user.id || user._id}</span>{user.username ? ` · @${user.username}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto' }}>
          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '13px',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Full Display Name
            </label>
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '13px',
                color: '#334155',
                outline: 'none',
              }}
            >
              <option value="Healthcare Administration">Healthcare Administration</option>
              <option value="Executive Leadership">Executive Leadership</option>
              <option value="Operations">Operations</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
              <option value="Customer Care">Customer Care</option>
              <option value="Technology & IT">Technology & IT</option>
              <option value="General">General</option>
            </select>
          </div>

          {isSuperAdmin && (
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Role Assignment (Super Admin override)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '13px',
                  color: '#334155',
                  outline: 'none',
                }}
              >
                <option value="Admin">Administrator</option>
                <option value="Staff">Staff Member</option>
                <option value="Super Admin">Super Administrator</option>
              </select>
            </div>
          )}

          {/* Module Access Management for Staff */}
          {isStaffAccount && (
            <div style={{ marginBottom: '18px' }}>
              <ModuleAccessSelector
                isSuperAdmin={isSuperAdmin}
                selectedModuleIds={allowedModules}
                onChange={setAllowedModules}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
