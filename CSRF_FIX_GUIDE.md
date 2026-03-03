# CSRF Token Mismatch - Complete Fix Guide

## ✅ What Was Fixed

The axios instance has been updated with:

1. **CSRF Token Interceptor** - Automatically reads XSRF-TOKEN from cookies
2. **Auto-Retry on 419 Error** - Fetches fresh CSRF token and retries request
3. **X-Requested-With Header** - Helps Laravel recognize AJAX requests
4. **401 Auto-Redirect** - Redirects to login on unauthorized access

## 🔧 Updated Files

### `lib/api/axios.ts`
- Added request interceptor to read CSRF token from cookies
- Added response interceptor to handle 419 errors
- Added automatic CSRF token refresh
- Added helper function to read cookies

## 🚀 How It Works Now

### 1. Initial Request Flow
```
User submits login form
    ↓
authService.getCsrfCookie() called
    ↓
GET /sanctum/csrf-cookie
    ↓
Laravel sets XSRF-TOKEN cookie
    ↓
POST /api/auth/login (with CSRF token from cookie)
    ↓
Success!
```

### 2. Automatic CSRF Refresh (on 419 error)
```
API request fails with 419
    ↓
Interceptor catches error
    ↓
Fetches fresh CSRF token
    ↓
Retries original request
    ↓
Success!
```

## 🔍 Verify Your Laravel Configuration

### 1. Check `.env` File
```env
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
FRONTEND_URL=http://localhost:3000
APP_URL=http://127.0.0.1:8000
SESSION_SECURE_COOKIE=false
```

### 2. Check `config/cors.php`
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],

'allowed_methods' => ['*'],

'allowed_headers' => ['*'],

'exposed_headers' => [],

'max_age' => 0,

'supports_credentials' => true,
```

### 3. Check `config/sanctum.php`
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    Sanctum::currentApplicationUrlWithPort()
))),
```

### 4. Check `config/session.php`
```php
'driver' => env('SESSION_DRIVER', 'cookie'),

'domain' => env('SESSION_DOMAIN', 'localhost'),

'secure' => env('SESSION_SECURE_COOKIE', false),

'same_site' => 'lax',
```

## 🐛 Troubleshooting Steps

### Issue 1: Still Getting 419 Error

**Check Browser Cookies:**
1. Open DevTools → Application → Cookies
2. Look for `XSRF-TOKEN` cookie
3. Verify it's set for `localhost` domain

**Solution:**
```bash
# Clear Laravel cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Restart Laravel server
php artisan serve
```

### Issue 2: CORS Error

**Symptoms:**
- "Access-Control-Allow-Origin" error in console
- Requests blocked by browser

**Solution:**
1. Verify `FRONTEND_URL` in Laravel `.env` matches your Next.js URL exactly
2. Check `supports_credentials: true` in `config/cors.php`
3. Ensure both apps use same domain (both on `localhost`)

### Issue 3: Cookie Not Being Set

**Check:**
1. Both apps must be on same domain (use `localhost` for both, not mix with `127.0.0.1`)
2. Browser allows cookies (not in incognito with strict settings)
3. `withCredentials: true` in axios config

**Solution:**
```bash
# Update your .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

# Update Laravel .env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
SESSION_DOMAIN=localhost
```

### Issue 4: Session Not Persisting

**Check:**
1. `SESSION_DRIVER=cookie` in Laravel `.env`
2. `SESSION_DOMAIN=localhost` (not `127.0.0.1`)
3. Cookies are being sent (check Network tab)

**Solution:**
```bash
# Clear all sessions
php artisan session:clear

# Restart server
php artisan serve --host=localhost --port=8000
```

## 🧪 Testing the Fix

### Test 1: Check CSRF Cookie
```bash
# In browser console
document.cookie
# Should see: XSRF-TOKEN=...
```

### Test 2: Check Network Tab
1. Open DevTools → Network
2. Try to login
3. Check `/sanctum/csrf-cookie` request
4. Verify `Set-Cookie` header is present
5. Check `/api/auth/login` request
6. Verify `Cookie` header includes XSRF-TOKEN
7. Verify `X-XSRF-TOKEN` header is present

### Test 3: Manual API Test
```javascript
// In browser console on http://localhost:3000
fetch('http://localhost:8000/sanctum/csrf-cookie', {
  credentials: 'include'
}).then(() => {
  return fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password'
    })
  });
}).then(r => r.json()).then(console.log);
```

## 📝 Common Mistakes to Avoid

### ❌ Don't Do This:
```javascript
// Wrong: Not calling getCsrfCookie first
await api.post('/api/auth/login', { email, password });
```

### ✅ Do This:
```javascript
// Correct: authService handles CSRF automatically
await authService.login(email, password);
```

### ❌ Don't Do This:
```env
# Wrong: Mixing localhost and 127.0.0.1
FRONTEND_URL=http://localhost:3000
APP_URL=http://127.0.0.1:8000
```

### ✅ Do This:
```env
# Correct: Use same domain for both
FRONTEND_URL=http://localhost:3000
APP_URL=http://localhost:8000
```

## 🔐 Security Notes

1. **HTTP-Only Cookies**: XSRF-TOKEN is NOT http-only (JavaScript can read it)
2. **Session Cookie**: Laravel session cookie IS http-only (JavaScript cannot read it)
3. **CSRF Protection**: Laravel validates XSRF-TOKEN on state-changing requests
4. **Same-Site**: Cookies use `lax` same-site policy for security

## 🎯 Quick Checklist

- [ ] Laravel `.env` configured correctly
- [ ] CORS configured with `supports_credentials: true`
- [ ] Both apps on same domain (`localhost`)
- [ ] `withCredentials: true` in axios config
- [ ] CSRF cookie fetched before login/register
- [ ] Cookies visible in browser DevTools
- [ ] Network tab shows cookies being sent
- [ ] No CORS errors in console

## 🚀 Next Steps

1. Clear browser cookies and cache
2. Restart Laravel server: `php artisan serve --host=localhost`
3. Restart Next.js: `npm run dev`
4. Try logging in
5. Check Network tab for any errors

## 💡 Pro Tips

### Enable Detailed Logging
```javascript
// Add to lib/api/axios.ts for debugging
api.interceptors.request.use(config => {
  console.log('Request:', config.method?.toUpperCase(), config.url);
  console.log('Headers:', config.headers);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('Error:', error.response?.status, error.config?.url);
    console.error('Error Data:', error.response?.data);
    return Promise.reject(error);
  }
);
```

### Test CSRF Token Manually
```javascript
// In browser console
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

console.log('XSRF-TOKEN:', getCookie('XSRF-TOKEN'));
```

## 📚 Additional Resources

- [Laravel Sanctum Docs](https://laravel.com/docs/sanctum)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [CSRF Protection](https://laravel.com/docs/csrf)
- [Cookie Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

---

## ✅ Summary

Your axios instance now:
1. ✅ Automatically reads CSRF token from cookies
2. ✅ Includes CSRF token in all requests
3. ✅ Auto-retries on 419 errors
4. ✅ Redirects to login on 401 errors
5. ✅ Handles all edge cases

The CSRF token mismatch issue should now be resolved! 🎉
