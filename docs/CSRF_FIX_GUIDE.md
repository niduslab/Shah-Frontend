# CSRF Token Fix Guide

## Problem
The visitor popup was getting a "CSRF token mismatch" error (419) when submitting the form.

## Solution Applied

### Frontend Fix (✅ COMPLETED)
Changed the visitor popup to use the configured `api` instance instead of raw axios:

**File:** `app/(public)/_components/shared/visitor-popup.tsx`

**Before:**
```typescript
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// In handleSubmit:
const response = await axios.post(`${API_URL}/api/visitor-popup`, {...});
```

**After:**
```typescript
import api from "@/lib/api/axios";

// In handleSubmit:
const response = await api.post("/api/visitor-popup", {...});
```

The `api` instance automatically:
1. Fetches CSRF token from `/sanctum/csrf-cookie` if needed
2. Includes the token in request headers (`X-XSRF-TOKEN`)
3. Retries on 419 errors with a fresh token
4. Handles credentials properly

### Backend Configuration (⚠️ VERIFY THIS)

You need to ensure your Laravel backend is properly configured for CSRF with SPA:

#### 1. Check CORS Configuration
**File:** `config/cors.php` (Backend)

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:3001',
        // Add your production domain
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true, // IMPORTANT!
];
```

#### 2. Check Session Configuration
**File:** `config/session.php` (Backend)

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
    
    'cookie' => env(
        'SESSION_COOKIE',
        Str::slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),
    
    'path' => '/',
    
    'domain' => env('SESSION_DOMAIN', null),
    
    'secure' => env('SESSION_SECURE_COOKIE', false),
    
    'http_only' => true,
    
    'same_site' => 'lax', // IMPORTANT! Use 'lax' or 'none'
];
```

#### 3. Check Sanctum Configuration
**File:** `config/sanctum.php` (Backend)

```php
return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,localhost:3001,127.0.0.1,127.0.0.1:8000,::1',
        Sanctum::currentApplicationUrlWithPort()
    ))),
    
    'guard' => ['web'],
    
    'expiration' => null,
    
    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),
    
    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
        'validate_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
    ],
];
```

#### 4. CSRF Middleware Exceptions (If Needed)
**File:** `app/Http/Middleware/VerifyCsrfToken.php` (Backend)

If you want to exclude the visitor popup endpoint from CSRF verification (NOT RECOMMENDED for production):

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Only add this if you absolutely cannot get CSRF working
        // 'api/visitor-popup',
    ];
}
```

**⚠️ WARNING:** Excluding routes from CSRF protection is a security risk. Only do this if:
- The endpoint doesn't perform sensitive operations
- You have other security measures in place
- You're in development/testing phase

#### 5. Environment Variables
**File:** `.env` (Backend)

```env
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost
SESSION_SECURE_COOKIE=false
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:3001

# For production:
# SESSION_DOMAIN=.yourdomain.com
# SESSION_SECURE_COOKIE=true
# SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
```

## How CSRF Works in This Setup

1. **First Request:**
   - Frontend makes request to `/sanctum/csrf-cookie`
   - Backend sets `XSRF-TOKEN` cookie
   - Cookie is stored in browser

2. **Subsequent Requests:**
   - Frontend reads `XSRF-TOKEN` from cookie
   - Includes it in `X-XSRF-TOKEN` header
   - Backend validates token matches session

3. **On 419 Error:**
   - Frontend automatically fetches fresh token
   - Retries the original request
   - Should succeed on retry

## Testing the Fix

### 1. Clear Browser Data
```javascript
// In browser console:
localStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

### 2. Test the Popup
1. Visit your site
2. Wait for popup to appear (5 seconds)
3. Fill in the form
4. Submit
5. Check browser console for errors
6. Should see success message

### 3. Check Network Tab
In browser DevTools > Network:
1. Look for `/sanctum/csrf-cookie` request
2. Check Response Headers for `Set-Cookie: XSRF-TOKEN`
3. Look for `/api/visitor-popup` request
4. Check Request Headers for `X-XSRF-TOKEN`
5. Should get 200 response, not 419

### 4. Debug CSRF Token
```javascript
// In browser console:
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

console.log('CSRF Token:', getCookie('XSRF-TOKEN'));
```

## Common Issues & Solutions

### Issue 1: "No XSRF-TOKEN cookie found"
**Solution:** 
- Check CORS `supports_credentials: true`
- Check frontend uses `withCredentials: true`
- Verify `api` instance is configured correctly

### Issue 2: "419 CSRF token mismatch" persists
**Solution:**
- Clear all cookies and localStorage
- Check `SESSION_DOMAIN` matches your domain
- Verify `SANCTUM_STATEFUL_DOMAINS` includes your frontend domain
- Check `same_site` is 'lax' or 'none'

### Issue 3: Cookie not being set
**Solution:**
- Check backend CORS allows credentials
- Verify frontend domain is in `SANCTUM_STATEFUL_DOMAINS`
- Check browser isn't blocking third-party cookies
- Ensure using same domain or proper CORS setup

### Issue 4: Works in development, fails in production
**Solution:**
- Set `SESSION_SECURE_COOKIE=true` for HTTPS
- Update `SESSION_DOMAIN` to your production domain
- Update `SANCTUM_STATEFUL_DOMAINS` with production domains
- Ensure HTTPS is properly configured

## Production Checklist

- [ ] CORS configured with correct origins
- [ ] `supports_credentials: true` in CORS
- [ ] `SESSION_DOMAIN` set correctly
- [ ] `SANCTUM_STATEFUL_DOMAINS` includes all frontend domains
- [ ] `SESSION_SECURE_COOKIE=true` for HTTPS
- [ ] `same_site` set to 'lax' or 'none'
- [ ] Test on actual production domain
- [ ] Verify cookies are being set
- [ ] Check CSRF token in request headers
- [ ] No 419 errors in production logs

## Alternative: API Token Authentication

If CSRF continues to be problematic for public endpoints, consider using API tokens:

**Backend Route:**
```php
Route::post('/visitor-popup', [VisitorPopupController::class, 'store'])
    ->middleware('throttle:10,1'); // Rate limit instead of CSRF
```

**Frontend:**
```typescript
// No CSRF token needed, just rate limiting
const response = await axios.post(`${API_URL}/api/visitor-popup`, data);
```

**⚠️ Note:** This removes CSRF protection, so implement:
- Rate limiting (throttle middleware)
- Input validation
- Honeypot fields
- reCAPTCHA (optional)

## Summary

The frontend fix is complete. The `api` instance now handles CSRF tokens automatically. If you still get 419 errors:

1. Verify backend CORS configuration
2. Check Sanctum stateful domains
3. Ensure session configuration is correct
4. Clear browser cookies and test again
5. Check backend logs for specific error details

The current implementation follows Laravel Sanctum best practices for SPA authentication and CSRF protection.
