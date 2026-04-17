# Brand Page Data Structure Reference

## Complete JSON Structure

This is the exact structure stored in `public/content/brand-pages/{brandId}.json`:

```json
{
  "brandId": 1,
  "content": {
    "hero": {
      "enabled": true,
      "backgroundImage": "/images/brand-page/hero-bg.png",
      "title": "Turn Your Home\nInto A Complete",
      "highlightedText": "Fitness Space",
      "description": "Experience premium fitness equipment designed for your home.",
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
          "image": "/images/categories/treadmills.png",
          "href": "/shop?category=treadmill"
        },
        {
          "id": "cat-2",
          "name": "Ellipticals",
          "image": "/images/categories/ellipticals.png",
          "href": "/shop?category=elliptical"
        }
      ]
    },
    "behindTheWork": {
      "enabled": true,
      "title": "Thinking Behind the Work",
      "description": "With over 50 years of innovation, we've perfected the art of home fitness.",
      "stats": [
        {
          "value": "51+",
          "label": "Years of Experience"
        },
        {
          "value": "1M+",
          "label": "Happy Customers"
        },
        {
          "value": "50+",
          "label": "Available In Countries"
        }
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
          "image": "/images/products/t-series.png",
          "title": "T Series 16 Treadmill",
          "buttonText": "Shop Treadmill",
          "buttonUrl": "/shop?product=t-series-16",
          "badge": {
            "enabled": true,
            "value": "12",
            "label": "MPH Speed"
          }
        },
        {
          "id": "card-2",
          "image": "/images/products/elliptical.png",
          "title": "Elite Elliptical",
          "buttonText": "Shop Elliptical",
          "buttonUrl": "/shop?product=elite-elliptical",
          "badge": {
            "enabled": false,
            "value": "",
            "label": ""
          }
        }
      ]
    }
  },
  "updatedAt": "2024-03-31T10:30:00.000Z"
}
```

---

## Section Details

### Hero Section

**Purpose:** Main banner with brand message

**Fields:**
- `enabled` (boolean) - Show/hide this section
- `backgroundImage` (string) - Full image URL or path
- `title` (string) - Main title (use `\n` for line breaks)
- `highlightedText` (string) - Text shown in orange gradient
- `description` (string) - Subtitle/description text
- `buttonText` (string) - CTA button label
- `buttonUrl` (string) - Where button links to

**Example:**
```json
{
  "enabled": true,
  "backgroundImage": "/images/hero-bg.jpg",
  "title": "Premium\nFitness",
  "highlightedText": "Equipment",
  "description": "Transform your home gym",
  "buttonText": "Explore",
  "buttonUrl": "/shop"
}
```

---

### Categories Section

**Purpose:** Grid of category cards

**Fields:**
- `enabled` (boolean) - Show/hide this section
- `sectionTitle` (string) - Section heading
- `items` (array) - Category items

**Item Fields:**
- `id` (string) - Unique identifier
- `name` (string) - Category name
- `image` (string) - Category image URL
- `href` (string) - Link destination

**Example:**
```json
{
  "enabled": true,
  "sectionTitle": "Shop By Category",
  "items": [
    {
      "id": "cat-1",
      "name": "Cardio",
      "image": "/images/cardio.jpg",
      "href": "/shop?type=cardio"
    }
  ]
}
```

---

### Behind The Work Section

**Purpose:** Brand story with statistics and images

**Fields:**
- `enabled` (boolean) - Show/hide this section
- `title` (string) - Section title
- `description` (string) - Brand story/description
- `stats` (array) - Statistics to display
- `images` (object) - Three images (left, center, right)

**Stat Fields:**
- `value` (string) - Stat number/value
- `label` (string) - Stat description

**Example:**
```json
{
  "enabled": true,
  "title": "Our Story",
  "description": "Founded in 1970...",
  "stats": [
    {
      "value": "50+",
      "label": "Years"
    }
  ],
  "images": {
    "left": "/images/left.jpg",
    "center": "/images/center.jpg",
    "right": "/images/right.jpg"
  }
}
```

---

### Shop By Section

**Purpose:** Product showcase cards

**Fields:**
- `enabled` (boolean) - Show/hide this section
- `cards` (array) - Product cards

**Card Fields:**
- `id` (string) - Unique identifier
- `image` (string) - Product image URL
- `title` (string) - Product name
- `buttonText` (string) - Button label
- `buttonUrl` (string) - Button link
- `badge` (object, optional) - Badge display

**Badge Fields:**
- `enabled` (boolean) - Show badge
- `value` (string) - Badge value (e.g., "12")
- `label` (string) - Badge label (e.g., "MPH Speed")

**Example:**
```json
{
  "enabled": true,
  "cards": [
    {
      "id": "prod-1",
      "image": "/images/product.jpg",
      "title": "Premium Treadmill",
      "buttonText": "Buy Now",
      "buttonUrl": "/shop/treadmill",
      "badge": {
        "enabled": true,
        "value": "15",
        "label": "MPH"
      }
    }
  ]
}
```

---

## Admin Panel Mapping

### How Admin Fields Map to JSON

