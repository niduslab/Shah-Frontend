import axios from 'axios';
import { API_ORIGIN } from '@/lib/config/api';

const API_URL = API_ORIGIN;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // CRITICAL: This enables HTTP-only cookies
  timeout: 15000, // Fail fast instead of holding a browser connection slot forever
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Important for Laravel to recognize AJAX requests
  },
});

// Helper function to get cookie by name
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  
  return null;
}

// Request interceptor to get CSRF token from cookie
api.interceptors.request.use(
  (config) => {
    // Skip CSRF token for the csrf-cookie endpoint itself
    if (config.url?.includes('/sanctum/csrf-cookie')) {
      return config;
    }

    // Get CSRF token from cookie
    const token = getCookie('XSRF-TOKEN');
    if (token) {
      // Decode the token properly
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    } else {
      console.warn('No CSRF token found in cookies');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 419 (CSRF token mismatch) and haven't retried yet
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('CSRF token mismatch (419), fetching new token...');

        // Get a fresh CSRF token using raw axios to avoid interceptor loop
        await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });

        // Wait for cookie to be set
        await new Promise(resolve => setTimeout(resolve, 150));

        // Get the new token from cookie
        const newToken = getCookie('XSRF-TOKEN');
        if (newToken) {
          originalRequest.headers['X-XSRF-TOKEN'] = decodeURIComponent(newToken);
          console.log('Retrying request with new CSRF token');

          // Retry the original request with the new token
          return api(originalRequest);
        } else {
          console.error('Failed to get new CSRF token from cookie after refresh');
          return Promise.reject(new Error('Failed to refresh CSRF token'));
        }
      } catch (csrfError) {
        console.error('Error refreshing CSRF token:', csrfError);
        return Promise.reject(csrfError);
      }
    }

    // Handle 401 Unauthorized - session expired or unauthenticated
    if (error.response?.status === 401) {
      // Suppress console errors for expected 401s on auth check endpoint
      if (originalRequest.url?.includes('/api/auth/user')) {
        return Promise.reject({ ...error, silent: true });
      }

      if (typeof window !== 'undefined') {
        // Check if user was actually logged in before this 401
        const storedUser = localStorage.getItem('user');
        const hasAuthToken = localStorage.getItem('token');
        const wasLoggedIn = storedUser || hasAuthToken;

        if (wasLoggedIn) {
          // User was logged in but session expired or became invalid
          console.log('Session expired or invalid - clearing cache');

          // Clear all auth-related data from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // Clear all cookies by setting them to expire
          document.cookie.split(";").forEach((c) => {
            const name = c.split("=")[0].trim();
            if (name) {
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }
          });

          // Dispatch custom event for global auth state update and redirect
          window.dispatchEvent(
            new CustomEvent('unauthenticated', {
              detail: {
                status: 401,
                reason: 'session_expired',
                wasLoggedIn: true
              }
            })
          );
        } else {
          // User was never logged in - just a regular unauthenticated request
          console.log('Unauthenticated request - user was not logged in');
          error.isGuest = true;
        }
      }

      // Mark this error so components know to handle 401 differently
      error.isUnauthenticated = true;
    }

    return Promise.reject(error);
  }
);

export default api;
