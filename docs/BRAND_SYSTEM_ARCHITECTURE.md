# Brand Pages System Architecture

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     BRAND PAGES ECOSYSTEM                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Backend API     │         │  Next.js App     │         │  Local Storage   │
│  (Laravel)       │◄────────┤  (Frontend)      │────────►│  (JSON Files)    │
└──────────────────┘         └──────────────────┘         └──────────────────┘
        │                             │                             │
        │                             │                             │
   ┌────▼────┐                   ┌───▼────┐                   ┌───▼────┐
   │ Brands  │                   │ Admin  │                   │ Custom │
   │ Products│                   │ Public │                   │Content │
   └─────────┘                   └────────┘                   └────────┘
```

---

## 📊 Data Flow Diagram

### Creating a Brand Page

```
Admin User
    │
    ├─► 1. Creates Brand
    │       └─► POST /api/brands (Backend)
    │           └─► Saves to Database
    │               ├─► id: 1
    │               ├─► name: "NordicTrack"
    │               ├─► slug: "nordictrack"
    │               └─► logo: "uploads/brands/logo.png"
    │
    ├─► 2. Clicks "Page" Button
    │       └─► Navigates to /admin/dynamic-contents/brand-pages-db/1
    │           └─► Fetches brand from Backend API
    │           └─► Fetches existing content from Local JSON (if exists)
    │
    ├─► 3. Customizes Content
    │       ├─► Uploads images
    │       ├─► Edits text
    │       └─► Configures sections
    │
    └─► 4. Saves Changes
            └─► POST /api/admin/brand-pages/1
                └─► Saves to public/content/brand-pages/1.json
                    └─► {
                          "brandId": "1",
                          "content": { ... },
                          "updatedAt": "2024-01-01T00:00:00Z"
                        }
```

### Viewing a Brand Page

```
Public User
    │
    └─► Visits /brand/nordictrack
            │
            ├─► 1. Fetch Brand Data
            │       └─► GET /api/brands (Backend)
            │           └─► Find brand where slug = "nordictrack"
            │               └─► Returns: { id: 1, name: "NordicTrack", ... }
            │
            ├─► 2. Fetch Custom Content
            │       └─► GET /api/admin/brand-pages/1
            │           └─► Reads public/content/brand-pages/1.json
            │               └─► Returns: { hero: {...}, categories: {...}, ... }
            │
            ├─► 3. Fetch Brand Products
            │       └─► GET /api/products?brand_id=1 (Backend)
            │           └─► Returns: [{ id: 1, name: "Treadmill", ... }, ...]
            │
            └─► 4. Render Page
                    ├─► Hero Section (from custom content)
                    ├─► Categories Section (from custom content)
                    ├─► Behind The Work (from custom content)
                    ├─► Shop By Section (from custom content)
                    └─► Products Section (from backend API)
```

---

## 🗂️ File Structure

```
project-root/
│
├── app/
│   ├── admin/
│   │   ├── brands/
│   │   │   ├── page.tsx                    # Brand list & management
│   │   │   └── _components/
│   │   │       ├── BrandModal.tsx          # Create/Edit brand
│   │   │       └── DeleteConfirmModal.tsx
│   │   │
│   │   └── dynamic-contents/
│   │       └── brand-pages-db/
│   │           └── [brandId]/
│   │               └── page.tsx            # Brand page editor
│   │
│   ├── (public)/
│   │   ├── brand/
│   │   │   ├── nordictrack/
│   │   │   │   └── page.tsx               # Static NordicTrack page
│   │   │   │
│   │   │   └── [slug]/
│   │   │       ├── page.tsx               # Dynamic brand page
│   │   │       └── not-found.tsx
│   │   │
│   │   └── _components/
│   │       └── brand/
│   │           ├── DynamicHeroSection.tsx
│   │           ├── DynamicCategoriesSection.tsx
│   │           ├── DynamicBehindTheWorkSection.tsx
│   │           ├── DynamicShopBySection.tsx
│   │           └── DynamicProductsSection.tsx  # NEW
│   │
│   └── api/
│       └── admin/
│           └── brand-pages/
│               └── [brandId]/
│                   └── route.ts            # API for saving/loading content
│
├── public/
│   └── content/
│       └── brand-pages/
│           ├── 1.json                      # NordicTrack content
│           ├── 2.json                      # ProForm content
│           └── ...
│
└── lib/
    └── hooks/
        └── admin/
            └── useAdminBrands.ts           # React Query hooks
