import { useState } from 'react';
import { adminService } from '../../services/admin.service';
import { useToast } from '../../hooks/useToast';
import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { AdminStaffTab } from './tabs/AdminStaffTab';
import { AdminPlatformUsersTab } from './tabs/AdminPlatformUsersTab';
import { AdminRolesPermissionsTab } from './tabs/AdminRolesPermissionsTab';
import { AdminModuleAccessTab } from './tabs/AdminModuleAccessTab';
import { AdminLoginSecurityTab } from './tabs/AdminLoginSecurityTab';
import { AdminAuditLogTab } from './tabs/AdminAuditLogTab';

import { AddStaffModal } from './modals/AddStaffModal';
import { EditStaffModal } from './modals/EditStaffModal';
import { ResetPasswordModal } from './modals/ResetPasswordModal';
import { ConfirmActionModal } from './modals/ConfirmActionModal';
import { CreateRoleModal } from './modals/CreateRoleModal';
import { EditPermissionsModal } from './modals/EditPermissionsModal';
import { ViewStaffDetailsModal } from './modals/ViewStaffDetailsModal';

import type {
  AdminTab,
  AdminStaffUser,
  PlatformUserAccount,
  PermissionLevel,
  ActionPermissions,
  AccountStatus,
} from '../../types/admin';

interface AdminPageProps {
  onNavigateDashboard?: () => void;
  onNavigateModule?: (moduleId: number) => void;
}

