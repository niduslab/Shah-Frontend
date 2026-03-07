# Dynamic Pages - Quick Start Guide

## Understanding the Two-Step Process

The Dynamic Pages system uses a **two-step process** for creating sections:

### Step 1: Create Section Structure
Use the "Add Section" modal to create the section skeleton:
- Section Type (hero_slider, product_grid, etc.)
- Section Title (optional display name)
- Sort Order
- Active Status

### Step 2: Add Content
After creating the section, use the "Edit Content" button to add the actual content and settings using the JSON editor.

---

## Why Two Steps?

This design allows for:
1. **Flexibility** - Different section types have different content structures
2. **Validation** - Ensures section type is set before content
3. **Organization** - Separates structure from content
4. **Easy Editing** - Content can be updated without changing section metadata

---

## Complete Workflow Example

### Creating a Hero Slider Section

#### Step 1: Add Section
1. Click "Add Section" button
2. Fill in the form:
   - **Section Type:** Hero Slider
   - **Section Title:** "Main Hero" (optional)
   - **Sort Order:** 1
   - **Active:** ✓ Checked
3. Click "Add Section"

#### Step 2: Edit Content
1. Find your new section in the list
2. Click the **Code icon** (Edit Content button)
3. You'll see two tabs: **Content** and **Settings**

**Content Tab** - Paste this:
```json
{
  "slides": [
    {
      "type": "image",
      "media_url": "/storage/media/hero.jpg",
      "title": "Elevate Your Fitness Journey",
      "subtitle": "Up to 40% Off",
      "cta_text": "Shop Now",
      "cta_link": "/shop",
      "text_position": "left",
      "text_color": "white"
    }
  ]
}
```

**Settings Tab** - Paste this:
```json
{
  "autoplay": true,
  "interval": 5000,
  "show_arrows": true,
  "show_dots": true
}
```

4. Click "Save Changes"

---

## Quick Reference: All Section Types

### 1. Hero Slider

**Step 1 - Add Section:**
- Type: Hero Slider
- Title: "Main Hero"

**Step 2 - Content:**
```json
{
  "slides": [
    {
      "type": "image",
      "media_url": "/storage/media/hero.jpg",
      "title": "Your Title",
      "subtitle": "Your Subtitle",
      "cta_text": "Shop Now",
      "cta_link": "/shop",
      "text_position": "left"
    }
  ]
}
```

**Settings:**
```json
{
  "autoplay": true,
  "interval": 5000,
  "show_arrows": true,
  "show_dots": true
}
```

---

### 2. Product Grid

**Step 1 - Add Section:**
- Type: Product Grid
- Title: "Featured Products"

**Step 2 - Content:**
```json
{
  "layout": "grid",
  "columns": 4,
  "items": [
    {
      "type": "product_card",
      "image": "/storage/media/product.jpg",
      "title": "Product Name",
      "description": "Product description",
      "cta_text": "Shop Now",
      "cta_link": "/product/slug",
      "badge": "40% OFF"
    }
  ]
}
```

**Settings:**
```json
{
  "show_prices": true,
  "show_ratings": true,
  "hover_effect": "zoom"
}
```

---

### 3. Category Grid

**Step 1 - Add Section:**
- Type: Category Grid
- Title: "Shop by Category"

**Step 2 - Content:**
```json
{
  "categories": [
    {
      "name": "Bikes",
      "image": "/storage/media/bikes.jpg",
      "link": "/category/bikes",
      "product_count": 45
    },
    {
      "name": "Treadmills",
      "image": "/storage/media/treadmills.jpg",
      "link": "/category/treadmills",
      "product_count": 32
    }
  ]
}
```

**Settings:**
```json
{
  "columns": 4,
  "show_border": true,
  "hover_effect": "zoom",
  "show_product_count": true
}
```

---

### 4. Banner

**Step 1 - Add Section:**
- Type: Banner
- Title: "Promotional Banner"

**Step 2 - Content:**
```json
{
  "image": "/storage/media/banner.jpg",
  "title": "Flash Sale",
  "subtitle": "Limited Time Offer",
  "cta_text": "Shop Now",
  "cta_link": "/flash-deals"
}
```

**Settings:**
```json
{
  "full_width": true,
  "height": "400px"
}
```

---

### 5. Brand Showcase

**Step 1 - Add Section:**
- Type: Brand Showcase
- Title: "Brand Story"

**Step 2 - Content:**
```json
{
  "background_type": "image",
  "background_url": "/storage/media/brand-bg.jpg",
  "logo": "/storage/media/brand-logo.png",
  "description": "Brand description here",
  "cta_text": "Shop Brand",
  "cta_link": "/brand/name"
}
```

