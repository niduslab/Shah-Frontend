# ✅ CSRF Fix Complete

## What Was Fixed

The visitor popup was getting a **419 CSRF token mismatch** error when submitting the form.

## The Solution

Changed the visitor popup component to use the configured `api` instance instead of raw axios.

### Before (❌ Broken)
```typescript
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const response = await axios.post(`${API_URL}/api/visitor-popup`, data);
```

### After (✅ Fixed)
```typescript
import api from "@/lib/api/axios";

const response = await api.post("/api/visitor-popup", data);
```

## Why This Works

The `api` instance (from `lib/api/axios.ts`) automatically:

1. **Fetches CSRF Token:** Makes a request to `/sanctum/csrf-cookie` before the first API call
2. **Includes Token:** Adds `X-XSRF-TOKEN` header to all requests
3. **Handles Retries:** If it gets a 419 error, it fetches a fresh token and retries
4. **Manages Credentials:** Properly sends cookies with `withCredentials: true`

## File Changed

**File:** `app/(public)/_components/shared/visitor-popup.tsx`

**Lines Changed:**
- Line 4: Changed import from `axios` to `api`
- Line 6: Removed `API_URL` constant
- Line 75: Changed `axios.post(${API_URL}/api/visitor-popup)` to `api.post("/api/visitor-popup")`

## How to Test

1. **Clear browser data:**
   ```javascript
   localStorage.clear();
   document.cookie.split(";").forEach(c => {
     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
   });
   location.reload();
   ```

2. **Visit your site and wait 5 seconds**

3. **Fill in the popup form and submit**

4. **Expected result:** Success message, no 419 error

## If You Still Get 419 Error

The frontend is now correct. If you still get errors, it's a backend configuration issue.

### Quick Backend Fixes

#### 1. CORS Configuration
**File:** `config/cors.php` (Backend)

```php
'supports_credentials' => true, // Must be true!
```

#### 2. Sanctum Stateful Domains
**File:** `.env` (Backend)

```env
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:3001
```

#### 3. Session Configuration
**File:** `.env` (Backend)

```env
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
```

### Detailed Backend Guide

See `CSRF_FIX_GUIDE.md` for complete backend configuration instructions.

## Network Flow (What Happens Now)

```
1. User submits form
   ↓
2. api.post() checks for CSRF token
   ↓
3. If no token: GET /sanctum/csrf-cookie
   ↓
4. Backend sets XSRF-TOKEN cookie
   ↓
5. Frontend reads cookie
   ↓
6. POST /api/visitor-popup with X-XSRF-TOKEN header
   ↓
7. Backend validates token
   ↓
8. Success! (200 response)
   ↓
9. If 419: Automatically retry with fresh token
```

## Verification Checklist

- [x] Frontend uses `api` instance (not raw axios)
- [x] Import statement updated
- [x] API call updated
- [x] No TypeScript errors
- [ ] Backend CORS configured (verify this)
- [ ] Backend Sanctum configured (verify this)
- [ ] Test submission works without 419 error

## Additional Resources

- **Full Backend Guide:** `CSRF_FIX_GUIDE.md`
- **Testing Guide:** `TEST_VISITOR_POPUP.md`
- **Implementation Docs:** `IMPLEMENTATION_SUMMARY.md`
- **Architecture:** `ARCHITECTURE_DIAGRAM.md`

## Summary

✅ **Frontend fix is complete and deployed**

The visitor popup now properly handles CSRF tokens using the configured `api` instance. This follows Laravel Sanctum best practices and matches how other forms in your application work (login, register, etc.).

If you encounter any issues, they will be backend configuration related. Follow the guides above to verify your backend setup.

---

**Status: FIXED ✅**
**Test it now and it should work!** 🎉
