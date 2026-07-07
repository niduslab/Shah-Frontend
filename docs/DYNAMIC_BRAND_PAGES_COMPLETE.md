# Dynamic Brand Pages System - Complete Implementation

## Overview
A complete dynamic brand page system that allows admins to create and manage custom brand pages with multiple sections, while automatically displaying brand products from the database.

## System Architecture

### 1. Admin Brand Management
**Location:** `/admin/brands`
- View all brands with pagination
- Create new brands
- Edit existing brands
- Delete brands
- Access brand page editor via "Page" button

### 2. Brand Page Content Editor
**Location:** `/admin/dynamic-contents/brand-pages-db/[brandId]`
- Manage custom content for each brand
- Content stored locally in JSON files
- Sections available:
  - **Hero Section**: Background image, title, highlighted text, description, CTA button
  - **Categories Section**: Multiple category cards with images and links
  - **Behind The Work Section**: Brand story, statistics, and three images
  - **Shop By Section**: Product showcase cards with optional badges

**Storage:** `public/content/brand-pages/[brandId].json`

### 3. Public Brand Pages
**Location:** `/brand/[slug]`
- Dynamic route based on brand slug
- Fetches brand data from backend API
- Fetches custom content from local JSON files
- Displays brand products automatically
- SEO-friendly with dynamic metadata

## URL Structure

### Admin URLs
- Brand list: `http://localhost:3000/admin/brands`
- Brand page editor: `http://localhost:3000/admin/dynamic-contents/brand-pages-db/[brandId]`
  - Example: `http://localhost:3000/admin/dynamic-contents/brand-pages-db/1`

### Public URLs
- Brand page: `http://localhost:3000/brand/[slug]`
  - Example: `http://localhost:3000/brand/nordictrack`
  - Example: `http://localhost:3000/brand/proform`

## Data Flow

```
Backend Database (Brands)
    ↓
Admin Creates/Edits Brand
    ↓
Admin Clicks "Page" Button
    ↓
Brand Page Editor (/admin/dynamic-contents/brand-pages-db/[brandId])
    ↓
Content Saved to Local JSON (public/content/brand-pages/[brandId].json)
    ↓
Public Brand Page (/brand/[slug])
    ↓
Fetches:
  1. Brand data from backend API
  2. Custom content from local JSON
  3. Brand products from backend API
    ↓
Renders Dynamic Page
```

## API Endpoints

### Brand Pages API
**File:** `app/api/admin/brand-pages/[brandId]/route.ts`

#### GET `/api/admin/brand-pages/[brandId]`
- Fetches brand page content from local JSON
- Returns null if no content exists

#### POST `/api/admin/brand-pages/[brandId]`
- Saves brand page content to local JSON
- Creates directory if it doesn't exist

## Components

### Dynamic Components
Located in: `app/(public)/_components/brand/`

1. **DynamicHeroSection.tsx**
   - Full-screen hero with background image
   - Title with highlighted text
   - Description and CTA button

2. **DynamicCategoriesSection.tsx**
   - Grid of category cards
   - Customizable section title

3. **DynamicBehindTheWorkSection.tsx**
   - Brand story section
   - Statistics display
   - Three-image layout

4. **DynamicShopBySection.tsx**
   - Product showcase cards
   - Optional badges (e.g., "12 MPH Speed")

5. **DynamicProductsSection.tsx** ⭐ NEW
   - Automatically fetches products by brand ID
   - Displays up to 8 products in a grid
   - Shows product images, prices, discounts
   - Add to cart and wishlist buttons
   - "View All Products" link to shop page

## Features

### Admin Features
✅ Create and manage brands
✅ Upload brand logos
✅ Set brand active/inactive status
✅ Custom brand page editor with live preview
✅ Image upload for all sections
✅ Enable/disable individual sections
✅ Add/remove category and product cards
✅ Configure badges and statistics

### Public Features
✅ SEO-optimized brand pages
✅ Dynamic URL routing by brand slug
✅ Responsive design
✅ Automatic product display from database
✅ Discount badges and stock status
✅ Smooth animations and hover effects
✅ Fallback content when no custom content exists

## Content Structure

