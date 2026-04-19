# 🔍 Analytics Tracking Troubleshooting Guide

## ❌ Issue: Tracking Not Working

The frontend tracking is integrated but not sending data to the backend.

---

## 🔍 Diagnosis

### What's Integrated ✅
- ✅ `lib/services/analyticsService.ts` - Analytics service created
- ✅ `lib/hooks/useAnalytics.ts` - React hooks created
- ✅ Home page tracking (`app/(public)/page.tsx`)
- ✅ Product page tracking (`app/(public)/_components/product-details/product-info.tsx`)
- ✅ Cart page tracking (`app/(public)/cart/page.tsx`)
- ✅ Checkout tracking (`app/(public)/checkout/page.tsx`)
- ✅ Search tracking (`app/(public)/shop/page.tsx`)

### What's Missing ❌
- ❌ Backend API endpoints not configured
- ❌ Database tables not created
- ❌ Laravel routes not registered

---

## 🚨 Root Cause

The **backend analytics system is not set up yet**. The frontend is trying to send tracking data to:
```
POST /api/analytics/track/page-view
POST /api/analytics/track/product-view
POST /api/analytics/track/cart-event
POST /api/analytics/track/checkout
POST /api/analytics/track/search
```

But these endpoints **don't exist** on the backend (Laravel API).

---

## 🔧 How to Fix

### Step 1: Check Backend Setup

According to `SETUP_COMPLETE.md`, you need to:

#### 1.1 Install Dependencies
```bash
cd /path/to/laravel/backend
composer require jenssegers/agent
```

#### 1.2 Run Migrations
```bash
php artisan migrate
```

This creates 6 analytics tables:
- `visitor_sessions`
- `page_views`
- `product_views`
- `cart_events`
- `checkout_funnels`
- `search_queries`

#### 1.3 Verify Routes
```bash
php artisan route:list | grep analytics
```

You should see 15 routes:
```
POST   api/analytics/track/page-view
POST   api/analytics/track/product-view
POST   api/analytics/track/cart-event
POST   api/analytics/track/checkout
POST   api/analytics/track/search
GET    api/admin/analytics/dashboard
... (10 more admin routes)
```

### Step 2: Test Backend API

#### 2.1 Test Page View Tracking
```bash
curl -X POST http://localhost:8000/api/analytics/track/page-view \
  -H "Content-Type: application/json" \
  -d '{
    "page_type": "home",
    "page_title": "Home Page"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Page view tracked"
}
```

#### 2.2 Test Product View Tracking
```bash
curl -X POST http://localhost:8000/api/analytics/track/product-view \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1
  }'
```

### Step 3: Check Frontend Console

Open browser DevTools (F12) and check:

#### 3.1 Console Tab
Look for:
```
[Analytics] page-view: {page_type: "home", page_title: "Home Page"}
[Analytics] product-view: {product_id: 123}
```

If you see errors:
```
[Analytics] Error tracking page-view: AxiosError: Request failed with status code 404
```
This means backend endpoints don't exist.

#### 3.2 Network Tab
Filter by "analytics" and look for:
```
POST /api/analytics/track/page-view
Status: 404 Not Found  ❌ (Backend not configured)
Status: 200 OK         ✅ (Backend working)
```

---

## 🎯 Quick Test

### Test if Backend is Ready

1. **Open Browser Console** (F12)
2. **Go to Console tab**
3. **Run this command:**
```javascript
fetch('http://localhost:8000/api/analytics/track/page-view', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ page_type: 'home', page_title: 'Test' })
})
.then(r => r.json())
.then(d => console.log('Backend Response:', d))
.catch(e => console.error('Backend Error:', e));
```

**If Backend is Ready:**
```
Backend Response: {success: true, message: "Page view tracked"}
```

**If Backend is NOT Ready:**
```
Backend Error: TypeError: Failed to fetch
```
or
```
Backend Error: 404 Not Found
```

---

## 📋 Checklist

### Backend Setup
- [ ] Laravel backend is running
- [ ] `jenssegers/agent` package installed
- [ ] Migrations run (`php artisan migrate`)
- [ ] Routes registered (check with `php artisan route:list`)
- [ ] API endpoints accessible

### Frontend Setup
- [x] Analytics service created
- [x] React hooks created
- [x] Pages integrated
- [x] Tracking calls added

### Testing
- [ ] Backend API responds to test requests
- [ ] Frontend console shows tracking logs
- [ ] Network tab shows 200 OK responses
- [ ] Data appears in database
- [ ] Admin dashboard shows data

