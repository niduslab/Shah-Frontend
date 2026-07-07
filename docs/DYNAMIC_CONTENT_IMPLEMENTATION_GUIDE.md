# Dynamic Content Management System - Complete Implementation Guide

## 📋 Overview

This guide provides a complete solution for managing dynamic content across your website, including:
- Landing page (homepage) with hero sections and pre-order sections
- Brand pages (25+ brands) with customizable sections
- Database-driven content management
- Admin interface for easy updates
- API endpoints for content delivery

## 🎯 Solution Architecture

### 1. Database Layer
- **dynamic_pages**: Stores page metadata (landing/brand pages)
- **page_sections**: Stores individual sections within pages
- **section_images**: Stores images for sections
- **section_badges**: Stores badges/labels (discount, save, etc.)

### 2. Backend API Layer (Django)
- RESTful API endpoints for CRUD operations
- Public endpoints for frontend consumption
- Admin endpoints for content management
- Image upload handling
- Nested serializers for complex data

### 3. Frontend Layer (Next.js)
- Admin interface for managing content
- Public pages consuming API data
- Real-time preview
- Image upload and management

## 📁 File Structure

```
project/
├── backend/
│   └── apps/
│       └── content/
│           ├── models.py                 # Database models
│           ├── serializers.py            # API serializers
│           ├── views.py                  # API views
│           ├── urls.py                   # URL routing
│           └── management/
│               └── commands/
│                   └── seed_landing_page.py  # Data seeding
│
├── app/
│   ├── admin/
│   │   └── dynamic-contents/
│   │       ├── page.tsx                  # Main listing page
│   │       ├── [pageKey]/
│   │       │   └── page.tsx              # Edit page
│   │       └── _components/
│   │           └── EditModal.tsx         # Reusable modal
│   │
│   ├── api/
│   │   ├── admin/
│   │   │   ├── dynamic-pages/
│   │   │   │   ├── route.ts              # List/Create pages
│   │   │   │   └── [pageKey]/
│   │   │   │       ├── route.ts          # Get/Update/Delete page
│   │   │   │       └── sections/
│   │   │   │           └── route.ts      # Manage sections
│   │   │   └── hero-sections/
│   │   │       └── route.ts              # Legacy endpoint (update)
│   │   │
│   │   └── dynamic-content/
│   │       ├── landing/
│   │       │   └── route.ts              # Public landing page API
│   │       └── brand/
│   │           └── [slug]/
│   │               └── route.ts          # Public brand page API
│   │
│   └── (public)/
│       ├── page.tsx                      # Landing page
│       ├── _components/
│       │   └── landing/
│       │       ├── hero-section.tsx      # Hero component
│       │       └── pre-order-section.tsx # Pre-order component
│       │
│       └── brand/
│           └── [slug]/
│               └── page.tsx              # Dynamic brand page
│
└── Documentation/
    ├── DYNAMIC_CONTENT_SYSTEM_DESIGN.md
    ├── BACKEND_DYNAMIC_CONTENT_API.md
    └── DYNAMIC_CONTENT_IMPLEMENTATION_GUIDE.md (this file)
```

## 🚀 Implementation Steps

### Step 1: Backend Setup

#### 1.1 Create Django Models
```bash
# File: backend/apps/content/models.py
```
See `BACKEND_DYNAMIC_CONTENT_API.md` for complete model definitions.

#### 1.2 Create Migrations
```bash
cd backend
python manage.py makemigrations content
python manage.py migrate content
```

#### 1.3 Create Serializers and Views
```bash
# File: backend/apps/content/serializers.py
# File: backend/apps/content/views.py
```
See `BACKEND_DYNAMIC_CONTENT_API.md` for complete code.

