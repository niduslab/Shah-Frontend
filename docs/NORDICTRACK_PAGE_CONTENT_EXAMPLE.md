# NordicTrack Brand Page - Complete Content Structure

This guide shows exactly how to create the NordicTrack brand page using the Dynamic Pages system.

## Step 1: Create the Page

**Endpoint:** `POST /api/admin/pages`

```json
{
  "title": "NordicTrack Brand Page",
  "slug": "nordictrack",
  "type": "brand",
  "meta_title": "NordicTrack Fitness Equipment - Premium Home Gym Solutions",
  "meta_description": "Discover NordicTrack's innovative treadmills, ellipticals, bikes, and rowers with iFIT technology integration.",
  "is_active": true,
  "sort_order": 1
}
```

**Response:** You'll get back a page with `id: 1` (use this for adding sections)

---

## Step 2: Add Hero Section (Top Banner)

**Endpoint:** `POST /api/admin/pages/1/sections`

```json
{
  "section_type": "hero_slider",
  "title": "NordicTrack Hero",
  "content": {
    "slides": [
      {
        "type": "image",
        "media_url": "/storage/media/nordictrack-hero.jpg",
        "title": "Turn Your Home Into A Complete",
        "subtitle": "Fitness Space",
        "cta_text": "Shop Nordictrack",
        "cta_link": "/brand/nordictrack",
        "text_position": "left",
        "text_color": "white"
      }
    ]
  },
  "settings": {
    "autoplay": false,
    "show_arrows": false,
    "show_dots": false,
    "full_height": true,
    "overlay": true,
    "overlay_opacity": 0.3
  },
  "sort_order": 1,
  "is_active": true
}
```

**Visual Result:** Large hero banner with person on treadmill, text on left side

---

## Step 3: Add Categories Section

**Endpoint:** `POST /api/admin/pages/1/sections`

```json
{
  "section_type": "category_grid",
  "title": "Explore The Nordictrack Categories",
  "content": {
    "categories": [
      {
        "name": "Bikes",
        "image": "/storage/media/nordictrack-bikes.jpg",
        "link": "/category/bikes",
        "product_count": 45
      },
      {
        "name": "Treadmills",
        "image": "/storage/media/nordictrack-treadmills.jpg",
        "link": "/category/treadmills",
        "product_count": 32
      },
      {
        "name": "Ellipticals",
        "image": "/storage/media/nordictrack-ellipticals.jpg",
        "link": "/category/ellipticals",
        "product_count": 28
      },
      {
        "name": "Rowers",
        "image": "/storage/media/nordictrack-rowers.jpg",
        "link": "/category/rowers",
        "product_count": 15
      }
    ]
  },
  "settings": {
    "columns": 4,
    "show_border": true,
    "hover_effect": "zoom",
    "show_product_count": false,
    "background_color": "dark"
  },
  "sort_order": 2,
  "is_active": true
}
```

**Visual Result:** 4 category cards with images (Bikes, Treadmills, Ellipticals, Rowers)

---

## Step 4: Add Product Grid Section (Left Side - 3 Cards)

**Endpoint:** `POST /api/admin/pages/1/sections`

```json
{
  "section_type": "product_grid",
  "title": "Featured Products",
  "content": {
    "layout": "grid",
    "columns": 3,
    "items": [
      {
        "type": "product_card",
        "image": "/storage/media/elevate-fitness.jpg",
        "title": "Elevate Your Fitness Journey",
        "description": "",
        "cta_text": "Shop Now",
        "cta_link": "/shop",
        "badge": "Up to 40%",
        "badge_text": "Discounts",
        "badge_color": "orange",
        "background_color": "light"
      },
      {
        "type": "product_card",
        "image": "/storage/media/perfect-gear.jpg",
        "title": "Perfect Gear Awaits",
        "description": "",
        "cta_text": "Shop Now",
        "cta_link": "/category/gear",
        "background_color": "dark"
      },
      {
        "type": "product_card",
        "image": "/storage/media/shine-weights.jpg",
        "title": "Shine Bright with Weights",
        "description": "",
        "cta_text": "Shop Now",
        "cta_link": "/category/weights",
        "background_color": "dark"
      }
    ]
  },
  "settings": {
    "show_prices": false,
    "show_ratings": false,
    "hover_effect": "lift",
    "card_style": "modern"
  },
  "sort_order": 3,
  "is_active": true
}
```