---

## 🔍 Common Issues

### Issue 1: 404 Not Found
**Symptom:** Network tab shows 404 for analytics endpoints

**Cause:** Backend routes not registered

**Fix:**
1. Check if analytics routes file exists in Laravel
2. Verify routes are registered in `routes/api.php`
3. Run `php artisan route:clear`
4. Run `php artisan route:cache`

### Issue 2: CORS Error
**Symptom:** Console shows CORS policy error

**Cause:** Backend not allowing frontend origin

**Fix:**
1. Check Laravel CORS configuration
2. Add frontend URL to allowed origins
3. Restart Laravel server

### Issue 3: 419 CSRF Token Mismatch
**Symptom:** 419 error in network tab

**Cause:** CSRF token not sent or invalid

**Fix:**
- This should be handled automatically by axios interceptor
- Check if `lib/api/axios.ts` is configured correctly
- Verify CSRF cookie is being set

### Issue 4: Silent Failures
**Symptom:** No errors, but no data in database

**Cause:** Analytics service failing silently

**Fix:**
1. Enable debug mode (already enabled in development)
2. Check browser console for `[Analytics]` logs
3. Check if `analyticsService.isEnabled` is true

### Issue 5: No Console Logs
**Symptom:** No `[Analytics]` logs in console

**Cause:** Debug mode not enabled or tracking not firing

**Fix:**
1. Check if `process.env.NODE_ENV === 'development'`
2. Verify tracking hooks are being called
3. Add manual console.log to verify

---

## 🛠️ Enable Debug Mode Manually

If you want to force debug mode, edit `lib/services/analyticsService.ts`:

```typescript
constructor() {
  // Force enable debug mode
  this.debugMode = true;  // Always show logs
}
```

---

## 📊 Expected Behavior

### When Working Correctly

#### Browser Console
```
[Analytics] page-view: {page_type: "home", page_title: "Home Page"} {success: true, message: "Page view tracked"}
[Analytics] product-view: {product_id: 123} {success: true, message: "Product view tracked"}
[Analytics] cart-event: {event_type: "added", product_id: 123, ...} {success: true, message: "Cart event tracked"}
```

#### Network Tab
```
POST /api/analytics/track/page-view       200 OK
POST /api/analytics/track/product-view    200 OK
POST /api/analytics/track/cart-event      200 OK
POST /api/analytics/track/checkout        200 OK
POST /api/analytics/track/search          200 OK
```

#### Database
```sql
SELECT COUNT(*) FROM visitor_sessions;  -- Should increase
SELECT COUNT(*) FROM page_views;        -- Should increase
SELECT COUNT(*) FROM product_views;     -- Should increase
```

---

## 🚀 Quick Fix Summary

### If Backend is NOT Set Up (Current Issue)

**Option 1: Set Up Backend (Recommended)**
Follow `SETUP_COMPLETE.md` to configure the backend properly.

**Option 2: Disable Tracking Temporarily**
```typescript
// In lib/services/analyticsService.ts
constructor() {
  this.isEnabled = false;  // Disable all tracking
}
```

**Option 3: Use Mock Mode (Already Done)**
The admin dashboard already uses mock data when backend is unavailable.

---

## 📝 Next Steps

1. **Verify Backend Status**
   ```bash
   php artisan route:list | grep analytics
   ```

2. **If Routes Don't Exist**
   - Backend analytics system needs to be implemented
   - Follow `SETUP_COMPLETE.md` for setup instructions
   - Or contact backend developer

3. **If Routes Exist**
   - Test endpoints with curl
   - Check database for data
   - Verify frontend is sending requests

4. **Once Backend is Ready**
   - Frontend tracking will work automatically
   - No frontend changes needed
   - Data will appear in admin dashboard

---

## ✅ Summary

### Current Status
- ✅ Frontend tracking: **Integrated**
- ❌ Backend API: **Not configured**
- ❌ Data collection: **Not working**
- ✅ Admin dashboard: **Working (mock data)**

### To Fix
1. Set up backend analytics system
2. Run migrations
3. Verify API endpoints
4. Test tracking

### When Fixed
- ✅ Tracking will work automatically
- ✅ Real data in admin dashboard
- ✅ Full analytics system operational

---

**Status:** ⏳ Waiting for backend setup  
**Frontend:** ✅ Ready  
**Backend:** ❌ Needs configuration
