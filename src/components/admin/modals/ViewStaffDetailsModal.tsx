import { Button } from '../../common/Button';
import { PLATFORM_CORE_MODULES } from '../../../data/adminData';
import type { AdminStaffUser, RoleDefinition } from '../../../types/admin';

interface ViewStaffDetailsModalProps {
  isOpen: boolean;
  user: AdminStaffUser | null;
  roles: RoleDefinition[];
  onClose: () => void;
  onEdit: () => void;
  onResetPassword: () => void;
  onToggleStatus: () => void;
}

export function ViewStaffDetailsModal({
  isOpen,
  user,
  roles,
  onClose,
  onEdit,
  onResetPassword,
  onToggleStatus,
}: ViewStaffDetailsModalProps) {
  if (!isOpen || !user) return null;

  const roleDef = roles.find((r) => r.name === user.role);

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
        maxWidth: 640,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #091e42 0%, #0066cc 100%)',
          color: '#ffffff',
          position: 'relative',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-times" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 800,
              color: '#ffffff',
            }}>
              {user.avatar}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{user.name}</h2>
                <span style={{
                  background: user.status === 'Active' ? '#22c55e' : user.status === 'Locked' ? '#ef4444' : '#94a3b8',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 12,
                  textTransform: 'uppercase',
                }}>
                  {user.status}
                </span>
              </div>
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>
                @{user.username} • {user.email}
              </div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                ID: {user.id} • Created: {user.createdAt}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          {/* Quick info grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            marginBottom: 24,
          }}>
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                Role
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                {user.role}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                Department
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                {user.department}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                Two-Factor Authentication
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: user.twoFactorStatus === 'Enforced' ? '#7c3aed' : user.twoFactorStatus === 'Enabled' ? '#16a34a' : '#94a3b8', marginTop: 2 }}>
                <i className="fas fa-shield-alt" style={{ marginRight: 6 }} />
                {user.twoFactorStatus}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                Last Login
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>
                {user.lastLogin}
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>IP: {user.lastLoginIp}</div>
            </div>
          </div>

          {user.lockoutReason && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 10,
              padding: 12,
              marginBottom: 20,
              color: '#991b1b',
              fontSize: 13,
            }}>
              <strong><i className="fas fa-lock" style={{ marginRight: 6 }} /> Lockout Notice:</strong>{' '}
              {user.lockoutReason}
            </div>
          )}

          {/* Module Access Summary */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
              Module Access & Privileges
            </h4>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              maxHeight: 180,
              overflowY: 'auto',
              padding: 4,
            }}>
              {PLATFORM_CORE_MODULES.map((mod) => {
                const level = user.customPermissions?.[mod] || roleDef?.defaultPermissions[mod] || 'No Access';
                if (level === 'No Access') return null;

                const bg = level === 'Full Access' ? '#dcfce7' : level === 'View & Edit' ? '#fef3c7' : '#e0f2fe';
                const color = level === 'Full Access' ? '#15803d' : level === 'View & Edit' ? '#b45309' : '#0369a1';

                return (
                  <div
                    key={mod}
                    style={{
                      background: bg,
                      color,
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{mod}</span>
                    <span style={{ fontSize: 10, opacity: 0.8, textTransform: 'uppercase' }}>({level})</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #e2e8f0',
            paddingTop: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                type="button"
                variant={user.status === 'Locked' ? 'primary' : 'danger'}
                onClick={() => {
                  onClose();
                  onToggleStatus();
                }}
              >
                <i className={`fas ${user.status === 'Locked' ? 'fa-unlock' : 'fa-lock'}`} style={{ marginRight: 6 }} />
                {user.status === 'Locked' ? 'Unlock Account' : 'Lock Account'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  onClose();
                  onResetPassword();
                }}
              >
                <i className="fas fa-key" style={{ marginRight: 6 }} />
                Reset Password
              </Button>
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onClose();
                onEdit();
              }}
            >
              <i className="fas fa-pencil-alt" style={{ marginRight: 6 }} />
              Edit Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
