# Session Persistence Debug Guide

## The Issue
Users are logged out after page reload. This is a **backend session/cookie configuration issue**, not a frontend issue.

## Where Sessions Are Stored
Laravel Sanctum uses **HTTP-only cookies** to store session data:
- Cookie name: `laravel_session` (or your app name)
- Cookie domain: Must match between frontend and backend
- Storage: Backend (database, file, or redis based on SESSION_DRIVER)

## Debug Steps

### 1. Check Browser Cookies (DevTools)
Open DevTools → Application → Cookies → http://localhost:3000

Look for these cookies:
- `XSRF-TOKEN` - CSRF protection token
- `laravel_session` - Session cookie (this is critical!)

**If `laravel_session` cookie is missing or expires immediately, the backend is not setting it properly.**

### 2. Check Backend .env Configuration
Your Laravel backend needs these settings:

```env
# Session Configuration
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost
SESSION_SECURE_COOKIE=false

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost

# URLs
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### 3. Check config/session.php
```php
'domain' => env('SESSION_DOMAIN', 'localhost'),
'secure' => env('SESSION_SECURE_COOKIE', false),
'http_only' => true,
'same_site' => 'lax',
```

### 4. Check config/sanctum.php
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 
    'localhost,localhost:3000'
)),
```

### 5. Check config/cors.php
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'supports_credentials' => true,
```

## Testing the Session

### Test 1: Login and Check Cookies
1. Open DevTools → Network tab
2. Login
3. Check the `/api/auth/login` response headers
4. Look for `Set-Cookie` header with `laravel_session`

**Expected:**
```
Set-Cookie: laravel_session=eyJ...; expires=...; Max-Age=7200; path=/; domain=localhost; httponly; samesite=lax
```

### Test 2: Check Auth Endpoint
After login, check if `/api/auth/user` returns user data:

```bash
# In browser console after login
fetch('http://localhost:8000/api/auth/user', {
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

**Expected:** User object
**If 401:** Session cookie is not being sent or is invalid

### Test 3: Reload Page
1. Login successfully
2. Open DevTools → Application → Cookies
3. Verify `laravel_session` cookie exists
4. Reload page (F5)
5. Check if cookie is still there
6. Check Network tab for `/api/auth/user` request

## Common Issues

### Issue 1: Cookie Not Set
**Symptom:** No `laravel_session` cookie after login
**Cause:** Backend session configuration issue
**Fix:** 
- Check `SESSION_DRIVER=cookie` in Laravel .env
- Restart Laravel server: `php artisan serve`
- Clear Laravel cache: `php artisan config:clear`

### Issue 2: Cookie Expires Immediately
**Symptom:** Cookie appears then disappears
**Cause:** Domain mismatch
**Fix:**
- Use `localhost` (not `127.0.0.1`) everywhere
- Set `SESSION_DOMAIN=localhost` in Laravel .env
- Access frontend at `http://localhost:3000` (not `127.0.0.1:3000`)

### Issue 3: Cookie Not Sent on Requests
**Symptom:** Cookie exists but not sent with API requests
**Cause:** CORS or credentials issue
**Fix:**
- Verify `withCredentials: true` in axios config (already set)
- Check `supports_credentials: true` in Laravel cors.php
- Verify `SANCTUM_STATEFUL_DOMAINS` includes `localhost:3000`

## Quick Fix Commands

Run these on your Laravel backend:

```bash
# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Restart server
php artisan serve --host=localhost --port=8000
```

## Frontend is Already Correct

Your frontend configuration is correct:
- ✅ `withCredentials: true` in axios
- ✅ Using `localhost` not `127.0.0.1`
- ✅ AuthContext checks session on mount
- ✅ CSRF token handling

**The issue is 100% on the backend session/cookie configuration.**

## Next Steps

1. Check if `laravel_session` cookie is being set after login
2. If not, fix backend SESSION_DOMAIN and SESSION_DRIVER
3. If yes but expires, check SESSION_LIFETIME
4. If cookie exists but user still logs out, check `/api/auth/user` endpoint
