export type AccountStatus = 'Active' | 'Inactive' | 'Locked' | 'Suspended';
export type VerificationStatus = 'Verified' | 'Pending' | 'Rejected';
export type TwoFactorStatus = 'Enforced' | 'Enabled' | 'Disabled';

export type AdminRoleType =
  | 'Super Admin'
  | 'Admin'
  | 'Manager'
  | 'HR'
  | 'Finance'
  | 'Marketing'
  | 'Support'
  | 'Custom Role';

export type DepartmentType =
  | 'Executive'
  | 'Engineering'
  | 'Operations'
  | 'Clinical Ops'
  | 'Human Resources'
  | 'Finance & Accounts'
  | 'Sales & Growth'
  | 'Marketing'
  | 'Customer Support'
  | 'Legal & Compliance';

export type PermissionLevel = 'No Access' | 'View' | 'View & Edit' | 'Full Access';

export interface ActionPermissions {
  view: boolean;
  edit: boolean;
  delete: boolean;
  manage: boolean;
}

export interface ModulePermission {
  moduleId: number;
  moduleName: string;
  category: string;
  icon: string;
  level: PermissionLevel;
  actions: ActionPermissions;
}

export interface AdminStaffUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: AdminRoleType;
  department: DepartmentType;
  status: AccountStatus;
  twoFactorStatus: TwoFactorStatus;
  lastLogin: string;
  lastLoginIp: string;
  createdAt: string;
  mustChangePasswordOnLogin?: boolean;
  failedLoginAttempts: number;
  lockoutReason?: string;
  customPermissions?: Record<string, PermissionLevel>;
  customActions?: Record<string, ActionPermissions>;
}

export interface PlatformUserAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  userType: 'Candidate' | 'Startup' | 'Company' | 'Institution';
  avatar: string;
  status: AccountStatus;
  verificationStatus: VerificationStatus;
  twoFactorStatus: TwoFactorStatus;
  lastLogin: string;
  lastLoginIp: string;
  registrationDate: string;
  isLoginAllowed: boolean;
  failedAttempts: number;
  lockoutReason?: string;
  allowedModules: string[];
  customPermissions?: Record<string, PermissionLevel>;
}

export interface RoleDefinition {
  id: string;
  name: string;
  roleType: AdminRoleType;
  description: string;
  isSystem: boolean;
  userCount: number;
  badgeColor: string;
  createdAt: string;
  updatedAt: string;
  defaultPermissions: Record<string, PermissionLevel>;
  matrix: Record<string, ActionPermissions>;
}

export interface SecurityPolicyConfig {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
    preventReuseCount: number;
  };
  lockoutPolicy: {
    maxFailedAttempts: number;
    lockoutDurationMinutes: number;
    notifyAdminOnLockout: boolean;
    requireAdminUnlock: boolean;
  };
  twoFactorPolicy: {
    enforcement: 'Disabled' | 'Optional' | 'Mandatory for Admins' | 'Mandatory for All';
    allowedMethods: ('TOTP' | 'SMS' | 'Email' | 'Hardware Key')[];
    gracePeriodDays: number;
  };
  ipAccessControl: {
    enabled: boolean;
    mode: 'Allowlist' | 'Blocklist';
    allowedRanges: string[];
    blockTorAndVpn: boolean;
  };
  sessionConfig: {
    idleTimeoutMinutes: number;
    maxConcurrentSessionsPerUser: number;
    forceLogoutOnPasswordChange: boolean;
  };
}

export interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userType: 'Admin Staff' | 'Platform User';
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  loginTime: string;
  lastActive: string;
  isCurrent: boolean;
}

export type AuditLogStatus = 'Success' | 'Failed' | 'Warning' | 'Blocked';

export interface AdminAuditLog {
  id: string;
  user: string;
  username: string;
  userRole: string;
  userAvatar: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  status: AuditLogStatus;
  details?: string;
  beforeState?: string;
  afterState?: string;
}

export type AdminTab =
  | 'overview'
  | 'staff'
  | 'platform-users'
  | 'roles-permissions'
  | 'module-access'
  | 'login-security'
  | 'audit-log';
