import { useState, useMemo } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { PlatformUserAccount, AccountStatus, VerificationStatus } from '../../../types/admin';

interface AdminPlatformUsersTabProps {
  platformUsers: PlatformUserAccount[];
  onResetPassword: (user: PlatformUserAccount) => void;
  onToggleStatus: (user: PlatformUserAccount) => void;
  onUpdateModules: (user: PlatformUserAccount, modules: string[]) => void;
}

type UserCategory = 'All' | 'Candidate' | 'Startup' | 'Company' | 'Institution';

export function AdminPlatformUsersTab({
  platformUsers,
  onResetPassword,
  onToggleStatus,
  onUpdateModules,
}: AdminPlatformUsersTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<UserCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');

  const categories: { label: UserCategory; icon: string; count: number }[] = [
    { label: 'All', icon: 'fa-users', count: platformUsers.length },
    { label: 'Candidate', icon: 'fa-user-graduate', count: platformUsers.filter((u) => u.userType === 'Candidate').length },
    { label: 'Startup', icon: 'fa-rocket', count: platformUsers.filter((u) => u.userType === 'Startup').length },
    { label: 'Company', icon: 'fa-building', count: platformUsers.filter((u) => u.userType === 'Company').length },
    { label: 'Institution', icon: 'fa-university', count: platformUsers.filter((u) => u.userType === 'Institution').length },
  ];

  const filteredUsers = useMemo(() => {
    return platformUsers.filter((user) => {
      const matchCategory = selectedCategory === 'All' || user.userType === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchVerification = verificationFilter === 'all' || user.verificationStatus === verificationFilter;

      return matchCategory && matchSearch && matchStatus && matchVerification;
    });
  }, [platformUsers, selectedCategory, searchQuery, statusFilter, verificationFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Category Sub-Tabs */}
      <div style={{
        display: 'flex',
        gap: 10,
        overflowX: 'auto',
        paddingBottom: 4,
      }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => setSelectedCategory(cat.label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 12,
                border: isSelected ? '1px solid #0066cc' : '1px solid #e2e8f0',
                background: isSelected ? 'linear-gradient(135deg, #091e42, #0066cc)' : '#ffffff',
                color: isSelected ? '#ffffff' : '#334155',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: isSelected ? '0 4px 12px rgba(0, 102, 204, 0.2)' : '0 1px 2px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <i className={`fas ${cat.icon}`} />
              <span>{cat.label === 'All' ? 'All Platform Users' : `${cat.label}s`}</span>
              <span style={{
                background: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                color: isSelected ? '#ffffff' : '#64748b',
                padding: '2px 8px',
                borderRadius: 10,
                fontSize: 11,
              }}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
          <Input
            type="text"
            placeholder={`Search ${selectedCategory.toLowerCase()} accounts...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
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
            <option value="all">All Account Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Locked">Locked</option>
            <option value="Suspended">Suspended</option>
          </select>

          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
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
            <option value="all">All Verifications</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Account & Entity</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Login Access</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Verification</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Last Login</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Allowed Modules</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Security Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: '#8e9bb5' }}>
                    No platform accounts found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isLocked = user.status === 'Locked' || user.status === 'Suspended';
                  const isActive = user.status === 'Active';

                  const typeColor = {
                    Candidate: '#0284c7',
                    Startup: '#7c3aed',
                    Company: '#2563eb',
                    Institution: '#059669',
                  }[user.userType];

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
                            background: `${typeColor}15`,
                            color: typeColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 14,
                          }}>
                            {user.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{user.name}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>
                              @{user.username} • {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          background: `${typeColor}15`,
                          color: typeColor,
                        }}>
                          {user.userType}
                        </span>
                      </td>

                      {/* Login Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          background: isActive ? '#dcfce7' : '#fee2e2',
                          color: isActive ? '#15803d' : '#b91c1c',
                        }}>
                          <span style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: isActive ? '#16a34a' : '#ef4444',
                          }} />
                          {user.status}
                        </span>
                      </td>

                      {/* Verification */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          color: user.verificationStatus === 'Verified' ? '#059669' : user.verificationStatus === 'Pending' ? '#d97706' : '#dc2626',
                        }}>
                          <i className={`fas ${user.verificationStatus === 'Verified' ? 'fa-check-circle' : user.verificationStatus === 'Pending' ? 'fa-clock' : 'fa-times-circle'}`} />
                          {user.verificationStatus}
                        </span>
                      </td>

                      {/* Last Login */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 12, color: '#1e293b' }}>{user.lastLogin}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{user.lastLoginIp}</div>
                      </td>

                      {/* Allowed Modules */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 200 }}>
                          {user.allowedModules.map((m) => (
                            <span
                              key={m}
                              style={{
                                background: '#f1f5f9',
                                color: '#475569',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 600,
                              }}
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
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
                            title="Reset Credentials"
                          >
                            <i className="fas fa-key" />
                          </button>

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
                            title={isLocked ? 'Unlock Platform Access' : 'Lock Platform Access'}
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
