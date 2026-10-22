import type {
  UserProfile,
  StorageUsage,
  SecurityIssue,
  ActivityControl,
  ContactItem,
  SubscriptionItem,
  HelpArticle,
  AccountType,
} from '../types/user.types'
import { authService } from '../../../services/auth.service'

class UserService {
  private cachedProfile: UserProfile | null = null

  getAccountType(_overrideType?: string | null): AccountType {
    return 'Company'
  }

  async getUserProfile(_accountType?: string | null): Promise<UserProfile> {
    const authUser = authService.getCachedUser()
    const displayName = authUser?.displayName || authUser?.username || 'Executive Admin'
    const email = authUser?.email || 'admin@letgetin.com'
    const role = authUser?.role || 'Super Admin'

    if (!this.cachedProfile) {
      this.cachedProfile = {
        id: String(authUser?.id || 'admin_1'),
        name: displayName,
        nickname: authUser?.username || 'Admin',
        email: email,
        phone: '+1 (555) 019-2834',
        avatarText: displayName.charAt(0).toUpperCase() || 'A',
        birthday: 'October 14, 1994',
        gender: 'Rather not say',
        passwordLastChanged: 'Aug 8, 2023',
        role: role,
        accountType: 'Company',
        organizationName: 'LetGetIn Global ERP Hub',
      }
    } else {
      // Sync in case auth details updated
      this.cachedProfile.name = displayName
      this.cachedProfile.email = email
      this.cachedProfile.role = role
    }

    return { ...this.cachedProfile }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 250))
    if (!this.cachedProfile) {
      await this.getUserProfile()
    }
    this.cachedProfile = {
      ...this.cachedProfile!,
      ...updates,
    }
    return { ...this.cachedProfile! }
  }

  async getStorageUsage(): Promise<StorageUsage> {
    return {
      usedGb: 2.4,
      totalGb: 50,
      usedPercentage: 5,
    }
  }

  async getSecurityIssues(_accountType?: string | null): Promise<SecurityIssue[]> {
    return [
      {
        id: 'sec_admin_1',
        title: '2-Step Verification Active',
        description: 'Hardware security key and TOTP authenticator enabled for Admin ERP workspace.',
        severity: 'low',
      },
    ]
  }

  async getActivityControls(): Promise<ActivityControl[]> {
    return [
      { id: 'act_1', title: 'Admin Audit Log & Traceability', status: 'On' },
      { id: 'act_2', title: 'System Access Monitor', status: 'On' },
      { id: 'act_3', title: 'ERP Session History', status: 'On' },
    ]
  }

  async getContacts(): Promise<ContactItem[]> {
    return [
      { id: 'c_1', name: 'Super Admin Operations', email: 'superadmin@letgetin.com', avatarText: 'S' },
      { id: 'c_2', name: 'Compliance Team', email: 'compliance@letgetin.com', avatarText: 'C' },
      { id: 'c_3', name: 'Security Operations Center', email: 'soc@letgetin.com', avatarText: 'O' },
    ]
  }

  async getSubscriptions(_accountType?: string | null): Promise<SubscriptionItem[]> {
    return [
      { id: 'sub_1', title: 'LetGetIn Enterprise Admin Suite', description: 'Master control node & security audit', cost: 'Enterprise', status: 'Active' },
      { id: 'sub_2', title: 'Cloud Asset Storage', description: '50 GB Dedicated Enterprise Storage', cost: 'Included', status: 'Active' },
    ]
  }

  async getHelpArticles(): Promise<HelpArticle[]> {
    return [
      { id: 'h_1', title: 'Managing administrative access controls', category: 'Security' },
      { id: 'h_2', title: 'ERP audit logging and export', category: 'Compliance' },
      { id: 'h_3', title: 'Configuring SSO and two-factor credentials', category: 'Identity' },
    ]
  }
}

export const userService = new UserService()
export default userService
