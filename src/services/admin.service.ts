import {
  INITIAL_STAFF_USERS,
  INITIAL_PLATFORM_USERS,
  INITIAL_ROLES,
  INITIAL_SECURITY_POLICY,
  INITIAL_ACTIVE_SESSIONS,
  INITIAL_AUDIT_LOGS,
  PLATFORM_CORE_MODULES,
} from '../data/adminData';
import type {
  AdminStaffUser,
  PlatformUserAccount,
  RoleDefinition,
  SecurityPolicyConfig,
  ActiveSession,
  AdminAuditLog,
  AccountStatus,
  PermissionLevel,
  ActionPermissions,
  AdminRoleType,
  DepartmentType,
} from '../types/admin';

class AdminService {
  private staffUsers: AdminStaffUser[] = [...INITIAL_STAFF_USERS];
  private platformUsers: PlatformUserAccount[] = [...INITIAL_PLATFORM_USERS];
  private roles: RoleDefinition[] = [...INITIAL_ROLES];
  private securityPolicy: SecurityPolicyConfig = { ...INITIAL_SECURITY_POLICY };
  private activeSessions: ActiveSession[] = [...INITIAL_ACTIVE_SESSIONS];
  private auditLogs: AdminAuditLog[] = [...INITIAL_AUDIT_LOGS];

