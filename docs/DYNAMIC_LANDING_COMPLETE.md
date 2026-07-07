# Dynamic Landing Page - Complete

## Overview
The landing page hero and pre-order sections are now fully dynamic, fetching content from the admin panel.

## How It Works

### Admin Side
1. Admin goes to: `http://localhost:3000/admin/dynamic-contents/landing-page`
2. Edits hero sections (main, top-right, bottom-right, tall-right)
3. Edits pre-order section (main feature + 4 grid images)
4. Clicks "Save Changes"
5. Data saved to: `public/content/landing-page.json`

### Frontend Side
1. User visits: `http://localhost:3000/`
2. `HeroSection` component fetches from `/api/hero-sections`
3. `PreOrderSection` component fetches from `/api/hero-sections`
4. Both components display the saved content dynamically

## API Routes

### Admin API (Save)
- **Endpoint:** `POST /api/admin/hero-sections`
- **Purpose:** Save hero and pre-order content
- **Storage:** `public/content/landing-page.json`

### Public API (Read)
- **Endpoint:** `GET /api/hero-sections`
- **Purpose:** Fetch hero and pre-order content for frontend
- **Fallback:** Returns default data if file doesn't exist

## Data Structure

```json
{
  "sections": [
    {
      "id": "main",
      "position": "main",
      "title": "Elevate Your\nFitness Journey",
      "buttonText": "Shop Now",
      "buttonUrl": "/shop",
      "image": "/images/landing/hero-section/hero.png",
      "discountBadge": {
        "enabled": true,
        "text": "Up to",
        "percentage": "40%"
      }
    }
  ],
  "preOrderSection": {
    "enabled": true,
    "sectionTitle": "Pre-Order Now & Save Big",
    "mainFeature": { ... },
    "gridImages": [ ... ]
  }
}
```

## Testing

1. Edit content in admin panel
2. Save changes
3. Refresh homepage
4. See updated content immediately

✅ Landing page is now fully dynamic!
