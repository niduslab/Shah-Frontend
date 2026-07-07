# Image URL Utility Usage

## Overview
The `getImageUrl` utility function constructs full URLs for images stored on the Laravel backend.

## How It Works

### Backend Storage
Laravel stores uploaded files in `storage/app/public/brands/` and serves them via:
```
http://localhost:8000/storage/brands/filename.jpg
```

### Frontend Usage

```typescript
import { getImageUrl, getPlaceholderImage } from '@/lib/utils/image';

// Example 1: Backend returns relative path
const brand = {
  logo: "brands/apple-logo.png"
};
const fullUrl = getImageUrl(brand.logo);
// Result: "http://localhost:8000/storage/brands/apple-logo.png"

// Example 2: Backend returns full URL (already processed)
const brand2 = {
  logo: "http://localhost:8000/storage/brands/samsung-logo.png"
};
const fullUrl2 = getImageUrl(brand2.logo);
// Result: "http://localhost:8000/storage/brands/samsung-logo.png" (unchanged)

// Example 3: No logo
const brand3 = {
  logo: null
};
const fullUrl3 = getImageUrl(brand3.logo);
// Result: "" (empty string)

// Example 4: Using placeholder
<img 
  src={getImageUrl(brand.logo) || getPlaceholderImage()} 
  alt="Brand logo"
  onError={(e) => {
    e.currentTarget.src = getPlaceholderImage();
  }}
/>
```

## Environment Configuration

The utility uses `NEXT_PUBLIC_API_URL` from `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, update to your production API URL:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Features

1. **Automatic URL Construction**: Converts relative paths to full URLs
2. **Full URL Detection**: Leaves already-complete URLs unchanged
3. **Null Safety**: Handles null/undefined gracefully
4. **Placeholder Support**: Provides SVG placeholder for missing images
5. **Error Handling**: Can be used with onError handlers for fallback images

## Implementation in Brands

### Display Brand Logo
```typescript
<img
  src={getImageUrl(brand.logo)}
  alt={brand.name}
  onError={(e) => {
    (e.target as HTMLImageElement).src = getPlaceholderImage();
  }}
/>
```

### Modal Preview
```typescript
const logoPreview = brand.logo ? getImageUrl(brand.logo) : '';
```

This ensures all brand images are loaded from the correct backend URL regardless of environment.
