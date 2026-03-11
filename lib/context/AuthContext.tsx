'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import authService, { User, RegisterData } from '../services/authService';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: RegisterData) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local state - cookies are handled by the server
      setUser(null);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authService.getUser();
      setUser(response.data);
    } catch (error: any) {
      // Handle 401 errors - session expired or invalid token
      if (error?.response?.status === 401) {
        console.log('Session expired or not authenticated');
        setUser(null);
        // Removed admin redirect - allow direct access to admin pages
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  // Periodic session check (every 5 minutes)
  useEffect(() => {
    if (!isInitialized) return;

    const intervalId = setInterval(() => {
      if (user) {
        checkAuth();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [checkAuth, isInitialized, user]);

  useEffect(() => {
    // Check auth on mount and after page reload
    if (!isInitialized) {
      checkAuth();
      setIsInitialized(true);
    }
  }, [checkAuth, isInitialized]);

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
