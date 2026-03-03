import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', // Changed from 127.0.0.1 to localhost
  withCredentials: true, // CRITICAL: This enables HTTP-only cookies
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Important for Laravel to recognize AJAX requests
  },
});

// Request interceptor to get CSRF token from cookie
api.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookie
    const token = getCookie('XSRF-TOKEN');
    if (token) {
      // Decode the token properly
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
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
        // Get a fresh CSRF token
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });

        // Get the new token from cookie
        const newToken = getCookie('XSRF-TOKEN');
        if (newToken) {
          originalRequest.headers['X-XSRF-TOKEN'] = decodeURIComponent(newToken);
        }

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (csrfError) {
        return Promise.reject(csrfError);
      }
    }

    // Don't handle 401 redirects here - let components handle auth state
    // This prevents redirect loops on auth pages

    return Promise.reject(error);
  }
);

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

export default api;
