import React, { useState } from 'react';
import { userService, type UserAccount } from '../../../../services/user.service';
import { Button } from '../../../common/Button';
import { Input } from '../../../common/Input';
import { ModuleAccessSelector } from '../components/ModuleAccessSelector';

interface AddUserModalProps {
  isOpen: boolean;
  isSuperAdmin: boolean;
  defaultRole?: 'Admin' | 'Staff';
  onClose: () => void;
  onUserCreated: (newUser: UserAccount) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  isSuperAdmin,
  defaultRole = 'Staff',
  onClose,
  onUserCreated,
}) => {
  const [role, setRole] = useState<'Admin' | 'Staff'>(isSuperAdmin ? defaultRole : 'Staff');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Operations');
  const [password, setPassword] = useState('');
  const [allowedModules, setAllowedModules] = useState<number[]>([1]); // Default to Dashboard
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    const pwd = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setPassword(pwd);
  };

  const handleAutoSuggestUserId = () => {
    const prefix = role === 'Admin' ? 'ADM' : 'STF';
    const rand = Math.floor(100 + Math.random() * 900);
    setUserId(`${prefix}-${rand}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim() || !username.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newUser = await userService.createUser({
        userId: userId.trim() || undefined,
        displayName: displayName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        role: isSuperAdmin ? role : 'Staff',
        department: department.trim(),
        password,
        allowedModules: role === 'Staff' ? allowedModules : undefined,
      });

      onUserCreated(newUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create user account.');
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
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #091e42 0%, #0265c2 100%)',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              <i className="fas fa-user-plus" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                {isSuperAdmin ? `Create New ${role} Account` : 'Create New Staff Account'}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#bae6fd' }}>
                Provision credentials and set up initial account profile
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              cursor: 'pointer',
              opacity: 0.8,
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '24px' }}>
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
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <i className="fas fa-exclamation-circle" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Account Role
            </label>
            {isSuperAdmin ? (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: role === 'Admin' ? '2px solid #0265c2' : '1px solid #cbd5e1',
                    background: role === 'Admin' ? '#eff6ff' : '#ffffff',
                    color: role === 'Admin' ? '#0265c2' : '#64748b',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <i className="fas fa-user-shield" />
                  Administrator
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Staff')}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: role === 'Staff' ? '2px solid #0265c2' : '1px solid #cbd5e1',
                    background: role === 'Staff' ? '#eff6ff' : '#ffffff',
                    color: role === 'Staff' ? '#0265c2' : '#64748b',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <i className="fas fa-user" />
                  Staff Member
                </button>
              </div>
            ) : (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>
                  <i className="fas fa-user" style={{ marginRight: '6px', color: '#0265c2' }} />
                  Staff Member
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', background: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>
                  Admin privileges locked to Staff creation
                </span>
              </div>
            )}
          </div>

          {/* User ID & Suggested ID */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                Unique User ID (Optional)
              </label>
              <button
                type="button"
                onClick={handleAutoSuggestUserId}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0265c2',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Auto-generate ID
              </button>
            </div>
            <Input
              type="text"
              placeholder={role === 'Admin' ? 'e.g. ADM-201 (auto-assigned if blank)' : 'e.g. STF-301 (auto-assigned if blank)'}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          {/* Full Name & Username */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Full Display Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Username <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. alex.morgan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email & Department */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Input
                type="email"
                placeholder="alex@curemaso.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
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
          </div>

          {/* Initial Password with Generator */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                Initial Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0265c2',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <i className="fas fa-magic" style={{ marginRight: '4px' }} />
                Generate Secure Password
              </button>
            </div>
            <Input
              type="text"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Module Access Configuration for Staff */}
          {role === 'Staff' && (
            <div style={{ marginBottom: '20px' }}>
              <ModuleAccessSelector
                isSuperAdmin={isSuperAdmin}
                selectedModuleIds={allowedModules}
                onChange={setAllowedModules}
              />
            </div>
          )}

          {/* Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '6px' }} />
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="fas fa-check" style={{ marginRight: '6px' }} />
                  Create {role}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
