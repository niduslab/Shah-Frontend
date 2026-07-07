# Brand Pages - Visual Guide

## 🎯 Complete System at a Glance

```
┌────────────────────────────────────────────────────────────────────────┐
│                         BRAND PAGES SYSTEM                              │
│                                                                         │
│  Admin Creates → Customizes → Saves → Public Views                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📍 URL Map

```
YOUR WEBSITE
│
├── /admin/brands
│   │
│   ├─► List all brands
│   ├─► Create new brand
│   ├─► Edit brand info
│   └─► Click "Page" button ──────┐
│                                  │
│                                  ▼
├── /admin/dynamic-contents/brand-pages-db/[brandId]
│   │
│   ├─► Hero Section Editor
│   ├─► Categories Editor
│   ├─► Behind The Work Editor
│   ├─► Shop By Editor
│   └─► Save Changes ─────────────┐
│                                  │
│                                  ▼
└── /brand/[slug] ◄──────── Content Saved
    │
    ├─► Hero Section (custom)
    ├─► Categories (custom)
    ├─► Behind The Work (custom)
    ├─► Shop By (custom)
    └─► Products (automatic from DB)
```

---

## 🎨 Page Builder Flow

```
STEP 1: CREATE BRAND
┌─────────────────────────────────────┐
│  /admin/brands                       │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ + Add Brand                    │ │
│  └────────────────────────────────┘ │
│                                      │
│  Name: NordicTrack                   │
│  Slug: nordictrack                   │
│  Logo: [Upload]                      │
│  Active: ✅                          │
│                                      │
│  [Save Brand]                        │
└─────────────────────────────────────┘
            │
            ▼
STEP 2: CUSTOMIZE PAGE
┌─────────────────────────────────────┐
│  /admin/dynamic-contents/           │
│  brand-pages-db/1                   │
│                                      │
│  ┌─ Hero Section ──────────────┐    │
│  │ ✅ Enabled                   │    │
│  │ Background: [Upload Image]   │    │
│  │ Title: Turn Your Home...     │    │
│  │ Button: Shop Now             │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌─ Categories ─────────────────┐    │
│  │ ✅ Enabled                   │    │
│  │ [+ Add Category]             │    │
│  │ • Treadmills                 │    │
│  │ • Ellipticals                │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌─ Behind The Work ────────────┐    │
│  │ ✅ Enabled                   │    │
│  │ Title: Our Story             │    │
│  │ Stats: 40+ Years             │    │
│  └──────────────────────────────┘    │
│                                      │
│  [💾 Save Changes]                   │
└─────────────────────────────────────┘
            │
            ▼
STEP 3: PUBLIC PAGE
┌─────────────────────────────────────┐
│  /brand/nordictrack                  │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  🖼️ HERO SECTION            │   │
│  │  Turn Your Home Into A       │   │
│  │  Complete Fitness Space      │   │
│  │  [Shop Now]                  │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  📦 CATEGORIES               │   │
│  │  [Treadmills] [Ellipticals]  │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  📖 BEHIND THE WORK          │   │
│  │  Our Story...                │   │
│  │  40+ Years | 1M+ Customers   │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  🛍️ SHOP BY                 │   │
│  │  [T Series] [Commercial]     │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  🏷️ PRODUCTS (AUTO)         │   │
│  │  [Product 1] [Product 2]     │   │
│  │  [Product 3] [Product 4]     │   │
│  │  [View All Products]         │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🔄 Data Sources

```
PUBLIC BRAND PAGE
        │
        ├─────────────────┬─────────────────┬─────────────────┐
        │                 │                 │                 │
        ▼                 ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Brand Info   │  │ Custom       │  │ Products     │  │ Images       │
│              │  │ Content      │  │              │  │              │
│ FROM:        │  │ FROM:        │  │ FROM:        │  │ FROM:        │
│ Backend DB   │  │ Local JSON   │  │ Backend DB   │  │ Uploads      │
│              │  │              │  │              │  │              │
│ • Name       │  │ • Hero       │  │ • Name       │  │ • Hero BG    │
│ • Slug       │  │ • Categories │  │ • Price      │  │ • Logos      │
│ • Logo       │  │ • Story      │  │ • Stock      │  │ • Products   │
│ • Active     │  │ • Shop By    │  │ • Images     │  │ • Categories │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🎯 Section Breakdown

### Hero Section
```
┌────────────────────────────────────────────────────┐
│                                                     │
│  [Background Image - Full Width]                   │
│                                                     │
│  Turn Your Home                                    │
│  Into A Complete                                   │
│  Fitness Space  ← Orange gradient                  │
│                                                     │
│  Premium equipment for your home gym               │
│                                                     │
│  [Shop Now Button]                                 │
│                                                     │
└────────────────────────────────────────────────────┘

Admin Controls:
✅ Enable/Disable
📷 Background Image Upload
✏️ Title (supports \n for line breaks)
✏️ Highlighted Text
✏️ Description
✏️ Button Text & URL
```

### Categories Section
```
┌────────────────────────────────────────────────────┐
│                                                     │
│              Explore Categories                     │
│                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │ 🏃   │  │ 🚴   │  │ 🚣   │  │ 💪   │          │
│  │Tread │  │ Bike │  │Rower │  │Ellip │          │
│  └──────┘  └──────┘  └──────┘  └──────┘          │
│                                                     │
└────────────────────────────────────────────────────┘

