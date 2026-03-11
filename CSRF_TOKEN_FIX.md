# CSRF Token Mismatch Fix - UPDATED

## Problem
Getting "CSRF token mismatch" error (419) when making requests, especially during logout.

## Root Cause Analysis
This is a **frontend issue** with multiple potential causes:
1. Using the api instance (with interceptors) to fetch CSRF cookie creates a circular dependency
2. CSRF token not being properly set in cookies before requests
3. Cookie timing issues - token not available immediately after fetch
4. Interceptor trying to add CSRF token to the csrf-cookie request itself

## Solution Implemented (v2)

### 1. Fixed Auth Service (`lib/services/authService.ts`)
**Key Change**: Use raw `axios` instead of `api` instance for CSRF cookie fetching to avoid interceptor loops.

```typescript
import axios from 'axios'; // ✅ Import raw axios

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const authService = {
  // Use RAW axios to avoid interceptor loop
  async getCsrfCookie() {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
    // Wait for cookie to be properly set
    await new Promise(resolve => setTimeout(resolve, 100));
  },
  
  // All other methods remain the same
  async logout() {
    try {
      await this.getCsrfCookie(); // ✅ Get fresh token first
      const response = await api.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout API error:', error);
      throw error;
    }
  },
};
```

### 2. Enhanced Axios Interceptor (`lib/api/axios.ts`)
**Key Changes**:
- Skip CSRF token for csrf-cookie endpoint itself
- Move helper function before interceptors
- Better error logging
- Increased delay to 150ms for cookie setting

```typescript
// Helper function BEFORE interceptors
function getCookie(name: string): string | null {
  // ... implementation
}

// Request interceptor
api.interceptors.request.use((config) => {
  // ✅ Skip CSRF token for the csrf-cookie endpoint itself
  if (config.url?.includes('/sanctum/csrf-cookie')) {
    return config;
  }

  const token = getCookie('XSRF-TOKEN');
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  } else {
    console.warn('No CSRF token found in cookies');
  }
  return config;
});

// Response interceptor with better retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Use raw axios to avoid interceptor loop
      await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      
      // Increased delay
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const newToken = getCookie('XSRF-TOKEN');
      if (newToken) {
        originalRequest.headers['X-XSRF-TOKEN'] = decodeURIComponent(newToken);
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);
```

### 3. Added Debug Utility (`lib/utils/csrf-debug.ts`)
Created a debugging tool to diagnose CSRF issues:

```typescript
import { debugCSRFToken } from '@/lib/utils/csrf-debug';

// Call this in browser console or component
debugCSRFToken();
```

This will show:
- All cookies
- XSRF-TOKEN value (encoded and decoded)
- Laravel session cookie status
- API URL configuration
- Current domain and protocol

## Key Improvements Over Previous Version

### 1. Avoid Interceptor Loop
**Before**: `getCsrfCookie()` used `api.get()` which triggered interceptors
**After**: Uses raw `axios.get()` to bypass interceptors

### 2. Skip CSRF for CSRF Endpoint
**Before**: Tried to add CSRF token to csrf-cookie request
**After**: Skips CSRF token for `/sanctum/csrf-cookie` endpoint

### 3. Better Timing
**Before**: 100ms delay
**After**: 100ms in service, 150ms in interceptor retry

### 4. Better Logging
Added warnings when CSRF token is missing and detailed error logs

## Testing Steps

1. **Clear all cookies** in browser DevTools
2. **Open browser console** to see debug logs
3. **Try to logout** - should see:
   ```
   No CSRF token found in cookies (first request)
   CSRF token mismatch (419), fetching new token...
   Retrying request with new CSRF token
   ```
4. **Check Network tab**:
   - First request to `/sanctum/csrf-cookie` should set cookies
   - Retry request should include `X-XSRF-TOKEN` header

## Debugging Checklist

If still getting 419 errors:

### Frontend Checks
- [ ] Open browser console and check for CSRF warnings
- [ ] Run `debugCSRFToken()` in console
- [ ] Check Network tab for `XSRF-TOKEN` cookie
- [ ] Verify `X-XSRF-TOKEN` header in request
- [ ] Check if using `localhost` not `127.0.0.1`
- [ ] Clear all cookies and try again

### Backend Checks (Laravel)
- [ ] Check `config/cors.php`:
  ```php
  'supports_credentials' => true,
  'paths' => ['api/*', 'sanctum/csrf-cookie'],
  ```
- [ ] Check `config/session.php`:
  ```php
  'domain' => env('SESSION_DOMAIN', null), // or 'localhost'
  'same_site' => 'lax',
  'secure' => false, // true only for HTTPS
  ```
- [ ] Check `config/sanctum.php`:
  ```php
  'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost:3000')),
  ```
- [ ] Check `.env`:
  ```env
  SESSION_DOMAIN=localhost
  SANCTUM_STATEFUL_DOMAINS=localhost:3000
  ```

### Common Issues

**Issue**: Cookie not being set
**Solution**: Check CORS configuration, ensure `supports_credentials: true`

**Issue**: Cookie set but not sent with requests
**Solution**: Ensure `withCredentials: true` in axios config

**Issue**: Token mismatch even with correct cookie
**Solution**: Check if token is being decoded with `decodeURIComponent()`

**Issue**: Works on first try, fails on subsequent requests
**Solution**: Session might be expiring, check Laravel session lifetime

## Environment Configuration

`.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Critical**: Use `localhost` not `127.0.0.1` for cookie domain compatibility.

## Quick Test Command

Add this to your admin header component temporarily:

```typescript
import { debugCSRFToken } from '@/lib/utils/csrf-debug';

// In component
useEffect(() => {
  debugCSRFToken();
}, []);
```

## Summary of Changes

1. ✅ Use raw axios for CSRF cookie fetching (avoid interceptor loop)
2. ✅ Skip CSRF token for csrf-cookie endpoint
3. ✅ Increased delays for cookie setting
4. ✅ Better error logging and warnings
5. ✅ Added debug utility for troubleshooting
6. ✅ Proper error handling in all auth methods

The CSRF token mismatch should now be resolved. If you still see the error, use the debug utility to identify the exact issue.
