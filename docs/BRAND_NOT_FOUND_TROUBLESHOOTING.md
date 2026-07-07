# Brand Not Found - Troubleshooting Guide

## 🔍 Understanding the Issue

When you see "Brand Not Found" on a brand page, it means the **brand doesn't exist in your backend database**, even though you may have created brand page content in the admin.

## 🎯 Important Concept

Your brand pages system uses **TWO data sources**:

### 1. Backend Database (Laravel API)
**Location:** `http://localhost:8000`
**Stores:**
- ✅ Brand basic info (id, name, slug)
- ✅ Brand logo
- ✅ Brand description
- ✅ Active/inactive status
- ✅ Products linked to brand

**This is REQUIRED** - Without this, the brand page won't work!

### 2. Frontend Local Storage (JSON Files)
**Location:** `public/content/brand-pages/[brandId].json`
**Stores:**
- ✅ Hero section content
- ✅ Categories section
- ✅ Behind the work section
- ✅ Shop by section

**This is OPTIONAL** - If missing, page shows default content + products

## 🔄 Correct Workflow

```
Step 1: Create Brand in Backend Database
   ↓
   This creates the brand with:
   - ID (e.g., 1)
   - Name (e.g., "NordicTrack")
   - Slug (e.g., "nordictrack")
   - Logo
   ↓
Step 2: Brand appears in Admin Brands List
   ↓
Step 3: Click "Page" button to customize
   ↓
Step 4: Add custom content (hero, categories, etc.)
   ↓
   This saves to: public/content/brand-pages/1.json
   ↓
Step 5: Visit public page
   ↓
   Page fetches:
   - Brand data from backend (REQUIRED)
   - Custom content from local JSON (optional)
   - Products from backend
   ↓
Step 6: Page renders successfully!
```

## ❌ Common Mistakes

### Mistake 1: Only Creating Brand Page Content
```
❌ WRONG:
   - Go to /admin/dynamic-contents/brand-pages-db/1
   - Add content
   - Expect page to work

Why it fails:
   - Brand ID 1 doesn't exist in backend database
   - Page can't find brand by slug
   - Shows "Brand Not Found"
```

### Mistake 2: Wrong Slug
```
❌ WRONG:
   Backend: slug = "nordic-track"
   URL: /brand/nordictrack
   
   Result: Brand Not Found (slug mismatch)

✅ CORRECT:
   Backend: slug = "nordictrack"
   URL: /brand/nordictrack
   
   Result: Page loads successfully
```

### Mistake 3: Inactive Brand
```
❌ WRONG:
   Brand exists but is_active = false
   
   Result: Brand might not appear in API response

✅ CORRECT:
   Brand exists and is_active = true
```

### Mistake 4: Backend Not Running
```
❌ WRONG:
   Backend API is not running
   Frontend tries to fetch from http://localhost:8000
   
   Result: Connection error, Brand Not Found

✅ CORRECT:
   Backend API is running
   Can access http://localhost:8000/api/brands
```

## 🔧 How to Fix

### Solution 1: Create Brand in Backend First

1. **Check if backend is running:**
   ```bash
   # Visit in browser:
   http://localhost:8000/api/brands
   
   # Should return JSON with brands list
   ```

2. **Create brand in admin:**
   - Go to: `http://localhost:3000/admin/brands`
   - Click "Add Brand"
   - Fill in:
     - Name: `NordicTrack`
     - Slug: `nordictrack` (lowercase, no spaces)
     - Logo: Upload image
     - Active: ✅ Yes
   - Click Save

3. **Verify brand was created:**
   - Check: `http://localhost:8000/api/brands`
   - Should see your brand in the response

4. **Now customize brand page:**
   - Click "Page" button
   - Add custom content
   - Save

5. **Visit public page:**
   - Go to: `http://localhost:3000/brand/nordictrack`
   - Should work now!

### Solution 2: Check Slug Matches

1. **Find brand slug in backend:**
   ```bash
   # Visit:
   http://localhost:8000/api/brands
   
   # Look for your brand:
   {
     "id": 1,
     "name": "NordicTrack",
     "slug": "nordictrack",  ← This is what matters!
     ...
   }
   ```

2. **Use exact slug in URL:**
   ```
   If slug is "nordictrack" → Use /brand/nordictrack
   If slug is "nordic-track" → Use /brand/nordic-track
   If slug is "NordicTrack" → Use /brand/NordicTrack
   ```

### Solution 3: Verify Backend Connection

