import { API_BASE_URL } from './apiConfig';

export interface AuthUser {
  id: number | string;
  userId: string;
  username: string;
  displayName: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Staff' | string;
  allowedModules?: number[];
  department?: string;
  status: 'Active' | 'Inactive' | 'Locked';
  avatarUrl?: string | null;
  createdAt?: string;
  lastLogin?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
}

const TOKEN_KEY = 'curemaso_auth_token';
const USER_KEY = 'curemaso_auth_user';

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setSession(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getCachedUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async loginUnified(username: string, password: string, selectedRole?: string): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, selectedRole }),
    });

    const data: LoginResponse = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Authentication failed');
    }

    if (data.token && data.user) {
      this.setSession(data.token, data.user);
    }
    return data;
  },

  async loginSuperAdmin(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/super-admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data: LoginResponse = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Super Admin login failed');
    }

    if (data.token && data.user) {
      this.setSession(data.token, data.user);
    }
    return data;
  },

  async loginAdmin(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data: LoginResponse = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Admin/Staff login failed');
    }

    if (data.token && data.user) {
      this.setSession(data.token, data.user);
    }
    return data;
  },

  async getMe(): Promise<AuthUser> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      this.clearSession();
      throw new Error(data.message || 'Failed to authenticate user session');
    }

    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } catch (err) {
      console.warn('Logout network error (clearing local session anyway):', err);
    } finally {
      this.clearSession();
    }
  },
};
