# Dynamic Content Management System - Complete

## Overview
A database-driven content management system for landing pages and brand pages. Admin creates/updates content via forms, stores in database, and frontend pages fetch dynamically.

## What Was Built

### 1. API Hooks (React Query)

#### Admin Hooks (`lib/hooks/admin/usePageContent.ts`)
- `usePageContents()` - Fetch all page contents with filters
- `usePageContentByKey(pageKey)` - Fetch sections for specific page
- `usePageContent(id)` - Fetch single section by ID
- `useCreatePageContent()` - Create new section
- `useUpdatePageContent()` - Update existing section
- `useDeletePageContent()` - Delete section
- `useUpdateSortOrder()` - Update section ordering

#### Public Hooks (`lib/hooks/usePageContent.ts`)
- `usePublicPageContent(pageKey)` - Fetch page content for frontend
- `useBrandPageContent(brandSlug)` - Fetch brand page content for frontend

### 2. Admin Pages

#### Landing Page Management
**URL:** `/admin/dynamic-contents/landing-page-db`

Features:
- List all landing page sections
- Create/Edit/Delete sections
- Toggle section active status
- Drag to reorder (visual indicator)
- JSON content editor
- Preview live page

#### Brand Pages Management
**URL:** `/admin/dynamic-contents/brand-pages-db`

Features:
- **Step 1:** List all brands (with logo, name, description)
- **Step 2:** Click brand → Manage that brand's page sections
- Create/Edit/Delete brand-specific sections
- Toggle section active status
- JSON content editor
- Preview live brand page
- Back to brands list

### 3. Database Structure

Table: `page_contents`

```sql
- id (primary key)
- page_key (string) - 'home', 'nordictrack', 'proform', etc.
- page_type (enum) - 'landing' or 'brand'
- section_name (string) - 'hero', 'categories', 'behind-the-work', etc.
- title (string) - Section title
- sort_order (integer) - Display order
- brand_id (foreign key) - Links to brands table (nullable)
- content (json) - Flexible JSON structure for section data
- meta_title (string, nullable)
- meta_description (text, nullable)
- is_active (boolean) - Show/hide section
- created_by, updated_by (foreign keys to users)
- timestamps

Indexes:
- page_key, page_type, section_name
- Unique: (page_key, section_name)
```

### 4. API Endpoints (Laravel)

#### Admin Routes (Protected)
```
GET    /api/admin/page-contents              - List all
POST   /api/admin/page-contents              - Create
GET    /api/admin/page-contents/{id}         - Show one
PUT    /api/admin/page-contents/{id}         - Update
DELETE /api/admin/page-contents/{id}         - Delete
GET    /api/admin/page-contents/page/{key}   - Get by page key
POST   /api/admin/page-contents/sort-order   - Update ordering
```

#### Public Routes (Frontend)
```
GET /api/page-content/{pageKey}           - Get page content (e.g., 'home')
GET /api/page-content/brand/{brandSlug}   - Get brand page content
```

## How to Use

### For Landing Page

1. Go to `/admin/dynamic-contents/landing-page-db`
2. Click "Add Section"
3. Fill in:
   - Section Name: `hero`, `pre-order`, `categories`, etc.
   - Title: Display title
   - Sort Order: 1, 2, 3...
   - Content: JSON with section data
4. Click Save
5. Section appears on landing page

### For Brand Pages

1. Go to `/admin/dynamic-contents/brand-pages-db`
2. See list of all brands
3. Click on a brand (e.g., "NordicTrack")
4. Click "Add Section"
5. Fill in:
   - Section Name: `hero`, `categories`, `behind-the-work`, `shop-by`, etc.
   - Title: Display title
   - Sort Order: 1, 2, 3...
   - Content: JSON with section data
6. Click Save
7. Section appears on brand page

## Content JSON Structure Examples

### Hero Section
```json
{
  "backgroundImage": "/images/hero.jpg",
  "title": "Turn Your Home Into A Complete",
  "highlightedText": "Fitness Space",
  "description": "Brand description here...",
  "buttonText": "Shop Now",
  "buttonUrl": "/shop",
  "discountBadge": {
    "enabled": true,
    "text": "Up to",
    "percentage": "40%"
  }
}
```

### Categories Section
```json
{
  "sectionTitle": "Explore Categories",
  "items": [
    {
      "id": "bikes",
      "name": "Bikes",
      "image": "/images/bikes.jpg",
      "href": "/shop/bikes"
    }
  ]
}
```

