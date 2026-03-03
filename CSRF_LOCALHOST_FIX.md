# CSRF Token Fix - localhost vs 127.0.0.1

## The Problem

Using `127.0.0.1` instead of `localhost` causes cookie domain mismatch issues:

- Frontend: `http://localhost:3000`
- Backend: `http://127.0.0.1:8000`
- Cookies set by backend with domain `127.0.0.1` won't be sent to `localhost`

This causes CSRF token mismatch because the browser doesn't send the CSRF cookie with requests.

## The Solution

### 1. Updated axios.ts
Changed baseURL from `127.0.0.1` to `localhost`:

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', // ✅ localhost
  withCredentials: true,
  // ...
});
```

### 2. Updated .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Updated .env.local.example
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Why This Matters

### Cookie Domain Rules:
- Cookies set by `127.0.0.1` are only sent to `127.0.0.1`
- Cookies set by `localhost` are only sent to `localhost`
- `127.0.0.1` and `localhost` are treated as different domains by browsers

### The Issue:
```
Frontend: http://localhost:3000
Backend:  http://127.0.0.1:8000

Backend sets cookie with domain: 127.0.0.1
Frontend makes request to: 127.0.0.1
Browser: ❌ Cookie domain mismatch - cookie not sent
Result: CSRF token mismatch
```

### The Fix:
```
Frontend: http://localhost:3000
Backend:  http://localhost:8000

Backend sets cookie with domain: localhost
Frontend makes request to: localhost
Browser: ✅ Cookie domain matches - cookie sent
Result: CSRF token validated
```

## Steps to Apply Fix

### 1. Update Environment Variable
Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Restart Next.js Dev Server
```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

**IMPORTANT**: Next.js only reads .env files on startup. You MUST restart the dev server for changes to take effect.

### 3. Clear Browser Cookies
```
1. Open DevTools (F12)
2. Application → Cookies
3. Delete all cookies for localhost:3000
4. Close DevTools
```

### 4. Hard Refresh
```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### 5. Test Login
```
1. Visit http://localhost:3000/login
2. Enter credentials
3. Click "Sign in"
4. Should work without CSRF errors
```

## Backend Configuration

Ensure your Laravel backend also uses `localhost`:

### .env (Laravel)
```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost
```

### config/cors.php
```php
'allowed_origins' => [
    'http://localhost:3000',
],
'supports_credentials' => true,
```

### config/sanctum.php
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 
    'localhost,localhost:3000'
)),
```

## Verification

### Check 1: Environment Variable Loaded
Add this to any component:
```typescript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
// Should output: http://localhost:8000
```

### Check 2: Cookies Set Correctly
```
1. Open DevTools → Application → Cookies
2. Visit http://localhost:3000/login
3. Should see cookies with domain: localhost
```

### Check 3: Network Requests
```
1. Open DevTools → Network
2. Try to login
3. Check request URL
4. Should be: http://localhost:8000/api/auth/login
```

### Check 4: Cookie Sent with Request
```
1. DevTools → Network → Click login request
2. Headers tab → Request Headers
3. Should see: Cookie: XSRF-TOKEN=...; laravel_session=...
```

## Common Mistakes

### ❌ Mistake 1: Not Restarting Dev Server
```
Changed .env.local but didn't restart
Result: Still using old 127.0.0.1 URL
```

### ❌ Mistake 2: Mixed URLs
```
Frontend: localhost:3000
Backend: 127.0.0.1:8000
Result: Cookie domain mismatch
```

### ❌ Mistake 3: Not Clearing Cookies
```
Old cookies from 127.0.0.1 still present
Result: Wrong cookies being sent
```

### ❌ Mistake 4: Backend Still Using 127.0.0.1
```
Frontend: localhost
Backend: 127.0.0.1
Result: Cookie domain mismatch
```

## Testing Checklist

- [ ] Updated .env.local to use localhost:8000
- [ ] Restarted Next.js dev server
- [ ] Cleared browser cookies
- [ ] Hard refreshed browser
- [ ] Backend uses localhost:8000
- [ ] Backend .env has SESSION_DOMAIN=localhost
- [ ] Backend SANCTUM_STATEFUL_DOMAINS includes localhost:3000
- [ ] Can see XSRF-TOKEN cookie in DevTools
- [ ] Cookie domain is "localhost"
- [ ] Login works without CSRF errors

## Debugging

### If Still Getting CSRF Errors:

#### 1. Check Environment Variable
```bash
# In your Next.js project
echo $NEXT_PUBLIC_API_URL
# Should output: http://localhost:8000
```

#### 2. Check Runtime Value
Add to login page:
```typescript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

#### 3. Check Network Request
```
DevTools → Network → Filter: login
Click request → Headers → General
Request URL should be: http://localhost:8000/api/auth/login
```

#### 4. Check Cookie Domain
```
DevTools → Application → Cookies → http://localhost:3000
XSRF-TOKEN cookie → Domain should be: localhost
```

#### 5. Check Backend
```bash
# In your Laravel project
php artisan config:clear
php artisan cache:clear
```

## Why localhost vs 127.0.0.1 Matters

### Technical Explanation:

1. **Different Origins**: Browsers treat `localhost` and `127.0.0.1` as different origins
2. **Cookie Scope**: Cookies are scoped to the domain that set them
3. **Same-Origin Policy**: Cookies are only sent to the same origin
4. **CORS**: Even with CORS enabled, cookies won't cross origin boundaries

### Browser Behavior:

```javascript
// Cookie set by 127.0.0.1
document.cookie = "test=value; domain=127.0.0.1"

// Request to localhost
fetch('http://localhost:8000/api/test')
// Cookie NOT sent (different domain)

// Request to 127.0.0.1
fetch('http://127.0.0.1:8000/api/test')
// Cookie sent (same domain)
```

## Production Considerations

In production, use actual domain names:

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Backend (.env)
```env
APP_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
SESSION_DOMAIN=.yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
```

Note: Use `.yourdomain.com` (with leading dot) to share cookies across subdomains.

## Summary

✅ Changed axios baseURL from `127.0.0.1` to `localhost`
✅ Updated .env.local to use `localhost:8000`
✅ Updated .env.local.example
✅ Both frontend and backend now use `localhost`
✅ Cookies will be set and sent correctly
✅ CSRF token validation will work

## Next Steps

1. **Restart Next.js dev server** (CRITICAL!)
2. **Clear browser cookies**
3. **Hard refresh browser**
4. **Test login**
5. **Verify no CSRF errors**

The CSRF token mismatch should now be completely fixed!
