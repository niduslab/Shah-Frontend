# Professional Page Builder System - Complete Guide

## 🎯 Overview

This is a professional, template-based page builder system that allows non-technical users to create and manage dynamic pages through an intuitive admin interface. The system supports multiple page types with pre-designed section templates.

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Page Types](#page-types)
3. [Section Templates](#section-templates)
4. [Admin Interface](#admin-interface)
5. [Frontend Implementation](#frontend-implementation)
6. [API Reference](#api-reference)
7. [Best Practices](#best-practices)

---

## 🏗️ System Architecture

### Core Components

```
┌─────────────────────────────────────────────────────┐
│                  Admin Interface                    │
│  ┌──────────────┐  ┌──────────────┐               │
│  │ Page Manager │  │Section Editor│               │
│  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                  Backend API                        │
│  ┌──────────────┐  ┌──────────────┐               │
│  │Pages Service │  │Template Svc  │               │
│  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                   Database                          │
│  ┌──────────────┐  ┌──────────────┐               │
│  │    Pages     │  │   Sections   │               │
│  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Frontend Renderer                      │
│  ┌──────────────┐  ┌──────────────┐               │
│  │Dynamic Pages │  │Section Comps │               │
│  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────┘
```

### Database Schema


**pages table:**
```sql
- id (primary key)
- title (string)
- slug (string, unique)
- type (enum: landing, brand, flash_deal, gallery, custom)
- meta_title (string, nullable)
- meta_description (text, nullable)
- is_active (boolean, default: true)
- sort_order (integer, default: 0)
- timestamps
```

**page_sections table:**
```sql
- id (primary key)
- page_id (foreign key → pages.id)
- section_type (string)
- title (string, nullable)
- content (json)
- settings (json, nullable)
- sort_order (integer)
- is_active (boolean, default: true)
- timestamps
```

---

## 📄 Page Types

### 1. Landing Page (`type: 'landing'`)

**Purpose:** Generic homepage, marketing campaigns, seasonal promotions

**Use Cases:**
- Homepage
- Summer Sale 2026
- Black Friday Campaign
- New Year Promotion

**Recommended Sections:**
1. Landing Hero Grid (4 sections OR video)
2. Category Cards (Two Column)
3. Pre-Order Showcase
4. Stats Section
5. CTA Section

**Example Structure:**
```json
{
  "title": "Home",
  "slug": "home",
  "type": "landing",
  "meta_title": "Premium Fitness Equipment Store",
  "sections": [
    { "section_type": "landing_hero_grid", "sort_order": 1 },
    { "section_type": "category_cards_two_column", "sort_order": 2 },
    { "section_type": "preorder_showcase", "sort_order": 3 }
  ]
}
```


---

### 2. Brand Page (`type: 'brand'`)

**Purpose:** Showcase specific brand products and story

**Connected to:** `brands` database table

**Use Cases:**
- NordicTrack Brand Page
- Peloton Brand Page
- ProForm Brand Page

**Recommended Sections:**
1. Brand Full Width CTA Banner (Hero)
2. Brand Category Grid
3. Brand Featured Products
4. Brand Content with Images
5. Brand Product Hero

**Example Structure:**
```json
{
  "title": "NordicTrack",
  "slug": "brands/nordictrack",
  "type": "brand",
  "meta_title": "NordicTrack - Premium Fitness Equipment",
  "sections": [
    { "section_type": "brand_full_width_cta", "sort_order": 1 },
    { "section_type": "brand_category_grid", "sort_order": 2 },
    { "section_type": "brand_featured_products", "sort_order": 3 },
    { "section_type": "brand_content_with_images", "sort_order": 4 },
    { "section_type": "brand_product_hero", "sort_order": 5 }
  ]
}
```

---

### 3. Flash Deal Page (`type: 'flash_deal'`)

**Purpose:** Time-sensitive promotional pages

**Use Cases:**
- 24-Hour Flash Sale
- Weekend Deals
- Limited Time Offers

**Recommended Sections:**
1. Banner (with countdown timer)
2. Product Grid
3. CTA Section

---

### 4. Gallery Page (`type: 'gallery'`)

**Purpose:** Image galleries, lookbooks, inspiration pages

**Recommended Sections:**
1. Hero Slider
2. Category Grid
3. Text Content

---

### 5. Custom Page (`type: 'custom'`)

**Purpose:** Flexible pages for unique requirements

**Use Cases:**
- About Us
- Contact
- Terms & Conditions


---

## 🧩 Section Templates

### Landing Page Templates

#### 1. Landing Hero Grid

**Template Type:** `landing_hero_grid`

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  ┌──────────┐  ┌────┐                  │
│  │          │  │Gear│                  │
│  │  Main    │  └────┘                  │
│  │  Hero    │  ┌────┐                  │
│  │  Card    │  │Wts │                  │
│  │          │  └────┘                  │
│  │  [CTA]   │  ┌────┐                  │
│  └──────────┘  │Pick│                  │
│                └────┘                  │
└─────────────────────────────────────────┘
```

**Features:**
- 4-section grid layout (1 large + 3 small cards)
- Optional video mode (replaces entire grid)
- Circular badge overlays
- Individual CTAs for each card

**Content Fields:**
```typescript
{
  use_video: boolean;
  video_url?: string;
  video_poster?: string;
  
  // Main card (large, left side)
  main_card_image: string;
  main_card_heading: string;
  main_card_subheading: string;
  main_card_badge?: string;
  main_card_badge_text?: string;
  main_card_cta_text: string;
  main_card_cta_link: string;
  
  // Top right card
  top_right_image: string;
  top_right_title: string;
  top_right_cta_text: string;
  top_right_cta_link: string;
  
  // Bottom left card
  bottom_left_image: string;
  bottom_left_title: string;
  bottom_left_cta_text: string;
  bottom_left_cta_link: string;
  
  // Bottom right card
  bottom_right_image: string;
  bottom_right_title: string;
  bottom_right_cta_text: string;
  bottom_right_cta_link: string;
}
```

**Settings:**
```typescript
{
  main_card_bg_overlay: boolean;
  text_color: string; // hex color
}
```


---

#### 2. Category Cards (Two Column)

**Template Type:** `category_cards_two_column`

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐   │
│  │   Cardio     │  │ Free Weights │   │
│  │  Equipment   │  │  Equipment   │   │
│  │              │  │              │   │
│  │ [Save 45%]   │  │  [Up to 30%] │   │
│  │ [Shop Now]   │  │  [Shop Now]  │   │
│  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────┘
```

**Features:**
- Two large category cards side-by-side
- Circular badge overlays
- Full-width background images
- Description text support

**Content Fields:**
```typescript
{
  // Left card
  left_card_image: string;
  left_card_title: string;
  left_card_description: string;
  left_card_badge?: string;
  left_card_cta_text: string;
  left_card_cta_link: string;
  
  // Right card
  right_card_image: string;
  right_card_title: string;
  right_card_description: string;
  right_card_badge?: string;
  right_card_cta_text: string;
  right_card_cta_link: string;
}
```

**Settings:**
```typescript
{
  card_height: 'small' | 'medium' | 'large';
  gap: 'small' | 'medium' | 'large';
}
```

---

#### 3. Pre-Order Showcase

**Template Type:** `preorder_showcase`

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  Pre-Order Now & Save Big               │
│                    [View All →]         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │30% │ │    │ │    │ │    │          │
│  │OFF │ │    │ │    │ │    │          │
│  │    │ │    │ │    │ │    │          │
│  │Prod│ │Prod│ │Prod│ │Prod│          │
│  │• • │ │    │ │    │ │    │          │
│  └────┘ └────┘ └────┘ └────┘          │
└─────────────────────────────────────────┘
```

**Features:**
- Product grid (2-6 columns)
- Circular "Save X%" badges
- Carousel indicators (dots)
- "View All" link

**Content Fields:**
```typescript
{
  section_heading: string;
  view_all_text: string;
  view_all_link: string;
  products: Array<{
    image: string;
    title: string;
    badge?: string;
    cta_text: string;
    cta_link: string;
    has_carousel: boolean;
  }>;
}
```

**Settings:**
```typescript
{
  background_color: string;
  grid_columns: 2 | 3 | 4 | 5 | 6;
}
```


---

### Brand Page Templates

#### 4. Brand Full Width CTA Banner

**Template Type:** `brand_full_width_cta`

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  ╔═══════════════════════════════════╗ │
│  ║ [Background Image]                ║ │
│  ║                                   ║ │
│  ║ Turn Your Home Into A Complete    ║ │
│  ║ Fitness Space [Yellow Text]       ║ │
│  ║                                   ║ │
│  ║ Brand description text...         ║ │
│  ║                                   ║ │
│  ║ [Shop Brand →]                    ║ │
│  ╚═══════════════════════════════════╝ │
└─────────────────────────────────────────┘
```

**Features:**
- Full-width hero banner
- Background image with overlay
- Colored subheading support
- Brand logo optional

**Content Fields:**
```typescript
{
  brand_id?: number;
  background_image: string;
  logo?: string;
  heading: string;
  subheading: string;
  subheading_color: string; // hex color
  description: string;
  cta_text: string;
  cta_link: string;
}
```

**Settings:**
```typescript
{
  height: 'small' | 'medium' | 'large';
  text_position: 'left' | 'center' | 'right';
  text_color: string;
  overlay_opacity: number; // 0-100
}
```

---

#### 5. Brand Category Grid

**Template Type:** `brand_category_grid`

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  ╔═══════════════════════════════════╗ │
│  ║ [Dark Background]                 ║ │
│  ║                                   ║ │
│  ║ Explore The Brand Categories      ║ │
│  ║                                   ║ │
│  ║ ┌────┐ ┌────┐ ┌────┐ ┌────┐     ║ │
│  ║ │Bike│ │Tred│ │Elip│ │Rowr│     ║ │
│  ║ └────┘ └────┘ └────┘ └────┘     ║ │
│  ╚═══════════════════════════════════╝ │
└─────────────────────────────────────────┘
```

**Features:**
- Dark background (#2c2c2c default)
- 2-6 column grid
- Category images with titles
- Hover effects

**Content Fields:**
```typescript
{
  brand_id?: number;
  section_title: string;
  background_color: string;
  text_color: string;
  categories: Array<{
    image: string;
    title: string;
    link: string;
    product_count?: number;
  }>;
}
```

**Settings:**
```typescript
{
  columns: 2 | 3 | 4 | 5 | 6;
  show_product_count: boolean;
  hover_effect: 'none' | 'zoom' | 'lift';
}
```


---

#### 6. Brand Featured Products

**Template Type:** `brand_featured_products`

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐   │
│  │              │  │              │   │
│  │  Treadmill   │  │  Elliptical  │   │
│  │              │  │              │   │
│  │ [12 MPH]     │  │              │   │
│  │ [Shop Now]   │  │  [Shop Now]  │   │
│  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────┘
```

**Features:**
- Two large product cards
- Badge support
- Individual CTAs

**Content Fields:**
```typescript
{
  brand_id?: number;
  
  // Left product
  left_product_image: string;
  left_product_title: string;
  left_product_badge?: string;
  left_product_cta_text: string;
  left_product_cta_link: string;
  
  // Right product
  right_product_image: string;
  right_product_title: string;
  right_product_badge?: string;
  right_product_cta_text: string;
  right_product_cta_link: string;
}
```

---

#### 7. Brand Content with Images

**Template Type:** `brand_content_with_images`

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────────────┐   │
│  │ Thinking │  │ ┌────┐  ┌────┐  │   │
│  │ Behind   │  │ │Img1│  │Img2│  │   │
│  │ the Work │  │ └────┘  └────┘  │   │
│  │          │  │                  │   │
│  │ Text...  │  │ ┌────┐          │   │
│  │          │  │ │Img3│          │   │
│  │ 51+      │  │ └────┘          │   │
│  │ Years    │  │                  │   │
│  │          │  │                  │   │
│  │ 1M+      │  │                  │   │
│  │ Customers│  │                  │   │
│  └──────────┘  └──────────────────┘   │
└─────────────────────────────────────────┘
```

**Features:**
- Text content + image collage
- Stats display
- Flexible image layout

**Content Fields:**
```typescript
{
  brand_id?: number;
  heading: string;
  description: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  images: Array<{
    image: string;
    alt_text: string;
  }>;
}
```

**Settings:**
```typescript
{
  background_color?: string;
  layout: 'text_left' | 'text_right';
}
```


---

#### 8. Brand Product Hero

**Template Type:** `brand_product_hero`

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  ┌──────┐    ┌──────────────────────┐ │
│  │      │    │ Smart Rowing.        │ │
│  │ Prod │    │ Full-Body Results.   │ │
│  │ Image│    │ Real Progress.       │ │
│  │      │    │                      │ │
│  └──────┘    │ Description text...  │ │
│              │                      │ │
│              │ [Shop Rowers →]      │ │
│              └──────────────────────┘ │
└─────────────────────────────────────────┘
```

**Features:**
- Side-by-side layout
- Product image + content
- Background color support

**Content Fields:**
```typescript
{
  brand_id?: number;
  product_image: string;
  heading: string;
  subheading?: string;
  description: string;
  cta_text: string;
  cta_link: string;
  background_color?: string;
}
```

**Settings:**
```typescript
{
  layout: 'image_left' | 'image_right';
  image_width: '40%' | '50%' | '60%';
}
```

---

### Shared Templates

#### 9. Stats Section

**Template Type:** `stats_section`

**Content Fields:**
```typescript
{
  stats: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
}
```

---

#### 10. Category Grid

**Template Type:** `category_grid`

**Content Fields:**
```typescript
{
  section_title?: string;
  categories: Array<{
    name: string;
    image: string;
    link: string;
    product_count?: number;
  }>;
}
```

**Settings:**
```typescript
{
  columns: 2 | 3 | 4 | 5 | 6;
  show_border: boolean;
  hover_effect: 'none' | 'zoom' | 'lift';
  show_product_count: boolean;
}
```

---

#### 11. Full Width Banner

**Template Type:** `full_width_banner`

**Content Fields:**
```typescript
{
  image: string;
  title: string;
  subtitle?: string;
  cta_text: string;
  cta_link: string;
  countdown?: {
    enabled: boolean;
    end_date: string; // ISO 8601
  };
}
```

**Settings:**
```typescript
{
  full_width: boolean;
  height: string; // e.g., "400px"
}
```


---

## 🎨 Admin Interface

### Page Management

#### Creating a Page

1. Navigate to **Admin → Dynamic Pages**
2. Click **"Create Page"** button
3. Fill in page details:
   - **Title:** Display name (e.g., "Home", "NordicTrack")
   - **Slug:** URL path (e.g., "home", "brands/nordictrack")
   - **Type:** Select page type (landing, brand, etc.)
   - **Meta Title:** SEO title
   - **Meta Description:** SEO description
   - **Is Active:** Publish status
   - **Sort Order:** Display order
4. Click **"Create"**

#### Managing Sections

1. From the pages list, click **"Manage Sections"** (Layers icon)
2. Click **"Add Section"** to create a new section
3. Select **Section Type** from dropdown
4. Fill in section details:
   - **Title:** Optional section name
   - **Content:** JSON content (use template schema)
   - **Settings:** JSON settings (optional)
   - **Sort Order:** Display order
   - **Is Active:** Visibility status
5. Click **"Save"**

#### Reordering Sections

- **Drag & Drop:** Click and drag the grip icon (⋮⋮) to reorder sections
- Changes save automatically

#### Editing Content

1. Click the **"Edit Content"** button (Code icon)
2. Use the JSON editor to modify content
3. Click **"Save"** to apply changes

**Pro Tip:** Use the template schema as a reference for required fields.

---

### Visual Section Editor (Recommended)

For a better user experience, implement a visual editor with:

1. **Form-based inputs** instead of raw JSON
2. **Image upload** with preview
3. **Color pickers** for color fields
4. **WYSIWYG editor** for text content
5. **Live preview** of changes

**Example Implementation:**

```typescript
// Visual editor for Landing Hero Grid
function LandingHeroGridEditor({ content, onChange }) {
  return (
    <div className="space-y-6">
      {/* Video Toggle */}
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={content.use_video}
            onChange={(e) => onChange({ ...content, use_video: e.target.checked })}
          />
          Use Video Instead of Grid
        </label>
      </div>

      {content.use_video ? (
        <>
          <ImageUpload
            label="Video URL"
            value={content.video_url}
            onChange={(url) => onChange({ ...content, video_url: url })}
          />
          <ImageUpload
            label="Video Poster"
            value={content.video_poster}
            onChange={(url) => onChange({ ...content, video_poster: url })}
          />
        </>
      ) : (
        <>
          {/* Main Card */}
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-4">Main Card (Large)</h3>
            <ImageUpload
              label="Image"
              value={content.main_card_image}
              onChange={(url) => onChange({ ...content, main_card_image: url })}
            />
            <Input
              label="Heading"
              value={content.main_card_heading}
              onChange={(e) => onChange({ ...content, main_card_heading: e.target.value })}
            />
            <Input
              label="Subheading"
              value={content.main_card_subheading}
              onChange={(e) => onChange({ ...content, main_card_subheading: e.target.value })}
            />
            {/* ... more fields */}
          </div>

          {/* Top Right Card */}
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-4">Top Right Card</h3>
            {/* ... fields */}
          </div>

          {/* Bottom Left Card */}
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-4">Bottom Left Card</h3>
            {/* ... fields */}
          </div>

          {/* Bottom Right Card */}
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-4">Bottom Right Card</h3>
            {/* ... fields */}
          </div>
        </>
      )}
    </div>
  );
}
```


---

## 🖥️ Frontend Implementation

### Dynamic Page Renderer

```typescript
// app/(public)/[slug]/page.tsx
import { notFound } from 'next/navigation';
import SectionRenderer from '@/components/sections/SectionRenderer';

interface PageProps {
  params: { slug: string };
}

async function getPage(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages/${slug}`, {
    next: { revalidate: 60 } // Cache for 60 seconds
  });
  
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: PageProps) {
  const page = await getPage(params.slug);
  
  if (!page) return {};
  
  return {
    title: page.meta_title || page.title,
    description: page.meta_description || '',
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await getPage(params.slug);
  
  if (!page || !page.is_active) {
    notFound();
  }
  
  return (
    <div className="dynamic-page">
      {page.sections
        .filter((section: any) => section.is_active)
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((section: any) => (
          <SectionRenderer
            key={section.id}
            type={section.section_type}
            content={section.content}
            settings={section.settings}
          />
        ))}
    </div>
  );
}
```

---

### Section Renderer Component

```typescript
// components/sections/SectionRenderer.tsx
import LandingHeroGrid from './LandingHeroGrid';
import CategoryCardsTwoColumn from './CategoryCardsTwoColumn';
import PreorderShowcase from './PreorderShowcase';
import BrandFullWidthCTA from './BrandFullWidthCTA';
import BrandCategoryGrid from './BrandCategoryGrid';
import BrandFeaturedProducts from './BrandFeaturedProducts';
import BrandContentWithImages from './BrandContentWithImages';
import BrandProductHero from './BrandProductHero';
import StatsSection from './StatsSection';
import CategoryGrid from './CategoryGrid';
import FullWidthBanner from './FullWidthBanner';

const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  landing_hero_grid: LandingHeroGrid,
  category_cards_two_column: CategoryCardsTwoColumn,
  preorder_showcase: PreorderShowcase,
  brand_full_width_cta: BrandFullWidthCTA,
  brand_category_grid: BrandCategoryGrid,
  brand_featured_products: BrandFeaturedProducts,
  brand_content_with_images: BrandContentWithImages,
  brand_product_hero: BrandProductHero,
  stats_section: StatsSection,
  category_grid: CategoryGrid,
  full_width_banner: FullWidthBanner,
};

interface SectionRendererProps {
  type: string;
  content: any;
  settings?: any;
}

export default function SectionRenderer({ type, content, settings }: SectionRendererProps) {
  const Component = SECTION_COMPONENTS[type];
  
  if (!Component) {
    console.warn(`Unknown section type: ${type}`);
    return null;
  }
  
  return <Component content={content} settings={settings} />;
}
```


---

### Example Section Component

```typescript
// components/sections/LandingHeroGrid.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LandingHeroGridProps {
  content: {
    use_video: boolean;
    video_url?: string;
    video_poster?: string;
    main_card_image: string;
    main_card_heading: string;
    main_card_subheading: string;
    main_card_badge?: string;
    main_card_badge_text?: string;
    main_card_cta_text: string;
    main_card_cta_link: string;
    top_right_image: string;
    top_right_title: string;
    top_right_cta_text: string;
    top_right_cta_link: string;
    bottom_left_image: string;
    bottom_left_title: string;
    bottom_left_cta_text: string;
    bottom_left_cta_link: string;
    bottom_right_image: string;
    bottom_right_title: string;
    bottom_right_cta_text: string;
    bottom_right_cta_link: string;
  };
  settings?: {
    main_card_bg_overlay?: boolean;
    text_color?: string;
  };
}

export default function LandingHeroGrid({ content, settings }: LandingHeroGridProps) {
  // Video mode
  if (content.use_video) {
    return (
      <section className="landing-hero-video">
        <video
          src={content.video_url}
          poster={content.video_poster}
          controls
          autoPlay
          muted
          loop
          className="w-full h-screen object-cover"
        />
      </section>
    );
  }

  // Grid mode
  return (
    <section className="landing-hero-grid py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
          {/* Main Card - spans 2 columns and 3 rows */}
          <div className="lg:col-span-2 lg:row-span-3 relative overflow-hidden rounded-2xl group">
            <Image
              src={content.main_card_image}
              alt={content.main_card_heading}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {settings?.main_card_bg_overlay && (
              <div className="absolute inset-0 bg-black/40" />
            )}
            <div className="absolute inset-0 flex flex-col justify-center items-start p-12 text-white">
              <h1 className="text-5xl font-bold mb-2">{content.main_card_heading}</h1>
              <h2 className="text-4xl font-bold mb-6">{content.main_card_subheading}</h2>
              
              {content.main_card_badge && (
                <div className="absolute top-8 right-8 w-32 h-32 bg-orange-500 rounded-full flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold">{content.main_card_badge}</span>
                  <span className="text-sm">{content.main_card_badge_text}</span>
                </div>
              )}
              
              <Link
                href={content.main_card_cta_link}
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                {content.main_card_cta_text}
              </Link>
            </div>
          </div>

          {/* Top Right Card */}
          <div className="relative overflow-hidden rounded-2xl group">
            <Image
              src={content.top_right_image}
              alt={content.top_right_title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-bold mb-3">{content.top_right_title}</h3>
              <Link
                href={content.top_right_cta_link}
                className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-center"
              >
                {content.top_right_cta_text}
              </Link>
            </div>
          </div>

          {/* Bottom Left Card */}
          <div className="relative overflow-hidden rounded-2xl group">
            <Image
              src={content.bottom_left_image}
              alt={content.bottom_left_title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-bold mb-3">{content.bottom_left_title}</h3>
              <Link
                href={content.bottom_left_cta_link}
                className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-center"
              >
                {content.bottom_left_cta_text}
              </Link>
            </div>
          </div>

          {/* Bottom Right Card */}
          <div className="relative overflow-hidden rounded-2xl group">
            <Image
              src={content.bottom_right_image}
              alt={content.bottom_right_title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-bold mb-3">{content.bottom_right_title}</h3>
              <Link
                href={content.bottom_right_cta_link}
                className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-center"
              >
                {content.bottom_right_cta_text}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```


---

## 📡 API Reference

### Public Endpoints (No Auth Required)

#### Get Page by Slug
```http
GET /api/pages/{slug}
```

**Response:**
```json
{
  "id": 1,
  "title": "Home",
  "slug": "home",
  "type": "landing",
  "meta_title": "Premium Fitness Equipment",
  "meta_description": "Shop the best fitness equipment",
  "is_active": true,
  "sections": [
    {
      "id": 1,
      "section_type": "landing_hero_grid",
      "title": null,
      "content": { ... },
      "settings": { ... },
      "sort_order": 1,
      "is_active": true
    }
  ]
}
```

---

### Admin Endpoints (Auth Required)

#### List Pages
```http
GET /api/admin/pages?page=1&per_page=15&type=landing
```

#### Create Page
```http
POST /api/admin/pages
Content-Type: application/json

{
  "title": "Summer Sale",
  "slug": "summer-sale",
  "type": "landing",
  "meta_title": "Summer Sale 2026",
  "meta_description": "Best deals of the summer",
  "is_active": true,
  "sort_order": 0
}
```

#### Update Page
```http
PUT /api/admin/pages/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "is_active": false
}
```

#### Delete Page
```http
DELETE /api/admin/pages/{id}
```

#### List Page Sections
```http
GET /api/admin/pages/{pageId}/sections
```

#### Create Section
```http
POST /api/admin/pages/{pageId}/sections
Content-Type: application/json

{
  "section_type": "landing_hero_grid",
  "title": "Main Hero",
  "content": {
    "use_video": false,
    "main_card_image": "/images/hero.jpg",
    "main_card_heading": "Elevate Your Fitness",
    ...
  },
  "settings": {
    "main_card_bg_overlay": true,
    "text_color": "#ffffff"
  },
  "sort_order": 1,
  "is_active": true
}
```

#### Update Section
```http
PUT /api/admin/pages/{pageId}/sections/{sectionId}
Content-Type: application/json

{
  "content": { ... },
  "is_active": false
}
```

#### Delete Section
```http
DELETE /api/admin/pages/{pageId}/sections/{sectionId}
```

#### Reorder Sections
```http
POST /api/admin/pages/{pageId}/sections/reorder
Content-Type: application/json

{
  "sections": [
    { "id": 2, "sort_order": 1 },
    { "id": 1, "sort_order": 2 },
    { "id": 3, "sort_order": 3 }
  ]
}
```


---

## ✅ Best Practices

### Content Management

1. **Use Descriptive Titles**
   - Good: "Summer Sale 2026 - Homepage Hero"
   - Bad: "Section 1"

2. **Optimize Images**
   - Use WebP format when possible
   - Compress images before upload
   - Use appropriate dimensions (hero: 1920x1080, cards: 800x600)

3. **SEO Optimization**
   - Always fill meta_title and meta_description
   - Use descriptive slugs
   - Include keywords naturally

4. **Content Structure**
   - Keep hero sections above the fold
   - Place CTAs strategically
   - Use consistent spacing

5. **Mobile Responsiveness**
   - Test all sections on mobile devices
   - Use responsive images
   - Ensure text is readable on small screens

---

### Performance

1. **Caching**
   ```typescript
   // Next.js App Router
   export const revalidate = 60; // Revalidate every 60 seconds
   
   // Or use on-demand revalidation
   revalidatePath('/[slug]');
   ```

2. **Image Optimization**
   ```typescript
   import Image from 'next/image';
   
   <Image
     src={content.image}
     alt={content.title}
     width={800}
     height={600}
     loading="lazy"
     placeholder="blur"
   />
   ```

3. **Code Splitting**
   ```typescript
   // Lazy load section components
   const LandingHeroGrid = dynamic(() => import('./LandingHeroGrid'), {
     loading: () => <SectionSkeleton />,
   });
   ```

---

### Security

1. **Sanitize Content**
   ```typescript
   import DOMPurify from 'isomorphic-dompurify';
   
   function TextContent({ content }) {
     const sanitized = DOMPurify.sanitize(content.html);
     return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
   }
   ```

2. **Validate URLs**
   ```typescript
   function isValidUrl(url: string) {
     try {
       new URL(url);
       return true;
     } catch {
       return false;
     }
   }
   ```

3. **Rate Limiting**
   - Implement rate limiting on admin endpoints
   - Use CSRF protection
   - Validate all inputs

---

### Accessibility

1. **Alt Text**
   - Always provide descriptive alt text for images
   - Use empty alt="" for decorative images

2. **Keyboard Navigation**
   - Ensure all interactive elements are keyboard accessible
   - Use proper focus states

3. **ARIA Labels**
   ```typescript
   <button aria-label="Close modal">
     <X className="h-5 w-5" />
   </button>
   ```

4. **Color Contrast**
   - Ensure text has sufficient contrast (WCAG AA: 4.5:1)
   - Test with color blindness simulators

---

### Testing

1. **Unit Tests**
   ```typescript
   describe('SectionRenderer', () => {
     it('renders landing hero grid', () => {
       const { getByText } = render(
         <SectionRenderer
           type="landing_hero_grid"
           content={mockContent}
         />
       );
       expect(getByText('Elevate Your Fitness')).toBeInTheDocument();
     });
   });
   ```

2. **Integration Tests**
   - Test page creation flow
   - Test section reordering
   - Test publish/unpublish

3. **E2E Tests**
   ```typescript
   test('create and publish landing page', async ({ page }) => {
     await page.goto('/admin/dynamic-pages');
     await page.click('text=Create Page');
     await page.fill('[name="title"]', 'Test Page');
     await page.fill('[name="slug"]', 'test-page');
     await page.click('text=Create');
     await expect(page).toHaveURL('/admin/dynamic-pages');
   });
   ```

---

### Monitoring

1. **Analytics**
   ```typescript
   // Track page views
   useEffect(() => {
     analytics.track('Page Viewed', {
       page_id: page.id,
       page_type: page.type,
       page_slug: page.slug,
     });
   }, [page]);
   ```

2. **Error Tracking**
   ```typescript
   try {
     await createSection(data);
   } catch (error) {
     Sentry.captureException(error, {
       tags: { feature: 'page-builder' },
       extra: { pageId, sectionType },
     });
   }
   ```

3. **Performance Monitoring**
   - Track page load times
   - Monitor API response times
   - Set up alerts for slow queries


---

## 🚀 Quick Start Guide

### Step 1: Create Your First Landing Page

```bash
# Using cURL
curl -X POST http://localhost:8000/api/admin/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Home",
    "slug": "home",
    "type": "landing",
    "meta_title": "Premium Fitness Equipment Store",
    "meta_description": "Shop the best fitness equipment for your home gym",
    "is_active": true
  }'
```

### Step 2: Add Hero Section

```bash
curl -X POST http://localhost:8000/api/admin/pages/1/sections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "section_type": "landing_hero_grid",
    "content": {
      "use_video": false,
      "main_card_image": "/images/bike-hero.jpg",
      "main_card_heading": "Elevate Your",
      "main_card_subheading": "Fitness Journey",
      "main_card_badge": "Up to",
      "main_card_badge_text": "40% Discounts",
      "main_card_cta_text": "Shop Now",
      "main_card_cta_link": "/shop",
      "top_right_image": "/images/gear.jpg",
      "top_right_title": "Perfect Gear Awaits",
      "top_right_cta_text": "Shop Now",
      "top_right_cta_link": "/accessories",
      "bottom_left_image": "/images/weights.jpg",
      "bottom_left_title": "Shine Bright with Weights",
      "bottom_left_cta_text": "Shop Now",
      "bottom_left_cta_link": "/weights",
      "bottom_right_image": "/images/top-picks.jpg",
      "bottom_right_title": "TOP PICKS",
      "bottom_right_cta_text": "Shop Now",
      "bottom_right_cta_link": "/featured"
    },
    "settings": {
      "main_card_bg_overlay": true,
      "text_color": "#ffffff"
    },
    "sort_order": 1,
    "is_active": true
  }'
```

### Step 3: Add Category Cards

```bash
curl -X POST http://localhost:8000/api/admin/pages/1/sections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "section_type": "category_cards_two_column",
    "content": {
      "left_card_image": "/images/cardio.jpg",
      "left_card_title": "Cardio Equipment",
      "left_card_description": "Burn calories and boost endurance",
      "left_card_badge": "Save all 45%",
      "left_card_cta_text": "Shop Now",
      "left_card_cta_link": "/cardio",
      "right_card_image": "/images/weights.jpg",
      "right_card_title": "Free Weight Equipment",
      "right_card_description": "Build strength and muscle",
      "right_card_badge": "Up to 30%",
      "right_card_cta_text": "Shop Now",
      "right_card_cta_link": "/weights"
    },
    "settings": {
      "card_height": "large",
      "gap": "medium"
    },
    "sort_order": 2,
    "is_active": true
  }'
```

### Step 4: View Your Page

Visit: `http://localhost:3000/home`

---

## 🎓 Advanced Features

### Dynamic Content Loading

```typescript
// Load products dynamically in sections
async function PreorderShowcase({ content, settings }) {
  const products = await fetch('/api/products?preorder=true').then(r => r.json());
  
  return (
    <section className="preorder-showcase">
      <h2>{content.section_heading}</h2>
      <div className="grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
```

### A/B Testing

```typescript
// Implement A/B testing for sections
function SectionRenderer({ type, content, settings }) {
  const variant = useABTest('hero-section', ['A', 'B']);
  
  if (type === 'landing_hero_grid' && variant === 'B') {
    // Show alternative version
    return <LandingHeroGridVariantB content={content} settings={settings} />;
  }
  
  return <LandingHeroGrid content={content} settings={settings} />;
}
```

### Personalization

```typescript
// Personalize content based on user data
function PersonalizedHero({ content, settings }) {
  const user = useUser();
  
  const personalizedContent = {
    ...content,
    main_card_heading: user ? `Welcome back, ${user.name}!` : content.main_card_heading,
  };
  
  return <LandingHeroGrid content={personalizedContent} settings={settings} />;
}
```

### Multi-language Support

```typescript
// Add language support
interface LocalizedContent {
  en: any;
  es: any;
  fr: any;
}

function LocalizedSection({ type, content, settings }) {
  const { locale } = useRouter();
  const localizedContent = content[locale] || content.en;
  
  return <SectionRenderer type={type} content={localizedContent} settings={settings} />;
}
```

---

## 📊 Metrics & KPIs

### Track These Metrics

1. **Page Performance**
   - Page load time
   - Time to interactive
   - Largest contentful paint

2. **User Engagement**
   - Bounce rate
   - Time on page
   - Scroll depth
   - CTA click-through rate

3. **Content Effectiveness**
   - Conversion rate by section
   - A/B test results
   - Heat maps

4. **Admin Efficiency**
   - Time to create a page
   - Number of pages created per week
   - Section reuse rate

---

## 🔧 Troubleshooting

### Common Issues

**Issue:** Section not rendering
```typescript
// Check console for errors
console.log('Section type:', section.section_type);
console.log('Available components:', Object.keys(SECTION_COMPONENTS));
```

**Issue:** Images not loading
```typescript
// Verify image paths
console.log('Image URL:', content.main_card_image);
// Check if URL is absolute or relative
```

**Issue:** Content not updating
```typescript
// Clear cache
revalidatePath('/[slug]');
// Or force refresh
router.refresh();
```

---

## 📚 Additional Resources

- [Landing Page Complete Guide](./LANDING_PAGE_COMPLETE_GUIDE.md)
- [Brand Page Complete Guide](./BRAND_PAGE_COMPLETE_GUIDE.md)
- [Frontend Dynamic Pages Guide](./FRONTEND_DYNAMIC_PAGES_GUIDE.md)
- [API Integration Complete](./API_INTEGRATION_COMPLETE.md)

---

## 🎉 Summary

You now have a professional page builder system with:

✅ **5 Page Types** - Landing, Brand, Flash Deal, Gallery, Custom
✅ **11+ Section Templates** - Pre-designed, reusable components
✅ **Admin Interface** - Easy-to-use management panel
✅ **Frontend Renderer** - Dynamic page rendering
✅ **API Endpoints** - Complete REST API
✅ **Best Practices** - Performance, security, accessibility
✅ **Documentation** - Comprehensive guides

**Ready to build amazing pages!** 🚀

