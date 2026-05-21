'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  requireAuth = false, 
  requireAdmin = false,
  redirectTo 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait for auth check to complete

    // If authentication is required but user is not logged in
    if (requireAuth && !user) {
      const loginUrl = redirectTo || `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    // If admin access is required but user is not admin
    if (requireAdmin && (!user || user.user_type !== 'admin')) {
      const loginPath = redirectTo ? redirectTo.split('?')[0] : '/login';
      if (pathname !== loginPath && pathname !== '/login' && pathname !== '/admin/login') {
        const target = redirectTo || `/login?redirect=${encodeURIComponent(pathname)}`;
        router.push(target);
      }
      return;
    }

    // If user is logged in but trying to access auth pages - redirect immediately
    if (user && (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password')) {
      if (user.user_type === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
      return;
    }
  }, [user, loading, requireAuth, requireAdmin, router, pathname, redirectTo]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00072D]"></div>
      </div>
    );
  }

  // Don't render children if auth requirements are not met
  if (requireAuth && !user) return null;
  if (requireAdmin && (!user || user.user_type !== 'admin')) return null;

  return <>{children}</>;
}