**Visual Result:** 3 cards in a row - "Elevate Your Fitness Journey" (with 40% badge), "Perfect Gear Awaits", "Shine Bright with Weights"

---

## Step 5: Add Right Side Card (Top Picks)

**Endpoint:** `POST /api/admin/pages/1/sections`

```json
{
  "section_type": "banner",
  "title": "Top Picks Banner",
  "content": {
    "image": "/storage/media/top-picks.jpg",
    "title": "TOP PICKS",
    "subtitle": "",
    "cta_text": "Shop Now",
    "cta_link": "/top-picks",
    "text_position": "center",
    "text_color": "white"
  },
  "settings": {
    "full_width": false,
    "height": "auto",
    "overlay": true,
    "overlay_opacity": 0.2
  },
  "sort_order": 4,
  "is_active": true
}
```

**Visual Result:** Tall banner with person in blue shirt, "TOP PICKS" text

---

## Complete Page Structure Summary

```
┌─────────────────────────────────────────────────────────┐
│  HERO SECTION (Full Width)                             │
│  "Turn Your Home Into A Complete Fitness Space"        │
│  [Person on treadmill]                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  CATEGORY GRID (4 Columns)                             │
│  "Explore The Nordictrack Categories"                  │
│  [Bikes] [Treadmills] [Ellipticals] [Rowers]          │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────┐
│  PRODUCT GRID (3 Cards)          │  BANNER (Top Picks)  │
│  ┌────────┬────────┬────────┐    │  ┌────────────────┐  │
│  │Elevate │Perfect │ Shine  │    │  │                │  │
│  │Fitness │  Gear  │Weights │    │  │   TOP PICKS    │  │
│  │40% OFF │        │        │    │  │                │  │
│  └────────┴────────┴────────┘    │  │  [Person]      │  │
│                                   │  │                │  │
│                                   │  └────────────────┘  │
└──────────────────────────────────┴──────────────────────┘
```

---

## Admin Workflow (Step by Step)

### Using the Admin Interface:

1. **Navigate to Dynamic Pages**
   - Go to `/admin/dynamic-pages`
   - Click "Create Page"

2. **Fill Page Details**
   - Title: "NordicTrack Brand Page"
   - Slug: "nordictrack"
   - Type: "Brand"
   - Meta Title: "NordicTrack Fitness Equipment..."
   - Click "Create Page"

3. **Add Hero Section**
   - Click "Manage Sections" (Layers icon)
   - Click "Add Section"
   - Section Type: "Hero Slider"
   - Title: "NordicTrack Hero"
   - Click "Add Section"
   - Click "Edit Content" (Code icon)
   - Paste the hero content JSON
   - Click "Save Changes"

4. **Add Category Grid**
   - Click "Add Section"
   - Section Type: "Category Grid"
   - Title: "Explore The Nordictrack Categories"
   - Click "Add Section"
   - Click "Edit Content"
   - Paste the category grid content JSON
   - Click "Save Changes"

5. **Add Product Grid**
   - Click "Add Section"
   - Section Type: "Product Grid"
   - Title: "Featured Products"
   - Click "Add Section"
   - Click "Edit Content"
   - Paste the product grid content JSON
   - Click "Save Changes"

6. **Add Top Picks Banner**
   - Click "Add Section"
   - Section Type: "Banner"
   - Title: "Top Picks Banner"
   - Click "Add Section"
   - Click "Edit Content"
   - Paste the banner content JSON
   - Click "Save Changes"

7. **Reorder if Needed**
   - Drag sections by the grip icon to reorder
   - Order should be: Hero → Categories → Products → Banner

8. **Preview**
   - Visit `/nordictrack` on the frontend
   - All sections should render in order

---

## Image Requirements

Upload these images to your storage:

1. **nordictrack-hero.jpg** (1920x800px)
   - Person on treadmill in modern gym
   - Dark/dramatic lighting

2. **nordictrack-bikes.jpg** (400x400px)
   - Exercise bike product image

3. **nordictrack-treadmills.jpg** (400x400px)
   - Treadmill product image

4. **nordictrack-ellipticals.jpg** (400x400px)
   - Elliptical product image

5. **nordictrack-rowers.jpg** (400x400px)
   - Rowing machine product image

6. **elevate-fitness.jpg** (600x400px)
   - Person on exercise bike