**Settings:**
```json
{
  "text_color": "white",
  "overlay": true,
  "overlay_opacity": 0.5,
  "text_align": "left"
}
```

---

### 6. Video Section

**Step 1 - Add Section:**
- Type: Video Section
- Title: "Product Demo"

**Step 2 - Content:**
```json
{
  "video_url": "/storage/media/video.mp4",
  "poster": "/storage/media/poster.jpg",
  "title": "See It In Action",
  "description": "Watch our product demo"
}
```

**Settings:**
```json
{
  "autoplay": false,
  "controls": true,
  "loop": false,
  "muted": false
}
```

---

### 7. Text Content

**Step 1 - Add Section:**
- Type: Text Content
- Title: "About Section"

**Step 2 - Content:**
```json
{
  "html": "<h2>About Us</h2><p>Your content here...</p>",
  "text_align": "center"
}
```

**Settings:**
```json
{
  "max_width": "800px",
  "padding": "60px 20px"
}
```

---

### 8. Custom

**Step 1 - Add Section:**
- Type: Custom
- Title: "Custom Component"

**Step 2 - Content:**
```json
{
  "component_name": "NewsletterSignup",
  "props": {
    "title": "Subscribe",
    "placeholder": "Enter email"
  }
}
```

---

## Tips & Tricks

### 1. Use "Load Example" Button
In the Content Editor modal, click "Load Example" to see a pre-filled template for your section type.

### 2. Validate JSON
The editor will show errors if your JSON is invalid. Fix syntax errors before saving.

### 3. Test Content
After saving, visit your page on the frontend to see how it looks.

### 4. Copy Existing Sections
If you have a section that works well, copy its JSON and modify it for new sections.

### 5. Keep Backups
Before making major changes, copy your JSON to a text file as backup.

---

## Common Mistakes

### ❌ Forgetting to Edit Content
**Problem:** Section created but shows nothing on frontend
**Solution:** Click "Edit Content" button and add content JSON

### ❌ Invalid JSON Syntax
**Problem:** Missing comma, bracket, or quote
**Solution:** Use the JSON validator in the editor, check for red error messages

### ❌ Wrong Image Paths
**Problem:** Images don't load
**Solution:** Ensure images are uploaded and paths are correct (start with `/storage/media/`)

### ❌ Empty Content Object
**Problem:** Content is `{}`
**Solution:** Add the required fields for your section type

---

## Keyboard Shortcuts

- **Tab** - Indent JSON
- **Ctrl/Cmd + S** - Save (in some browsers)
- **Ctrl/Cmd + F** - Find in JSON
- **Ctrl/Cmd + Z** - Undo

---

## Need Help?

### Check These Resources:
1. **FRONTEND_DYNAMIC_PAGES_GUIDE.md** - Complete API reference
2. **NORDICTRACK_PAGE_CONTENT_EXAMPLE.md** - Real-world example
3. **DYNAMIC_PAGES_ADMIN_COMPLETE.md** - Full documentation

### Common Questions:

**Q: Can I add content when creating the section?**
A: No, this is by design. Create the section first, then edit content.

**Q: Why is my section not showing?**
A: Check that:
- Section is Active (checkbox)
- Content is not empty `{}`
- JSON is valid
- Images paths are correct

**Q: Can I preview before saving?**
A: Not yet, but you can save and check the frontend page.

**Q: How do I add multiple slides/items?**
A: In the content JSON, add more objects to the array:
```json
{
  "slides": [
    { "title": "Slide 1", ... },
    { "title": "Slide 2", ... },
    { "title": "Slide 3", ... }
  ]
}
```

---

## Visual Guide

```
┌─────────────────────────────────────────────────────┐
│  1. Click "Add Section"                             │
│     ↓                                               │
│  2. Fill Form (Type, Title, Order)                  │
│     ↓                                               │
│  3. Click "Add Section" Button                      │
│     ↓                                               │
│  4. Section appears in list (empty content)         │
│     ↓                                               │
│  5. Click "Edit Content" (Code icon)                │
│     ↓                                               │
│  6. Paste JSON in Content tab                       │
│     ↓                                               │
│  7. Paste JSON in Settings tab                      │
│     ↓                                               │
│  8. Click "Save Changes"                            │
│     ↓                                               │
│  9. Visit frontend to see result                    │
└─────────────────────────────────────────────────────┘
```

---

## Summary

✅ **Two-step process:** Create structure → Add content
✅ **Use JSON editor** for content and settings
✅ **Load Example** button for templates
✅ **Validate** before saving
✅ **Test** on frontend after saving

This workflow gives you maximum flexibility while keeping the interface clean and organized!
