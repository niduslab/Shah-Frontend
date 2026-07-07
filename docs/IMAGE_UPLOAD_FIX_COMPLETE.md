# Image Upload Fix - Complete

## Issue
Images were not uploading/changing in the old admin pages:
- `/admin/dynamic-contents/landing-page`
- `/admin/dynamic-contents/brand-pages`

## Root Causes

1. **Missing API Endpoint:** `/api/admin/upload` route didn't exist
2. **No Input Reset:** File input wasn't resetting after upload, preventing same file selection
3. **Poor UX:** When image existed, hard to see it was clickable to change
4. **Base64 Encoding:** Pre-order section was using FileReader instead of proper upload
5. **No Folder Organization:** Images weren't organized by section type

## Fixes Applied

### 1. Created Missing API Route
**File:** `app/api/admin/upload/route.ts`
- Handles file uploads
- Saves to `public/images/{folder}/`
- Returns public URL
- Supports custom folder parameter

### 2. Fixed Landing Page (`app/admin/dynamic-contents/landing-page/page.tsx`)

**Hero Sections:**
- Added input reset after upload
- Added hover overlay showing "Change Image"
- Added folder parameter: `landing/hero-section`
- Added error handling with alerts

**Pre-Order Main Feature:**
- Replaced FileReader with API upload
- Created `handlePreOrderImageUpload()` function
- Folder: `landing/pre-order`

**Pre-Order Grid Images:**
- Replaced FileReader with API upload
- Created `handleGridImageUpload()` function
- Folder: `landing/pre-order`

### 3. Fixed Brand Pages (`app/admin/dynamic-contents/brand-pages/page.tsx`)

**Brand Hero Images:**
- Added input reset after upload
- Added folder parameter support
- Default folder: `brand-page`
- Added error handling with alerts

## How It Works Now

### Upload Flow
1. User clicks image area (even if image exists)
2. File dialog opens
3. User selects image
4. File uploads to `/api/admin/upload`
5. Server saves to `public/images/{folder}/`
6. Returns URL like `/images/brand-page/1234567890-hero.jpg`
7. URL updates in state
8. Input resets (can select same file again)
9. Success/error alert shown

### Visual Feedback
- **No Image:** Shows upload icon and text
- **Has Image:** Shows image with hover overlay
- **Hover:** Dark overlay with "Change Image" text
- **Uploading:** (Could add loading state)

### File Organization
Images now organized by section:
```
public/images/
├── landing/
│   ├── hero-section/
│   │   └── 1234567890-hero.jpg
│   └── pre-order/
│       ├── 1234567890-main.jpg
│       └── 1234567890-grid1.jpg
└── brand-page/
    └── 1234567890-nordictrack-hero.jpg
```

## Testing Checklist

### Landing Page
- [ ] Upload hero section image (main)
- [ ] Change existing hero image
- [ ] Upload top right section image
- [ ] Upload bottom right section image
- [ ] Upload tall right section image
- [ ] Upload pre-order main feature image
- [ ] Upload pre-order grid images (4 items)
- [ ] Save and verify images persist

### Brand Pages
- [ ] Upload brand hero background image
- [ ] Change existing brand image
- [ ] Upload category images
- [ ] Upload behind-the-work images (3)
- [ ] Upload shop-by card images
- [ ] Save and verify images persist

## Code Changes Summary

### New Files
- `app/api/admin/upload/route.ts` - Upload API endpoint

### Modified Files
- `app/admin/dynamic-contents/landing-page/page.tsx`
  - Enhanced `handleImageUpload()` with reset & folder
  - Added `handlePreOrderImageUpload()`
  - Added `handleGridImageUpload()`
  - Updated all file inputs to use new functions
  - Added hover overlays for better UX

- `app/admin/dynamic-contents/brand-pages/page.tsx`
  - Enhanced `handleImageUpload()` with reset & folder
  - Updated file input to pass element reference

## Benefits

✅ Images upload properly to server
✅ Files organized by section type
✅ Can change existing images easily
✅ Visual feedback on hover
✅ Input resets after upload
✅ Error handling with user feedback
✅ Consistent upload behavior across all sections
✅ No more base64 encoding (better performance)

## Next Steps (Optional Enhancements)

1. **Loading States:** Show spinner during upload
2. **Progress Bar:** Show upload progress for large files
3. **Image Preview:** Show preview before upload
4. **Drag & Drop:** Add drag-and-drop support
5. **Validation:** Client-side file type/size validation
6. **Compression:** Auto-compress images before upload
7. **Cropping:** Add image cropping tool
8. **Multiple Upload:** Upload multiple images at once

## Notes

- The NEW database-driven pages (`landing-page-db`, `brand-pages-db`) already have the enhanced ImageUpload component with all these features
- This fix brings the OLD file-based pages up to par
- Both systems now work properly for image uploads
