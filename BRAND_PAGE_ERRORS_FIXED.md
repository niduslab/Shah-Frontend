# Brand Page Errors Fixed

## Issues Encountered

When clicking "Page" button from brands admin, two errors occurred:

### Error 1: Window is not defined
```
ReferenceError: window is not defined
at admin-header.tsx:13:6
```

### Error 2: Invalid Image URL
```
Failed to parse src "storage/brands/..." on next/image
TypeError: Failed to construct 'URL': Invalid URL
```

## Fixes Applied

### 1. Fixed Window Error (`app/admin/_components/admin-header.tsx`)

**Problem:**
- Code tried to access `window` object during server-side rendering
- Next.js renders components on server first, where `window` doesn't exist

**Solution:**
```typescript
// Before
if (process.env.NODE_ENV === 'development') {
  import('@/lib/utils/csrf-debug').then(({ debugCSRFToken }) => {
    (window as any).debugCSRF = debugCSRFToken;
  });
}

// After
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('@/lib/utils/csrf-debug').then(({ debugCSRFToken }) => {
    (window as any).debugCSRF = debugCSRFToken;
  });
}
```

**What Changed:**
- Added `typeof window !== 'undefined'` check
- Only runs on client-side (browser)
- Prevents server-side rendering errors

### 2. Fixed Image URL Error (`app/admin/dynamic-contents/brand-pages-db/page.tsx`)

**Problem:**
- Brand logos stored as relative paths: `storage/brands/image.png`
- Next.js Image component requires absolute URLs
- Relative paths without leading `/` are invalid

**Solution:**

**Added imports:**
```typescript
import { getImageUrl, getPlaceholderImage } from "@/lib/utils/image";
```

**Updated Image component:**
```typescript
// Before
<Image
  src={brand.logo}
  alt={brand.name}
  fill
  className="object-contain p-8"
/>

// After
<Image
  src={getImageUrl(brand.logo)}
  alt={brand.name}
  fill
  className="object-contain p-8"
  onError={(e) => {
    (e.target as HTMLImageElement).src = getPlaceholderImage();
  }}
/>
```

**What Changed:**
- Uses `getImageUrl()` utility to convert relative paths to absolute URLs
- Adds error handler with placeholder image fallback
- Matches the pattern used in brands admin page

## How getImageUrl Works

The utility function handles different image path formats:

```typescript
// Relative path
"storage/brands/image.png" 
→ "/storage/brands/image.png"

// Already absolute
"/images/logo.png" 
→ "/images/logo.png"

// External URL
"https://example.com/image.png" 
→ "https://example.com/image.png"
```

## Files Modified

1. **app/admin/_components/admin-header.tsx**
   - Added window existence check
   - Prevents SSR errors

2. **app/admin/dynamic-contents/brand-pages-db/page.tsx**
   - Added image utility imports
   - Updated Image src to use getImageUrl()
   - Added error handler with placeholder

## Testing

After fixes:
- ✅ No more "window is not defined" error
- ✅ Brand logos display correctly
- ✅ Page loads without errors
- ✅ Can navigate from brands to brand pages
- ✅ Brand auto-selected from URL parameter
- ✅ Fallback to placeholder if image fails

## Result

The brand page button now works perfectly:

1. Click "Page" on any brand
2. Navigate to `/admin/dynamic-contents/brand-pages-db?brand=24`
3. Page loads successfully
4. Brand is auto-selected
5. Brand logo displays correctly
6. Ready to edit content

All errors resolved!