| Admin Field | JSON Path | Type |
|---|---|---|
| Hero Enabled | `hero.enabled` | boolean |
| Hero Background | `hero.backgroundImage` | string |
| Hero Title | `hero.title` | string |
| Hero Highlight | `hero.highlightedText` | string |
| Hero Description | `hero.description` | string |
| Hero Button Text | `hero.buttonText` | string |
| Hero Button URL | `hero.buttonUrl` | string |
| Categories Enabled | `categories.enabled` | boolean |
| Categories Title | `categories.sectionTitle` | string |
| Category Item | `categories.items[n]` | object |
| Behind Work Enabled | `behindTheWork.enabled` | boolean |
| Behind Work Title | `behindTheWork.title` | string |
| Behind Work Description | `behindTheWork.description` | string |
| Stats | `behindTheWork.stats[n]` | array |
| Images | `behindTheWork.images` | object |
| Shop By Enabled | `shopBy.enabled` | boolean |
| Shop Card | `shopBy.cards[n]` | object |

---

## API Response Format

### GET /api/admin/brand-pages/{brandId}

**Success Response (200):**
```json
{
  "brandId": 1,
  "content": { /* full content object */ },
  "updatedAt": "2024-03-31T10:30:00.000Z"
}
```

**Not Found Response (200):**
```json
{
  "content": null
}
```

### POST /api/admin/brand-pages/{brandId}

**Request Body:**
```json
{
  "content": { /* full content object */ }
}
```

**Success Response (200):**
```json
{
  "message": "Brand page content saved successfully",
  "data": {
    "brandId": 1,
    "content": { /* saved content */ },
    "updatedAt": "2024-03-31T10:30:00.000Z"
  }
}
```

---

## Validation Rules

### Required Fields
- `hero.enabled` - Must be boolean
- `categories.enabled` - Must be boolean
- `behindTheWork.enabled` - Must be boolean
- `shopBy.enabled` - Must be boolean

### Conditional Requirements
- If `hero.enabled = true`, then `hero.title` and `hero.buttonUrl` are recommended
- If `categories.enabled = true`, then `categories.items` should have at least 1 item
- If `shopBy.enabled = true`, then `shopBy.cards` should have at least 1 card

### Image URLs
- Can be relative paths: `/images/hero.jpg`
- Can be absolute URLs: `https://example.com/image.jpg`
- Can be storage URLs: `/storage/brand-pages/image.jpg`

---

## Example: Complete Brand Page

```json
{
  "brandId": 1,
  "content": {
    "hero": {
      "enabled": true,
      "backgroundImage": "/images/brand-page/hero.jpg",
      "title": "Transform Your\nHome Into A",
      "highlightedText": "Fitness Paradise",
      "description": "Premium equipment for serious fitness enthusiasts",
      "buttonText": "Start Shopping",
      "buttonUrl": "/shop?brand=nordictrack"
    },
    "categories": {
      "enabled": true,
      "sectionTitle": "Explore Our Range",
      "items": [
        {
          "id": "cat-1",
          "name": "Treadmills",
          "image": "/images/categories/treadmills.jpg",
          "href": "/shop?category=treadmill"
        },
        {
          "id": "cat-2",
          "name": "Ellipticals",
          "image": "/images/categories/ellipticals.jpg",
          "href": "/shop?category=elliptical"
        },
        {
          "id": "cat-3",
          "name": "Bikes",
          "image": "/images/categories/bikes.jpg",
          "href": "/shop?category=bike"
        },
        {
          "id": "cat-4",
          "name": "Rowers",
          "image": "/images/categories/rowers.jpg",
          "href": "/shop?category=rower"
        }
      ]
    },
    "behindTheWork": {
      "enabled": true,
      "title": "Why Choose Us",
      "description": "With decades of innovation and millions of satisfied customers worldwide, we're committed to bringing professional-grade fitness equipment to your home.",
      "stats": [
        {
          "value": "50+",
          "label": "Years of Excellence"
        },
        {
          "value": "2M+",
          "label": "Active Users"
        },
        {
          "value": "100+",
          "label": "Countries"
        }
      ],
      "images": {
        "left": "/images/brand/left.jpg",
        "center": "/images/brand/center.jpg",
        "right": "/images/brand/right.jpg"
      }
    },
    "shopBy": {
      "enabled": true,
      "cards": [
        {
          "id": "prod-1",
          "image": "/images/products/t-series.jpg",
          "title": "T Series 16 Treadmill",
          "buttonText": "View Details",
          "buttonUrl": "/product/t-series-16",
          "badge": {
            "enabled": true,
            "value": "12",
            "label": "MPH Max"
          }
        },
        {
          "id": "prod-2",
          "image": "/images/products/elite-elliptical.jpg",
          "title": "Elite Elliptical",
          "buttonText": "View Details",
          "buttonUrl": "/product/elite-elliptical",
          "badge": {
            "enabled": false,
            "value": "",
            "label": ""
          }
        }
      ]
    }
  },
  "updatedAt": "2024-03-31T10:30:00.000Z"
}
```

---

## Tips for Admin Users

1. **Line Breaks in Title:** Use `\n` to create line breaks in hero title
2. **Image Optimization:** Upload optimized images (compressed, right size)
3. **URL Consistency:** Use relative URLs for internal links (`/shop`, `/product/123`)
4. **Badge Values:** Keep badge values short (e.g., "12", "NEW", "SALE")
5. **Description Length:** Keep descriptions concise for better readability
6. **Button URLs:** Always include leading slash for internal links
