import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../hooks/useToast';
import { userService, type UserAccount, type UserStats } from '../../../services/user.service';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Loader } from '../../common/Loader';
import { AddUserModal } from './modals/AddUserModal';
import { EditUserModal } from './modals/EditUserModal';
import { ResetPasswordModal } from './modals/ResetPasswordModal';
import { ConfirmActionModal } from './modals/ConfirmActionModal';
import { CreditPlansPricingView } from './CreditPlansPricingView';

interface UserManagementPageProps {
  onNavigateDashboard?: () => void;
  initialSubTab?: 'staff' | 'admins';
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({
  onNavigateDashboard,
  initialSubTab,
}) => {
  const { user: currentUser, isSuperAdmin, isAdmin } = useAuth();
  const { showToast } = useToast();

  // Active Tab: 'staff' or 'admins' (Super Admin)
  const [activeTab, setActiveTab] = useState<'staff' | 'admins'>(() => {
    if (initialSubTab) return initialSubTab;
    return 'staff';
  });

  // State
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalStaff: 0,
    activeUsers: 0,
    lockedUsers: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [resettingUser, setResettingUser] = useState<UserAccount | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    variant: 'danger' | 'warning' | 'primary';
    showReasonInput?: boolean;
    onConfirm: (reason?: string) => Promise<void> | void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    variant: 'warning',
    onConfirm: () => {},
  });

  // Fetch users & stats
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [fetchedUsers, statsRes] = await Promise.all([
        userService.getUsers({
          search: search.trim() || undefined,
          status: statusFilter !== 'All' ? statusFilter : undefined,
        }),
        userService.getUserStats(),
      ]);

      setUsers(fetchedUsers);
      setStats(statsRes.stats);
    } catch (err: any) {
      showToast(err.message || 'Failed to load user management data.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Tab filtering: 'admins' shows Admin accounts; 'staff' shows Staff accounts
  const displayedUsers = useMemo(() => {
    return users.filter((u) => {
      const isUserAdmin = u.role === 'Admin' || u.role === 'ADMIN';
      if (activeTab === 'admins') {
        return isUserAdmin;
      }
      return !isUserAdmin;
    });
  }, [users, activeTab]);

  // Handlers
  const handleUserCreated = (newUser: UserAccount) => {
    setUsers((prev) => [newUser, ...prev]);
    showToast(`Account created successfully for ${newUser.displayName || newUser.username || newUser.email || 'User'} (${newUser.userId || newUser.id || ''}).`, 'success');
    fetchData();
  };

  const handleUserUpdated = (updatedUser: UserAccount) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id || u._id === updatedUser._id ? updatedUser : u)),
    );
    showToast(`Updated account details for ${updatedUser.displayName || updatedUser.username || updatedUser.email || 'User'}.`, 'success');
  };

  const handleToggleStatus = (targetUser: UserAccount) => {
    const isCurrentlyActive = (targetUser.status || 'Active') === 'Active';
    const nextStatus = isCurrentlyActive ? 'Locked' : 'Active';
    const targetName = targetUser.displayName || targetUser.fullName || targetUser.username || targetUser.email || 'User';
    const targetIdentifier = targetUser.username ? `@${targetUser.username}` : targetName;
    const targetId = targetUser.userId || (targetUser.id ? `ID-${targetUser.id}` : (targetUser._id ? `ID-${String(targetUser._id).slice(-6).toUpperCase()}` : ''));

    setConfirmConfig({
      isOpen: true,
      title: isCurrentlyActive ? `Lock Account: ${targetName}` : `Activate Account: ${targetName}`,
      message: isCurrentlyActive
        ? `Locking ${targetIdentifier}${targetId ? ` (${targetId})` : ''} will immediately revoke all active login sessions and block access.`
        : `Restore active ERP workspace login access for ${targetIdentifier}?`,
      confirmLabel: isCurrentlyActive ? 'Lock Account' : 'Activate Account',
      variant: isCurrentlyActive ? 'danger' : 'primary',
      showReasonInput: isCurrentlyActive,
      onConfirm: async (reason) => {
        try {
          const updated = await userService.toggleStatus(
            targetUser.id || (targetUser._id as string),
            nextStatus,
            reason,
          );
          setUsers((prev) =>
            prev.map((u) => (u.id === updated.id || u._id === updated._id ? updated : u)),
          );
          showToast(
            `Account ${targetIdentifier} is now ${nextStatus}.`,
            nextStatus === 'Active' ? 'success' : 'warning',
          );
          fetchData();
        } catch (err: any) {
          showToast(err.message || 'Failed to update account status.', 'error');
        }
      },
    });
  };

  const handleDeleteUser = (targetUser: UserAccount) => {
    const targetName = targetUser.displayName || targetUser.fullName || targetUser.username || targetUser.email || 'User';
    const targetIdentifier = targetUser.username ? `@${targetUser.username}` : targetName;
    const targetId = targetUser.userId || (targetUser.id ? `ID-${targetUser.id}` : (targetUser._id ? `ID-${String(targetUser._id).slice(-6).toUpperCase()}` : ''));

    setConfirmConfig({
      isOpen: true,
      title: `Delete User: ${targetName}`,
      message: `Are you sure you want to permanently delete ${targetIdentifier}${targetId ? ` (${targetId})` : ''}? This action cannot be undone.`,
      confirmLabel: 'Delete Permanently',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await userService.deleteUser(targetUser.id || (targetUser._id as string));
          setUsers((prev) => prev.filter((u) => u.id !== targetUser.id && u._id !== targetUser._id));
          showToast(`User account ${targetIdentifier} has been deleted.`, 'success');
          fetchData();
        } catch (err: any) {
          showToast(err.message || 'Failed to delete user.', 'error');
        }
      },
    });
  };

  return (
    <div style={{ padding: '24px 32px 60px', maxWidth: 1440, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {onNavigateDashboard && (
            <button
              type="button"
              onClick={onNavigateDashboard}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
              title="Back to Dashboard"
            >
              <i className="fas fa-arrow-left" />
            </button>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #091e42, #0265c2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '17px',
                }}
              >
                <i className="fas fa-users-cog" />
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#091e42',
                  letterSpacing: '-0.02em',
                }}
              >
                User & Staff Management
              </h1>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
              {isSuperAdmin
                ? 'System-wide governance of Administrator and Staff credentials & permissions.'
                : 'Manage your assigned staff accounts, credentials, and access statuses.'}
            </p>
          </div>
        </div>

        {/* Action Button & Role Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              background: isSuperAdmin ? '#eff6ff' : '#f0fdf4',
              border: isSuperAdmin ? '1px solid #bfdbfe' : '1px solid #bbf7d0',
              color: isSuperAdmin ? '#1d4ed8' : '#15803d',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <i className={`fas ${isSuperAdmin ? 'fa-crown' : 'fa-user-shield'}`} />
            <span>Role: {currentUser?.role || (isSuperAdmin ? 'Super Admin' : 'Admin')}</span>
          </div>

          <Button
            variant="primary"
            onClick={() => setIsAddUserOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #0b2546 0%, #0265c2 100%)',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(2, 101, 194, 0.25)',
            }}
          >
            <i className="fas fa-plus" />
            <span>{isSuperAdmin ? 'Add User (Admin/Staff)' : 'Add Staff Member'}</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs (Staff vs Admin) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('staff')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'staff' ? 'linear-gradient(135deg, #091e42, #0052cc)' : 'transparent',
            color: activeTab === 'staff' ? '#ffffff' : '#64748b',
            fontWeight: activeTab === 'staff' ? 700 : 500,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <i className="fas fa-users" />
          <span>Staff Accounts</span>
          <span
            style={{
              background: activeTab === 'staff' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
              color: activeTab === 'staff' ? '#ffffff' : '#475569',
              padding: '2px 7px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            {users.filter((u) => u.role !== 'Admin' && u.role !== 'ADMIN').length}
          </span>
        </button>

        {isSuperAdmin && (
          <button
            type="button"
            onClick={() => setActiveTab('admins')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'admins' ? 'linear-gradient(135deg, #091e42, #0052cc)' : 'transparent',
              color: activeTab === 'admins' ? '#ffffff' : '#64748b',
              fontWeight: activeTab === 'admins' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <i className="fas fa-user-shield" />
            <span>Administrator Accounts</span>
            <span
              style={{
                background: activeTab === 'admins' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                color: activeTab === 'admins' ? '#ffffff' : '#475569',
                padding: '2px 7px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              {users.filter((u) => u.role === 'Admin' || u.role === 'ADMIN').length}
            </span>
          </button>
        )}
      </div>

      {/* KPI Dashboard Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isSuperAdmin ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* Total Accounts */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '20px 22px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#eff6ff',
              color: '#0265c2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            <i className="fas fa-users" />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              {isSuperAdmin ? 'Total System Users' : 'Total Managed Staff'}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#091e42', marginTop: '2px' }}>
              {stats.totalUsers}
            </div>
          </div>
        </div>

        {/* Admins Card (Super Admin only) */}
        {isSuperAdmin && (
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '20px 22px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#fdf2f8',
                color: '#db2777',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <i className="fas fa-user-shield" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Administrators
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#091e42', marginTop: '2px' }}>
                {stats.totalAdmins}
              </div>
            </div>
          </div>
        )}

        {/* Active Staff Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '20px 22px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            <i className="fas fa-user-check" />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Active Staff
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#091e42', marginTop: '2px' }}>
              {stats.activeUsers}
            </div>
          </div>
        </div>

        {/* Inactive / Locked Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '20px 22px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#fff1f2',
              color: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            <i className="fas fa-user-lock" />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Locked / Inactive
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#091e42', marginTop: '2px' }}>
              {stats.lockedUsers}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
          background: '#ffffff',
          padding: '14px 18px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
          <Input
            type="text"
            placeholder="Search by User ID, Name, Username, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', width: '100%', boxSizing: 'border-box' }}
          />
          <i
            className="fas fa-search"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '13px',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                color: '#334155',
                background: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Locked">Locked</option>
            </select>
          </div>

          <Button
            variant="outline"
            onClick={() => fetchData()}
            title="Refresh list"
            style={{ padding: '8px 12px' }}
          >
            <i className={`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          overflow: 'hidden',
        }}
      >
        {isLoading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Loader label="Loading user accounts..." />
          </div>
        ) : displayedUsers.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                fontSize: '24px',
                margin: '0 auto 16px',
              }}
            >
              <i className="fas fa-users-slash" />
            </div>
            <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              No accounts found
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              {search || statusFilter !== 'All'
                ? 'Try adjusting your search criteria or clearing active filters.'
                : activeTab === 'admins'
                  ? 'No administrator accounts created yet.'
                  : 'No staff accounts exist under your management.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 18px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>
                    User Details
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>
                    User ID
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>
                    Email
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>
                    Role & Dept
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>
                    Module Access
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>
                    Created By
                  </th>
                  <th style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 600, color: '#64748b', fontSize: '12px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((u) => {
                  const displayName =
                    u.displayName ||
                    u.fullName ||
                    u.username ||
                    (u.email ? u.email.split('@')[0] : 'User');

                  const initials =
                    (u.displayName
                      ? u.displayName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : '') ||
                    (u.username ?? u.email ?? 'U').slice(0, 2).toUpperCase() ||
                    'U';

                  const isLocked = u.status === 'Locked';
                  const isSuperAdminRole = u.role === 'Super Admin' || u.role === 'SUPER_ADMIN';

                  return (
                    <tr
                      key={u.id || (u._id as string)}
                      style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s ease' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#ffffff')}
                    >
                      {/* Name & Username */}
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              background: isSuperAdminRole
                                ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)'
                                : u.role === 'Admin'
                                  ? 'linear-gradient(135deg, #0f766e, #14b8a6)'
                                  : 'linear-gradient(135deg, #475569, #64748b)',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '12px',
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{displayName}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {u.username ? `@${u.username}` : (u.email ? u.email : '')}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* User ID Badge */}
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            fontWeight: 700,
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #dbeafe',
                          }}
                        >
                          {u.userId || (u.id ? `ID-${u.id}` : (u._id ? `ID-${String(u._id).slice(-6).toUpperCase()}` : '—'))}
                        </span>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{u.email}</td>

                      {/* Role & Dept */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              background: isSuperAdminRole
                                ? '#fef3c7'
                                : u.role === 'Admin'
                                  ? '#eff6ff'
                                  : '#f1f5f9',
                              color: isSuperAdminRole
                                ? '#92400e'
                                : u.role === 'Admin'
                                  ? '#1d4ed8'
                                  : '#334155',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            {u.role || 'Staff'}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                          {u.department || 'General'}
                        </div>
                      </td>

                      {/* Module Access */}
                      <td style={{ padding: '12px 16px' }}>
                        {u.role === 'Admin' || u.role === 'ADMIN' || u.role === 'Super Admin' || u.role === 'SUPER_ADMIN' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            <i className="fas fa-shield-alt" style={{ fontSize: '10px' }} />
                            All Modules
                          </span>
                        ) : (
                          <span
                            title={
                              Array.isArray(u.allowedModules) && u.allowedModules.length > 0
                                ? `Permitted modules: ${u.allowedModules.join(', ')}`
                                : 'Default personal modules: Dashboard, Profile, Calendar, Reports, Settings'
                            }
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: Array.isArray(u.allowedModules) ? '#ecfdf5' : '#f1f5f9',
                              color: Array.isArray(u.allowedModules) ? '#059669' : '#64748b',
                              border: Array.isArray(u.allowedModules) ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                            onClick={() => setEditingUser(u)}
                          >
                            <i className="fas fa-th-large" style={{ fontSize: '10px' }} />
                            {Array.isArray(u.allowedModules)
                              ? `${u.allowedModules.length} Modules`
                              : 'Default (5)'}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background:
                              (u.status || 'Active') === 'Active'
                                ? '#dcfce7'
                                : isLocked
                                  ? '#fee2e2'
                                  : '#f1f5f9',
                            color:
                              (u.status || 'Active') === 'Active'
                                ? '#166534'
                                : isLocked
                                  ? '#991b1b'
                                  : '#475569',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background:
                                (u.status || 'Active') === 'Active'
                                  ? '#16a34a'
                                  : isLocked
                                    ? '#dc2626'
                                    : '#94a3b8',
                            }}
                          />
                          {u.status || 'Active'}
                        </span>
                      </td>

                      {/* Created By & Date */}
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b' }}>
                        <div>{u.createdByName || 'System'}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => setEditingUser(u)}
                            title="Edit User Details"
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              color: '#334155',
                              width: '30px',
                              height: '30px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                            }}
                          >
                            <i className="fas fa-edit" />
                          </button>

                          {/* Reset Password */}
                          <button
                            type="button"
                            onClick={() => setResettingUser(u)}
                            title="Reset Password & Invalidate Sessions"
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              color: '#d97706',
                              width: '30px',
                              height: '30px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                            }}
                          >
                            <i className="fas fa-key" />
                          </button>

                          {/* Lock / Activate */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u)}
                            title={isLocked ? 'Unlock Account' : 'Lock Account'}
                            style={{
                              background: isLocked ? '#fef2f2' : '#ffffff',
                              border: isLocked ? '1px solid #fecaca' : '1px solid #cbd5e1',
                              color: isLocked ? '#dc2626' : '#64748b',
                              width: '30px',
                              height: '30px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                            }}
                          >
                            <i className={`fas ${isLocked ? 'fa-lock' : 'fa-lock-open'}`} />
                          </button>

                          {/* Delete (if allowed) */}
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            title="Delete Account"
                            style={{
                              background: '#ffffff',
                              border: '1px solid #fee2e2',
                              color: '#ef4444',
                              width: '30px',
                              height: '30px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                            }}
                          >
                            <i className="fas fa-trash-alt" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserOpen}
        isSuperAdmin={isSuperAdmin}
        defaultRole={activeTab === 'admins' ? 'Admin' : 'Staff'}
        onClose={() => setIsAddUserOpen(false)}
        onUserCreated={handleUserCreated}
      />

      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        isSuperAdmin={isSuperAdmin}
        onClose={() => setEditingUser(null)}
        onUserUpdated={handleUserUpdated}
      />

      <ResetPasswordModal
        isOpen={!!resettingUser}
        user={resettingUser}
        onClose={() => setResettingUser(null)}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      <ConfirmActionModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        variant={confirmConfig.variant}
        showReasonInput={confirmConfig.showReasonInput}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
      />
    </div>
  );
};

export default UserManagementPage;