1. **Check environment variables:**
   ```env
   # In .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. **Test backend API:**
   ```bash
   # In browser or curl:
   curl http://localhost:8000/api/brands
   
   # Should return:
   {
     "data": [
       {
         "id": 1,
         "name": "NordicTrack",
         "slug": "nordictrack",
         ...
       }
     ]
   }
   ```

3. **Check backend is running:**
   ```bash
   # For Laravel:
   php artisan serve
   
   # Should show:
   # Server running on http://localhost:8000
   ```

### Solution 4: Check Browser Console

1. **Open browser console** (F12)
2. **Visit brand page**
3. **Look for logs:**
   ```
   [Brand Page] Fetching brands from: http://localhost:8000/api/brands
   [Brand Page] Looking for slug: nordictrack
   [Brand Page] Received 5 brands from API
   [Brand Page] Found brand: {id: 1, name: "NordicTrack", ...}
   ```

4. **If you see errors:**
   - Connection refused → Backend not running
   - 404 Not Found → Wrong API endpoint
   - Brand not found → Check slug or brand doesn't exist

## 🧪 Testing Checklist

### Backend Tests
- [ ] Backend API is running
- [ ] Can access `http://localhost:8000/api/brands`
- [ ] API returns brands list
- [ ] Brand exists in response
- [ ] Brand slug is correct
- [ ] Brand is_active = true

### Frontend Tests
- [ ] Environment variable set correctly
- [ ] Can access admin brands page
- [ ] Brand appears in admin list
- [ ] Can click "Page" button
- [ ] Can save brand page content
- [ ] Public page loads without errors

### Integration Tests
- [ ] Visit `/brand/[slug]` with correct slug
- [ ] Page loads successfully
- [ ] Brand name displays
- [ ] Products display (if any)
- [ ] Custom content displays (if added)

## 📊 Debugging Steps

### Step 1: Check Backend
```bash
# 1. Is backend running?
curl http://localhost:8000/api/brands

# 2. Does brand exist?
# Look for your brand in the response

# 3. What's the slug?
# Note the exact slug value
```

### Step 2: Check Frontend
```bash
# 1. Check environment
cat .env.local | grep API_URL

# 2. Check browser console
# Open F12, go to Console tab
# Visit brand page
# Look for [Brand Page] logs
```

### Step 3: Check Data Flow
```
1. Backend has brand? → Yes/No
   ↓
2. Slug matches URL? → Yes/No
   ↓
3. Brand is active? → Yes/No
   ↓
4. Frontend can connect? → Yes/No
   ↓
5. Page loads? → Yes/No
```

## 💡 Quick Fixes

### Fix 1: Brand Doesn't Exist
```bash
# Create brand in admin:
http://localhost:3000/admin/brands
→ Click "Add Brand"
→ Fill in details
→ Save
```

### Fix 2: Wrong Slug
```bash
# Option A: Update backend slug to match URL
# Option B: Update URL to match backend slug
```

### Fix 3: Backend Not Running
```bash
# Start backend:
cd /path/to/backend
php artisan serve
```

### Fix 4: Connection Error
```bash
# Check .env.local:
NEXT_PUBLIC_API_URL=http://localhost:8000

# Restart Next.js:
npm run dev
```

## 📝 Example: Complete Setup

### Step-by-Step Example

**1. Start Backend:**
```bash
cd backend
php artisan serve
# Running on http://localhost:8000
```

**2. Verify Backend:**
```bash
# Visit: http://localhost:8000/api/brands
# Should return: {"data": [...]}
```

**3. Create Brand:**
```
Visit: http://localhost:3000/admin/brands
Click: "Add Brand"
Enter:
  - Name: NordicTrack
  - Slug: nordictrack
  - Logo: [upload]
  - Active: Yes
Save
```

**4. Verify Brand Created:**
```bash
# Visit: http://localhost:8000/api/brands
# Should see:
{
  "data": [
    {
      "id": 1,
      "name": "NordicTrack",
      "slug": "nordictrack",
      "is_active": true,
      ...
    }
  ]
}
```

**5. Customize Brand Page:**
```
Visit: http://localhost:3000/admin/brands
Click: "Page" button on NordicTrack
Add: Hero section, categories, etc.
Save
```

**6. View Public Page:**
```
Visit: http://localhost:3000/brand/nordictrack
Result: ✅ Page loads successfully!
```

## 🎯 Summary

### Key Points
1. ✅ **Brand MUST exist in backend database first**
2. ✅ **Slug in URL must match slug in database**
3. ✅ **Brand must be active**
4. ✅ **Backend API must be running**
5. ✅ **Custom content is optional**

### Data Sources
- **Backend:** Brand info, products (REQUIRED)
- **Frontend:** Custom page content (OPTIONAL)

### Correct Order
1. Create brand in backend
2. Verify brand exists
3. Customize page content
4. View public page

### Common Issues
- ❌ Brand doesn't exist in backend
- ❌ Slug mismatch
- ❌ Backend not running
- ❌ Brand inactive

### Quick Test
```bash
# 1. Check backend
curl http://localhost:8000/api/brands

# 2. Find your brand's slug

# 3. Visit page
http://localhost:3000/brand/[exact-slug]
```

## 🆘 Still Not Working?

### Check These:
1. Backend API is running
2. Brand exists in database
3. Brand is active
4. Slug is correct (case-sensitive)
5. Environment variables set
6. No console errors
7. Network tab shows successful API calls

### Get Help:
- Check browser console (F12)
- Check backend logs
- Verify API response
- Test with curl/Postman
- Check database directly

---

**Remember: The brand page content editor is for customizing the page AFTER the brand exists in the backend!** 🎯
