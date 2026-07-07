# Dynamic Brand Pages Implementation Guide

## Current Architecture Analysis

### Admin Side (How Data is Stored)
**Location:** `/admin/dynamic-contents/brand-pages-db/[brandId]`

The admin interface stores brand page content as JSON files in:
```
public/content/brand-pages/{brandId}.json
```

**Data Structure:**
```typescript
{
  brandId: number,
  content: {
    hero: {
      enabled: boolean,
      backgroundImage: string,
      title: string,
      highlightedText: string,
      description: string,
      buttonText: string,
      buttonUrl: string
    },
    categories: {
      enabled: boolean,
      sectionTitle: string,
      items: Array<{
        id: string,
        name: string,
        image: string,
        href: string
      }>
    },
    behindTheWork: {
      enabled: boolean,
      title: string,
      description: string,
      stats: Array<{ value: string, label: string }>,
      images: { left: string, center: string, right: string }
    },
    shopBy: {
      enabled: boolean,
      cards: Array<{
        id: string,
        image: string,
        title: string,
        buttonText: string,
        buttonUrl: string,
        badge?: { enabled: boolean, value: string, label: string }
      }>
    }
  },
  updatedAt: string
}
```

### API Endpoint
**GET/POST:** `/api/admin/brand-pages/[brandId]`
- **GET:** Fetches the JSON content for a specific brand
- **POST:** Saves the JSON content for a specific brand

---

## Frontend Implementation Strategy

### Current State
- Static brand pages (e.g., `/brand/nordictrack/page.tsx`)
- Hard-coded components for each section
- No dynamic content loading

### Target State
- Dynamic brand pages that load content from the API
- Reusable components that render based on admin-configured data
- Single page template for all brands

---

## Implementation Steps

### 1. Create Dynamic Brand Page Template
Replace static pages with a dynamic route that:
- Fetches brand data from `/api/admin/brand-pages/[brandId]`
- Renders sections based on `enabled` flags
- Uses the admin-configured content

### 2. Create Reusable Section Components
Build generic components that accept data props:
- `DynamicHeroSection`
- `DynamicCategoriesSection`
- `DynamicBehindTheWorkSection`
- `DynamicShopBySection`

### 3. Update Brand Links
Ensure the "Trusted Brands" component links to the dynamic brand page with the correct brand ID/slug

---

## Key Benefits
✅ Single source of truth (admin panel)
✅ No code changes needed to add/modify brand pages
✅ Consistent UI across all brands
✅ Easy to enable/disable sections
✅ Scalable for unlimited brands
