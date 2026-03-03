# CSRF Token Mismatch Fix

## Problem
Getting "CSRF token mismatch" error during login.

## Root Cause
The CSRF token from the cookie wasn't being properly attached to the login request, or the token expired/wasn't set.

## Solution

### 1. Improved Request Interceptor
**File: `lib/api/axios.ts`**

The request interceptor now properly reads and decodes the CSRF token:

```typescript
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
```

### 2. Improved Response Interceptor
**File: `lib/api/axios.ts`**

The response interceptor now properly handles 419 errors and retries with a fresh token:

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 419 (CSRF token mismatch) and haven't retried yet
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get a fresh CSRF token
        await axios.get('/sanctum/csrf-cookie', {
          withCredentials: true,
        });

        // Get the new token from cookie and attach it
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

    return Promise.reject(error);
  }
);
```

### 3. AuthService Gets CSRF Cookie
**File: `lib/services/authService.ts`**

The login function gets a fresh CSRF cookie before making the request:

```typescript
async login(email: string, password: string) {
  // Get CSRF cookie first
  await this.getCsrfCookie();
  
  // Make the login request
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
}
```

## How It Works

### Flow:
1. User clicks "Sign in"
2. `authService.login()` is called
3. `getCsrfCookie()` fetches CSRF token from `/sanctum/csrf-cookie`
4. Laravel sets `XSRF-TOKEN` cookie
5. Login request is made
6. Request interceptor reads `XSRF-TOKEN` cookie
7. Request interceptor adds `X-XSRF-TOKEN` header
8. Laravel validates the token
9. Login succeeds

### If Token Mismatch (419):
1. Response interceptor catches 419 error
2. Gets fresh CSRF token from `/sanctum/csrf-cookie`
3. Reads new token from cookie
4. Attaches new token to original request headers
5. Retries the original request
6. Should succeed this time

## Common Causes of CSRF Errors

### 1. Cookie Not Set
**Problem**: CSRF cookie not being set by Laravel
**Solution**: Ensure `withCredentials: true` in axios config

### 2. Cookie Not Sent
**Problem**: Browser not sending cookie with request
**Solution**: Ensure `withCredentials: true` and same domain

### 3. Token Not Decoded
**Problem**: Token is URL-encoded in cookie
**Solution**: Use `decodeURIComponent(token)` before sending

### 4. Wrong Header Name
**Problem**: Using wrong header name
**Solution**: Use `X-XSRF-TOKEN` (not `X-CSRF-TOKEN`)

### 5. Domain Mismatch
**Problem**: Frontend and backend on different domains
**Solution**: Configure CORS properly in Laravel

## Laravel Configuration

Ensure your Laravel backend has proper CORS and Sanctum configuration:

### config/cors.php
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true, // CRITICAL
```

### config/sanctum.php
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1'
)),
```

### .env
```env
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost
```

## Testing

### 1. Check Cookie is Set
1. Open DevTools → Application → Cookies
2. Visit http://localhost:3000/login
3. Should see `XSRF-TOKEN` cookie
4. Should see `laravel_session` cookie

### 2. Check Request Headers
1. Open DevTools → Network
2. Try to login
3. Click on the login request
4. Check Headers tab
5. Should see `X-XSRF-TOKEN` header

### 3. Test Login
1. Enter credentials
2. Click "Sign in"
3. Should succeed without CSRF error
4. Should redirect to home page

### 4. Test Token Refresh
1. Clear cookies
2. Try to login
3. Should get 419 error
4. Should automatically retry with new token
5. Should succeed on retry

## Debugging

### Add Console Logs

In `lib/api/axios.ts`:

```typescript
// In request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getCookie('XSRF-TOKEN');
    console.log('Request interceptor - CSRF token:', token ? 'Found' : 'Not found');
    if (token) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
      console.log('Request interceptor - Token attached to headers');
    }
    return config;
  }
);

// In response interceptor
if (error.response?.status === 419) {
  console.log('419 CSRF error - Getting fresh token');
  // ... rest of code
}
```

### Check Backend Logs

In Laravel, check `storage/logs/laravel.log` for CSRF errors.

### Check Cookie Domain

Ensure cookies are set for the correct domain:
- Frontend: `localhost:3000`
- Backend: `localhost:8000` or `127.0.0.1:8000`
- Cookie domain should be `localhost` (without port)

## Common Issues

### Issue 1: "CSRF token mismatch" on first request
**Cause**: Cookie not set yet
**Solution**: Call `getCsrfCookie()` before login

### Issue 2: "CSRF token mismatch" on every request
**Cause**: Cookie domain mismatch
**Solution**: Check Laravel SESSION_DOMAIN and SANCTUM_STATEFUL_DOMAINS

### Issue 3: Cookie not visible in DevTools
**Cause**: HttpOnly flag or wrong domain
**Solution**: Check Laravel session config

### Issue 4: Token in cookie but not in header
**Cause**: Request interceptor not working
**Solution**: Check axios interceptor code

### Issue 5: 419 error not retrying
**Cause**: Response interceptor not catching error
**Solution**: Check response interceptor code

## Environment Variables

Ensure you have the correct environment variables:

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Backend (.env)
```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost
```

## Summary

The CSRF token mismatch issue is fixed by:

1. ✅ Properly reading CSRF token from cookie
2. ✅ Decoding the token before sending
3. ✅ Attaching token to request headers
4. ✅ Getting fresh token before login
5. ✅ Automatically retrying on 419 errors
6. ✅ Properly handling token refresh

The login should now work without CSRF errors!

## Next Steps

1. Clear browser cookies
2. Hard refresh (Ctrl+Shift+R)
3. Try logging in
4. Check DevTools for any errors
5. Verify cookies are set correctly

If issues persist, check:
- Laravel CORS configuration
- Laravel Sanctum configuration
- Cookie domain settings
- Network tab in DevTools