#### 1.4 Configure URLs
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
# File: backend/config/urls.py (add to main URLs)
urlpatterns = [
    # ... existing patterns
    path('api/', include('apps.content.urls')),
    path('api/admin/', include('apps.content.urls')),
]
```

#### 1.5 Seed Initial Data
```bash
python manage.py seed_landing_page
```

### Step 2: Frontend API Routes

#### 2.1 Create Admin API Routes
Already created:
- `app/api/admin/dynamic-pages/route.ts`
- `app/api/admin/dynamic-pages/[pageKey]/route.ts`

#### 2.2 Update Hero Sections API
Update `app/api/admin/hero-sections/route.ts` to use new backend endpoint:

```typescript
// GET endpoint should call: /api/admin/dynamic-pages/home/sections
// POST endpoint should call: /api/admin/dynamic-pages/home/sections
```

#### 2.3 Create Public API Routes
```typescript
// File: app/api/dynamic-content/landing/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-sections/`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch landing page content" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching landing page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

```typescript
// File: app/api/dynamic-content/brand/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/dynamic-content/brand/${params.slug}/`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch brand page content" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching brand page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Step 3: Admin Interface

#### 3.1 Main Listing Page
Already created: `app/admin/dynamic-contents/page.tsx`

Features:
- List all pages (landing + brand)
- Filter by page type
- Toggle active/inactive status
- Edit, preview, and delete pages
- Create new pages

#### 3.2 Edit Page Interface
Update `app/admin/dynamic-contents/landing-page/page.tsx` to:
- Rename to `app/admin/dynamic-contents/[pageKey]/page.tsx`
- Make it dynamic to handle both landing and brand pages
- Use the new API endpoints

#### 3.3 Create Page Interface
```typescript
// File: app/admin/dynamic-contents/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateDynamicPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    page_type: "landing",
    page_key: "",
    title: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/dynamic-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/dynamic-contents/${data.data.page_key}`);
      }
    } catch (error) {
      console.error("Error creating page:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">Create New Page</h1>
        
        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-8 shadow-lg">
          {/* Form fields here */}
          <button
            type="submit"
            className="w-full rounded-lg bg-orange-500 px-6 py-3 text-white"
          >
            Create Page
          </button>
        </form>
      </div>
    </div>
  );
}
```

### Step 4: Update Frontend Components

#### 4.1 Update Hero Section Component
The existing `app/(public)/_components/landing/hero-section.tsx` already fetches from `/api/hero-sections`. No changes needed if backend endpoint is updated.

#### 4.2 Update Pre-Order Section Component
The existing `app/(public)/_components/landing/pre-order-section.tsx` already fetches from `/api/hero-sections`. No changes needed.

#### 4.3 Create Dynamic Brand Page
```typescript
// File: app/(public)/brand/[slug]/page.tsx
import { notFound } from "next/navigation";
import { BrandHero } from "@/app/(public)/_components/brand/brand-hero";
// Import other brand components

