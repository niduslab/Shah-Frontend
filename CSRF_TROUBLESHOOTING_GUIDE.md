# CSRF Token Troubleshooting Guide

## Quick Fix Steps

### 1. Clear Browser Cookies
- Open DevTools (F12)
- Go to Application tab
- Clear all cookies for localhost:3000 and localhost:8000
- Refresh the page

### 2. Check Console Logs
Open browser console and look for:
- ✅ "No CSRF token found in cookies" (first request - normal)
- ✅ "CSRF token mismatch (419), fetching new token..." (retry happening)
- ✅ "Retrying request with new CSRF token" (should succeed)
- ❌ "Failed to get new CSRF token from cookie" (problem!)

### 3. Use Debug Utility
In browser console, type:
```javascript
window.debugCSRF()
```

This will show:
- All cookies
- XSRF-TOKEN value
- Laravel session status
- API URL
- Current domain

### 4. Check Network Tab
1. Open DevTools Network tab
2. Try to logout
3. Look for `/sanctum/csrf-cookie` request
4. Check Response Headers for `Set-Cookie`
5. Check subsequent request has `X-XSRF-TOKEN` header

## Common Issues & Solutions

### Issue 1: No XSRF-TOKEN Cookie Set
**Symptoms**: Debug shows "XSRF-TOKEN: Not found"

**Backend Fix** (Laravel):
```php
// config/cors.php
'supports_credentials' => true,
'allowed_origins' => ['http://localhost:3000'],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
```

### Issue 2: Cookie Set But Not Sent
**Symptoms**: Cookie exists but not in request headers

**Frontend Fix**: Already implemented
```typescript
// lib/api/axios.ts
withCredentials: true, // ✅ Already set
```

### Issue 3: Domain Mismatch
**Symptoms**: Cookie set for wrong domain

**Check**:
- Frontend: `http://localhost:3000` (not 127.0.0.1)
- Backend: `http://localhost:8000` (not 127.0.0.1)

**Backend Fix** (Laravel `.env`):
```env
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### Issue 4: Token Decoding Issue
**Symptoms**: Token exists but still 419 error

**Already Fixed** in code:
```typescript
decodeURIComponent(token) // ✅ Properly decodes token
```

### Issue 5: Interceptor Loop
**Symptoms**: Infinite requests to csrf-cookie

**Already Fixed** in code:
```typescript
// Skip CSRF for csrf-cookie endpoint
if (config.url?.includes('/sanctum/csrf-cookie')) {
  return config;
}
```

## Backend Configuration Checklist

### 1. CORS Configuration (`config/cors.php`)
```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // ✅ CRITICAL
];
```

### 2. Session Configuration (`config/session.php`)
```php
return [
    'driver' => env('SESSION_DRIVER', 'file'),
    'lifetime' => 120,
    'expire_on_close' => false,
    'encrypt' => false,
    'files' => storage_path('framework/sessions'),
    'connection' => null,
    'table' => 'sessions',
    'store' => null,
    'lottery' => [2, 100],
    'cookie' => env('SESSION_COOKIE', 'laravel_session'),
    'path' => '/',
    'domain' => env('SESSION_DOMAIN', null), // or 'localhost'
    'secure' => env('SESSION_SECURE_COOKIE', false), // false for HTTP
    'http_only' => true,
    'same_site' => 'lax', // ✅ CRITICAL
];
```

### 3. Sanctum Configuration (`config/sanctum.php`)
```php
return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost:3000')),
    'guard' => ['web'],
    'expiration' => null,
    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],
];
```

### 4. Environment Variables (`.env`)
```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost

SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

## Testing Procedure

### Step 1: Fresh Start
1. Stop both frontend and backend servers
2. Clear all browser cookies
3. Start backend: `php artisan serve`
4. Start frontend: `npm run dev`

### Step 2: Test Login
1. Go to `http://localhost:3000/login`
2. Open browser console
3. Login with credentials
4. Should see no CSRF errors

### Step 3: Test Logout
1. Go to admin dashboard
2. Open browser console
3. Type `window.debugCSRF()` to check token
4. Click logout
5. Watch console for logs
6. Should logout successfully

### Step 4: Verify Cookies
1. Open DevTools → Application → Cookies
2. Should see:
   - `XSRF-TOKEN` (for localhost:3000)
   - `laravel_session` (for localhost:8000)

## Advanced Debugging

### Enable Laravel Logging
```php
// app/Http/Middleware/VerifyCsrfToken.php
protected function tokensMatch($request)
{
    $token = $this->getTokenFromRequest($request);
    
    \Log::info('CSRF Token Check', [
        'session_token' => $request->session()->token(),
        'request_token' => $token,
        'match' => hash_equals($request->session()->token(), $token)
    ]);
    
    return hash_equals($request->session()->token(), $token);
}
```

### Check Laravel Logs
```bash
tail -f storage/logs/laravel.log
```

### Network Analysis
1. Open DevTools → Network
2. Filter: `csrf-cookie`
3. Check Response Headers:
   ```
   Set-Cookie: XSRF-TOKEN=...; path=/; domain=localhost
   Set-Cookie: laravel_session=...; path=/; domain=localhost
   ```

## Still Having Issues?

### Try This:
1. **Restart everything**: Backend, frontend, browser
2. **Use incognito mode**: Eliminates cookie conflicts
3. **Check firewall**: Might be blocking cookies
4. **Try different browser**: Rule out browser-specific issues
5. **Check backend logs**: Look for session errors

### Report Issue With:
1. Console logs (screenshot)
2. Network tab (screenshot of csrf-cookie request)
3. Debug output from `window.debugCSRF()`
4. Laravel logs (last 20 lines)
5. Backend .env configuration (sanitized)

## Summary

The CSRF fix implements:
1. ✅ Raw axios for csrf-cookie fetching (no interceptor loop)
2. ✅ Skip CSRF token for csrf-cookie endpoint
3. ✅ Automatic retry on 419 errors
4. ✅ Proper delays for cookie setting
5. ✅ Debug utility for troubleshooting

If following this guide doesn't resolve the issue, it's likely a backend configuration problem.
