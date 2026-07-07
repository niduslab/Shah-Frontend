# Dynamic Brand Pages - Quick Reference Card

## 🚀 Quick Start (5 Minutes)

### Step 1: Admin Creates Content
```
1. Go to: /admin/dynamic-contents/brand-pages-db/1
2. Configure sections (Hero, Categories, Behind Work, Shop By)
3. Upload images
4. Click "Save Changes"
```

### Step 2: User Visits Brand Page
```
1. Click brand from "Trusted Brands"
2. Automatically goes to: /brand/{slug}
3. Sees dynamically rendered content
```

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `app/(public)/brand/[slug]/page.tsx` | Main dynamic page |
| `app/(public)/brand/[slug]/not-found.tsx` | 404 page |
| `app/(public)/_components/brand/DynamicHeroSection.tsx` | Hero component |
| `app/(public)/_components/brand/DynamicCategoriesSection.tsx` | Categories component |
| `app/(public)/_components/brand/DynamicBehindTheWorkSection.tsx` | Brand story component |
| `app/(public)/_components/brand/DynamicShopBySection.tsx` | Products component |
| `app/api/admin/brand-pages/[brandId]/route.ts` | API endpoint (exists) |
| `public/content/brand-pages/{brandId}.json` | Stored content |

---

## 🔗 URLs

| URL | Purpose |
|-----|---------|
| `/admin/dynamic-contents/brand-pages-db/1` | Edit brand 1 page |
| `/brand/nordictrack` | View NordicTrack brand page |
| `/api/admin/brand-pages/1` | API endpoint for brand 1 |

---

## 📊 Data Structure (Simplified)

```json
{
  "hero": {
    "enabled": true,
    "backgroundImage": "/images/hero.jpg",
    "title": "Title\nWith Breaks",
    "highlightedText": "Highlighted",
    "description": "Description",
    "buttonText": "Button",
    "buttonUrl": "/link"
  },
  "categories": {
    "enabled": true,
    "sectionTitle": "Title",
    "items": [
      { "id": "1", "name": "Name", "image": "/img.jpg", "href": "/link" }
    ]
  },
  "behindTheWork": {
    "enabled": true,
    "title": "Title",
    "description": "Description",
    "stats": [{ "value": "51+", "label": "Label" }],
    "images": { "left": "/l.jpg", "center": "/c.jpg", "right": "/r.jpg" }
  },
  "shopBy": {
    "enabled": true,
    "cards": [
      {
        "id": "1",
        "image": "/img.jpg",
        "title": "Title",
        "buttonText": "Button",
        "buttonUrl": "/link",
        "badge": { "enabled": true, "value": "12", "label": "MPH" }
      }
    ]
  }
}
```

---

## 🎯 Admin Panel Checklist

### Hero Section
- [ ] Enable/Disable
- [ ] Upload background image
- [ ] Enter title (use `\n` for line breaks)
- [ ] Enter highlighted text
- [ ] Enter description
- [ ] Enter button text
- [ ] Enter button URL

### Categories Section
- [ ] Enable/Disable
- [ ] Enter section title
- [ ] Add categories (click "Add Category")
- [ ] For each category:
  - [ ] Upload image
  - [ ] Enter name
  - [ ] Enter link URL

### Behind The Work Section
- [ ] Enable/Disable
- [ ] Enter title
- [ ] Enter description
- [ ] Edit 3 statistics (value + label)
- [ ] Upload 3 images (left, center, right)

### Shop By Section
- [ ] Enable/Disable
- [ ] Add products (click "Add Card")
- [ ] For each product:
  - [ ] Upload image
  - [ ] Enter title
  - [ ] Enter button text
  - [ ] Enter button URL
  - [ ] Enable/Disable badge
  - [ ] If badge enabled:
    - [ ] Enter badge value
    - [ ] Enter badge label

---

## 🔄 Data Flow

```
Admin Panel
    ↓ (Save)
API POST /api/admin/brand-pages/{brandId}
    ↓
public/content/brand-pages/{brandId}.json
    ↓ (Fetch)
API GET /api/admin/brand-pages/{brandId}
    ↓
Frontend /brand/[slug]/page.tsx
    ↓
Render DynamicSections
    ↓
User sees brand page
```

---

## 🎨 Component Props

### DynamicHeroSection
```typescript
<DynamicHeroSection data={{
  backgroundImage: string,
  title: string,
  highlightedText: string,
  description: string,
  buttonText: string,
  buttonUrl: string
}} />
```

