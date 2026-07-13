import { API_ORIGIN } from '@/lib/config/api';
/**
 * CSRF Token Debugging Utility
 * Use this to diagnose CSRF token issues
 */

export function debugCSRFToken() {
  if (typeof document === 'undefined') {
    console.log('Running on server side - no cookies available');
    return;
  }

  console.group('🔍 CSRF Token Debug Info');
  
  // Get all cookies
  const allCookies = document.cookie;
  console.log('All Cookies:', allCookies || 'No cookies found');
  
  // Get XSRF-TOKEN specifically
  const xsrfToken = getCookie('XSRF-TOKEN');
  console.log('XSRF-TOKEN:', xsrfToken || 'Not found');
  
  if (xsrfToken) {
    console.log('XSRF-TOKEN (decoded):', decodeURIComponent(xsrfToken));
    console.log('XSRF-TOKEN length:', xsrfToken.length);
  }
  
  // Check Laravel session cookie
  const laravelSession = getCookie('laravel_session');
  console.log('Laravel Session:', laravelSession ? 'Present' : 'Not found');
  
  // Check API URL
  console.log('API URL:', API_ORIGIN);
  
  // Check current domain
  console.log('Current Domain:', window.location.hostname);
  console.log('Current Protocol:', window.location.protocol);
  
  console.groupEnd();
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  
  return null;
}

// Auto-run on import in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Run after a short delay to ensure cookies are loaded
  setTimeout(() => {
    console.log('📌 CSRF Debug utility loaded. Call debugCSRFToken() to see token info.');
  }, 1000);
}
