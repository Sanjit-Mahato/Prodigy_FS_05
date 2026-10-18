'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SafeUser } from '@/types';

interface AuthContextType {
  user: SafeUser | null;
  loading: boolean;
  unreadCount: number;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { username: string; email: string; password: string; name: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoUser: (username: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  updateLocalUser: (userData: Partial<SafeUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load user', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadNotifications = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success && typeof data.data.unreadCount === 'number') {
        setUnreadCount(data.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notification count', err);
    }
  }, [user]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (user) {
      fetchUnreadNotifications();
      const interval = setInterval(fetchUnreadNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user, fetchUnreadNotifications]);

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch {
      return { success: false, error: 'Network error during login' };
    }
  };

  const register = async (formData: { username: string; email: string; password: string; name: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch {
      return { success: false, error: 'Network error during registration' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setUnreadCount(0);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const switchDemoUser = async (username: string) => {
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Failed to switch demo user' };
    }
  };

  const updateLocalUser = (userData: Partial<SafeUser>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        unreadCount,
        login,
        register,
        logout,
        switchDemoUser,
        refreshUser,
        setUnreadCount,
        updateLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