### DynamicCategoriesSection
```typescript
<DynamicCategoriesSection data={{
  sectionTitle: string,
  items: Array<{
    id: string,
    name: string,
    image: string,
    href: string
  }>
}} />
```

### DynamicBehindTheWorkSection
```typescript
<DynamicBehindTheWorkSection data={{
  title: string,
  description: string,
  stats: Array<{ value: string, label: string }>,
  images: { left: string, center: string, right: string }
}} />
```

### DynamicShopBySection
```typescript
<DynamicShopBySection data={{
  cards: Array<{
    id: string,
    image: string,
    title: string,
    buttonText: string,
    buttonUrl: string,
    badge?: { enabled: boolean, value: string, label: string }
  }>
}} />
```

---

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| Brand page shows "Content Being Prepared" | Create content in admin panel |
| Images not loading | Check image URLs in admin panel |
| Styling looks wrong | Clear browser cache |
| Links not working | Check URLs in admin panel |
| Section not showing | Check if section is enabled |

---

## 📝 Tips & Tricks

1. **Line breaks in title:** Use `\n` in hero title
2. **Internal links:** Use `/shop`, `/product/123`
3. **External links:** Use full URL `https://example.com`
4. **Image optimization:** Compress images before uploading
5. **Badge values:** Keep short (e.g., "12", "NEW", "SALE")
6. **Cache:** Changes appear after 1 hour or on redeploy

---

## 🚀 Deployment

### Before Deploying
- [ ] Test all brand pages locally
- [ ] Verify images load correctly
- [ ] Check all links work
- [ ] Test on mobile devices

### After Deploying
- [ ] Verify brand pages work in production
- [ ] Check images load from CDN
- [ ] Monitor for errors in logs
- [ ] Test admin panel functionality

---

## 📚 Documentation

| Document | Content |
|----------|---------|
| DYNAMIC_BRAND_PAGES_IMPLEMENTATION.md | Architecture overview |
| BRAND_PAGES_SETUP_GUIDE.md | Complete setup guide |
| BRAND_PAGE_DATA_STRUCTURE.md | Data structure reference |
| COMPONENT_ARCHITECTURE.md | Component hierarchy |
| IMPLEMENTATION_SUMMARY.md | Implementation overview |
| QUICK_REFERENCE.md | This file |

---

## 🎯 Key Points

✅ **No code changes needed** to add/modify brand pages
✅ **Admin panel** controls all content
✅ **Dynamic rendering** based on configuration
✅ **Fully typed** with TypeScript
✅ **Optimized** for performance
✅ **SEO friendly** with server-side rendering
✅ **Responsive** design for all devices
✅ **Accessible** with semantic HTML

---

## 🔗 Related URLs

- Admin Panel: `/admin/dynamic-contents/brand-pages-db/[brandId]`
- Brand Page: `/brand/[slug]`
- Brands List: `/brands`
- Trusted Brands: `/` (scroll down)
- API: `/api/admin/brand-pages/[brandId]`

---

## 💡 Common Tasks

### Add a new brand page
1. Go to `/admin/dynamic-contents/brand-pages-db/{brandId}`
2. Configure sections
3. Click "Save Changes"

### Update brand page content
1. Go to `/admin/dynamic-contents/brand-pages-db/{brandId}`
2. Edit sections
3. Click "Save Changes"

### Disable a section
1. Go to `/admin/dynamic-contents/brand-pages-db/{brandId}`
2. Uncheck "Enabled" for that section
3. Click "Save Changes"

### Add a product card
1. Go to `/admin/dynamic-contents/brand-pages-db/{brandId}`
2. Scroll to "Shop By Section"
3. Click "Add Card"
4. Fill in product details
5. Click "Save Changes"

---

## 🎓 Learning Path

1. **Read** IMPLEMENTATION_SUMMARY.md (5 min)
2. **Review** BRAND_PAGE_DATA_STRUCTURE.md (10 min)
3. **Study** COMPONENT_ARCHITECTURE.md (10 min)
4. **Follow** BRAND_PAGES_SETUP_GUIDE.md (15 min)
5. **Test** by creating a brand page (10 min)
6. **Deploy** to production (5 min)

**Total time: ~55 minutes**

---

## ✨ You're All Set!

Everything is ready to use. Start by:
1. Going to `/admin/dynamic-contents/brand-pages-db/1`
2. Configuring a brand page
3. Visiting `/brand/nordictrack` to see it live

**Happy coding!** 🚀
