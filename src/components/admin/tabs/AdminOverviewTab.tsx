import { Button } from '../../common/Button';
import type { AdminStaffUser, PlatformUserAccount, RoleDefinition, SecurityPolicyConfig, AdminAuditLog, AdminTab } from '../../../types/admin';

interface AdminOverviewTabProps {
  staffUsers: AdminStaffUser[];
  platformUsers: PlatformUserAccount[];
  roles: RoleDefinition[];
  securityPolicy: SecurityPolicyConfig;
  auditLogs: AdminAuditLog[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddStaff: () => void;
  onOpenCreateRole: () => void;
}

export function AdminOverviewTab({
  staffUsers,
  platformUsers,
  roles,
  securityPolicy,
  auditLogs,
  onNavigateTab,
  onOpenAddStaff,
  onOpenCreateRole,
}: AdminOverviewTabProps) {
  const activeStaffCount = staffUsers.filter((u) => u.status === 'Active').length;
  const lockedStaffCount = staffUsers.filter((u) => u.status === 'Locked').length;
  const activePlatformCount = platformUsers.filter((u) => u.status === 'Active').length;
  const lockedPlatformCount = platformUsers.filter((u) => u.status === 'Locked' || u.status === 'Suspended').length;

  const mfaEnforcedCount = staffUsers.filter((u) => u.twoFactorStatus === 'Enforced' || u.twoFactorStatus === 'Enabled').length;
  const mfaAdoptionRate = Math.round((mfaEnforcedCount / staffUsers.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner: Security Posture Status */}
      <div style={{
        background: 'linear-gradient(135deg, #091e42 0%, #0052cc 60%, #0265c2 100%)',
        borderRadius: 16,
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 25px rgba(2, 101, 194, 0.2)',
        flexWrap: 'wrap',
        gap: 20,
      }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255, 255, 255, 0.16)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 10,
          }}>
            <i className="fas fa-shield-check" style={{ color: '#4ade80' }} />
            <span>Central Administration Active</span>
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Enterprise Access & Security Control
          </h2>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>
            Manage staff credentials, platform user access, granular role permissions, and track immutable audit logs in real time.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onOpenAddStaff}
            style={{
              background: '#ffffff',
              color: '#0052cc',
              border: 'none',
              borderRadius: 10,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.15s ease',
            }}
          >
            <i className="fas fa-user-plus" />
            <span>Add Admin Staff</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('module-access')}
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <i className="fas fa-th" />
            <span>Module Access</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('audit-log')}
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <i className="fas fa-clipboard-list" />
            <span>Audit Logs</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}>
        {/* Card 1: Admin Staff */}
        <div
          onClick={() => onNavigateTab('staff')}
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Admin & Staff Users</span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-user-shield" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{staffUsers.length}</div>
          <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 600 }}>{activeStaffCount} Active</span>
            {lockedStaffCount > 0 && (
              <span style={{ color: '#ef4444', fontWeight: 600 }}>• {lockedStaffCount} Locked</span>
            )}
          </div>
        </div>

        {/* Card 2: Platform Users */}
        <div
          onClick={() => onNavigateTab('platform-users')}
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Platform Accounts</span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-users" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{platformUsers.length}</div>
          <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 600 }}>{activePlatformCount} Allowed Logins</span>
            {lockedPlatformCount > 0 && (
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>• {lockedPlatformCount} Restricted</span>
            )}
          </div>
        </div>

        {/* Card 3: Configured Roles */}
        <div
          onClick={() => onNavigateTab('roles-permissions')}
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Configured Roles</span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#faf5ff',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-id-badge" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{roles.length}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            7 System Presets • 1 Custom Role
          </div>
        </div>

        {/* Card 4: Security & MFA Adoption */}
        <div
          onClick={() => onNavigateTab('login-security')}
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>MFA Adoption Rate</span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-shield-alt" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{mfaAdoptionRate}%</div>
          <div style={{ fontSize: 12, color: '#059669', marginTop: 4, fontWeight: 600 }}>
            Policy: {securityPolicy.twoFactorPolicy.enforcement}
          </div>
        </div>
      </div>

      {/* Main Grid: Roles Distribution & Recent Audit Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>
        {/* Left Column: Role Hierarchy & Module Access Summary */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Role Hierarchy & Distribution
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Access governance distribution</p>
            </div>
            <button
              type="button"
              onClick={onOpenCreateRole}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              + New Role
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {roles.map((role) => (
              <div
                key={role.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid #f1f5f9',
                  background: '#fafcff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: role.badgeColor,
                  }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{role.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b', maxWidth: 260, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {role.description}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    background: '#f1f5f9',
                    padding: '3px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#475569',
                  }}>
                    {role.userCount} users
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('roles-permissions')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      cursor: 'pointer',
                      fontSize: 12,
                      padding: 4,
                    }}
                    title="Configure Role Matrix"
                  >
                    <i className="fas fa-chevron-right" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Audit Activity Feed */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Recent Administrative Activity
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Real-time platform access events</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('audit-log')}
              style={{
                background: 'none',
                border: 'none',
                color: '#0284c7',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View Full Audit Trail <i className="fas fa-arrow-right" style={{ marginLeft: 4 }} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {auditLogs.slice(0, 5).map((log) => {
              const statusColor =
                log.status === 'Success'
                  ? '#16a34a'
                  : log.status === 'Warning'
                  ? '#d97706'
                  : log.status === 'Blocked'
                  ? '#ef4444'
                  : '#dc2626';

              return (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    paddingBottom: 12,
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: '#f1f5f9',
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {log.userAvatar}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>
                        {log.action}
                      </div>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 4,
                        color: statusColor,
                        background: `${statusColor}15`,
                        textTransform: 'uppercase',
                      }}>
                        {log.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                      By <strong>{log.user}</strong> in module <em>{log.module}</em>
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      {log.timestamp} • {log.ipAddress}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