Admin Controls:
✅ Enable/Disable
✏️ Section Title
➕ Add Category Card
  ├─ Upload Image
  ├─ Category Name
  └─ Link URL
🗑️ Remove Category
```

### Behind The Work Section
```
┌────────────────────────────────────────────────────┐
│                                                     │
│         Thinking Behind the Work                    │
│                                                     │
│  For over 40 years, NordicTrack has been...       │
│                                                     │
│  ┌────────┐  ┌────────┐  ┌────────┐              │
│  │  40+   │  │  1M+   │  │  50+   │              │
│  │ Years  │  │Customers│ │Countries│              │
│  └────────┘  └────────┘  └────────┘              │
│                                                     │
│  [Image]    [Image]    [Image]                     │
│   Left      Center      Right                      │
│                                                     │
└────────────────────────────────────────────────────┘

Admin Controls:
✅ Enable/Disable
✏️ Section Title
✏️ Description
✏️ 3 Statistics (Value + Label)
📷 3 Images Upload
```

### Shop By Section
```
┌────────────────────────────────────────────────────┐
│                                                     │
│  ┌─────────────────┐    ┌─────────────────┐       │
│  │                 │    │                 │       │
│  │  [Product Img]  │    │  [Product Img]  │       │
│  │                 │    │                 │       │
│  │  ┌──────────┐   │    │  ┌──────────┐   │       │
│  │  │ 12 MPH   │   │    │  │ Pro Grade│   │       │
│  │  │  Speed   │   │    │  │  Quality │   │       │
│  │  └──────────┘   │    │  └──────────┘   │       │
│  │                 │    │                 │       │
│  │  T Series 16    │    │  Commercial     │       │
│  │  Treadmill      │    │  Series         │       │
│  │                 │    │                 │       │
│  │ [Shop Treadmill]│    │ [Shop Commercial]│       │
│  └─────────────────┘    └─────────────────┘       │
│                                                     │
└────────────────────────────────────────────────────┘

Admin Controls:
✅ Enable/Disable
➕ Add Product Card
  ├─ Upload Image
  ├─ Product Title
  ├─ Button Text & URL
  └─ Optional Badge
      ├─ Enable Badge
      ├─ Badge Value (e.g., "12")
      └─ Badge Label (e.g., "MPH Speed")
🗑️ Remove Card
```

### Products Section (Automatic)
```
┌────────────────────────────────────────────────────┐
│                                                     │
│         NordicTrack Products                        │
│  Explore our collection of premium equipment       │
│                                                     │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐                  │
│  │ 📷 │  │ 📷 │  │ 📷 │  │ 📷 │                  │
│  │$999│  │$799│  │$599│  │$899│                  │
│  │[🛒]│  │[🛒]│  │[🛒]│  │[🛒]│                  │
│  └────┘  └────┘  └────┘  └────┘                  │
│                                                     │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐                  │
│  │ 📷 │  │ 📷 │  │ 📷 │  │ 📷 │                  │
│  │$699│  │$499│  │$899│  │$999│                  │
│  │[🛒]│  │[🛒]│  │[🛒]│  │[🛒]│                  │
│  └────┘  └────┘  └────┘  └────┘                  │
│                                                     │
│         [View All NordicTrack Products]            │
│                                                     │
└────────────────────────────────────────────────────┘

Features:
✅ Automatic (no admin config needed)
✅ Fetches from backend database
✅ Shows up to 8 products
✅ Real-time pricing
✅ Stock status
✅ Discount badges
✅ Add to cart button
✅ Link to full product list
```

---

## 🎨 Admin Interface Preview

```
BRAND LIST PAGE
┌─────────────────────────────────────────────────────┐
│  🏷️  Brands                          [+ Add Brand]  │
├─────────────────────────────────────────────────────┤
│  [Search brands...]                                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ [Logo]       │  │ [Logo]       │  │ [Logo]   │  │
│  │ NordicTrack  │  │ ProForm      │  │ Schwinn  │  │
│  │ nordictrack  │  │ proform      │  │ schwinn  │  │
│  │ ✅ Active    │  │ ✅ Active    │  │ ✅ Active│  │
│  │ 12 products  │  │ 8 products   │  │ 5 products│ │
│  │              │  │              │  │          │  │
│  │ [Edit][Page] │  │ [Edit][Page] │  │[Edit][Page]│ │
│  │ [Delete]     │  │ [Delete]     │  │ [Delete] │  │
│  └──────────────┘  └──────────────┘  └──────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

