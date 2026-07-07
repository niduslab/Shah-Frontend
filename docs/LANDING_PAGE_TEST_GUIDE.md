# Landing Page Dynamic Content - Test Guide

## Quick Test Steps

### 1. Test Admin Panel
1. Go to: `http://localhost:3000/admin/dynamic-contents/landing-page`
2. You should see 4 hero sections and 1 pre-order section
3. Click on any section to edit
4. Change the title or upload a new image
5. Click "Save Changes"
6. You should see success alert

### 2. Test Frontend Display
1. Go to: `http://localhost:3000/`
2. Refresh the page (Ctrl+F5 or Cmd+Shift+R)
3. You should see your changes reflected immediately
4. Hero section should show updated content
5. Pre-order section should show updated content

### 3. Test Image Upload
1. In admin panel, click a section to edit
2. Click on the image area
3. Select a new image from your computer
4. Image should upload and display immediately
5. Save changes
6. Verify image appears on frontend

## What's Dynamic Now

✅ **Hero Section (4 parts):**
- Main section (large left)
- Top right section
- Bottom right section
- Tall right section

✅ **Pre-Order Section:**
- Section title
- Main feature image & content
- 4 grid images
- Save badge
- View all link

## Data Flow

```
Admin Panel → Save → JSON File → Public API → Frontend Components
```

1. Admin edits content
2. Saves to `public/content/landing-page.json`
3. Frontend fetches from `/api/hero-sections`
4. Components render dynamic content

## Troubleshooting

**Changes not showing?**
- Hard refresh the page (Ctrl+F5)
- Check browser console for errors
- Verify file saved: `public/content/landing-page.json`

**Images not uploading?**
- Check file size (< 5MB)
- Check file type (PNG, JPG, GIF)
- Check browser console for errors

**Default content showing?**
- Save content from admin panel first
- Check if JSON file exists
- API will return defaults if no file

## Success Criteria

✅ Can edit hero sections in admin
✅ Can edit pre-order section in admin
✅ Can upload images
✅ Changes save successfully
✅ Frontend displays saved content
✅ Images display correctly
✅ No console errors

Your landing page is now fully dynamic!
