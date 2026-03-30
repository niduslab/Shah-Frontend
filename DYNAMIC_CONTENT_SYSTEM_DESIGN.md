# Dynamic Content Management System - Design Document

## Overview
This document outlines the database schema and API design for managing dynamic content across the website, including landing pages and brand pages.

## Database Schema

### 1. Page Types
We have two main page types:
- **Landing Page**: Homepage with hero sections and pre-order sections
- **Brand Pages**: Individual brand pages (e.g., NordicTrack, ProForm, etc.)

### 2. Database Tables

#### Table: `dynamic_pages`
Stores metadata about pages that have dynamic content.

```sql
CREATE TABLE dynamic_pages (
    id SERIAL PRIMARY KEY,
    page_type VARCHAR(50) NOT NULL, -- 'landing' or 'brand'
    page_key VARCHAR(100) UNIQUE NOT NULL, -- 'home' or 'nordictrack', 'proform', etc.
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_dynamic_pages_page_type ON dynamic_pages(page_type);
CREATE INDEX idx_dynamic_pages_page_key ON dynamic_pages(page_key);
CREATE INDEX idx_dynamic_pages_slug ON dynamic_pages(slug);
```

#### Table: `page_sections`
Stores individual sections within a page (hero, pre-order, categories, etc.).

```sql
CREATE TABLE page_sections (
    id SERIAL PRIMARY KEY,
    page_id INTEGER NOT NULL REFERENCES dynamic_pages(id) ON DELETE CASCADE,
    section_type VARCHAR(100) NOT NULL, -- 'hero', 'pre-order', 'categories', 'behind-work', etc.
    section_key VARCHAR(100) NOT NULL, -- 'main', 'topRight', 'bottomRight', 'tallRight' for hero
    title VARCHAR(500),
    subtitle TEXT,
    description TEXT,
    button_text VARCHAR(100),
    button_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_enabled BOOLEAN DEFAULT true,
    config JSONB, -- Flexible JSON for section-specific configuration
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(page_id, section_type, section_key)
);

-- Indexes
CREATE INDEX idx_page_sections_page_id ON page_sections(page_id);
CREATE INDEX idx_page_sections_section_type ON page_sections(section_type);
CREATE INDEX idx_page_sections_display_order ON page_sections(display_order);
CREATE INDEX idx_page_sections_config ON page_sections USING GIN(config);
```

#### Table: `section_images`
Stores images associated with sections.

```sql
CREATE TABLE section_images (
    id SERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL REFERENCES page_sections(id) ON DELETE CASCADE,
    image_url VARCHAR(1000) NOT NULL,
    image_alt VARCHAR(255),
    image_type VARCHAR(50), -- 'main', 'grid', 'background', 'thumbnail'
    display_order INTEGER DEFAULT 0,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_section_images_section_id ON section_images(section_id);
CREATE INDEX idx_section_images_display_order ON section_images(display_order);
```

#### Table: `section_badges`
Stores badges/labels for sections (discount badges, save badges, etc.).

```sql
CREATE TABLE section_badges (
    id SERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL REFERENCES page_sections(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL, -- 'discount', 'save', 'new', 'featured'
    text VARCHAR(100),
    value VARCHAR(50), -- '40%', '30%', etc.
    position VARCHAR(50), -- 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    background_color VARCHAR(50),
    text_color VARCHAR(50),
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_section_badges_section_id ON section_badges(section_id);
```

### 3. Example Data Structure

#### Landing Page - Hero Section (Main)
```json
{
  "page": {
    "id": 1,
    "page_type": "landing",
    "page_key": "home",
    "title": "Home Page"
  },
  "section": {
    "id": 1,
    "page_id": 1,
    "section_type": "hero",
    "section_key": "main",
    "title": "Elevate Your\nFitness Journey",
    "button_text": "Shop Now",
    "button_url": "/shop",
    "display_order": 1,
    "is_enabled": true,
    "config": {
      "position": "main",
      "layout": "large"
    }
  },
  "images": [
    {
      "id": 1,
      "section_id": 1,
      "image_url": "/images/landing/hero-section/6da4e59475159602882c3fabee07c1388d618dbb.png",
      "image_alt": "Fitness Journey",
      "image_type": "main",
      "display_order": 0
    }
  ],
  "badges": [
    {
      "id": 1,
      "section_id": 1,
      "badge_type": "discount",
      "text": "Up to",
      "value": "40%",
      "position": "bottom-right",
      "background_color": "#FF5722",
      "text_color": "#FFFFFF",
      "is_enabled": true
    }
  ]
}
```