  // ---------------------------------------------------------------------------
  // AUDIT LOG HELPER
  // ---------------------------------------------------------------------------
  public logActivity(
    action: string,
    module: string,
    details?: string,
    status: 'Success' | 'Failed' | 'Warning' | 'Blocked' = 'Success',
    beforeState?: string,
    afterState?: string,
  ): AdminAuditLog {
    const newLog: AdminAuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user: 'Labeeb EEE',
      username: 'labeeb.eee',
      userRole: 'Super Admin',
      userAvatar: 'LE',
      action,
      module,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      ipAddress: '10.0.4.22 (Current Session)',
      location: 'Bengaluru, India',
      status,
      details,
      beforeState,
      afterState,
    };
    this.auditLogs = [newLog, ...this.auditLogs];
    return newLog;
  }

  // ---------------------------------------------------------------------------
  // ADMIN STAFF METHODS
  // ---------------------------------------------------------------------------
  public getStaffUsers(): AdminStaffUser[] {
    return [...this.staffUsers];
  }

  public getStaffById(id: string): AdminStaffUser | undefined {
    return this.staffUsers.find((u) => u.id === id);
  }

  public createStaffUser(data: {
    name: string;
    username: string;
    email: string;
    role: AdminRoleType;
    department: DepartmentType;
    sendInviteEmail?: boolean;
    requirePasswordChange?: boolean;
  }): AdminStaffUser {
    const initials = data.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newUser: AdminStaffUser = {
      id: `ADM-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name,
      username: data.username.toLowerCase().trim(),
      email: data.email.toLowerCase().trim(),
      avatar: initials || 'AD',
      role: data.role,
      department: data.department,
      status: 'Active',
      twoFactorStatus: data.role.includes('Admin') ? 'Enforced' : 'Optional' as any,
      lastLogin: 'Never logged in',
      lastLoginIp: '—',
      createdAt: new Date().toISOString().split('T')[0],
      mustChangePasswordOnLogin: data.requirePasswordChange ?? true,
      failedLoginAttempts: 0,
    };

    this.staffUsers = [newUser, ...this.staffUsers];
    this.logActivity(
      `Created admin staff account: ${newUser.name} (@${newUser.username})`,
      'Admin Staff',
      `Assigned role ${newUser.role} in ${newUser.department} department.`,
    );

    // Update role count
    const roleDef = this.roles.find((r) => r.name === data.role);
    if (roleDef) {
      roleDef.userCount += 1;
    }

    return newUser;
  }

  public updateStaffUser(
    id: string,
    updates: Partial<Omit<AdminStaffUser, 'id' | 'createdAt'>>,
  ): AdminStaffUser | undefined {
    const index = this.staffUsers.findIndex((u) => u.id === id);
    if (index === -1) return undefined;

    const previous = this.staffUsers[index];
    const updated = { ...previous, ...updates };
    this.staffUsers[index] = updated;

    this.logActivity(
      `Updated profile for staff member ${updated.name}`,
      'Admin Staff',
      `Updated fields: ${Object.keys(updates).join(', ')}`,
      'Success',
      JSON.stringify({ role: previous.role, department: previous.department, status: previous.status }),
      JSON.stringify({ role: updated.role, department: updated.department, status: updated.status }),
    );

    return updated;
  }

  public setStaffStatus(id: string, status: AccountStatus, reason?: string): boolean {
    const user = this.getStaffById(id);
    if (!user) return false;

    const prevStatus = user.status;
    user.status = status;
    if (status === 'Locked') {
      user.lockoutReason = reason || 'Account locked by administrator.';
    } else if (status === 'Active') {
      user.failedLoginAttempts = 0;
      user.lockoutReason = undefined;
    }

    this.logActivity(
      `Changed staff status: ${user.name} to ${status}`,
      'Admin Staff',
      reason ? `Reason: ${reason}` : `Status updated from ${prevStatus} to ${status}.`,
      status === 'Locked' ? 'Warning' : 'Success',
    );
    return true;
  }

  public resetStaffPassword(
    id: string,
    options: { forceChangeOnLogin?: boolean; method: 'generate_temp' | 'send_email_link' },
  ): { success: boolean; tempPassword?: string; message: string } {
    const user = this.getStaffById(id);
    if (!user) return { success: false, message: 'User not found' };

    user.mustChangePasswordOnLogin = options.forceChangeOnLogin ?? true;
    user.failedLoginAttempts = 0;
    if (user.status === 'Locked') {
      user.status = 'Active';
      user.lockoutReason = undefined;
    }

    let tempPassword: string | undefined;
    if (options.method === 'generate_temp') {
      // Secure pseudo-generator for one-time credential presentation
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
      tempPassword = Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    this.logActivity(
      `Password reset triggered for ${user.name} (@${user.username})`,
      'Admin Staff',
      options.method === 'generate_temp'
        ? 'Generated secure temporary one-time password credential. Mandatory change on login enabled.'
        : `Sent secure password reset link to registered email (${user.email}).`,
    );

    return {
      success: true,
      tempPassword,
      message:
        options.method === 'generate_temp'
          ? `Temporary password generated for ${user.username}. Share securely with user.`
          : `Password reset instructions sent to ${user.email}.`,
    };
  }

  public updateStaffCustomPermissions(
    id: string,
    permissions: Record<string, PermissionLevel>,
    actions?: Record<string, ActionPermissions>,
  ): boolean {
    const user = this.getStaffById(id);
    if (!user) return false;

    user.customPermissions = permissions;
    if (actions) user.customActions = actions;

    this.logActivity(
      `Admin updated ${user.name}'s permissions`,
      'Module Access',
      `Custom module permissions override configured for @${user.username}.`,
      'Success',
      'Standard Role Permissions',
      `${Object.entries(permissions).filter(([_, v]) => v !== 'No Access').length} active module overrides`,
    );
    return true;
  }

  // ---------------------------------------------------------------------------
  // PLATFORM USERS METHODS
  // ---------------------------------------------------------------------------
  public getPlatformUsers(): PlatformUserAccount[] {
    return [...this.platformUsers];
  }

  public setPlatformUserStatus(id: string, status: AccountStatus, reason?: string): boolean {
    const user = this.platformUsers.find((u) => u.id === id);
    if (!user) return false;

    const prev = user.status;
    user.status = status;
    user.isLoginAllowed = status === 'Active';
    if (status === 'Locked') {
      user.lockoutReason = reason || 'Locked by security administrator.';
    } else if (status === 'Active') {
      user.failedAttempts = 0;
      user.lockoutReason = undefined;
    }

    this.logActivity(
      `Platform user access status changed: ${user.name} (${user.userType}) to ${status}`,
      'Platform Users',
      reason ? `Reason: ${reason}` : `Status changed from ${prev} to ${status}.`,
      status === 'Locked' || status === 'Suspended' ? 'Warning' : 'Success',
    );
    return true;
  }

  public resetPlatformUserPassword(
    id: string,
  ): { success: boolean; tempPassword?: string; message: string } {
    const user = this.platformUsers.find((u) => u.id === id);
    if (!user) return { success: false, message: 'User not found' };

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    const tempPassword = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    user.failedAttempts = 0;
    if (user.status === 'Locked') {
      user.status = 'Active';
      user.isLoginAllowed = true;
      user.lockoutReason = undefined;
    }

    this.logActivity(
      `Reset credentials for platform user ${user.name} (${user.userType})`,
      'Platform Users',
      `Temporary credentials generated for @${user.username}.`,
    );

    return {
      success: true,
      tempPassword,
      message: `Credentials successfully reset for ${user.name}.`,
    };
  }

  public updatePlatformUserModules(id: string, modules: string[]): boolean {
    const user = this.platformUsers.find((u) => u.id === id);
    if (!user) return false;

    user.allowedModules = modules;
    this.logActivity(
      `Updated platform module access for ${user.name}`,
      'Platform Users',
      `Allowed modules: ${modules.join(', ')}`,
    );
    return true;
  }

  // ---------------------------------------------------------------------------
  // ROLES & ACCESS MATRIX METHODS
  // ---------------------------------------------------------------------------
  public getRoles(): RoleDefinition[] {
    return [...this.roles];
  }

  public getRoleById(id: string): RoleDefinition | undefined {
    return this.roles.find((r) => r.id === id);
  }

  public createRole(data: {
    name: string;
    description: string;
    cloneFromRoleId?: string;
  }): RoleDefinition {
    const baseRole = data.cloneFromRoleId ? this.getRoleById(data.cloneFromRoleId) : this.roles[1];
    const newRole: RoleDefinition = {
      id: `ROLE-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name,
      roleType: 'Custom Role',
      description: data.description,
      isSystem: false,
      userCount: 0,
      badgeColor: '#0284c7',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      defaultPermissions: { ...(baseRole?.defaultPermissions || {}) },
      matrix: JSON.parse(JSON.stringify(baseRole?.matrix || {})),
    };

    this.roles.push(newRole);
    this.logActivity(
      `Created custom role: ${newRole.name}`,
      'Roles & Permissions',
      `Initialized with base permissions from ${baseRole?.name || 'Default'}.`,
    );
    return newRole;
  }

  public updateRoleMatrix(
    roleId: string,
    matrix: Record<string, ActionPermissions>,
    defaultPermissions?: Record<string, PermissionLevel>,
  ): boolean {
    const role = this.getRoleById(roleId);
    if (!role) return false;

    role.matrix = matrix;
    if (defaultPermissions) {
      role.defaultPermissions = defaultPermissions;
    } else {
      // derive default permissions
      Object.keys(matrix).forEach((mod) => {
        const act = matrix[mod];
        if (act.manage || (act.view && act.edit && act.delete)) {
          role.defaultPermissions[mod] = 'Full Access';
        } else if (act.view && act.edit) {
          role.defaultPermissions[mod] = 'View & Edit';
        } else if (act.view) {
          role.defaultPermissions[mod] = 'View';
        } else {
          role.defaultPermissions[mod] = 'No Access';
        }
      });
    }
    role.updatedAt = new Date().toISOString().split('T')[0];

    this.logActivity(
      `Role permissions updated: ${role.name}`,
      'Roles & Permissions',
      `Modified granular action permissions matrix for role ${role.name}.`,
    );
    return true;
  }

  public deleteRole(roleId: string): { success: boolean; message: string } {
    const role = this.getRoleById(roleId);
    if (!role) return { success: false, message: 'Role not found' };
    if (role.isSystem) return { success: false, message: 'System default roles cannot be deleted.' };
    if (role.userCount > 0)
      return { success: false, message: `Cannot delete role with ${role.userCount} assigned users. Reassign users first.` };

    this.roles = this.roles.filter((r) => r.id !== roleId);
    this.logActivity(`Deleted custom role: ${role.name}`, 'Roles & Permissions');
    return { success: true, message: `Role ${role.name} was removed.` };
  }

  // ---------------------------------------------------------------------------
  // LOGIN & SECURITY POLICIES
  // ---------------------------------------------------------------------------
  public getSecurityPolicy(): SecurityPolicyConfig {
    return JSON.parse(JSON.stringify(this.securityPolicy));
  }

  public updateSecurityPolicy(updates: Partial<SecurityPolicyConfig>): SecurityPolicyConfig {
    this.securityPolicy = {
      ...this.securityPolicy,
      ...updates,
    };
    this.logActivity(
      'Global security policies updated',
      'Login & Security',
      `Security configuration modified: ${Object.keys(updates).join(', ')}`,
      'Success',
    );
    return this.securityPolicy;
  }

  // ---------------------------------------------------------------------------
  // ACTIVE SESSIONS
  // ---------------------------------------------------------------------------
  public getActiveSessions(): ActiveSession[] {
    return [...this.activeSessions];
  }

  public revokeSession(sessionId: string): boolean {
    const session = this.activeSessions.find((s) => s.id === sessionId);
    if (!session) return false;

    this.activeSessions = this.activeSessions.filter((s) => s.id !== sessionId);
    this.logActivity(
      `Revoked login session for ${session.userName} (${session.ipAddress})`,
      'Login & Security',
      `Device: ${session.device}, Browser: ${session.browser}`,
      'Warning',
    );
    return true;
  }

  public revokeAllOtherSessions(): number {
    const count = this.activeSessions.filter((s) => !s.isCurrent).length;
    this.activeSessions = this.activeSessions.filter((s) => s.isCurrent);
    this.logActivity(
      `Terminated all ${count} other active login sessions`,
      'Login & Security',
      'Force logout issued across all active devices.',
      'Warning',
    );
    return count;
  }

  // ---------------------------------------------------------------------------
  // AUDIT LOGS
  // ---------------------------------------------------------------------------
  public getAuditLogs(): AdminAuditLog[] {
    return [...this.auditLogs];
  }

  public clearLogs(): void {
    this.auditLogs = [];
  }
}

export const adminService = new AdminService();
