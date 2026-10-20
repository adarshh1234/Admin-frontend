import { useState } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { AdminRoleType, DepartmentType } from '../../../types/admin';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    username: string;
    email: string;
    role: AdminRoleType;
    department: DepartmentType;
    requirePasswordChange: boolean;
    sendInviteEmail: boolean;
  }) => void;
}

const DEPARTMENTS: DepartmentType[] = [
  'Executive',
  'Engineering',
  'Operations',
  'Clinical Ops',
  'Human Resources',
  'Finance & Accounts',
  'Sales & Growth',
  'Marketing',
  'Customer Support',
  'Legal & Compliance',
];

const ROLES: AdminRoleType[] = [
  'Super Admin',
  'Admin',
  'Manager',
  'HR',
  'Finance',
  'Marketing',
  'Support',
  'Custom Role',
];

export function AddStaffModal({ isOpen, onClose, onSubmit }: AddStaffModalProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRoleType>('Admin');
  const [department, setDepartment] = useState<DepartmentType>('Operations');
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);
  const [sendInviteEmail, setSendInviteEmail] = useState(true);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !email.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
      setError('Username can only contain letters, numbers, dots, hyphens and underscores.');
      return;
    }

    onSubmit({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      role,
      department,
      requirePasswordChange,
      sendInviteEmail,
    });
    onClose();
  }

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16,
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 540,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        animation: 'modalSlideIn 0.2s ease-out',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 18,
            }}>
              <i className="fas fa-user-plus" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Add Admin Staff</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Create a new platform administrator or internal staff account</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              fontSize: 18,
              padding: 4,
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {error && (
            <div style={{
              padding: '10px 14px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              color: '#dc2626',
              fontSize: 13,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <i className="fas fa-exclamation-circle" />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Full Name *
              </label>
              <Input
                type="text"
                placeholder="e.g. John Miller"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!username && e.target.value) {
                    setUsername(e.target.value.toLowerCase().replace(/\s+/g, '.'));
                  }
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Username *
              </label>
              <Input
                type="text"
                placeholder="e.g. john.miller"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
              Work Email Address *
            </label>
            <Input
              type="email"
              placeholder="e.g. john.m@curemaso.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Assigned Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRoleType)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 14,
                  color: '#1e293b',
                  outline: 'none',
                }}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentType)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 14,
                  color: '#1e293b',
                  outline: 'none',
                }}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Security & Access Checkboxes */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: 14,
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={requirePasswordChange}
                onChange={(e) => setRequirePasswordChange(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#0284c7' }}
              />
              <span><strong>Force password reset</strong> upon first login</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={sendInviteEmail}
                onChange={(e) => setSendInviteEmail(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#0284c7' }}
              />
              <span>Send welcome email with secure onboarding activation link</span>
            </label>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <i className="fas fa-check" style={{ marginRight: 6 }} />
              Create Staff Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
