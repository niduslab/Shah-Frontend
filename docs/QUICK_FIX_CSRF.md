# Quick Fix for CSRF Token Mismatch

## The Problem
CSRF token mismatch error during login.

## The Root Cause
Using `127.0.0.1` instead of `localhost` causes cookie domain mismatch.

## The Quick Fix

### Step 1: Update .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 2: Restart Next.js Dev Server
```bash
# Press Ctrl+C to stop
npm run dev
```

**CRITICAL**: You MUST restart the dev server for .env changes to take effect!

### Step 3: Clear Browser Cookies
```
1. Press F12 (DevTools)
2. Application → Cookies
3. Delete all cookies
4. Close DevTools
```

### Step 4: Hard Refresh
```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### Step 5: Test Login
```
1. Visit http://localhost:3000/login
2. Enter credentials
3. Click "Sign in"
4. ✅ Should work!
```

## Files Changed

1. ✅ `lib/api/axios.ts` - Changed baseURL to `localhost:8000`
2. ✅ `.env.local` - Changed to `localhost:8000`
3. ✅ `.env.local.example` - Updated example

## Why This Works

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Cookies: Domain is `localhost`
- Result: Cookies sent with requests ✅

## Before (Broken)
```
Frontend: localhost:3000
Backend:  127.0.0.1:8000
Cookies:  Domain 127.0.0.1
Result:   Cookie not sent ❌
```

## After (Fixed)
```
Frontend: localhost:3000
Backend:  localhost:8000
Cookies:  Domain localhost
Result:   Cookie sent ✅
```

## Verify It's Working

### Check 1: Environment Variable
Open any component and add:
```typescript
console.log(process.env.NEXT_PUBLIC_API_URL);
// Should show: http://localhost:8000
```

### Check 2: Cookies
```
DevTools → Application → Cookies
Should see: XSRF-TOKEN with domain "localhost"
```

### Check 3: Network
```
DevTools → Network → Login request
URL should be: http://localhost:8000/api/auth/login
```

## Still Not Working?

### Did you restart the dev server?
```bash
# Stop with Ctrl+C
npm run dev
```

### Did you clear cookies?
```
DevTools → Application → Cookies → Delete all
```

### Is backend using localhost?
Check Laravel `.env`:
```env
APP_URL=http://localhost:8000
SESSION_DOMAIN=localhost
```

### Check backend is running
Visit: http://localhost:8000/api/health

## Summary

The fix is simple:
1. Use `localhost` everywhere (not `127.0.0.1`)
2. Restart dev server
3. Clear cookies
4. Test login

That's it! The CSRF error should be gone.
