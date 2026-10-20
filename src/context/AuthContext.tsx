import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService, type AuthUser } from '../services/auth.service';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  login: (username: string, password: string, selectedRole?: string) => Promise<void>;
  loginSuperAdmin: (username: string, password: string) => Promise<void>;
  loginAdmin: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCachedUser());
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isSuperAdmin = user?.role === 'Super Admin' || user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'Admin' || user?.role === 'ADMIN';
  const isStaff =
    user?.role === 'Staff' ||
    user?.role === 'STAFF' ||
    user?.role === 'USER' ||
    user?.role === 'Manager' ||
    user?.role === 'HR';

  const refreshUser = useCallback(async () => {
    if (!authService.getToken()) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const freshUser = await authService.getMe();
      setUser(freshUser);
      setToken(authService.getToken());
    } catch (err) {
      console.warn('Failed to refresh user session:', err);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (username: string, password: string, selectedRole?: string) => {
    setIsLoading(true);
    try {
      const res = await authService.loginUnified(username, password, selectedRole);
      if (res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginSuperAdmin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.loginSuperAdmin(username, password);
      if (res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.loginAdmin(username, password);
      if (res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        isSuperAdmin,
        isAdmin,
        isStaff,
        login,
        loginSuperAdmin,
        loginAdmin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
