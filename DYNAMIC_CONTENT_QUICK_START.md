# Dynamic Content System - Quick Start Guide

## 🎯 What Problem Does This Solve?

Currently, your landing page and brand pages have hardcoded content. Every time you want to:
- Change a hero image
- Update button text
- Modify titles
- Add/remove sections
- Update discount badges

...you need to edit code files and redeploy. This system allows you to manage all this content through an admin interface.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN INTERFACE                          │
│  http://localhost:3000/admin/dynamic-contents               │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Landing Page │  │  Brand Pages │  │ Create New   │     │
│  │   Editor     │  │    Editor    │  │    Page      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS API LAYER                         │
│                                                              │
│  /api/admin/dynamic-pages     (CRUD operations)             │
│  /api/hero-sections           (Landing page content)        │
│  /api/dynamic-content/brand   (Brand page content)          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   DJANGO BACKEND API                         │
│                                                              │
│  /api/admin/dynamic-pages/                                  │
│  /api/hero-sections/                                        │
│  /api/dynamic-content/brand/{slug}/                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                                │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │dynamic_pages │  │page_sections │  │section_images│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐                                          │
│  │section_badges│                                          │
│  └──────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Structure Example

### Landing Page Structure
```
Landing Page (page_key: "home")
├── Hero Section (Main)
│   ├── Title: "Elevate Your\nFitness Journey"
│   ├── Button: "Shop Now" → /shop
│   ├── Image: hero-main.png
│   └── Badge: "Up to 40% Discounts"
│
├── Hero Section (Top Right)
│   ├── Title: "Perfect Gear\nAwaits"
│   ├── Button: "Shop Now" → /shop
│   └── Image: hero-top-right.png
│
├── Hero Section (Bottom Right)
│   └── ...
│
├── Hero Section (Tall Right)
│   └── ...
│
└── Pre-Order Section
    ├── Section Title: "Pre-Order Now & Save Big"
    ├── Main Feature
    │   ├── Title: "Nordictrack T Series\n10 Treadmill"
    │   ├── Button: "Preorder Now" → /pre-order
    │   ├── Image: treadmill.png
    │   └── Badge: "Save 30%"
    └── Grid Images (4 items)
        ├── Image 1
        ├── Image 2
        ├── Image 3
        └── Image 4
```

### Brand Page Structure
```
Brand Page (page_key: "nordictrack", slug: "nordictrack")
├── Brand Hero Section
│   ├── Title: "NordicTrack"
│   ├── Subtitle: "Premium Home Fitness Equipment"
│   ├── Button: "Shop Now" → /shop?brand=nordictrack
│   └── Image: nordictrack-hero.png
│
├── Categories Section
│   └── ...
│
├── Behind The Work Section
│   └── ...
│
└── Recommended Products Section
    └── ...
```

## 🚀 Quick Implementation (5 Steps)

### Step 1: Backend Setup (10 minutes)

```bash
# Navigate to backend
cd backend

# Create the content app (if not exists)
python manage.py startapp content

# Copy models, serializers, views from BACKEND_DYNAMIC_CONTENT_API.md

# Create migrations
python manage.py makemigrations content
python manage.py migrate content

# Seed initial data
python manage.py seed_landing_page
```

### Step 2: Backend URLs (2 minutes)

```python
# File: backend/apps/content/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DynamicPageViewSet

router = DefaultRouter()
router.register(r'dynamic-pages', DynamicPageViewSet, basename='dynamic-pages')

urlpatterns = [
    path('', include(router.urls)),
    path('hero-sections/', 
         DynamicPageViewSet.as_view({'get': 'landing_page'}),
         name='hero-sections'),
]
```

```python
# File: backend/config/urls.py (add this line)
urlpatterns = [
    # ... existing patterns
    path('api/', include('apps.content.urls')),
]
```

### Step 3: Frontend API Routes (5 minutes)

Files already created:
- ✅ `app/api/admin/dynamic-pages/route.ts`
- ✅ `app/api/admin/dynamic-pages/[pageKey]/route.ts`