export function AdminPage({ onNavigateDashboard }: AdminPageProps) {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // State synchronized from service
  const [staffUsers, setStaffUsers] = useState(() => adminService.getStaffUsers());
  const [platformUsers, setPlatformUsers] = useState(() => adminService.getPlatformUsers());
  const [roles, setRoles] = useState(() => adminService.getRoles());
  const [securityPolicy, setSecurityPolicy] = useState(() => adminService.getSecurityPolicy());
  const [activeSessions, setActiveSessions] = useState(() => adminService.getActiveSessions());
  const [auditLogs, setAuditLogs] = useState(() => adminService.getAuditLogs());

  // Modal states
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [editingStaffUser, setEditingStaffUser] = useState<AdminStaffUser | null>(null);
  const [viewingStaffUser, setViewingStaffUser] = useState<AdminStaffUser | null>(null);
  const [permissionsStaffUser, setPermissionsStaffUser] = useState<AdminStaffUser | null>(null);
  const [resetPasswordTarget, setResetPasswordTarget] = useState<{
    id: string;
    name: string;
    username: string;
    email: string;
    type?: string;
    isStaff: boolean;
  } | null>(null);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);

  // Generic confirmation modal state
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    variant: 'danger' | 'warning' | 'primary';
    showReasonInput?: boolean;
    onConfirm: (reason?: string) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    variant: 'warning',
    onConfirm: () => {},
  });

  function refreshAll() {
    setStaffUsers(adminService.getStaffUsers());
    setPlatformUsers(adminService.getPlatformUsers());
    setRoles(adminService.getRoles());
    setSecurityPolicy(adminService.getSecurityPolicy());
    setActiveSessions(adminService.getActiveSessions());
    setAuditLogs(adminService.getAuditLogs());
  }

  // ---------------------------------------------------------------------------
  // HANDLERS FOR STAFF
  // ---------------------------------------------------------------------------
  function handleCreateStaff(data: Parameters<typeof adminService.createStaffUser>[0]) {
    adminService.createStaffUser(data);
    refreshAll();
    showToast(`Staff account created for ${data.name}.`, 'success');
  }

  function handleUpdateStaff(id: string, data: Partial<AdminStaffUser>) {
    adminService.updateStaffUser(id, data);
    refreshAll();
    showToast('Staff member details updated successfully.', 'success');
  }

  function handleToggleStaffStatus(user: AdminStaffUser) {
    const isLocked = user.status === 'Locked';
    const targetStatus: AccountStatus = isLocked ? 'Active' : 'Locked';

    setConfirmModalConfig({
      isOpen: true,
      title: isLocked ? `Unlock Account: ${user.name}` : `Lock Account: ${user.name}`,
      message: isLocked
        ? `Are you sure you want to restore full login and access permissions for @${user.username}?`
        : `Locking this account will immediately revoke all active sessions and prevent login for @${user.username}.`,
      confirmLabel: isLocked ? 'Unlock Account' : 'Lock Account',
      variant: isLocked ? 'primary' : 'danger',
      showReasonInput: !isLocked,
      onConfirm: (reason) => {
        adminService.setStaffStatus(user.id, targetStatus, reason);
        refreshAll();
        showToast(
          isLocked ? `Account @${user.username} has been unlocked.` : `Account @${user.username} has been locked.`,
          isLocked ? 'success' : 'warning',
        );
      },
    });
  }

  // ---------------------------------------------------------------------------
  // HANDLERS FOR PLATFORM USERS
  // ---------------------------------------------------------------------------
  function handleTogglePlatformUserStatus(user: PlatformUserAccount) {
    const isLocked = user.status === 'Locked' || user.status === 'Suspended';
    const targetStatus: AccountStatus = isLocked ? 'Active' : 'Locked';

    setConfirmModalConfig({
      isOpen: true,
      title: isLocked ? `Restore Access for ${user.name}` : `Restrict Access for ${user.name}`,
      message: isLocked
        ? `Enable platform authentication and module access for ${user.name} (${user.userType})?`
        : `Restrict access for ${user.name} (${user.userType}). They will be unable to sign in to the platform.`,
      confirmLabel: isLocked ? 'Restore Access' : 'Lock Access',
      variant: isLocked ? 'primary' : 'danger',
      showReasonInput: !isLocked,
      onConfirm: (reason) => {
        adminService.setPlatformUserStatus(user.id, targetStatus, reason);
        refreshAll();
        showToast(
          isLocked ? `Access enabled for ${user.name}.` : `Access restricted for ${user.name}.`,
          isLocked ? 'success' : 'warning',
        );
      },
    });
  }

  function handleResetPasswordConfirm(options: {
    method: 'generate_temp' | 'send_email_link';
    forceChangeOnLogin: boolean;
  }) {
    if (!resetPasswordTarget) return { success: false, message: 'No target user' };

    let res;
    if (resetPasswordTarget.isStaff) {
      res = adminService.resetStaffPassword(resetPasswordTarget.id, options);
    } else {
      res = adminService.resetPlatformUserPassword(resetPasswordTarget.id);
    }
    refreshAll();
    showToast(res.message, 'success');
    return res;
  }

  // ---------------------------------------------------------------------------
  // HANDLERS FOR ROLES & MATRIX
  // ---------------------------------------------------------------------------
  function handleCreateRole(data: { name: string; description: string; cloneFromRoleId?: string }) {
    const newRole = adminService.createRole(data);
    refreshAll();
    showToast(`Role '${newRole.name}' created successfully.`, 'success');
  }

  function handleUpdateRoleMatrix(roleId: string, matrix: Record<string, ActionPermissions>) {
    adminService.updateRoleMatrix(roleId, matrix);
    refreshAll();
    showToast('Role access matrix updated successfully.', 'success');
  }

  function handleDeleteRole(roleId: string) {
    const target = roles.find((r) => r.id === roleId);
    if (!target) return;

    setConfirmModalConfig({
      isOpen: true,
      title: `Delete Custom Role: ${target.name}`,
      message: `Are you sure you want to delete the role '${target.name}'? This action cannot be undone.`,
      confirmLabel: 'Delete Role',
      variant: 'danger',
      onConfirm: () => {
        const res = adminService.deleteRole(roleId);
        if (res.success) {
          refreshAll();
          showToast(res.message, 'success');
        } else {
          showToast(res.message, 'error');
        }
      },
    });
  }

  function handleUpdateCustomPermissions(
    userId: string,
    permissions: Record<string, PermissionLevel>,
    actions?: Record<string, ActionPermissions>,
  ) {
    adminService.updateStaffCustomPermissions(userId, permissions, actions);
    refreshAll();
    showToast('Module access permissions updated successfully.', 'success');
  }

  // ---------------------------------------------------------------------------
  // HANDLERS FOR SECURITY & SESSIONS
  // ---------------------------------------------------------------------------
  function handleUpdateSecurityPolicy(updates: Partial<typeof securityPolicy>) {
    adminService.updateSecurityPolicy(updates);
    refreshAll();
    showToast('Security policy updated.', 'success');
  }

  function handleRevokeSession(sessionId: string) {
    adminService.revokeSession(sessionId);
    refreshAll();
    showToast('Login session revoked.', 'info');
  }

  function handleRevokeAllOtherSessions() {
    const count = adminService.revokeAllOtherSessions();
    refreshAll();
    showToast(`Terminated ${count} active sessions.`, 'warning');
  }

  // Tab definitions
  const tabs: { id: AdminTab; label: string; icon: string; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'staff', label: 'Admin Staff', icon: 'fa-user-shield', count: staffUsers.length },
    { id: 'platform-users', label: 'Platform Users', icon: 'fa-users', count: platformUsers.length },
    { id: 'roles-permissions', label: 'Roles & Permissions', icon: 'fa-id-badge', count: roles.length },
    { id: 'module-access', label: 'Module Access', icon: 'fa-th' },
    { id: 'login-security', label: 'Login & Security', icon: 'fa-shield-alt' },
    { id: 'audit-log', label: 'Activity / Audit Log', icon: 'fa-clipboard-list', count: auditLogs.length },
  ];

  return (
    <div style={{ padding: '24px 32px 60px', maxWidth: 1440, margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {onNavigateDashboard && (
            <button
              type="button"
              onClick={onNavigateDashboard}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                width: 38,
                height: 38,
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #091e42, #0265c2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: 16,
              }}>
                <i className="fas fa-shield-alt" />
              </div>
              <h1 style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 800,
                color: '#091e42',
                letterSpacing: '-0.02em',
              }}>
                Admin Central Access Control
              </h1>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Central administration, credential governance, role matrices, and audit logging
            </p>
          </div>
        </div>

        {/* Global Security Status Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: '8px 16px',
          borderRadius: 30,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
            Security Guard Active
          </div>
          <div style={{ width: 1, height: 16, background: '#cbd5e1' }} />
          <div style={{ fontSize: 12, color: '#64748b' }}>
            2FA: <strong>{securityPolicy.twoFactorPolicy.enforcement}</strong>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: '#ffffff',
        padding: '6px',
        borderRadius: 14,
        border: '1px solid #e2e8f0',
        marginBottom: 24,
        overflowX: 'auto',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #091e42, #0052cc)' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <i className={`fas ${tab.icon}`} style={{ fontSize: 13, color: isActive ? '#ffffff' : '#94a3b8' }} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#475569',
                  padding: '2px 7px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <AdminOverviewTab
          staffUsers={staffUsers}
          platformUsers={platformUsers}
          roles={roles}
          securityPolicy={securityPolicy}
          auditLogs={auditLogs}
          onNavigateTab={setActiveTab}
          onOpenAddStaff={() => setIsAddStaffOpen(true)}
          onOpenCreateRole={() => setIsCreateRoleOpen(true)}
        />
      )}

      {activeTab === 'staff' && (
        <AdminStaffTab
          staffUsers={staffUsers}
          roles={roles}
          onAddStaff={() => setIsAddStaffOpen(true)}
          onEditStaff={(user) => setEditingStaffUser(user)}
          onViewStaffDetails={(user) => setViewingStaffUser(user)}
          onResetPassword={(user) =>
            setResetPasswordTarget({
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email,
              type: user.role,
              isStaff: true,
            })
          }
          onEditPermissions={(user) => setPermissionsStaffUser(user)}
          onToggleStatus={handleToggleStaffStatus}
        />
      )}

      {activeTab === 'platform-users' && (
        <AdminPlatformUsersTab
          platformUsers={platformUsers}
          onResetPassword={(user) =>
            setResetPasswordTarget({
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email,
              type: user.userType,
              isStaff: false,
            })
          }
          onToggleStatus={handleTogglePlatformUserStatus}
          onUpdateModules={(user, modules) => {
            adminService.updatePlatformUserModules(user.id, modules);
            refreshAll();
            showToast('Module permissions updated.', 'success');
          }}
        />
      )}

      {activeTab === 'roles-permissions' && (
        <AdminRolesPermissionsTab
          roles={roles}
          onOpenCreateRole={() => setIsCreateRoleOpen(true)}
          onUpdateRoleMatrix={handleUpdateRoleMatrix}
          onDeleteRole={handleDeleteRole}
        />
      )}

      {activeTab === 'module-access' && (
        <AdminModuleAccessTab
          staffUsers={staffUsers}
          roles={roles}
          onUpdatePermissions={(userId, perms) => {
            adminService.updateStaffCustomPermissions(userId, perms);
            refreshAll();
            showToast('User module permissions saved.', 'success');
          }}
        />
      )}

      {activeTab === 'login-security' && (
        <AdminLoginSecurityTab
          policy={securityPolicy}
          activeSessions={activeSessions}
          onUpdatePolicy={handleUpdateSecurityPolicy}
          onRevokeSession={handleRevokeSession}
          onRevokeAllOtherSessions={handleRevokeAllOtherSessions}
        />
      )}

      {activeTab === 'audit-log' && (
        <AdminAuditLogTab
          logs={auditLogs}
          onClearLogs={() => {
            adminService.clearLogs();
            refreshAll();
            showToast('Audit logs cleared.', 'info');
          }}
        />
      )}

      {/* Modals */}
      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        onSubmit={handleCreateStaff}
      />

      <EditStaffModal
        isOpen={!!editingStaffUser}
        user={editingStaffUser}
        onClose={() => setEditingStaffUser(null)}
        onSubmit={handleUpdateStaff}
      />

      <ResetPasswordModal
        isOpen={!!resetPasswordTarget}
        targetUser={resetPasswordTarget}
        onClose={() => setResetPasswordTarget(null)}
        onConfirm={handleResetPasswordConfirm}
      />

      <CreateRoleModal
        isOpen={isCreateRoleOpen}
        existingRoles={roles}
        onClose={() => setIsCreateRoleOpen(false)}
        onSubmit={handleCreateRole}
      />

      <EditPermissionsModal
        isOpen={!!permissionsStaffUser}
        user={permissionsStaffUser}
        roles={roles}
        onClose={() => setPermissionsStaffUser(null)}
        onSubmit={(userId, perms, actions) => handleUpdateCustomPermissions(userId, perms, actions)}
      />

      <ViewStaffDetailsModal
        isOpen={!!viewingStaffUser}
        user={viewingStaffUser}
        roles={roles}
        onClose={() => setViewingStaffUser(null)}
        onEdit={() => {
          setEditingStaffUser(viewingStaffUser);
          setViewingStaffUser(null);
        }}
        onResetPassword={() => {
          if (viewingStaffUser) {
            setResetPasswordTarget({
              id: viewingStaffUser.id,
              name: viewingStaffUser.name,
              username: viewingStaffUser.username,
              email: viewingStaffUser.email,
              type: viewingStaffUser.role,
              isStaff: true,
            });
          }
          setViewingStaffUser(null);
        }}
        onToggleStatus={() => {
          if (viewingStaffUser) {
            handleToggleStaffStatus(viewingStaffUser);
          }
          setViewingStaffUser(null);
        }}
      />

      <ConfirmActionModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmLabel={confirmModalConfig.confirmLabel}
        variant={confirmModalConfig.variant}
        showReasonInput={confirmModalConfig.showReasonInput}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={(reason) => confirmModalConfig.onConfirm(reason)}
      />
    </div>
  );
}

export default AdminPage;