```
BRAND PAGE EDITOR
┌─────────────────────────────────────────────────────┐
│  ← Back to Brands                    [💾 Save]      │
│  NordicTrack - Brand Page                           │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─ Hero Section ────────────────────────── ✅ ─┐  │
│  │                                              │  │
│  │  Background Image:                           │  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │ [Click to upload or drag image here]   │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  │                                              │  │
│  │  Title:                                      │  │
│  │  [Turn Your Home\nInto A Complete]          │  │
│  │                                              │  │
│  │  Highlighted Text:                           │  │
│  │  [Fitness Space]                             │  │
│  │                                              │  │
│  │  Description:                                │  │
│  │  [Premium equipment for your home gym...]    │  │
│  │                                              │  │
│  │  Button Text:        Button URL:            │  │
│  │  [Shop Now]          [/shop]                │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌─ Categories Section ──────────────────── ✅ ─┐  │
│  │                                              │  │
│  │  Section Title: [Explore Categories]         │  │
│  │                                              │  │
│  │  [+ Add Category]                            │  │
│  │                                              │  │
│  │  ┌─ Category 1 ────────────────────── 🗑️ ─┐ │  │
│  │  │ Image: [Upload]                         │ │  │
│  │  │ Name: [Treadmills]                      │ │  │
│  │  │ Link: [/shop?category=treadmill]        │ │  │
│  │  └─────────────────────────────────────────┘ │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  [More sections...]                                 │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Views

```
DESKTOP (1280px+)
┌────────────────────────────────────────────────────┐
│  [Hero - Full Width]                               │
│  [Categories - 4 columns]                          │
│  [Behind Work - 3 images side by side]             │
│  [Shop By - 2 columns]                             │
│  [Products - 4 columns]                            │
└────────────────────────────────────────────────────┘

TABLET (768px)
┌──────────────────────────────┐
│  [Hero - Full Width]         │
│  [Categories - 2 columns]    │
│  [Behind Work - Stacked]     │
│  [Shop By - 2 columns]       │
│  [Products - 2 columns]      │
└──────────────────────────────┘

MOBILE (375px)
┌──────────────┐
│  [Hero]      │
│  [Categories]│
│  [1 column]  │
│  [Behind]    │
│  [Work]      │
│  [Shop By]   │
│  [1 column]  │
│  [Products]  │
│  [1 column]  │
└──────────────┘
```

---

## 🚀 Quick Start Checklist

```
□ Step 1: Create Brand
  □ Go to /admin/brands
  □ Click "Add Brand"
  □ Fill in name, slug, logo
  □ Save

□ Step 2: Customize Page
  □ Click "Page" button
  □ Enable sections you want
  □ Upload images
  □ Fill in text content
  □ Save changes

□ Step 3: Add Products
  □ In your backend
  □ Assign products to brand
  □ Set brand_id field

□ Step 4: View Public Page
  □ Visit /brand/[your-slug]
  □ Check all sections
  □ Verify products show
  □ Test on mobile

□ Step 5: Launch
  □ Set brand to active
  □ Share the URL
  □ Monitor analytics
```

---

## 🎯 Example: Complete NordicTrack Setup

```
1. CREATE BRAND
   Name: NordicTrack
   Slug: nordictrack
   Logo: nordictrack-logo.png
   Active: Yes

2. HERO SECTION
   Background: hero-gym.jpg
   Title: "Turn Your Home\nInto A Complete"
   Highlight: "Fitness Space"
   Button: "Shop Now" → /shop?brand=1

3. CATEGORIES (4 cards)
   • Treadmills → /shop?category=treadmill&brand=1
   • Ellipticals → /shop?category=elliptical&brand=1
   • Bikes → /shop?category=bike&brand=1
   • Rowers → /shop?category=rower&brand=1

4. BEHIND THE WORK
   Title: "Thinking Behind the Work"
   Description: "For over 40 years..."
   Stats:
   • 40+ Years of Innovation
   • 1M+ Happy Customers
   • 50+ Countries Worldwide
   Images: left.jpg, center.jpg, right.jpg

5. SHOP BY (2 cards)
   Card 1:
   • Image: t-series.jpg
   • Title: "T Series 16 Treadmill"
   • Button: "Shop Treadmill"
   • Badge: "12 MPH Speed"
   
   Card 2:
   • Image: commercial.jpg
   • Title: "Commercial Series"
   • Button: "Shop Commercial"
   • Badge: "Pro Grade"

6. PRODUCTS (Automatic)
   • Fetches all NordicTrack products
   • Shows 8 products
   • Link to view all

RESULT: /brand/nordictrack
✅ Beautiful, professional brand page
✅ All products displayed
✅ Mobile responsive
✅ SEO optimized
```

---

## 💡 Pro Tips

```
✨ IMAGES
   • Hero: 1920x1080px (landscape)
   • Categories: 400x400px (square)
   • Behind Work: 600x800px (portrait)
   • Shop By: 800x600px (landscape)

✨ CONTENT
   • Keep titles short (3-5 words)
   • Use \n for line breaks in hero
   • Write compelling CTAs
   • Test all links

✨ SEO
   • Use descriptive slugs
   • Fill in descriptions
   • Use alt text for images
   • Keep URLs clean

✨ PERFORMANCE
   • Optimize images before upload
   • Use WebP format when possible
   • Test on mobile devices
   • Check page speed
```

---

**You're ready to create amazing brand pages! 🎉**

Visit `/admin/brands` to get started!