### Brand Page Content JSON
```json
{
  "brandId": "1",
  "content": {
    "hero": {
      "enabled": true,
      "backgroundImage": "/images/brand-page/hero.png",
      "title": "Turn Your Home\nInto A Complete",
      "highlightedText": "Fitness Space",
      "description": "Premium fitness equipment for your home",
      "buttonText": "Shop Now",
      "buttonUrl": "/shop"
    },
    "categories": {
      "enabled": true,
      "sectionTitle": "Explore Categories",
      "items": [
        {
          "id": "cat-1",
          "name": "Treadmills",
          "image": "/images/categories/treadmill.png",
          "href": "/shop?category=treadmill"
        }
      ]
    },
    "behindTheWork": {
      "enabled": true,
      "title": "Thinking Behind the Work",
      "description": "Brand story...",
      "stats": [
        { "value": "51+", "label": "Years of Experience" },
        { "value": "1M+", "label": "Happy Customers" },
        { "value": "50+", "label": "Available In Countries" }
      ],
      "images": {
        "left": "/images/brand/left.png",
        "center": "/images/brand/center.png",
        "right": "/images/brand/right.png"
      }
    },
    "shopBy": {
      "enabled": true,
      "cards": [
        {
          "id": "card-1",
          "image": "/images/products/treadmill.png",
          "title": "T Series 16 Treadmill",
          "buttonText": "Shop Treadmill",
          "buttonUrl": "/shop?category=treadmill",
          "badge": {
            "enabled": true,
            "value": "12",
            "label": "MPH Speed"
          }
        }
      ]
    }
  },
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Next.js 15 Compatibility

### Fixed Issues
✅ **Params Promise Issue**: Updated all dynamic routes to await params
- `app/api/admin/brand-pages/[brandId]/route.ts`
- `app/(public)/brand/[slug]/page.tsx`

### Updated Pattern
```typescript
// Before (Next.js 14)
export async function GET(
  request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  const { brandId } = params;
}

// After (Next.js 15)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandId: string }> }
) {
  const { brandId } = await params;
}
```

## How to Use

### For Admins

1. **Create a Brand**
   - Go to `/admin/brands`
   - Click "Add Brand"
   - Fill in brand details (name, slug, logo, description)
   - Save

2. **Customize Brand Page**
   - Click the "Page" button on the brand card
   - Enable/disable sections as needed
   - Upload images for each section
   - Configure text, links, and buttons
   - Click "Save Changes"

3. **View Public Page**
   - Visit `/brand/[brand-slug]`
   - Example: `/brand/nordictrack`

### For Developers

1. **Add New Section Type**
   - Create component in `app/(public)/_components/brand/`
   - Add section to content interface
   - Update editor in `app/admin/dynamic-contents/brand-pages-db/[brandId]/page.tsx`
   - Add section to public page

2. **Customize Product Display**
   - Edit `DynamicProductsSection.tsx`
   - Modify product grid layout
   - Add filters or sorting
   - Customize product cards

## Database Integration

### Brand Data (Backend)
- Brands stored in backend database
- Fetched via API: `${NEXT_PUBLIC_API_URL}/api/brands`
- Fields: id, name, slug, logo, description, is_active

### Product Data (Backend)
- Products linked to brands via brand_id
- Fetched via API: `${NEXT_PUBLIC_API_URL}/api/products?brand_id=[id]`
- Automatically displayed on brand pages

### Custom Content (Local)
- Stored in: `public/content/brand-pages/[brandId].json`
- Managed through admin interface
- Can be migrated to database if needed

## Migration Path (Optional)

To move custom content to database:

1. Create `brand_page_contents` table
2. Update API routes to use database
3. Migrate existing JSON files to database
4. Update editor to save to database

## Testing

### Test Scenarios
1. ✅ Create new brand
2. ✅ Edit brand page content
3. ✅ View public brand page
4. ✅ Products display correctly
5. ✅ Enable/disable sections
6. ✅ Image uploads work
7. ✅ SEO metadata generated
8. ✅ Responsive on mobile

## Performance

- **Revalidation**: 1 hour (3600 seconds)
- **Image Optimization**: Next.js Image component
- **Caching**: Static generation with ISR
- **Loading States**: Skeleton loaders for products

## Future Enhancements

- [ ] Add recommended products section
- [ ] Add customer reviews section
- [ ] Add video section
- [ ] Add FAQ section
- [ ] Add brand comparison tool
- [ ] Add product filters on brand page
- [ ] Add brand story timeline
- [ ] Add social media integration
- [ ] Migrate content to database
- [ ] Add content versioning
- [ ] Add A/B testing capabilities

## Summary

✅ **Complete dynamic brand page system**
✅ **Admin can manage all brand content**
✅ **Products automatically sync from database**
✅ **SEO-friendly URLs using brand slugs**
✅ **Fully responsive design**
✅ **Next.js 15 compatible**
✅ **Easy to extend with new sections**

The system is now fully functional and ready for production use!