async function getBrandPageData(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/dynamic-content/brand/${slug}`,
    { cache: 'no-store' }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const data = await getBrandPageData(params.slug);

  if (!data || !data.success) {
    notFound();
  }

  const { page, sections } = data.data;

  return (
    <main className="min-h-screen bg-black">
      {sections.map((section: any) => {
        // Render appropriate component based on section_type
        switch (section.section_type) {
          case 'brand-hero':
            return <BrandHero key={section.id} data={section} />;
          // Add other section types
          default:
            return null;
        }
      })}
    </main>
  );
}
```

## 🎨 Admin Interface Features

### Landing Page Management
1. **Hero Sections** (4 positions)
   - Main section (large, left)
   - Top right section
   - Bottom right section
   - Tall right section
   - Each with:
     - Title (supports line breaks with \n)
     - Button text and URL
     - Image upload
     - Optional discount badge

2. **Pre-Order Section**
   - Enable/disable toggle
   - Section title
   - View all link text and URL
   - Main feature:
     - Image
     - Title
     - Button text and URL
     - Save badge (optional)
   - Grid images (4 items)

### Brand Page Management
1. **Page Metadata**
   - Page title
   - Slug
   - Meta title and description
   - Active/inactive status

2. **Sections** (customizable)
   - Brand hero
   - Categories
   - Behind the work
   - Recommended products
   - Shop by section
   - Fitness discounts
   - Product showcase
   - Why choose section

## 📊 Data Flow

### Admin Flow
```
Admin UI → Next.js API Route → Django Backend → Database
                                      ↓
                                   Response
                                      ↓
Admin UI ← Next.js API Route ← Django Backend
```

### Public Flow
```
Public Page → Next.js API Route → Django Backend → Database
                                        ↓
                                    Response
                                        ↓
Public Page ← Next.js API Route ← Django Backend
```

## 🔧 Configuration

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Backend Settings
```python
# backend/config/settings.py
INSTALLED_APPS = [
    # ...
    'apps.content',
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test apps.content
```

### Frontend Tests
```bash
npm run test
```

### Manual Testing Checklist
- [ ] Create landing page
- [ ] Edit hero sections
- [ ] Upload images
- [ ] Toggle section visibility
- [ ] Create brand page
- [ ] Add brand sections
- [ ] Preview changes
- [ ] Publish changes
- [ ] View public pages
- [ ] Test API endpoints

## 🚀 Deployment

### Backend Deployment
1. Run migrations on production database
2. Seed initial data
3. Configure static file serving for images
4. Set up CDN for image delivery
5. Enable caching (Redis recommended)

### Frontend Deployment
1. Build Next.js application
2. Configure environment variables
3. Deploy to hosting platform
4. Set up CDN for static assets

## 📈 Future Enhancements

1. **Version Control**
   - Track changes to sections
   - Rollback capability
   - Change history

2. **A/B Testing**
   - Multiple versions of sections
   - Performance tracking
   - Automatic winner selection

3. **Scheduling**
   - Schedule content changes
   - Automatic publish/unpublish
   - Campaign management

4. **Analytics**
   - Section performance metrics
   - Click tracking
   - Conversion tracking

5. **Templates**
   - Reusable section templates
   - Quick page creation
   - Template marketplace

6. **Multi-language**
   - Content translation
   - Language-specific sections
   - Automatic language detection

7. **Preview Mode**
   - Preview before publishing
   - Share preview links
   - Approval workflow

8. **Bulk Operations**
   - Bulk update sections
   - Bulk image upload
   - Bulk delete

## 🆘 Troubleshooting

### Common Issues

1. **Images not loading**
   - Check image paths
   - Verify CDN configuration
   - Check CORS settings

2. **API errors**
   - Verify backend is running
   - Check API_BASE_URL
   - Review backend logs

3. **Sections not updating**
   - Clear cache
   - Check database connection
   - Verify API endpoints

4. **Permission errors**
   - Check authentication
   - Verify admin permissions
   - Review CORS settings

## 📚 Additional Resources

- [Database Schema Design](./DYNAMIC_CONTENT_SYSTEM_DESIGN.md)
- [Backend API Documentation](./BACKEND_DYNAMIC_CONTENT_API.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Django REST Framework](https://www.django-rest-framework.org/)

## ✅ Summary

This implementation provides:
- ✅ Database-driven content management
- ✅ Flexible section system
- ✅ Admin interface for easy updates
- ✅ Support for landing and brand pages
- ✅ Image management
- ✅ Badge/label system
- ✅ Enable/disable sections
- ✅ Reorder sections
- ✅ Real-time preview
- ✅ RESTful API
- ✅ Scalable architecture

You now have a complete dynamic content management system that allows you to:
1. Manage landing page hero sections and pre-order sections
2. Create and manage 25+ brand pages
3. Update content without code changes
4. Preview changes before publishing
5. Scale to hundreds of pages

Access the admin interface at: `http://localhost:3000/admin/dynamic-contents`