### Behind The Work Section
```json
{
  "title": "Thinking Behind the Work",
  "description": "Long description...",
  "stats": [
    { "value": "51+", "label": "Years of Experience" },
    { "value": "1M+", "label": "Happy Customers" }
  ],
  "images": {
    "left": "/images/left.jpg",
    "center": "/images/center.jpg",
    "right": "/images/right.jpg"
  }
}
```

## Frontend Integration

### Landing Page
```tsx
import { usePublicPageContent } from '@/lib/hooks/usePageContent';

export default function LandingPage() {
  const { data } = usePublicPageContent('home');
  const sections = data?.data || [];
  
  return (
    <>
      {sections
        .filter(s => s.is_active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(section => {
          // Render based on section_name
          if (section.section_name === 'hero') {
            return <HeroSection key={section.id} data={section.content} />;
          }
          if (section.section_name === 'pre-order') {
            return <PreOrderSection key={section.id} data={section.content} />;
          }
          // ... more sections
        })}
    </>
  );
}
```

### Brand Page
```tsx
import { useBrandPageContent } from '@/lib/hooks/usePageContent';

export default function BrandPage({ params }: { params: { slug: string } }) {
  const { data } = useBrandPageContent(params.slug);
  const sections = data?.data || [];
  
  return (
    <>
      {sections
        .filter(s => s.is_active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(section => {
          // Render based on section_name
          if (section.section_name === 'hero') {
            return <BrandHero key={section.id} data={section.content} />;
          }
          if (section.section_name === 'categories') {
            return <BrandCategories key={section.id} data={section.content} />;
          }
          // ... more sections
        })}
    </>
  );
}
```

## Key Features

✅ Database-driven content (no hardcoded data)
✅ Flexible JSON structure (any content shape)
✅ Section ordering (sort_order)
✅ Active/inactive toggle
✅ Brand-specific content
✅ Type-safe React Query hooks
✅ Toast notifications
✅ Optimistic updates
✅ Auto cache invalidation
✅ Preview live pages
✅ Brand list → Brand content flow

## Image Upload Feature

### Components Created

1. **ImageUpload Component** (`app/admin/dynamic-contents/_components/ImageUpload.tsx`)
   - Drag & drop or click to upload
   - Image preview with remove option
   - File validation (type & size)
   - Loading state
   - Error handling
   - Uses existing `/api/admin/content/upload` endpoint

2. **ContentEditor Component** (`app/admin/dynamic-contents/_components/ContentEditor.tsx`)
   - Visual editor mode with image uploads
   - JSON editor mode for advanced users
   - Auto-detects section type (Hero, Categories, Behind The Work)
   - Dynamic array management (add/remove items)
   - Field-specific inputs (text, textarea, image, number, checkbox)
   - Real-time validation

### How Images Work

1. **Upload Process:**
   - User clicks image field or drags image
   - File uploads to `/api/admin/content/upload`
   - Returns public URL (e.g., `/images/page-content/123456-hero.jpg`)
   - URL stored in content JSON

2. **Storage:**
   - Images saved to `public/images/page-content/`
   - Unique filename with timestamp
   - Accessible via public URL

3. **Visual Editor:**
   - Hero sections: Background image field
   - Categories: Image per category item
   - Behind The Work: Left, center, right images
   - Custom sections: Switch to JSON mode

### Usage Example

When creating a hero section:
1. Click "Add Section"
2. Enter section name: `hero`
3. Visual editor auto-loads
4. Click "Background Image" field
5. Upload image → URL auto-populated
6. Fill other fields (title, button, etc.)
7. Save

## Next Steps

1. **Backend:** Ensure Laravel controllers are implemented
2. **Frontend:** Update existing landing/brand pages to use hooks
3. **Seeder:** Create PageContentSeeder with default data
4. **Validation:** Add form validation in admin pages
5. ✅ **Image Upload:** Integrated with visual editor
6. **Drag & Drop:** Implement actual drag-to-reorder functionality
7. ✅ **Rich Editor:** Visual editor with image uploads complete

## Important Notes

- Your existing layouts (`app/(public)/page.tsx`, `app/(public)/brand/[slug]/page.tsx`) remain untouched
- These new admin pages are separate: `/admin/dynamic-contents/landing-page-db` and `/admin/dynamic-contents/brand-pages-db`
- The old file-based admin pages still exist at `/admin/dynamic-contents/landing-page` and `/admin/dynamic-contents/brand-pages`
- You can migrate gradually by updating frontend pages to fetch from DB instead of hardcoded data
