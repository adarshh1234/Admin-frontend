import { useState, useMemo } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { AdminStaffUser, RoleDefinition, DepartmentType, AccountStatus, AdminRoleType } from '../../../types/admin';

interface AdminStaffTabProps {
  staffUsers: AdminStaffUser[];
  roles: RoleDefinition[];
  onAddStaff: () => void;
  onEditStaff: (user: AdminStaffUser) => void;
  onViewStaffDetails: (user: AdminStaffUser) => void;
  onResetPassword: (user: AdminStaffUser) => void;
  onEditPermissions: (user: AdminStaffUser) => void;
  onToggleStatus: (user: AdminStaffUser) => void;
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

export function AdminStaffTab({
  staffUsers,
  roles,
  onAddStaff,
  onEditStaff,
  onViewStaffDetails,
  onResetPassword,
  onEditPermissions,
  onToggleStatus,
}: AdminStaffTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    return staffUsers.filter((user) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = deptFilter === 'all' || user.department === deptFilter;
      const matchRole = roleFilter === 'all' || user.role === roleFilter;
      const matchStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchSearch && matchDept && matchRole && matchStatus;
    });
  }, [staffUsers, searchQuery, deptFilter, roleFilter, statusFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header & Controls */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '20px 24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              Admin & Staff Directory ({filteredUsers.length})
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Manage internal administrative accounts, security authentication, and access delegation
            </p>
          </div>

          <Button type="button" variant="primary" onClick={onAddStaff}>
            <i className="fas fa-user-plus" style={{ marginRight: 8 }} />
            Add Admin Staff
          </Button>
        </div>

        {/* Filter bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 1.5fr) repeat(3, minmax(140px, 1fr))',
          gap: 12,
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Input
              type="text"
              placeholder="Search by name, username, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              color: '#334155',
              outline: 'none',
            }}
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              color: '#334155',
              outline: 'none',
            }}
          >
            <option value="all">All Roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              color: '#334155',
              outline: 'none',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Locked">Locked</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Staff Member</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Role & Dept</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>2FA</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Last Login</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Permissions</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: '#8e9bb5' }}>
                    <i className="fas fa-user-slash" style={{ fontSize: 28, marginBottom: 8, display: 'block' }} />
                    No staff members match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleDef = roles.find((r) => r.name === user.role);
                  const activePermsCount = user.customPermissions
                    ? Object.values(user.customPermissions).filter((v) => v !== 'No Access').length
                    : Object.values(roleDef?.defaultPermissions || {}).filter((v) => v !== 'No Access').length;

                  const isLocked = user.status === 'Locked';
                  const isActive = user.status === 'Active';

                  return (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fafcff')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                    >
                      {/* Name & Avatar */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            background: roleDef?.badgeColor || '#0284c7',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 14,
                            flexShrink: 0,
                          }}>
                            {user.avatar}
                          </div>
                          <div>
                            <div
                              onClick={() => onViewStaffDetails(user)}
                              style={{ fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}
                              title="Click to view full details"
                            >
                              {user.name}
                            </div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>
                              @{user.username} • {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Dept */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          background: `${roleDef?.badgeColor || '#2563eb'}18`,
                          color: roleDef?.badgeColor || '#2563eb',
                          marginBottom: 4,
                        }}>
                          {user.role}
                        </span>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{user.department}</div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          background:
                            isActive
                              ? '#dcfce7'
                              : isLocked
                              ? '#fee2e2'
                              : '#f1f5f9',
                          color:
                            isActive
                              ? '#15803d'
                              : isLocked
                              ? '#b91c1c'
                              : '#64748b',
                        }}>
                          <span style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: isActive ? '#16a34a' : isLocked ? '#ef4444' : '#94a3b8',
                          }} />
                          {user.status}
                        </span>
                      </td>

                      {/* 2FA */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12,
                          color: user.twoFactorStatus === 'Enforced' ? '#7c3aed' : user.twoFactorStatus === 'Enabled' ? '#16a34a' : '#94a3b8',
                          fontWeight: 600,
                        }}>
                          <i className="fas fa-shield-alt" />
                          {user.twoFactorStatus}
                        </span>
                      </td>

                      {/* Last Login */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 12, color: '#1e293b', fontWeight: 500 }}>
                          {user.lastLogin}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>
                          {user.lastLoginIp}
                        </div>
                      </td>

                      {/* Permissions */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{
                            background: '#f0f9ff',
                            color: '#0284c7',
                            border: '1px solid #bae6fd',
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                          }}>
                            {user.customPermissions ? 'Custom Override' : `${activePermsCount} Modules`}
                          </span>
                          <button
                            type="button"
                            onClick={() => onEditPermissions(user)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#0284c7',
                              cursor: 'pointer',
                              fontSize: 12,
                              padding: 4,
                            }}
                            title="Edit Permissions"
                          >
                            <i className="fas fa-sliders-h" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => onViewStaffDetails(user)}
                            style={{
                              background: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              borderRadius: 6,
                              padding: '6px 10px',
                              color: '#334155',
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                            title="View Staff Profile"
                          >
                            <i className="fas fa-eye" />
                          </button>

                          {/* Edit user */}
                          <button
                            type="button"
                            onClick={() => onEditStaff(user)}
                            style={{
                              background: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              borderRadius: 6,
                              padding: '6px 10px',
                              color: '#0284c7',
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                            title="Edit User Info"
                          >
                            <i className="fas fa-edit" />
                          </button>

                          {/* Reset password */}
                          <button
                            type="button"
                            onClick={() => onResetPassword(user)}
                            style={{
                              background: '#fffbeb',
                              border: '1px solid #fde68a',
                              borderRadius: 6,
                              padding: '6px 10px',
                              color: '#d97706',
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                            title="Reset Password"
                          >
                            <i className="fas fa-key" />
                          </button>

                          {/* Lock / Unlock Toggle */}
                          <button
                            type="button"
                            onClick={() => onToggleStatus(user)}
                            style={{
                              background: isLocked ? '#eff6ff' : '#fef2f2',
                              border: `1px solid ${isLocked ? '#bfdbfe' : '#fecaca'}`,
                              borderRadius: 6,
                              padding: '6px 10px',
                              color: isLocked ? '#2563eb' : '#dc2626',
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                            title={isLocked ? 'Unlock Account' : 'Lock Account'}
                          >
                            <i className={`fas ${isLocked ? 'fa-unlock' : 'fa-lock'}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
