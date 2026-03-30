# Test Visitor Popup - Quick Test Guide

## Quick Test Steps

### 1. Clear Browser Data (Important!)
Open browser console (F12) and run:
```javascript
localStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

### 2. Visit Your Site
- Open your site in a browser
- Wait 5 seconds for the popup to appear

### 3. Test the Form
Fill in the form:
- Name: "Test User" (required)
- Email: "test@example.com" (optional)
- Phone: "+1234567890" (optional)

Click "Get Exclusive Deals"

### 4. Expected Results

#### ✅ Success
- Form submits without errors
- Success message appears: "Thank you for your interest! We'll be in touch soon."
- Popup auto-closes after 2 seconds
- Refresh page - popup should NOT appear again

#### ❌ If You Get 419 Error
Check browser console. If you see "CSRF token mismatch (419)":

1. **Check Network Tab:**
   - Look for `/sanctum/csrf-cookie` request
   - Should see `Set-Cookie: XSRF-TOKEN` in response headers
   - Look for `/api/visitor-popup` request
   - Should see `X-XSRF-TOKEN` in request headers

2. **Verify Backend Configuration:**
   - See `CSRF_FIX_GUIDE.md` for detailed backend setup
   - Key points:
     - CORS `supports_credentials: true`
     - `SANCTUM_STATEFUL_DOMAINS` includes `localhost:3000`
     - `SESSION_DOMAIN` is set correctly

3. **Check Console Logs:**
   - Should see: "CSRF token mismatch (419), fetching new token..."
   - Should see automatic retry
   - If retry fails, backend configuration needs adjustment

## Debug Commands

### Check CSRF Token
```javascript
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

console.log('CSRF Token:', getCookie('XSRF-TOKEN'));
console.log('All Cookies:', document.cookie);
```

### Check localStorage
```javascript
console.log('Popup Submitted:', localStorage.getItem('visitor_popup_submitted'));
console.log('Cookie Consent:', localStorage.getItem('cookie_consent_accepted'));
```

### Force Show Popup Again
```javascript
localStorage.removeItem('visitor_popup_submitted');
location.reload();
```

## Network Tab Checklist

When you submit the form, you should see these requests:

1. **GET /sanctum/csrf-cookie**
   - Status: 204 No Content
   - Response Headers: `Set-Cookie: XSRF-TOKEN=...`

2. **POST /api/visitor-popup**
   - Status: 200 OK (or 201 Created)
   - Request Headers: `X-XSRF-TOKEN: ...`
   - Request Payload: `{ name, email, phone }`
   - Response: `{ success: true, data: {...} }`

## Common Issues

### Issue: "No XSRF-TOKEN cookie found"
**Fix:** Backend CORS not allowing credentials
- Check `config/cors.php`: `supports_credentials => true`

### Issue: "419 CSRF token mismatch" on every request
**Fix:** Session domain mismatch
- Check `.env`: `SESSION_DOMAIN=localhost`
- Check `.env`: `SANCTUM_STATEFUL_DOMAINS=localhost:3000`

### Issue: Popup appears every time
**Fix:** localStorage not working
- Check browser privacy settings
- Try different browser
- Check if localStorage is disabled

### Issue: Form validation errors
**Fix:** Check required fields
- Name is required
- Email must be valid format (if provided)
- Phone is optional

## Test in Different Scenarios

### Test 1: Minimum Data
- Name: "John"
- Email: (empty)
- Phone: (empty)
- Should succeed

### Test 2: Full Data
- Name: "John Doe"
- Email: "john@example.com"
- Phone: "+1234567890"
- Should succeed

### Test 3: Invalid Email
- Name: "John"
- Email: "invalid-email"
- Phone: ""
- Should show error: "Please enter a valid email"

### Test 4: Empty Name
- Name: ""
- Email: "john@example.com"
- Phone: ""
- Should show error: "Name is required"

## Verify in Admin Dashboard

After successful submission:

1. Login as admin
2. Go to `/admin/visitor-popups`
3. Should see your test submission
4. Statistics should update
5. Can view details, export CSV, or delete

## Production Testing

Before deploying to production:

1. Test on production domain
2. Verify HTTPS works correctly
3. Check cookies are set with `Secure` flag
4. Test from different devices/browsers
5. Verify rate limiting works
6. Check backend logs for errors

## Success Criteria

- ✅ Popup appears after 5 seconds
- ✅ Form validation works
- ✅ Submission succeeds without 419 error
- ✅ Success message appears
- ✅ Popup doesn't appear again after submission
- ✅ Data appears in admin dashboard
- ✅ No console errors
- ✅ CSRF token is automatically handled

## If All Else Fails

If CSRF continues to be problematic:

1. Check backend logs: `storage/logs/laravel.log`
2. Enable debug mode temporarily: `APP_DEBUG=true`
3. Check exact error message
4. Verify all backend configuration files
5. Try the alternative approach in `CSRF_FIX_GUIDE.md`

## Contact Points

If you need to modify the behavior:

- **Popup delay:** `app/(public)/layout.tsx` line 17
- **Form validation:** `app/(public)/_components/shared/visitor-popup.tsx` line 48
- **API endpoint:** `app/(public)/_components/shared/visitor-popup.tsx` line 75
- **Success message:** `app/(public)/_components/shared/visitor-popup.tsx` line 81

---

**The CSRF fix is complete. The popup now uses the configured `api` instance that handles tokens automatically. Test it and enjoy! 🎉**
