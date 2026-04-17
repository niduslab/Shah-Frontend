# Quick Brand Status Check

## 🔍 Run These Commands

Copy and paste these commands one by one to diagnose the issue:

### 1. Check Backend API

```bash
curl http://localhost:8000/api/brands
```

**What to look for:**

✅ **Good Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "NordicTrack",
      "slug": "nordictrack",
      "is_active": true
    }
  ]
}
```

❌ **Bad Response:**
```json
{"data": []}
```
→ No brands exist. **Create brand at `/admin/brands`**

❌ **Connection Error:**
```
curl: (7) Failed to connect to localhost port 8000
```
→ Backend not running. **Start with `php artisan serve`**

### 2. Check What Slug You're Using

What URL are you trying to visit?
```
http://localhost:3000/brand/[WHAT-IS-THIS-PART]
                              ↑
                              This is your slug
```

### 3. Compare Slugs

**Backend slug** (from step 1): `_______________`

**URL slug** (from step 2): `_______________`

Do they match? 
- ✅ Yes → Continue to step 4
- ❌ No → Fix the mismatch

### 4. Check Brand is Active

Look at the response from step 1.

Find your brand and check:
```json
{
  "is_active": true  ← Must be true!
}
```

- ✅ true → Should work
- ❌ false → Go to `/admin/brands` and activate it

## 🎯 Quick Fix Guide

Based on your results above:

### If Backend Not Running
```bash
cd /path/to/your/backend
php artisan serve
```

### If No Brands Exist
1. Visit: `http://localhost:3000/admin/brands`
2. Click: "Add Brand"
3. Fill in details
4. **Make sure slug matches your URL!**
5. **Make sure Active is checked!**
6. Save

### If Slug Doesn't Match
**Option A:** Change URL to match backend
```
Backend has: "nordic-track"
Change URL to: /brand/nordic-track
```

**Option B:** Change backend to match URL
1. Go to `/admin/brands`
2. Edit the brand
3. Change slug to match URL
4. Save

### If Brand is Inactive
1. Go to `/admin/brands`
2. Find your brand
3. Click "Edit"
4. Check "Active"
5. Save

## 📊 Visual Diagnostic

```
┌─────────────────────────────────────────────┐
│  DIAGNOSTIC FLOWCHART                        │
└─────────────────────────────────────────────┘

Can you access http://localhost:8000/api/brands?
│
├─ NO → Backend not running
│        Fix: Start backend server
│
└─ YES → Does it return brands?
         │
         ├─ NO → No brands in database
         │        Fix: Create brand at /admin/brands
         │
         └─ YES → Is your brand in the list?
                  │
                  ├─ NO → Brand doesn't exist
                  │        Fix: Create brand
                  │
                  └─ YES → Does slug match URL?
                           │
                           ├─ NO → Slug mismatch
                           │        Fix: Match slug and URL
                           │
                           └─ YES → Is brand active?
                                    │
                                    ├─ NO → Brand inactive
                                    │        Fix: Activate brand
                                    │
                                    └─ YES → Should work!
                                             If not, check console
```

## 🧪 Test After Fix

After making changes:

1. **Verify backend:**
   ```bash
   curl http://localhost:8000/api/brands
   # Should see your brand
   ```

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R

3. **Visit public page:**
   ```
   http://localhost:3000/brand/[your-slug]
   ```

4. **Check console:**
   - Press F12
   - Look for [Brand Page] logs
   - Should say "Found brand"

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Backend API returns your brand
2. ✅ Slug matches URL exactly
3. ✅ Brand is_active = true
4. ✅ Console shows "Found brand"
5. ✅ Public page loads
6. ✅ No "Brand Not Found" error

## 🆘 Emergency Checklist

If nothing works, check ALL of these:

- [ ] Backend server is running (`php artisan serve`)
- [ ] Can access `http://localhost:8000/api/brands` in browser
- [ ] API returns JSON (not error page)
- [ ] Your brand exists in the response
- [ ] Slug in response matches URL exactly (case-sensitive!)
- [ ] is_active is true
- [ ] Environment variable NEXT_PUBLIC_API_URL is set
- [ ] Next.js server is running (`npm run dev`)
- [ ] Browser cache is cleared
- [ ] No console errors

## 📞 What to Share if You Need Help

If you still can't fix it, share these:

1. **Backend API response:**
   ```bash
   curl http://localhost:8000/api/brands
   ```

2. **URL you're trying to visit:**
   ```
   http://localhost:3000/brand/[what-slug]
   ```

3. **Browser console logs:**
   - Press F12
   - Copy [Brand Page] logs

4. **Environment variables:**
   ```bash
   echo $NEXT_PUBLIC_API_URL
   ```

---

**Most Common Issue: Brand doesn't exist in backend database!**

**Fix: Go to `/admin/brands` and create it!** 🎯