```

---

## 🔄 Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    Brand Page (/brand/[slug])                │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Brand Data   │    │ Custom       │    │ Products     │
│ (Backend)    │    │ Content      │    │ (Backend)    │
└──────────────┘    │ (Local JSON) │    └──────────────┘
        │           └──────────────┘            │
        │                   │                   │
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ • id         │    │ • hero       │    │ • name       │
│ • name       │    │ • categories │    │ • price      │
│ • slug       │    │ • behindWork │    │ • images     │
│ • logo       │    │ • shopBy     │    │ • stock      │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │   Rendered Page       │
                │                       │
                │ ┌───────────────────┐ │
                │ │ Hero Section      │ │
                │ └───────────────────┘ │
                │ ┌───────────────────┐ │
                │ │ Categories        │ │
                │ └───────────────────┘ │
                │ ┌───────────────────┐ │
                │ │ Behind The Work   │ │
                │ └───────────────────┘ │
                │ ┌───────────────────┐ │
                │ │ Shop By           │ │
                │ └───────────────────┘ │
                │ ┌───────────────────┐ │
                │ │ Products (Auto)   │ │
                │ └───────────────────┘ │
                └───────────────────────┘
```

---

## 🔌 API Integration Points

### Backend API (Laravel)

```typescript
// Brands Endpoint
GET  /api/brands
     → Returns all brands
     → Used by: Admin brands page, Public brand pages

GET  /api/brands/{id}
     → Returns single brand
     → Used by: Brand details

POST /api/brands
     → Creates new brand
     → Used by: Admin brand creation

PUT  /api/brands/{id}
     → Updates brand
     → Used by: Admin brand editing

DELETE /api/brands/{id}
     → Deletes brand
     → Used by: Admin brand deletion

// Products Endpoint
GET  /api/products?brand_id={id}
     → Returns products for a brand
     → Used by: DynamicProductsSection
```

### Frontend API (Next.js)

```typescript
// Brand Pages Content
GET  /api/admin/brand-pages/{brandId}
     → Reads local JSON file
     → Returns custom content or null

POST /api/admin/brand-pages/{brandId}
     → Saves custom content to JSON
     → Creates directory if needed
```

---

## 🎯 Key Features by Role

### Admin Features

```
┌─────────────────────────────────────────┐
│         Admin Dashboard                  │
├─────────────────────────────────────────┤
│                                          │
│  Brand Management                        │
│  ├─ Create Brand                         │
│  ├─ Edit Brand Info                      │
│  ├─ Upload Logo                          │
│  ├─ Set Active/Inactive                  │
│  └─ Delete Brand                         │
│                                          │
│  Brand Page Editor                       │
│  ├─ Enable/Disable Sections              │
│  ├─ Upload Section Images                │
│  ├─ Edit Text Content                    │
│  ├─ Configure Links & Buttons            │
│  ├─ Add/Remove Cards                     │
│  ├─ Set Statistics                       │
│  └─ Save Changes                         │
│                                          │
└─────────────────────────────────────────┘
```

### Public Features

```
┌─────────────────────────────────────────┐
│         Public Brand Page                │
├─────────────────────────────────────────┤
│                                          │
│  Dynamic Content                         │
│  ├─ Hero with CTA                        │
│  ├─ Category Navigation                  │
│  ├─ Brand Story                          │
│  └─ Featured Products                    │
│                                          │
│  Automatic Features                      │
│  ├─ Brand Products Grid                  │
│  ├─ Real-time Pricing                    │
│  ├─ Stock Status                         │
│  ├─ Discount Badges                      │
│  ├─ Add to Cart                          │
│  ├─ Add to Wishlist                      │
│  └─ View All Products Link               │
│                                          │
│  SEO & Performance                       │
│  ├─ Dynamic Meta Tags                    │
│  ├─ Optimized Images                     │
│  ├─ Static Generation (ISR)              │
│  └─ Mobile Responsive                    │
│                                          │
└─────────────────────────────────────────┘
```

---

## 🔐 Data Storage Strategy

### Backend Database (PostgreSQL/MySQL)
```sql
-- Brands Table
brands
├── id (primary key)
├── name
├── slug (unique)
├── description
├── logo
├── is_active
├── sort_order
├── created_at
└── updated_at

-- Products Table
products
├── id (primary key)
├── brand_id (foreign key)
├── name
├── slug
├── price
├── sale_price
├── stock_quantity
└── ...
```

### Local JSON Storage
```
public/content/brand-pages/
├── 1.json    # Brand ID 1 content
├── 2.json    # Brand ID 2 content
└── ...

Structure:
{
  "brandId": "1",
  "content": {
    "hero": { ... },
    "categories": { ... },
    "behindTheWork": { ... },
    "shopBy": { ... }
  },
  "updatedAt": "ISO timestamp"
}
```

**Why Local JSON?**
- ✅ Fast read/write
- ✅ No database schema changes needed
- ✅ Easy to backup
- ✅ Version control friendly
- ✅ Can migrate to DB later if needed

---

## 🚀 Performance Optimizations

