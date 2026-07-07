# Login Page Reload Issue - FIXED

## Problem
The login page was reloading automatically in an infinite loop.

## Root Cause
The axios interceptor was redirecting to `/login` on every 401 error, even when already on the login page:

```typescript
// ❌ BAD - Causes infinite reload loop
if (error.response?.status === 401) {
  window.location.href = '/login'; // Full page reload!
}
```

### The Loop:
1. User visits `/login`
2. AuthContext calls `checkAuth()` on mount
3. API returns 401 (user not authenticated)
4. Axios interceptor catches 401 and redirects to `/login` using `window.location.href`
5. Page reloads completely → back to step 1
6. Infinite loop!

## Solution

### 1. Removed 401 Redirect from Axios Interceptor
**File: `lib/api/axios.ts`**

```typescript
// ✅ GOOD - Let components handle auth state
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle CSRF token refresh
    if (error.response?.status === 419 && !originalRequest._retry) {
      // ... refresh CSRF and retry
    }

    // Don't handle 401 redirects here - let components handle auth state
    // This prevents redirect loops on auth pages

    return Promise.reject(error);
  }
);
```

### 2. Fixed Login Page Redirect Logic
**File: `app/(auth)/login/page.tsx`**

```typescript
// ✅ GOOD - Only redirect if user is authenticated
const hasRedirected = useRef(false);

useEffect(() => {
  if (user && !hasRedirected.current) {
    hasRedirected.current = true;
    router.push(redirectTo);
  }
}, [user, redirectTo]); // router removed from dependencies
```

### 3. Improved AuthContext
**File: `lib/context/AuthContext.tsx`**

```typescript
// ✅ GOOD - Silently handle auth check failures
const checkAuth = useCallback(async () => {
  if (isInitialized) return;
  
  setLoading(true);
  try {
    const response = await authService.getUser();
    setUser(response.data);
  } catch (error) {
    // Silently fail - don't redirect, let pages handle auth state
    setUser(null);
  } finally {
    setLoading(false);
    setIsInitialized(true);
  }
}, []);
```

## Why This Works

### Before:
- Axios interceptor redirected on 401 → full page reload
- Login page loaded → checked auth → got 401 → redirected → infinite loop

### After:
- Axios interceptor doesn't redirect on 401
- Login page loads → checks auth → gets 401 → sets `user = null` → stays on login page
- ProtectedRoute component handles redirects for protected pages
- Login page handles redirect after successful login

## Architecture

### Separation of Concerns:
1. **Axios Interceptor**: Only handles CSRF token refresh (419 errors)
2. **AuthContext**: Manages auth state, doesn't redirect
3. **ProtectedRoute**: Redirects unauthenticated users to login
4. **Login Page**: Redirects authenticated users away from login

### Flow:
```
Public Page (e.g., /shop)
  → No auth check needed
  → Renders normally

Protected Page (e.g., /dashboard)
  → ProtectedRoute checks auth
  → If not authenticated → redirect to /login
  → If authenticated → render page

Login Page
  → Checks auth on mount
  → If authenticated → redirect to home
  → If not authenticated → show login form
  → After login → redirect to intended page
```

## Testing

### Test 1: Visit Login Page (Not Authenticated)
1. Clear cookies/logout
2. Visit http://localhost:3000/login
3. ✅ Page should load once without reloading
4. ✅ Login form should be visible
5. ✅ No console errors

### Test 2: Visit Login Page (Already Authenticated)
1. Login successfully
2. Visit http://localhost:3000/login
3. ✅ Should redirect to home page
4. ✅ No reload loop

### Test 3: Visit Protected Page (Not Authenticated)
1. Clear cookies/logout
2. Visit http://localhost:3000/dashboard
3. ✅ Should redirect to /login
4. ✅ No reload loop

### Test 4: Login Flow
1. Visit /login
2. Enter credentials
3. Submit form
4. ✅ Should redirect to home
5. ✅ No reload loop

## Files Modified

1. **lib/api/axios.ts**
   - Removed 401 redirect logic
   - Only handles CSRF token refresh

2. **lib/context/AuthContext.tsx**
   - Improved checkAuth to silently handle failures
   - Fixed memoization

3. **app/(auth)/login/page.tsx**
   - Added hasRedirected ref to prevent multiple redirects
   - Removed router from useEffect dependencies

## Additional Fixes Applied

### Hydration Mismatch Fix
Also fixed GSAP hydration issues that were causing page re-renders:
- Created centralized GSAP initialization
- Moved plugin registration to useEffect
- See HYDRATION_FIX.md for details

## Result

✅ Login page loads once without reloading
✅ No infinite redirect loops
✅ Clean console (no errors)
✅ Smooth authentication flow
✅ Protected routes work correctly
✅ Auth state managed properly

## Best Practices Applied

1. **Don't redirect in API interceptors** - Let components handle navigation
2. **Use refs for redirect tracking** - Prevents multiple redirects
3. **Remove router from dependencies** - Prevents unnecessary re-renders
4. **Silently handle auth failures** - Don't force redirects on every 401
5. **Separate concerns** - Each layer has a specific responsibility

## Debugging Tips

If you still see reload issues:

1. **Check browser console** - Look for errors or warnings
2. **Check Network tab** - Look for repeated API calls
3. **Add console.logs**:
```typescript
useEffect(() => {
  console.log('Login page mounted, user:', user);
  if (user && !hasRedirected.current) {
    console.log('Redirecting authenticated user');
    hasRedirected.current = true;
    router.push(redirectTo);
  }
}, [user, redirectTo]);
```

4. **Clear browser cache** - Hard refresh (Ctrl+Shift+R)
5. **Check for multiple AuthProviders** - Should only have one in app/layout.tsx

## Summary

The login page reload issue was caused by the axios interceptor redirecting on 401 errors, creating an infinite loop. The fix removes the redirect logic from axios and lets components handle authentication state and navigation properly.
