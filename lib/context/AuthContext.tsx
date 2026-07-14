'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback, useMemo } from 'react';
import authService, { User, RegisterData } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: RegisterData) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: (showLoading?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false);
  const userRef = useRef<User | null>(null);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setUser(null);
      userRef.current = null;
    }
  }, []);

  const isCheckingAuthRef = useRef(false);

  const checkAuth = useCallback(async (showLoading = true) => {
    // Skip overlapping checks (e.g. a slow background poll still in flight)
    if (isCheckingAuthRef.current) return;
    isCheckingAuthRef.current = true;

    if (showLoading) setLoading(true);
    try {
      const response = await authService.getUser();
      setUser(response.data);
      userRef.current = response.data;
    } catch {
      setUser(null);
      userRef.current = null;
    } finally {
      isCheckingAuthRef.current = false;
      if (showLoading) setLoading(false);
    }
  }, []);

  // Periodic session check (every 5 minutes) — silent, no loading flash
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userRef.current) {
        checkAuth(false);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [checkAuth]);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      checkAuth();
    }
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.data.user);
    return response;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const response = await authService.register(data);
    setUser(response.data.user);
    return response;
  }, []);

  const value = useMemo(
    () => ({ user, login, register, logout, loading, checkAuth }),
    [user, login, register, logout, loading, checkAuth]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
