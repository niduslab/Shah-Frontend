# Image Upload Guide - Dynamic Content System

## Overview
The admin pages now have a visual content editor with built-in image upload functionality. No more manual JSON editing for images!

## Features

### 1. Visual Content Editor
- **Two Modes:**
  - **Visual Mode:** User-friendly form with image uploads
  - **JSON Mode:** Advanced JSON editor for custom structures

### 2. Image Upload Component
- Drag & drop or click to upload
- Live image preview
- Remove/replace images
- File validation (images only, max 5MB)
- Loading states
- Error handling

### 3. Auto-Detection
The editor automatically detects your section type and shows relevant fields:

- **Hero Section:** Background image, title, button, discount badge
- **Categories Section:** Multiple items with images
- **Behind The Work:** Three images (left, center, right) + stats
- **Custom Sections:** Falls back to JSON mode

## How to Use

### Creating a Hero Section with Image

1. Go to `/admin/dynamic-contents/landing-page-db`
2. Click **"Add Section"**
3. Fill in basic info:
   - Section Name: `hero`
   - Title: `Hero Section`
   - Sort Order: `1`
4. In the **Content** area:
   - Editor auto-switches to Visual mode
   - Click **"Background Image"** field
   - Upload your hero image
   - Fill in Title, Description, Button Text, Button URL
   - Toggle discount badge if needed
5. Click **"Save"**

### Creating Categories with Images

1. Section Name: `categories`
2. Visual editor shows:
   - Section Title field
   - Categories list (empty initially)
3. Click **"Add Item"**
4. For each category:
   - Enter Name
   - Upload Image (click image field)
   - Enter Link URL
5. Add more categories as needed
6. Click **"Save"**

### Creating Behind The Work Section

1. Section Name: `behind-the-work`
2. Visual editor shows:
   - Title & Description
   - Stats (add multiple with +)
   - Three image fields:
     - Left Image
     - Center Image
     - Right Image
3. Upload each image
4. Click **"Save"**

## Image Upload Details

### Supported Formats
- PNG
- JPG/JPEG
- GIF
- WebP

### File Size Limit
- Maximum: 5MB per image

### Storage Location
- Images saved to: `public/images/page-content/`
- URL format: `/images/page-content/1234567890-filename.jpg`

### Naming Convention
- Timestamp + original filename
- Example: `1710518400000-hero-background.jpg`

## Tips & Tricks

### 1. Quick Image Replacement
- Hover over existing image
- Click "Remove" button
- Upload new image

### 2. Switch Between Modes
- Use Visual mode for common sections
- Switch to JSON mode for custom structures
- Changes sync between modes

### 3. Reusing Images
- Copy image URL from one section
- Paste in JSON mode for another section
- Or re-upload the same image

### 4. Bulk Image Upload
For multiple images:
1. Upload first image
2. Click "Add Item" for next
3. Upload next image
4. Repeat

### 5. Image Optimization
Before uploading:
- Resize to appropriate dimensions
- Compress to reduce file size
- Use WebP for better performance

## Common Section Structures

### Hero Section Content
```json
{
  "backgroundImage": "/images/page-content/123-hero.jpg",
  "title": "Your Title Here",
  "highlightedText": "Highlighted",
  "description": "Description text...",
  "buttonText": "Shop Now",
  "buttonUrl": "/shop",
  "discountBadge": {
    "enabled": true,
    "text": "Up to",
    "percentage": "40%"
  }
}
```

### Categories Section Content
```json
{
  "sectionTitle": "Explore Categories",
  "items": [
    {
      "name": "Bikes",
      "image": "/images/page-content/456-bikes.jpg",
      "href": "/shop/bikes"
    },
    {
      "name": "Treadmills",
      "image": "/images/page-content/789-treadmills.jpg",
      "href": "/shop/treadmills"
    }
  ]
}
```

### Behind The Work Content
```json
{
  "title": "Thinking Behind the Work",
  "description": "Long description here...",
  "stats": [
    { "value": "51+", "label": "Years of Experience" },
    { "value": "1M+", "label": "Happy Customers" }
  ],
  "images": {
    "left": "/images/page-content/111-left.jpg",
    "center": "/images/page-content/222-center.jpg",
    "right": "/images/page-content/333-right.jpg"
  }
}
```

## Troubleshooting

### Image Not Uploading
- Check file size (must be < 5MB)
- Verify file type (must be image)
- Check browser console for errors
- Ensure upload API is working

### Image Not Displaying
- Verify URL is correct
- Check if file exists in `public/images/page-content/`
- Clear browser cache
- Check Next.js image optimization settings

### Visual Editor Not Showing
- Section might not match known templates
- Switch to JSON mode
- Manually structure content
- Or create custom template

### JSON Parse Error
- Check for valid JSON syntax
- Use JSON validator
- Switch to Visual mode to auto-fix

## Best Practices

1. **Image Dimensions:**
   - Hero backgrounds: 1920x1080px or larger
   - Category images: 800x1000px (portrait)
   - Behind The Work: 600x800px

2. **File Naming:**
   - Use descriptive names
   - Avoid spaces (use hyphens)
   - Example: `hero-background-nordictrack.jpg`

3. **Organization:**
   - Keep images organized by section
   - Use consistent naming conventions
   - Document image sources

4. **Performance:**
   - Compress images before upload
   - Use appropriate formats (WebP for web)
   - Consider lazy loading for frontend

5. **Backup:**
   - Keep original high-res images
   - Document image sources
   - Version control for important images

## API Endpoint

The image upload uses:
```
POST /api/admin/content/upload
```

Request:
```
FormData {
  file: File
  folder: "page-content" (optional)
}
```

Response:
```json
{
  "success": true,
  "url": "/images/page-content/123456-filename.jpg",
  "filename": "123456-filename.jpg"
}
```

## Summary

✅ Visual editor with image uploads
✅ Drag & drop support
✅ Auto-detection of section types
✅ Real-time preview
✅ JSON fallback for custom sections
✅ File validation & error handling
✅ Easy image replacement
✅ No manual URL entry needed

Images are now fully integrated into the dynamic content system!
