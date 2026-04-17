# Dynamic Brand Pages - Complete Setup Guide

## What Was Created

### 1. Dynamic Section Components
Located in `app/(public)/_components/brand/`:

- **DynamicHeroSection.tsx** - Renders hero section with background image, title, description, and CTA button
- **DynamicCategoriesSection.tsx** - Renders category cards with images and links
- **DynamicBehindTheWorkSection.tsx** - Renders brand story with stats and images
- **DynamicShopBySection.tsx** - Renders product cards with optional badges

### 2. Dynamic Brand Page Template
**File:** `app/(public)/brand/[slug]/page.tsx`

This is the main page that:
- Fetches brand data by slug from your API
- Fetches brand page content from `/api/admin/brand-pages/{brandId}`
- Renders sections based on `enabled` flags
- Handles metadata generation for SEO
- Shows a fallback if no content is configured

### 3. Not Found Page
**File:** `app/(public)/brand/[slug]/not-found.tsx`

Handles cases where a brand doesn't exist.

---

## How It Works

### Flow Diagram
```
User clicks brand from "Trusted Brands"
    ↓
Navigates to /brand/{slug}
    ↓
Dynamic page fetches:
  1. Brand data from API (by slug)
  2. Brand page content from /api/admin/brand-pages/{brandId}
    ↓
Renders enabled sections with admin-configured content
```

### Data Flow
```
Admin Panel (Edit Brand Page)
    ↓
Saves to: public/content/brand-pages/{brandId}.json
    ↓
API Endpoint: /api/admin/brand-pages/{brandId}
    ↓
Frontend fetches and renders
```

---

## Configuration in Admin Panel

### Step 1: Navigate to Brand Page Editor
Go to: `/admin/dynamic-contents/brand-pages-db/1` (replace 1 with brand ID)

### Step 2: Configure Sections

#### Hero Section
- Enable/disable the section
- Upload background image
- Set title (use `\n` for line breaks)
- Set highlighted text (appears in orange)
- Add description
- Configure button text and URL

#### Categories Section
- Enable/disable
- Set section title
- Add category items with:
  - Category name
  - Category image
  - Link URL

#### Behind The Work Section
- Enable/disable
- Set title and description
- Configure statistics (value + label)
- Upload 3 images (left, center, right)

#### Shop By Section
- Enable/disable
- Add product cards with:
  - Product image
  - Product title
  - Button text and URL
  - Optional badge (value + label)

### Step 3: Save
Click "Save Changes" button to persist the content.

---

## Frontend Integration

### Trusted Brands Component
The existing `TrustedBrands` component already links to `/brand/{slug}`:

```tsx
<Link href={`/brand/${brand.slug}`}>
  {/* Brand logo */}
</Link>
```

This automatically works with the new dynamic pages!

### Brands Page
The `/brands` page can also link to individual brand pages:

```tsx
<Link href={`/brand/${brand.slug}`}>
  {/* Brand card */}
</Link>
```

---

## API Endpoints Used

### 1. Fetch Brands
```
GET /api/brands
Response: { data: [{ id, name, slug, logo, is_active }, ...] }
```

### 2. Fetch Brand Page Content
```
GET /api/admin/brand-pages/{brandId}
Response: { content: { hero, categories, behindTheWork, shopBy } }
```

### 3. Save Brand Page Content (Admin Only)
```
POST /api/admin/brand-pages/{brandId}
Body: { content: { hero, categories, behindTheWork, shopBy } }
```

---

## Migration from Static Pages

### Old Approach
- Static pages: `/brand/nordictrack/page.tsx`
- Hard-coded components
- Changes require code deployment

### New Approach
- Dynamic pages: `/brand/[slug]/page.tsx`
- Admin-configured content
- Changes via admin panel (no deployment needed)

### What to Do with Old Static Pages
You can keep the old static pages for reference or delete them:
- `app/(public)/brand/nordictrack/page.tsx` (can be deleted)
- `app/(public)/_components/brand/nordictrack-*.tsx` (can be deleted)

The new dynamic system replaces all of them!

---

## Testing the Implementation

### 1. Create Brand Page Content
1. Go to `/admin/dynamic-contents/brand-pages-db/1`
2. Configure at least the Hero section
3. Click "Save Changes"

### 2. Visit Brand Page
1. Go to `/brands` or find a brand in "Trusted Brands"
2. Click on a brand
3. Should see the dynamically rendered content

### 3. Verify Sections
- Check that enabled sections appear
- Check that disabled sections don't appear
- Verify images load correctly
- Test button links work

---

## Troubleshooting

### Brand Page Shows "Content Being Prepared"
- Check if brand page content has been created in admin panel
- Verify the brand ID matches in the database
- Check browser console for API errors

### Images Not Loading
- Verify image URLs are correct in admin panel
- Check if images are uploaded to the correct folder
- Ensure image paths are accessible

### Styling Issues
- Check if Tailwind CSS classes are being applied
- Verify component imports are correct
- Check browser DevTools for CSS conflicts

---

## Performance Optimization

### Caching
Both data fetches use `revalidate: 3600` (1 hour cache):
- Brand data: Cached for 1 hour
- Brand page content: Cached for 1 hour

To update cache immediately, redeploy or use ISR.

### Image Optimization
- All images use Next.js `Image` component
- Automatic optimization and lazy loading
- Responsive image serving

---

## Future Enhancements

Possible improvements:
1. Add more section types (testimonials, FAQ, etc.)
2. Add section reordering in admin panel
3. Add A/B testing for different brand page layouts
4. Add analytics tracking for brand page views
5. Add brand page preview in admin panel
6. Add bulk brand page creation from templates

---

## File Structure Summary

```
app/(public)/
├── brand/
│   └── [slug]/
│       ├── page.tsx (Main dynamic page)
│       └── not-found.tsx
└── _components/
    └── brand/
        ├── DynamicHeroSection.tsx
        ├── DynamicCategoriesSection.tsx
        ├── DynamicBehindTheWorkSection.tsx
        └── DynamicShopBySection.tsx

app/api/admin/
└── brand-pages/
    └── [brandId]/
        └── route.ts (Already exists)
```

---

## Questions?

Refer to the admin page editor for the exact data structure being saved.
All components are fully typed with TypeScript for better development experience.
