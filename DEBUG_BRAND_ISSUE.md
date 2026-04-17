# Debug: Brand Not Found Issue

## 🔍 The Problem

You have brand page content but the public page shows "Brand Not Found".

## 💡 Root Cause

**The brand doesn't exist in your BACKEND DATABASE.**

Having content in `public/content/brand-pages/1.json` is NOT enough!

## 🎯 What You Need

```
┌─────────────────────────────────────────────────────┐
│           BOTH ARE REQUIRED                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1. Brand in Backend Database (Laravel)              │
│     ✅ REQUIRED - Without this, page won't load     │
│     Location: Backend database                       │
│     Created at: /admin/brands                        │
│                                                      │
│  2. Brand Page Content (JSON)                        │
│     ⚠️ OPTIONAL - You have this already             │
│     Location: public/content/brand-pages/1.json      │
│     Created at: /admin/dynamic-contents/...          │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## 🔧 How to Fix

### Step 1: Check if Backend is Running

Open a new terminal and run:

```bash
# Test if backend API is accessible
curl http://localhost:8000/api/brands

# OR visit in browser:
http://localhost:8000/api/brands
```

**Expected Result:**
```json
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

**If you get an error:**
- Backend is not running
- Start it with: `php artisan serve`

### Step 2: Check Browser Console

1. Open the brand page that's not working
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for logs like:

```
[Brand Page] Fetching brands from: http://localhost:8000/api/brands
[Brand Page] Looking for slug: nordictrack
[Brand Page] Received 0 brands from API
[Brand Page] Brand not found with slug: nordictrack
[Brand Page] Available slugs: []
```

This tells you:
- ✅ Backend is accessible
- ❌ No brands in database
- ❌ Need to create brand

### Step 3: Create Brand in Admin

**IMPORTANT: You must create the brand in the admin panel!**

1. Go to: `http://localhost:3000/admin/brands`
2. Click: "Add Brand" button
3. Fill in:
   ```
   Name: NordicTrack
   Slug: nordictrack (must match your URL!)
   Logo: Upload image
   Description: Optional
   Active: ✅ YES (very important!)
   ```
4. Click: Save

### Step 4: Verify Brand Was Created

```bash
# Check again:
curl http://localhost:8000/api/brands

# Should now see:
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

### Step 5: Visit Public Page Again

```
Visit: http://localhost:3000/brand/nordictrack

Should now work! ✅
```

## 🧪 Quick Diagnostic

Run these checks in order:

### Check 1: Backend Running?
```bash
curl http://localhost:8000/api/brands
```
- ✅ Returns JSON → Backend is running
- ❌ Connection refused → Start backend

### Check 2: Brand Exists?
```bash
# Look at the response from above
# Do you see your brand in the list?
```
- ✅ Brand in list → Check slug
- ❌ Brand not in list → Create brand

### Check 3: Slug Matches?
```
Backend slug: "nordictrack"
URL: /brand/nordictrack
```
- ✅ Match → Check if active
- ❌ No match → Fix slug

### Check 4: Brand Active?
```json
{
  "is_active": true  ← Must be true!
}
```
- ✅ true → Should work
- ❌ false → Activate brand

## 📊 Common Scenarios

### Scenario 1: Backend Not Running

**Symptoms:**
- Connection error in console
- "Brand Not Found" on all pages

**Fix:**
```bash
cd backend
php artisan serve
```

### Scenario 2: Brand Not Created

**Symptoms:**
- Backend returns empty array
- Console shows "Received 0 brands"

**Fix:**
- Go to `/admin/brands`
- Create the brand
- Make sure it's active

### Scenario 3: Wrong Slug

**Symptoms:**
- Backend has brands
- Console shows "Available slugs: [...]"
- Your slug not in the list

**Fix:**
- Check exact slug in backend
- Update URL to match
- OR update slug in backend

### Scenario 4: Brand Inactive

**Symptoms:**
- Brand exists in database
- Still shows "Brand Not Found"

**Fix:**
- Go to `/admin/brands`
- Edit the brand
- Set Active: ✅ Yes
- Save

## 🎯 Your Specific Case

Based on your description, you likely have:

```
✅ Brand page content exists
   Location: public/content/brand-pages/1.json
   
❌ Brand doesn't exist in backend database
   OR
❌ Brand slug doesn't match URL
   OR
❌ Brand is inactive
```

## 🔍 Step-by-Step Diagnosis

### 1. Open Browser Console (F12)

Visit your brand page and check console logs.

**If you see:**
```
[Brand Page] Received 0 brands from API
```
→ No brands in database. Create brand at `/admin/brands`

**If you see:**
```
[Brand Page] Brand not found with slug: nordictrack
[Brand Page] Available slugs: ["proform", "schwinn"]
```
→ Brand exists but slug is wrong. Either:
  - Change URL to match existing slug
  - OR create new brand with correct slug

**If you see:**
```
Failed to fetch
```
→ Backend not running. Start backend server.

### 2. Check Backend API Directly

```bash
curl http://localhost:8000/api/brands
```

**Response Analysis:**

**Empty array:**
```json
{"data": []}
```
→ No brands exist. Create brand.

**Has brands:**
```json
{
  "data": [
    {"id": 1, "slug": "proform"},
    {"id": 2, "slug": "schwinn"}
  ]
}
```
→ Brands exist but not yours. Create your brand.

**Connection error:**
```
curl: (7) Failed to connect
```
→ Backend not running. Start it.

### 3. Create Brand

If brand doesn't exist:

1. Visit: `http://localhost:3000/admin/brands`
2. Click: "Add Brand"
3. Fill in form
4. **IMPORTANT:** Make sure slug matches your URL
5. **IMPORTANT:** Set Active to Yes
6. Save

### 4. Verify and Test

```bash
# 1. Check brand was created
curl http://localhost:8000/api/brands

# 2. Visit public page
http://localhost:3000/brand/[your-slug]

# Should work now!
```

## ✅ Checklist

Go through this checklist:

- [ ] Backend server is running
- [ ] Can access `http://localhost:8000/api/brands`
- [ ] API returns brands array
- [ ] Your brand is in the array
- [ ] Brand slug matches URL
- [ ] Brand is_active = true
- [ ] Public page loads successfully

## 🆘 Still Not Working?

If you've done all the above and it still doesn't work:

1. **Check environment variables:**
   ```env
   # In .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. **Restart Next.js:**
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev
   ```

3. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

4. **Check Network tab:**
   - Open F12 → Network tab
   - Visit brand page
   - Look for `/api/brands` request
   - Check response

## 📝 Example: Complete Fix

Let's say you want brand page for "NordicTrack":

```bash
# 1. Check backend
curl http://localhost:8000/api/brands
# Result: {"data": []}  ← Empty!

# 2. Create brand
Visit: http://localhost:3000/admin/brands
Click: "Add Brand"
Fill:
  Name: NordicTrack
  Slug: nordictrack
  Logo: [upload]
  Active: ✅ Yes
Save

# 3. Verify
curl http://localhost:8000/api/brands
# Result: {"data": [{"id": 1, "slug": "nordictrack", ...}]}  ← Success!

# 4. Visit public page
Visit: http://localhost:3000/brand/nordictrack
# Result: ✅ Page loads!
```

## 🎓 Key Lesson

**Brand page content (JSON) ≠ Brand (Database)**

You need BOTH:
1. Brand in database (created at `/admin/brands`)
2. Brand page content (created at `/admin/dynamic-contents/...`)

Without #1, the page won't load at all.
Without #2, the page loads with default content.

---

**TL;DR: Go to `/admin/brands` and create the brand first!** 🎯