Update existing:
```typescript
// File: app/api/hero-sections/route.ts
// Change the backend URL to use new endpoint
const response = await fetch(`${API_BASE_URL}/hero-sections/`);
```

### Step 4: Admin Interface (Already Done!)

Files already created:
- ✅ `app/admin/dynamic-contents/page.tsx` - Main listing
- ✅ `app/admin/dynamic-contents/landing-page/page.tsx` - Edit page

### Step 5: Test It! (5 minutes)

```bash
# Start backend
cd backend
python manage.py runserver

# Start frontend (in another terminal)
cd frontend
npm run dev

# Visit admin interface
open http://localhost:3000/admin/dynamic-contents/landing-page
```

## 🎨 Using the Admin Interface

### Managing Landing Page

1. **Navigate to Admin**
   ```
   http://localhost:3000/admin/dynamic-contents/landing-page
   ```

2. **Edit Hero Section**
   - Click on any hero section in the preview
   - Update title (use `\n` for line breaks)
   - Change button text and URL
   - Upload new image
   - Toggle discount badge
   - Click "Save Changes"

3. **Edit Pre-Order Section**
   - Click on the pre-order main feature
   - Update product title
   - Change button text and URL
   - Upload new image
   - Toggle save badge
   - Click on grid images to update them

4. **Preview Changes**
   - Click "Preview Live" to see changes on the actual site
   - Changes are saved to database immediately

### Managing Brand Pages

1. **Create New Brand Page**
   ```
   http://localhost:3000/admin/dynamic-contents/create
   ```
   - Select "Brand Page"
   - Enter page key (e.g., "proform")
   - Enter title (e.g., "ProForm")
   - Enter slug (e.g., "proform")
   - Add meta title and description
   - Click "Create Page"

2. **Add Sections**
   - Click "Add Section"
   - Select section type (hero, categories, etc.)
   - Fill in content
   - Upload images
   - Save

3. **Reorder Sections**
   - Drag and drop sections to reorder
   - Changes save automatically

## 📝 Common Tasks

### Task 1: Change Hero Image
```
1. Go to: /admin/dynamic-contents/landing-page
2. Click on the hero section you want to edit
3. Click on the image area
4. Select new image from your computer
5. Click "Save Changes"
```

### Task 2: Update Discount Badge
```
1. Go to: /admin/dynamic-contents/landing-page
2. Click on the main hero section
3. Toggle "Show Discount Badge"
4. Update "Badge Text" (e.g., "Up to")
5. Update "Discount Percentage" (e.g., "50%")
6. Click "Save Changes"
```

### Task 3: Add New Brand Page
```
1. Go to: /admin/dynamic-contents
2. Click "Create New Page"
3. Select "Brand Page"
4. Fill in details:
   - Page Key: "proform"
   - Title: "ProForm"
   - Slug: "proform"
5. Click "Create Page"
6. Add sections as needed
```

### Task 4: Disable a Section
```
1. Go to the page editor
2. Find the section you want to disable
3. Toggle the "Enable Section" switch
4. Click "Save Changes"
5. Section will be hidden on the public site
```

## 🔍 API Endpoints Reference

### Admin Endpoints (Require Authentication)

```
GET    /api/admin/dynamic-pages              # List all pages
POST   /api/admin/dynamic-pages              # Create new page
GET    /api/admin/dynamic-pages/{pageKey}    # Get page details
PUT    /api/admin/dynamic-pages/{pageKey}    # Update page
DELETE /api/admin/dynamic-pages/{pageKey}    # Delete page

GET    /api/admin/dynamic-pages/{pageKey}/sections           # Get sections
POST   /api/admin/dynamic-pages/{pageKey}/create_section     # Create section
PUT    /api/admin/dynamic-pages/{pageKey}/sections/{id}      # Update section
DELETE /api/admin/dynamic-pages/{pageKey}/sections/{id}      # Delete section
POST   /api/admin/dynamic-pages/{pageKey}/sections/reorder   # Reorder sections
```

### Public Endpoints (No Authentication)

