import { API_BASE_URL } from './apiConfig';
import { authService } from './auth.service';

export interface UserAccount {
  _id?: string;
  id: number | string;
  userId?: string;
  username?: string;
  displayName?: string;
  fullName?: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Staff' | string;
  allowedModules?: number[];
  department?: string;
  status?: 'Active' | 'Inactive' | 'Locked';
  lockoutReason?: string | null;
  createdBy?: string;
  createdByName?: string;
  createdByRole?: string;
  assignedAdminId?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface UserStats {
  totalUsers: number;
  totalAdmins: number;
  totalStaff: number;
  activeUsers: number;
  lockedUsers: number;
}

export const userService = {
  async getUsers(params?: { search?: string; role?: string; status?: string }): Promise<UserAccount[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.role && params.role !== 'All') query.append('role', params.role);
    if (params?.status && params.status !== 'All') query.append('status', params.status);

    const res = await fetch(`${API_BASE_URL}/api/users?${query.toString()}`, {
      headers: authService.getAuthHeaders(),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch user accounts');
    }

    return data.users;
  },

  async getUserStats(): Promise<{ isSuperAdmin: boolean; stats: UserStats }> {
    const res = await fetch(`${API_BASE_URL}/api/users/stats`, {
      headers: authService.getAuthHeaders(),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch user statistics');
    }

    return {
      isSuperAdmin: data.isSuperAdmin,
      stats: data.stats,
    };
  },

  async createUser(userData: {
    userId?: string;
    username: string;
    displayName: string;
    email: string;
    role: 'Admin' | 'Staff';
    department?: string;
    password: string;
    allowedModules?: number[];
  }): Promise<UserAccount> {
    const res = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create user account');
    }

    return data.user;
  },

  async updateUser(
    id: string | number,
    updates: {
      displayName?: string;
      email?: string;
      department?: string;
      role?: string;
      status?: 'Active' | 'Inactive' | 'Locked';
      allowedModules?: number[];
    },
  ): Promise<UserAccount> {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update user account');
    }

    return data.user;
  },

  async resetPassword(
    id: string | number,
    newPassword?: string,
  ): Promise<{ success: boolean; message: string; generatedPassword?: string }> {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}/reset-password`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ newPassword }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to reset password');
    }

    return data;
  },

  async toggleStatus(
    id: string | number,
    status: 'Active' | 'Inactive' | 'Locked',
    reason?: string,
  ): Promise<UserAccount> {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}/status`, {
      method: 'PATCH',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ status, reason }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to change user status');
    }

    return data.user;
  },

  async deleteUser(id: string | number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete user account');
    }
  },
};