#### Landing Page - Pre-Order Section
```json
{
  "section": {
    "id": 5,
    "page_id": 1,
    "section_type": "pre-order",
    "section_key": "main",
    "title": "Pre-Order Now & Save Big",
    "subtitle": "View All Preorder Products",
    "button_url": "/pre-order",
    "display_order": 2,
    "is_enabled": true,
    "config": {
      "view_all_text": "View All Preorder Products",
      "view_all_url": "/pre-order",
      "main_feature": {
        "title": "Nordictrack T Series\n10 Treadmill",
        "button_text": "Preorder Now",
        "button_url": "/pre-order"
      }
    }
  },
  "images": [
    {
      "id": 10,
      "section_id": 5,
      "image_url": "/images/landing/pre-order/c7b139cd4aecc159bde32e9387c0dcb372021ab9.png",
      "image_alt": "Nordictrack T Series 10 Treadmill",
      "image_type": "main",
      "display_order": 0
    },
    {
      "id": 11,
      "section_id": 5,
      "image_url": "/images/landing/pre-order/606b82b85373e30dc10d2f79a0253f7d20502b39.png",
      "image_alt": "Fitness Equipment 1",
      "image_type": "grid",
      "display_order": 1
    }
  ],
  "badges": [
    {
      "id": 5,
      "section_id": 5,
      "badge_type": "save",
      "text": "Save",
      "value": "30%",
      "position": "top-left",
      "background_color": "#D35400",
      "text_color": "#FFFFFF",
      "is_enabled": true
    }
  ]
}
```

#### Brand Page - Hero Section (NordicTrack)
```json
{
  "page": {
    "id": 2,
    "page_type": "brand",
    "page_key": "nordictrack",
    "title": "NordicTrack",
    "slug": "nordictrack",
    "meta_title": "NordicTrack - Home Fitness Equipment",
    "meta_description": "Turn your home into a complete fitness space with NordicTrack's innovative treadmills, ellipticals, and exercise bikes."
  },
  "section": {
    "id": 20,
    "page_id": 2,
    "section_type": "brand-hero",
    "section_key": "main",
    "title": "NordicTrack",
    "subtitle": "Premium Home Fitness Equipment",
    "description": "Turn your home into a complete fitness space",
    "button_text": "Shop Now",
    "button_url": "/shop?brand=nordictrack",
    "display_order": 1,
    "is_enabled": true,
    "config": {
      "layout": "full-width",
      "overlay_opacity": 0.6
    }
  }
}
```

## API Endpoints

### Admin Endpoints

#### 1. Get All Pages
```
GET /api/admin/dynamic-pages
Query Parameters:
  - page_type: 'landing' | 'brand' (optional)
  - is_active: boolean (optional)
  - page: number (pagination)
  - limit: number (pagination)

Response:
{
  "success": true,
  "data": {
    "pages": [...],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "total_pages": 3
    }
  }
}
```

#### 2. Get Page with Sections
```
GET /api/admin/dynamic-pages/{page_key}

Response:
{
  "success": true,
  "data": {
    "page": {...},
    "sections": [
      {
        "section": {...},
        "images": [...],
        "badges": [...]
      }
    ]
  }
}
```

#### 3. Create/Update Page
```
POST /api/admin/dynamic-pages
PUT /api/admin/dynamic-pages/{page_key}

Request Body:
{
  "page_type": "landing",
  "page_key": "home",
  "title": "Home Page",
  "meta_title": "...",
  "meta_description": "...",
  "is_active": true
}

Response:
{
  "success": true,
  "data": {
    "page": {...}
  },
  "message": "Page created/updated successfully"
}
```

#### 4. Get Page Sections
```
GET /api/admin/dynamic-pages/{page_key}/sections
Query Parameters:
  - section_type: string (optional)
  - is_enabled: boolean (optional)

Response:
{
  "success": true,
  "data": {
    "sections": [
      {
        "section": {...},
        "images": [...],
        "badges": [...]
      }
    ]
  }
}
```