```
GET /api/hero-sections                        # Landing page content
GET /api/dynamic-content/landing              # Landing page content (alternative)
GET /api/dynamic-content/brand/{slug}         # Brand page content
```

## 🎯 Benefits

### Before (Hardcoded)
```typescript
// Had to edit code file
const title = "Elevate Your\nFitness Journey";
const buttonText = "Shop Now";
const image = "/images/hero.png";

// Then commit, push, and deploy
```

### After (Database-Driven)
```
1. Open admin interface
2. Click section
3. Update content
4. Save
5. Done! (No deployment needed)
```

## 📊 Database Tables Overview

### dynamic_pages
Stores page metadata
```sql
id | page_type | page_key    | title      | slug       | is_active
1  | landing   | home        | Home Page  | NULL       | true
2  | brand     | nordictrack | NordicTrack| nordictrack| true
3  | brand     | proform     | ProForm    | proform    | true
```

### page_sections
Stores sections within pages
```sql
id | page_id | section_type | section_key | title                    | button_text | button_url
1  | 1       | hero         | main        | Elevate Your\nFitness... | Shop Now    | /shop
2  | 1       | hero         | topRight    | Perfect Gear\nAwaits     | Shop Now    | /shop
3  | 1       | pre-order    | main        | Pre-Order Now & Save Big | NULL        | /pre-order
```

### section_images
Stores images for sections
```sql
id | section_id | image_url                  | image_type | display_order
1  | 1          | /images/hero-main.png      | main       | 0
2  | 2          | /images/hero-top-right.png | main       | 0
3  | 3          | /images/preorder-main.png  | main       | 0
4  | 3          | /images/preorder-grid1.png | grid       | 1
```

### section_badges
Stores badges/labels
```sql
id | section_id | badge_type | text  | value | position      | is_enabled
1  | 1          | discount   | Up to | 40%   | bottom-right  | true
2  | 3          | save       | Save  | 30%   | top-left      | true
```

## 🎓 Next Steps

1. **Implement Backend**
   - Follow `BACKEND_DYNAMIC_CONTENT_API.md`
   - Create models, serializers, views
   - Run migrations
   - Seed data

2. **Test Admin Interface**
   - Access `/admin/dynamic-contents/landing-page`
   - Edit hero sections
   - Update pre-order section
   - Save and preview

3. **Create Brand Pages**
   - Use admin interface to create brand pages
   - Add sections
   - Customize content

4. **Deploy**
   - Deploy backend with migrations
   - Deploy frontend
   - Test in production

## 📚 Documentation Files

1. **DYNAMIC_CONTENT_SYSTEM_DESIGN.md**
   - Complete database schema
   - API endpoint specifications
   - Data structure examples

2. **BACKEND_DYNAMIC_CONTENT_API.md**
   - Django models code
   - Serializers code
   - Views code
   - URL configuration
   - Testing guide

3. **DYNAMIC_CONTENT_IMPLEMENTATION_GUIDE.md**
   - Step-by-step implementation
   - File structure
   - Configuration
   - Deployment guide

4. **DYNAMIC_CONTENT_QUICK_START.md** (this file)
   - Quick overview
   - 5-step implementation
   - Common tasks
   - API reference

## ✅ Checklist

Backend:
- [ ] Create Django models
- [ ] Create serializers
- [ ] Create views
- [ ] Configure URLs
- [ ] Run migrations
- [ ] Seed initial data
- [ ] Test API endpoints

Frontend:
- [ ] Create API routes
- [ ] Update hero sections API
- [ ] Test admin interface
- [ ] Test public pages
- [ ] Deploy

## 🆘 Need Help?

1. Check the detailed documentation files
2. Review the code examples
3. Test API endpoints with Postman
4. Check backend logs for errors
5. Verify database migrations

## 🎉 Success!

Once implemented, you'll be able to:
- ✅ Update landing page content without code changes
- ✅ Manage 25+ brand pages from admin interface
- ✅ Upload and change images easily
- ✅ Toggle sections on/off
- ✅ Preview changes before publishing
- ✅ Scale to hundreds of pages

Access your admin interface at:
```
http://localhost:3000/admin/dynamic-contents
```
