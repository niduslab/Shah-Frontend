# Shop Page Image Fix - Complete

## Issue
Product images were not displaying on the shop page because the API returns image URLs with `full_url` property in the format `/storage/products/...`, which needs to be prepended with the backend API base URL.

## API Image Format

The backend API returns product images in this format:

```json
{
  "images": [
    {
      "id": 122,
      "product_id": 30,
      "image_path": "products/1772941011_0_69aceed38a2ba.png",
      "alt_text": null,
      "is_primary": true,
      "sort_order": 0,
      "full_url": "/storage/products/1772941011_0_69aceed38a2ba.png"
    }
  ]
}
```

## Solution

### 1. Updated Image Utility (`lib/utils/image.ts`)

Enhanced the existing image utility functions to handle both `image_path` and `full_url` formats:

#### Updated `getImageUrl()` Function
```typescript
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // If path already starts with /storage, just prepend the API URL
  if (path.startsWith('/storage/')) {
    return `${apiUrl}${path}`;
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Construct full URL
  return `${apiUrl}/storage/${cleanPath}`;
}
```

#### Updated `getPrimaryImageUrl()` Function
Now accepts both `image_path` and `full_url` properties:

```typescript
export function getPrimaryImageUrl(
  images?: Array<{ 
    image_path?: string; 
    full_url?: string; 
    is_primary: boolean 
  }> | null
): string {
  if (!images || images.length === 0) return getPlaceholderImage();
  
  const primaryImage = images.find(img => img.is_primary);
  const imageToUse = primaryImage || images[0];
  
  // Use full_url if available, otherwise fall back to image_path
  const imagePath = imageToUse.full_url || imageToUse.image_path;
  return getImageUrl(imagePath);
}
```

#### Updated `getAllImageUrls()` Function
```typescript
export function getAllImageUrls(
  images?: Array<{ 
    image_path?: string; 
    full_url?: string; 
  }> | null
): string[] {
  if (!images || images.length === 0) return [];
  
  return images.map(img => {
    const imagePath = img.full_url || img.image_path;
    return getImageUrl(imagePath);
  });
}
```

### 2. Updated Shop Page (`app/(public)/shop/page.tsx`)

Simplified the image handling by using the utility function:

```typescript
import { getPrimaryImageUrl } from "@/lib/utils/image";

// Transform API products
const transformedProducts = products.map((product: any) => ({
  id: product.id,
  name: product.name,
  image: getPrimaryImageUrl(product.images), // ✅ Now uses utility function
  price: parseFloat(product.price),
  // ... rest of the properties
}));
```

## How It Works

1. **API Response**: Backend returns `full_url: "/storage/products/image.png"`
2. **Utility Function**: `getPrimaryImageUrl()` extracts the primary image
3. **URL Construction**: `getImageUrl()` prepends the API base URL
4. **Final URL**: `http://localhost:8000/storage/products/image.png`

## Image Priority Logic

The utility functions follow this priority:

1. **Primary Image**: Look for image with `is_primary: true`
2. **First Image**: If no primary, use the first image in the array
3. **Placeholder**: If no images, return a placeholder SVG

## URL Format Handling

The `getImageUrl()` function handles multiple formats:

1. **Full URLs**: `http://example.com/image.png` → Returns as-is
2. **Storage Paths**: `/storage/products/image.png` → Prepends API URL
3. **Relative Paths**: `products/image.png` → Adds `/storage/` and API URL

## Environment Configuration

The image URLs use the environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, update to:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Benefits of This Approach

1. **Reusable**: Utility functions can be used across the entire application
2. **Flexible**: Handles both `image_path` and `full_url` formats
3. **Fallback**: Provides placeholder images when no image is available
4. **Type-Safe**: TypeScript interfaces ensure proper usage
5. **Centralized**: All image URL logic in one place

## Usage in Other Components

Any component can now use these utilities:

```typescript
import { getPrimaryImageUrl, getAllImageUrls } from "@/lib/utils/image";

// Get primary image
const primaryImage = getPrimaryImageUrl(product.images);

// Get all images
const allImages = getAllImageUrls(product.images);

// Get single image URL
const imageUrl = getImageUrl(product.category.image);
```

## Files Modified

1. **lib/utils/image.ts** - Enhanced to handle `full_url` format
2. **app/(public)/shop/page.tsx** - Uses utility function for images

## Testing Checklist

- [x] Product images display correctly on shop page
- [x] Primary images are selected correctly
- [x] Fallback to first image if no primary
- [x] Placeholder shows when no images
- [x] URLs are properly constructed
- [x] Works with both `image_path` and `full_url`
- [x] TypeScript types are correct
- [x] No console errors

## Example Image URLs

**API Response:**
```
full_url: "/storage/products/1772941011_0_69aceed38a2ba.png"
```

**Constructed URL:**
```
http://localhost:8000/storage/products/1772941011_0_69aceed38a2ba.png
```

## Status: ✅ COMPLETE

Product images now display correctly on the shop page using the proper API base URL!

## Next Steps

Consider using these utility functions in other components that display product images:
- Product detail pages
- Cart items
- Order history
- Admin product listings
- Featured products sections
- Category pages