#### 5. Create/Update Section
```
POST /api/admin/dynamic-pages/{page_key}/sections
PUT /api/admin/dynamic-pages/{page_key}/sections/{section_id}

Request Body:
{
  "section_type": "hero",
  "section_key": "main",
  "title": "Elevate Your\nFitness Journey",
  "button_text": "Shop Now",
  "button_url": "/shop",
  "display_order": 1,
  "is_enabled": true,
  "config": {},
  "images": [
    {
      "image_url": "...",
      "image_alt": "...",
      "image_type": "main",
      "display_order": 0
    }
  ],
  "badges": [
    {
      "badge_type": "discount",
      "text": "Up to",
      "value": "40%",
      "position": "bottom-right",
      "is_enabled": true
    }
  ]
}

Response:
{
  "success": true,
  "data": {
    "section": {...},
    "images": [...],
    "badges": [...]
  },
  "message": "Section created/updated successfully"
}
```

#### 6. Delete Section
```
DELETE /api/admin/dynamic-pages/{page_key}/sections/{section_id}

Response:
{
  "success": true,
  "message": "Section deleted successfully"
}
```

#### 7. Reorder Sections
```
POST /api/admin/dynamic-pages/{page_key}/sections/reorder

Request Body:
{
  "sections": [
    { "id": 1, "display_order": 1 },
    { "id": 2, "display_order": 2 }
  ]
}

Response:
{
  "success": true,
  "message": "Sections reordered successfully"
}
```

#### 8. Upload Section Image
```
POST /api/admin/dynamic-pages/upload-image
Content-Type: multipart/form-data

Form Data:
  - file: File
  - section_id: number (optional)
  - image_type: string (optional)

Response:
{
  "success": true,
  "data": {
    "image_url": "/uploads/...",
    "image_id": 123
  }
}
```

### Public Endpoints

#### 1. Get Landing Page Content
```
GET /api/hero-sections
(or GET /api/dynamic-content/landing)

Response:
{
  "success": true,
  "data": {
    "sections": [...],
    "preOrderSection": {...}
  }
}
```

#### 2. Get Brand Page Content
```
GET /api/dynamic-content/brand/{brand_slug}

Response:
{
  "success": true,
  "data": {
    "page": {...},
    "sections": [
      {
        "section": {...},
        "images": [...],
        "badges": [...]
      }
    ]
  }
}
```

## Section Types Reference

### Landing Page Sections
- `hero` - Hero section with 4 positions (main, topRight, bottomRight, tallRight)
- `pre-order` - Pre-order section with main feature and grid images
- `categories` - Explore categories section
- `flash-deal` - Flash deal section
- `new-arrivals` - New arrival products
- `discounts` - Discounts section
- `performance` - Performance section
- `clients` - Our clients section

### Brand Page Sections
- `brand-hero` - Brand hero section
- `brand-categories` - Brand categories
- `brand-behind-work` - Behind the work section
- `brand-recommended` - Recommended products
- `brand-shop-by` - Shop by section
- `brand-discounts` - Fitness discounts
- `brand-products` - Product showcase
- `brand-why-choose` - Why choose section

## Implementation Notes

1. **Flexible Config Field**: The `config` JSONB field allows storing section-specific data without schema changes
2. **Image Management**: Images are stored separately for better organization and reusability
3. **Badge System**: Flexible badge system for discount labels, save badges, etc.
4. **Display Order**: Sections can be reordered dynamically
5. **Enable/Disable**: Sections can be toggled without deletion
6. **Cascading Deletes**: Deleting a page removes all associated sections, images, and badges
7. **Caching**: Consider implementing Redis caching for frequently accessed pages
8. **CDN Integration**: Images should be served through CDN for better performance

## Migration Strategy

1. Create database tables
2. Migrate existing hero sections data to new schema
3. Update API endpoints to use new schema
4. Update frontend components to fetch from new endpoints
5. Create admin interface for managing content
6. Test thoroughly before production deployment

## Future Enhancements

1. **Version Control**: Track changes to sections with version history
2. **A/B Testing**: Support multiple versions of sections for testing
3. **Scheduling**: Schedule section changes for future dates
4. **Analytics**: Track section performance and engagement
5. **Templates**: Create reusable section templates
6. **Multi-language**: Support for multiple languages
7. **Preview Mode**: Preview changes before publishing
8. **Bulk Operations**: Bulk update/delete sections