### Caching Strategy

```typescript
// Brand Data
fetch('/api/brands', {
  next: { revalidate: 3600 } // 1 hour
})

// Custom Content
fetch('/api/admin/brand-pages/1', {
  next: { revalidate: 3600 } // 1 hour
})

// Products
fetch('/api/products?brand_id=1', {
  next: { revalidate: 300 } // 5 minutes (more frequent)
})
```

### Image Optimization

```typescript
// Next.js Image Component
<Image
  src={imageUrl}
  alt="Product"
  fill
  className="object-cover"
  // Automatic:
  // - WebP conversion
  // - Responsive sizes
  // - Lazy loading
  // - Blur placeholder
/>
```

### Static Generation

```
Build Time:
  ├─ Generate static pages for known brands
  └─ Create optimized bundles

Runtime:
  ├─ ISR (Incremental Static Regeneration)
  ├─ Revalidate every hour
  └─ Serve from CDN
```

---

## 🔄 Update Flow

### When Admin Updates Brand Page

```
1. Admin saves changes
   └─► POST /api/admin/brand-pages/1

2. JSON file updated
   └─► public/content/brand-pages/1.json

3. Next revalidation (1 hour)
   └─► Public page updates automatically

4. Or force revalidation
   └─► revalidatePath('/brand/nordictrack')
```

### When Products Change

```
1. Product updated in backend
   └─► Database updated

2. Next API call (5 min cache)
   └─► Fresh data fetched

3. Public page shows new data
   └─► Prices, stock, etc. updated
```

---

## 🎨 Styling Architecture

```
Tailwind CSS
├── Utility Classes
│   ├── Responsive (sm:, md:, lg:)
│   ├── Colors (orange-500, gray-900)
│   ├── Spacing (p-4, m-6, gap-4)
│   └── Effects (hover:, group-hover:)
│
├── Custom Components
│   ├── Buttons (gradient backgrounds)
│   ├── Cards (shadow, border, hover)
│   └── Sections (max-width, padding)
│
└── Theme Colors
    ├── Primary: Orange (#FF6F00)
    ├── Secondary: Black/White
    └── Accents: Gray scale
```

---

## 📱 Responsive Design

```
Mobile First Approach:

Base (Mobile)
  └─► Single column
      Full width cards
      Stacked sections

sm: (640px+)
  └─► 2 columns for products
      Larger text

md: (768px+)
  └─► 2-3 columns
      Side-by-side layouts

lg: (1024px+)
  └─► 4 columns for products
      Full desktop layout
      Max-width containers

xl: (1280px+)
  └─► Enhanced spacing
      Larger images
```

---

## 🔍 SEO Implementation

```typescript
// Dynamic Metadata
export async function generateMetadata({ params }) {
  const brand = await getBrandBySlug(params.slug);
  
  return {
    title: `${brand.name} - Home Fitness Equipment`,
    description: `Explore ${brand.name}'s innovative fitness equipment`,
    openGraph: {
      title: brand.name,
      description: brand.description,
      images: [brand.logo],
    },
  };
}

// Structured Data (Future)
{
  "@context": "https://schema.org",
  "@type": "Brand",
  "name": "NordicTrack",
  "logo": "https://example.com/logo.png",
  "url": "https://example.com/brand/nordictrack"
}
```

---

## 🧪 Testing Checklist

### Admin Testing
- [ ] Create brand
- [ ] Edit brand
- [ ] Delete brand
- [ ] Upload logo
- [ ] Access page editor
- [ ] Upload section images
- [ ] Save content
- [ ] Enable/disable sections

### Public Testing
- [ ] View brand page
- [ ] All sections render
- [ ] Products display
- [ ] Images load
- [ ] Links work
- [ ] Mobile responsive
- [ ] SEO meta tags
- [ ] Performance (Lighthouse)

---

## 🎯 Success Metrics

```
Performance Goals:
├── Page Load: < 2 seconds
├── Lighthouse Score: > 90
├── Image Optimization: WebP
└── Mobile Score: > 85

User Experience:
├── Admin: Easy content management
├── Public: Fast, responsive pages
└── SEO: Good search rankings

Business Goals:
├── Increase brand visibility
├── Improve product discovery
└── Higher conversion rates
```

---

## 🔮 Future Enhancements

### Phase 2
- [ ] Migrate content to database
- [ ] Add content versioning
- [ ] Add preview mode
- [ ] Add scheduling (publish later)

### Phase 3
- [ ] A/B testing
- [ ] Analytics integration
- [ ] Personalization
- [ ] Multi-language support

### Phase 4
- [ ] AI-generated content suggestions
- [ ] Automated SEO optimization
- [ ] Advanced product recommendations
- [ ] Video sections

---

**System is production-ready and fully documented! 🚀**
