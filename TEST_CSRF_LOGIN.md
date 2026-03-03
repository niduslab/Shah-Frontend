# Test CSRF Login Flow

## Quick Test Steps

### 1. Clear Everything
```
1. Open DevTools (F12)
2. Go to Application → Cookies
3. Delete all cookies for localhost:3000
4. Close DevTools
```

### 2. Test Login
```
1. Visit http://localhost:3000/login
2. Open DevTools → Network tab
3. Enter credentials:
   - Email: test@example.com
   - Password: password
4. Click "Sign in"
```

### 3. Check Network Requests

You should see these requests in order:

#### Request 1: GET /sanctum/csrf-cookie
- Status: 204 No Content
- Sets cookies: XSRF-TOKEN, laravel_session

#### Request 2: POST /api/auth/login
- Status: 200 OK (if successful)
- Headers should include:
  - X-XSRF-TOKEN: [token value]
  - Cookie: XSRF-TOKEN=...; laravel_session=...

### 4. Check Cookies

After login, you should have these cookies:
- `XSRF-TOKEN` - The CSRF token
- `laravel_session` - The session cookie

### 5. Expected Results

✅ Login succeeds without errors
✅ No "CSRF token mismatch" error
✅ Redirects to home page
✅ User is authenticated

## If You Get CSRF Error

### Check 1: Cookies Set?
```
DevTools → Application → Cookies → http://localhost:3000
Should see: XSRF-TOKEN and laravel_session
```

### Check 2: Token in Request?
```
DevTools → Network → Click login request → Headers
Should see: X-XSRF-TOKEN: [token]
```

### Check 3: Backend Running?
```
Backend should be running on http://127.0.0.1:8000
Test: Visit http://127.0.0.1:8000/api/health
```

### Check 4: CORS Configured?
```
Laravel config/cors.php should have:
- 'supports_credentials' => true
- 'allowed_origins' => ['http://localhost:3000']
```

## Automatic Retry Test

### Test 419 Error Handling

1. Login successfully
2. In DevTools Console, run:
```javascript
// Clear CSRF cookie
document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
```
3. Try to make an API request
4. Should get 419 error
5. Should automatically retry with new token
6. Should succeed on retry

## Debug Mode

### Enable Debug Logging

Add to `lib/api/axios.ts`:

```typescript
// In request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getCookie('XSRF-TOKEN');
    console.log('🔑 CSRF Token:', token ? '✅ Found' : '❌ Not found');
    console.log('📤 Request URL:', config.url);
    console.log('📤 Request Method:', config.method);
    if (token) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
      console.log('✅ Token attached to headers');
    }
    return config;
  }
);

// In response interceptor
if (error.response?.status === 419) {
  console.log('⚠️ 419 CSRF Error - Getting fresh token');
  // ... rest of code
  console.log('🔄 Retrying request with new token');
}
```

## Common Scenarios

### Scenario 1: First Time Login
```
1. Visit /login (no cookies)
2. getCsrfCookie() called
3. CSRF cookie set
4. Login request with token
5. ✅ Success
```

### Scenario 2: Token Expired
```
1. Visit /login (old token)
2. Login request with old token
3. 419 error
4. Get fresh token
5. Retry with new token
6. ✅ Success
```

### Scenario 3: Already Logged In
```
1. Visit /login (authenticated)
2. Redirect to home
3. No login request needed
```

## Backend Checklist

Ensure your Laravel backend has:

- [ ] CORS configured with `supports_credentials: true`
- [ ] Sanctum stateful domains include `localhost:3000`
- [ ] Session driver is `cookie`
- [ ] Session domain is `localhost`
- [ ] API routes use `auth:sanctum` middleware
- [ ] CSRF middleware enabled for API routes

## Frontend Checklist

Ensure your Next.js frontend has:

- [ ] `withCredentials: true` in axios config
- [ ] Request interceptor reads CSRF token
- [ ] Response interceptor handles 419 errors
- [ ] `getCsrfCookie()` called before login
- [ ] Proper error handling in login form

## Success Indicators

✅ No console errors
✅ No network errors
✅ Cookies are set
✅ Token in request headers
✅ Login succeeds
✅ Redirect works
✅ User authenticated

## Failure Indicators

❌ "CSRF token mismatch" error
❌ 419 status code
❌ No cookies set
❌ No token in headers
❌ CORS errors
❌ Network errors

## Quick Fix Commands

### Clear Browser Data
```
Ctrl+Shift+Delete (Windows)
Cmd+Shift+Delete (Mac)
```

### Hard Refresh
```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### Clear Cookies via Console
```javascript
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
```

## Summary

The CSRF token flow should now work correctly:
1. Get CSRF cookie before login
2. Token automatically attached to requests
3. Automatic retry on 419 errors
4. Proper error handling

If you still get CSRF errors, check the backend configuration and ensure cookies are being set correctly.
