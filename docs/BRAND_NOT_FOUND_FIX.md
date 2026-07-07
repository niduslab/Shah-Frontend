# Brand Not Found - Quick Fix Guide

## 🔍 The Problem

You're seeing "Brand Not Found" when visiting a brand page, even though you created brand page content in the admin.

## 💡 The Solution

**The brand must exist in your BACKEND DATABASE first!**

## 🎯 Understanding the System

Your brand pages use **TWO separate data sources**:

### 1. Backend Database (Laravel) - REQUIRED ✅
- **URL:** `http://localhost:8000`
- **Stores:** Brand name, slug, logo, products
- **Created at:** `/admin/brands` → "Add Brand"
- **Without this:** Page shows "Brand Not Found"

### 2. Frontend JSON Files - OPTIONAL 📝
- **Location:** `public/content/brand-pages/[brandId].json`
- **Stores:** Hero, categories, brand story sections
- **Created at:** `/admin/dynamic-contents/brand-pages-db/[brandId]`
- **Without this:** Page shows default content + products

## ✅ Correct Workflow

```
1. Create Brand in Backend
   ↓
   Go to: http://localhost:3000/admin/brands
   Click: "Add Brand"
   Fill in: Name, Slug, Logo
   Save
   ↓
2. Brand Now Exists in Database
   ↓
3. Customize Brand Page (Optional)
   ↓
   Click: "Page" button
   Add: Custom sections
   Save
   ↓
4. Visit Public Page
   ↓
   Go to: http://localhost:3000/brand/[slug]
   ✅ Works!
```

## ❌ Wrong Workflow (What You Did)

```
1. Go directly to brand page editor
   ↓
   http://localhost:3000/admin/dynamic-contents/brand-pages-db/1
   ↓
2. Add custom content
   ↓
3. Visit public page
   ↓
   http://localhost:3000/brand/[slug]
   ❌ Brand Not Found!
   
Why? Brand ID 1 doesn't exist in backend database!
```

## 🔧 How to Fix Right Now

### Step 1: Check Backend is Running
```bash
# Visit this URL in your browser:
http://localhost:8000/api/brands

# Should see JSON response with brands list
# If error: Start your backend server
```

### Step 2: Create Brand in Admin
```
1. Go to: http://localhost:3000/admin/brands
2. Click: "Add Brand" button
3. Fill in:
   - Name: NordicTrack
   - Slug: nordictrack (lowercase, no spaces)
   - Logo: Upload image
   - Description: Optional
   - Active: ✅ Yes
4. Click: Save
```

### Step 3: Verify Brand Created
```bash
# Visit again:
http://localhost:8000/api/brands

# Should now see your brand:
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

### Step 4: Now Customize Page (Optional)
```
1. Go back to: http://localhost:3000/admin/brands
2. Find your brand
3. Click: "Page" button
4. Add custom content
5. Save
```

### Step 5: Visit Public Page
```
Go to: http://localhost:3000/brand/nordictrack
✅ Should work now!
```

## 🧪 Quick Test

Run these commands to diagnose:

```bash
# 1. Test backend API
curl http://localhost:8000/api/brands

# 2. Check if your brand exists
# Look for your brand in the response

# 3. Note the exact slug
# Use this slug in the URL

# 4. Visit page
http://localhost:3000/brand/[exact-slug-from-api]
```

## 📊 Debugging

### Check Browser Console
1. Open browser (F12)
2. Go to Console tab
3. Visit brand page
4. Look for logs:

```
✅ Good:
[Brand Page] Fetching brands from: http://localhost:8000/api/brands
[Brand Page] Looking for slug: nordictrack
[Brand Page] Received 5 brands from API
[Brand Page] Found brand: {id: 1, name: "NordicTrack", ...}

❌ Bad:
[Brand Page] Brand not found with slug: nordictrack
[Brand Page] Available slugs: ["proform", "schwinn"]
→ Your brand doesn't exist or slug is wrong
```

## 🎯 Common Issues & Fixes

### Issue 1: Brand Doesn't Exist
**Symptom:** "Brand Not Found"
**Fix:** Create brand at `/admin/brands` first

### Issue 2: Wrong Slug
**Symptom:** "Brand Not Found"
**Check:** 
```bash
# Backend slug:
curl http://localhost:8000/api/brands
# Look at "slug" field

# URL slug:
/brand/[this-part-must-match]
```
**Fix:** Make sure they match exactly (case-sensitive)

### Issue 3: Backend Not Running
**Symptom:** Connection error in console
**Fix:** 
```bash
cd backend
php artisan serve
```

### Issue 4: Brand Inactive
**Symptom:** Brand exists but not found
**Fix:** Set `is_active = true` in admin

## 📝 Example: Complete Setup

```
# 1. Start backend
cd backend && php artisan serve

# 2. Create brand
Visit: http://localhost:3000/admin/brands
Create: NordicTrack (slug: nordictrack)

# 3. Verify
Visit: http://localhost:8000/api/brands
Check: Brand appears in list

# 4. Customize (optional)
Visit: http://localhost:3000/admin/brands
Click: "Page" button
Add: Custom content

# 5. View public page
Visit: http://localhost:3000/brand/nordictrack
Result: ✅ Works!
```

## 🎓 Key Takeaways

1. **Brand MUST exist in backend database**
   - Created at `/admin/brands`
   - Not at `/admin/dynamic-contents/brand-pages-db/[id]`

2. **Brand page content is OPTIONAL**
   - Adds custom sections
   - Without it, page still works with default content

3. **Slug must match exactly**
   - Backend: `slug = "nordictrack"`
   - URL: `/brand/nordictrack`

4. **Backend must be running**
   - Frontend fetches brand data from backend
   - Without backend, no brands found

## ✅ Checklist

Before visiting brand page, ensure:

- [ ] Backend API is running
- [ ] Brand exists in backend database
- [ ] Brand is active (`is_active = true`)
- [ ] You know the exact slug
- [ ] URL uses correct slug
- [ ] No console errors

## 🆘 Still Not Working?

1. **Check backend:**
   ```bash
   curl http://localhost:8000/api/brands
   ```

2. **Check console:**
   - Open F12
   - Look for [Brand Page] logs
   - Check for errors

3. **Verify brand:**
   - Go to `/admin/brands`
   - See if brand is listed
   - Check if it's active

4. **Test slug:**
   - Copy slug from admin
   - Use exact slug in URL

## 📚 More Help

- **Full Guide:** See `BRAND_NOT_FOUND_TROUBLESHOOTING.md`
- **System Docs:** See `DYNAMIC_BRAND_PAGES_COMPLETE.md`
- **Quick Start:** See `BRAND_PAGES_QUICK_START.md`

---

**TL;DR: Create the brand at `/admin/brands` FIRST, then customize the page content!** 🎯