7. **perfect-gear.jpg** (600x400px)
   - Foam roller and fitness accessories

8. **shine-weights.jpg** (600x400px)
   - Dumbbells in gym setting

9. **top-picks.jpg** (400x800px)
   - Person in athletic wear (vertical image)

---

## Content JSON Templates

### For Quick Copy-Paste in Admin:

#### Hero Content:
```json
{
  "slides": [
    {
      "type": "image",
      "media_url": "/storage/media/nordictrack-hero.jpg",
      "title": "Turn Your Home Into A Complete",
      "subtitle": "Fitness Space",
      "cta_text": "Shop Nordictrack",
      "cta_link": "/brand/nordictrack",
      "text_position": "left",
      "text_color": "white"
    }
  ]
}
```

#### Hero Settings:
```json
{
  "autoplay": false,
  "show_arrows": false,
  "show_dots": false,
  "full_height": true,
  "overlay": true,
  "overlay_opacity": 0.3
}
```

#### Category Grid Content:
```json
{
  "categories": [
    {
      "name": "Bikes",
      "image": "/storage/media/nordictrack-bikes.jpg",
      "link": "/category/bikes",
      "product_count": 45
    },
    {
      "name": "Treadmills",
      "image": "/storage/media/nordictrack-treadmills.jpg",
      "link": "/category/treadmills",
      "product_count": 32
    },
    {
      "name": "Ellipticals",
      "image": "/storage/media/nordictrack-ellipticals.jpg",
      "link": "/category/ellipticals",
      "product_count": 28
    },
    {
      "name": "Rowers",
      "image": "/storage/media/nordictrack-rowers.jpg",
      "link": "/category/rowers",
      "product_count": 15
    }
  ]
}
```

#### Category Grid Settings:
```json
{
  "columns": 4,
  "show_border": true,
  "hover_effect": "zoom",
  "show_product_count": false,
  "background_color": "dark"
}
```

#### Product Grid Content:
```json
{
  "layout": "grid",
  "columns": 3,
  "items": [
    {
      "type": "product_card",
      "image": "/storage/media/elevate-fitness.jpg",
      "title": "Elevate Your Fitness Journey",
      "cta_text": "Shop Now",
      "cta_link": "/shop",
      "badge": "Up to 40%",
      "badge_text": "Discounts",
      "badge_color": "orange"
    },
    {
      "type": "product_card",
      "image": "/storage/media/perfect-gear.jpg",
      "title": "Perfect Gear Awaits",
      "cta_text": "Shop Now",
      "cta_link": "/category/gear"
    },
    {
      "type": "product_card",
      "image": "/storage/media/shine-weights.jpg",
      "title": "Shine Bright with Weights",
      "cta_text": "Shop Now",
      "cta_link": "/category/weights"
    }
  ]
}
```

#### Banner Content:
```json
{
  "image": "/storage/media/top-picks.jpg",
  "title": "TOP PICKS",
  "cta_text": "Shop Now",
  "cta_link": "/top-picks",
  "text_position": "center",
  "text_color": "white"
}
```

#### Banner Settings:
```json
{
  "full_width": false,
  "height": "auto",
  "overlay": true,
  "overlay_opacity": 0.2
}
```

---

## Testing Checklist

- [ ] Page created successfully
- [ ] Hero section displays with correct image and text
- [ ] Category grid shows 4 categories
- [ ] Product grid shows 3 cards
- [ ] "40% Discounts" badge appears on first card
- [ ] Top Picks banner displays on the right
- [ ] All "Shop Now" buttons link correctly
- [ ] Page is responsive on mobile
- [ ] Images load correctly
- [ ] Text is readable over images

---

## Tips

1. **Image Paths**: Make sure to upload images first and use correct paths
2. **Testing**: Use "Load Example" button in content editor to see structure
3. **Validation**: JSON editor will show errors if syntax is wrong
4. **Preview**: Always preview on frontend after saving
5. **Reordering**: Drag sections to change order easily
6. **Inactive Sections**: Toggle sections off to hide without deleting

---

## Next Steps

After creating the NordicTrack page, you can:

1. Create similar pages for other brands (Peloton, Bowflex, etc.)
2. Add more sections (testimonials, video demos, etc.)
3. Create seasonal landing pages (Summer Sale, Black Friday)
4. Build custom gallery pages
5. Create flash deal pages with countdown timers

The system is flexible - mix and match section types to create any layout you need!
