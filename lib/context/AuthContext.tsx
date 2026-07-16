'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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
    } catch (error: any) {
      // Handle 401 errors from auth check
      if (error?.response?.status === 401 || error?.silent) {
        // Session expired or invalid - user was logged in but now isn't
        const wasLoggedIn = !!userRef.current;
        if (wasLoggedIn) {
          console.log('Session check failed - session expired');
          setUser(null);
          userRef.current = null;

          // Clear cache
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // Redirect to login with current path and sessionExpired flag
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
          const loginUrl = '/auth/login?redirect=' + encodeURIComponent(currentPath) + '&sessionExpired=true';
          router.push(loginUrl);
        }
      } else {
        setUser(null);
        userRef.current = null;
      }
    } finally {
      isCheckingAuthRef.current = false;
      if (showLoading) setLoading(false);
    }
  }, [router]);

  // Handle global unauthenticated event (401 responses)
  useEffect(() => {
    const handleUnauthenticated = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { reason, wasLoggedIn } = customEvent.detail || {};

      if (wasLoggedIn && reason === 'session_expired') {
        // Session expired - user was logged in but now isn't
        console.log('Session expired - redirecting to login');
        setUser(null);
        userRef.current = null;

        // Redirect with sessionExpired flag so login page knows not to auto-fill email
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
        const loginUrl = '/auth/login?redirect=' + encodeURIComponent(currentPath) + '&sessionExpired=true';
        router.push(loginUrl);
      }
    };

    window.addEventListener('unauthenticated', handleUnauthenticated);
    return () => window.removeEventListener('unauthenticated', handleUnauthenticated);
  }, [router]);

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
