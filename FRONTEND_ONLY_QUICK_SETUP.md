# Frontend-Only Solution - Quick Setup (10 Minutes)

## ✅ Everything in Next.js - No Backend Changes!

## 📁 Where Things Are Stored

```
your-nextjs-project/
├── public/
│   ├── content/                    ← JSON files here
│   │   ├── landing-page.json
│   │   ├── nordictrack.json
│   │   └── ... (25 brand files)
│   │
│   └── images/                     ← Images here
│       ├── landing/
│       │   ├── hero-section/
│       │   └── pre-order/
│       └── brands/
│           ├── nordictrack/
│           └── ...
```

## 🚀 Setup Steps

### Step 1: Create Directories (1 minute)

```bash
# In your Next.js project root
mkdir -p public/content
mkdir -p public/images/landing/hero-section
mkdir -p public/images/landing/pre-order
mkdir -p public/images/brands/nordictrack
mkdir -p public/images/uploads
```

### Step 2: Create Landing Page JSON (2 minutes)

Create `public/content/landing-page.json`:

```json
{
  "pageType": "landing",
  "pageKey": "home",
  "title": "Home Page",
  "heroSections": [
    {
      "id": "main",
      "position": "main",
      "title": "Elevate Your\nFitness Journey",
      "buttonText": "Shop Now",
      "buttonUrl": "/shop",
      "image": "/images/landing/hero-section/6da4e59475159602882c3fabee07c1388d618dbb.png",
      "discountBadge": {
        "enabled": true,
        "text": "Up to",
        "percentage": "40%"
      }
    },
    {
      "id": "topRight",
      "position": "topRight",
      "title": "Perfect Gear\nAwaits",
      "buttonText": "Shop Now",
      "buttonUrl": "/shop",
      "image": "/images/landing/hero-section/d7c609f1a7f9028a48f85f6b588e7ae4e6803c45.png"
    },
    {
      "id": "bottomRight",
      "position": "bottomRight",
      "title": "Shine Bright with\nWeights",
      "buttonText": "Shop Now",
      "buttonUrl": "/shop",
      "image": "/images/landing/hero-section/efc3fc0e7c591b4a8aaa86acf5dae5a7e6ef5118.png"
    },
    {
      "id": "tallRight",
      "position": "tallRight",
      "title": "TOP\nPICKS",
      "buttonText": "Shop Now",
      "buttonUrl": "/shop",
      "image": "/images/landing/hero-section/e2e807f93cc803b571ae315331b10d75e097223b.png"
    }
  ],
  "preOrderSection": {
    "enabled": true,
    "sectionTitle": "Pre-Order Now & Save Big",
    "viewAllText": "View All Preorder Products",
    "viewAllUrl": "/pre-order",
    "mainFeature": {
      "image": "/images/landing/pre-order/c7b139cd4aecc159bde32e9387c0dcb372021ab9.png",
      "title": "Nordictrack T Series\n10 Treadmill",
      "buttonText": "Preorder Now",
      "buttonUrl": "/pre-order",
      "saveBadge": {
        "enabled": true,
        "text": "Save",
        "percentage": "30%"
      }
    },
    "gridImages": [
      {
        "id": "grid1",
        "image": "/images/landing/pre-order/606b82b85373e30dc10d2f79a0253f7d20502b39.png",
        "alt": "Fitness Equipment 1"
      },
      {
        "id": "grid2",
        "image": "/images/landing/pre-order/63594412e77df42c02a5f16d3a2eceb8d4f91d99.png",
        "alt": "Fitness Equipment 2"
      },
      {
        "id": "grid3",
        "image": "/images/landing/pre-order/a1d135ac0387f5fbbc33cdd695d09e992dc2d274.png",
        "alt": "Fitness Equipment 3"
      },
      {
        "id": "grid4",
        "image": "/images/landing/pre-order/a9bf5425dbad371e93771b044cfeaccd4402283d.png",
        "alt": "Fitness Equipment 4"
      }
    ]
  }
}
```

### Step 3: Create Brand Page JSON (2 minutes)

Create `public/content/nordictrack.json`:

```json
{
  "pageType": "brand",
  "pageKey": "nordictrack",
  "slug": "nordictrack",
  "title": "NordicTrack",
  "metaTitle": "NordicTrack - Home Fitness Equipment",
  "metaDescription": "Turn your home into a complete fitness space with NordicTrack's innovative treadmills, ellipticals, and exercise bikes.",
  "sections": [
    {
      "id": "hero",
      "type": "brand-hero",
      "enabled": true,
      "title": "NordicTrack",
      "subtitle": "Premium Home Fitness Equipment",
      "description": "Turn your home into a complete fitness space",
      "buttonText": "Shop Now",
      "buttonUrl": "/shop?brand=nordictrack",
      "backgroundImage": "/images/brands/nordictrack/hero.jpg"
    }
  ]
}
```

### Step 4: Images (Already There!)

Your images are already in `public/images/`. Just reference them in JSON:

```json
{
  "image": "/images/landing/hero-section/6da4e59475159602882c3fabee07c1388d618dbb.png"
}
```

### Step 5: Test (5 minutes)

```bash
# Start Next.js
npm run dev

# Visit admin interface
open http://localhost:3000/admin/content-editor

# You should see:
# - landing-page.json
# - nordictrack.json

# Click "Edit JSON" to edit content
# Click "Save Changes" to save
```

## ✅ Done! That's It!

## 🎨 How to Use

### Edit Landing Page:
1. Go to `http://localhost:3000/admin/content-editor`
2. Click "Edit JSON" on landing-page.json
3. Modify the JSON
4. Click "Save Changes"
5. Refresh homepage to see changes

### Change Image:
**Option 1: Replace existing image**
```bash
# Replace the image file in public/images/
cp new-image.png public/images/landing/hero-section/main.png
```

**Option 2: Upload new image (future feature)**
- Upload through admin interface
- Image saved to `public/images/uploads/`
- Update JSON with new path

### Add New Brand:
```bash
# Create JSON file
cat > public/content/proform.json << 'EOF'
{
  "pageType": "brand",
  "pageKey": "proform",
  "slug": "proform",
  "title": "ProForm",
  "sections": []
}
EOF

# Add images
mkdir -p public/images/brands/proform
cp brand-images/* public/images/brands/proform/

# Refresh admin to see it
```

## 📊 What Was Created

### API Routes (Already Done!):
1. ✅ `app/api/admin/content/route.ts` - List JSON files
2. ✅ `app/api/admin/content/[filename]/route.ts` - Get/Update JSON
3. ✅ `app/api/admin/content/upload/route.ts` - Upload images

### Admin Interface (Already Done!):
1. ✅ `app/admin/content-editor/page.tsx` - List files
2. ✅ `app/admin/content-editor/[filename]/page.tsx` - Edit JSON

### Storage:
1. ✅ `public/content/` - JSON files
2. ✅ `public/images/` - Image files

## 🖼️ Image Management

### Current Images (Keep Using):
```
public/images/landing/hero-section/6da4e59475159602882c3fabee07c1388d618dbb.png
public/images/landing/pre-order/c7b139cd4aecc159bde32e9387c0dcb372021ab9.png
```

### New Images (Upload Here):
```
public/images/uploads/1234567890-new-image.png
```

### Organize by Folder:
```
public/images/
├── landing/
│   ├── hero-section/
│   └── pre-order/
├── brands/
│   ├── nordictrack/
│   ├── proform/
│   └── schwinn/
└── uploads/          ← New uploads go here
```

## ✅ Benefits

1. **No Backend Changes** - Everything in Next.js
2. **No Database** - Just JSON files
3. **Simple** - Easy to understand
4. **Fast** - Direct file access
5. **Version Control** - Commit to Git
6. **Images Included** - All in public folder
7. **CDN Ready** - Works with Vercel/Netlify

## 🎯 Summary

**Setup Time:** 10 minutes
**Backend Changes:** None!
**Database Tables:** None!
**Complexity:** Very Low

**Files Created:**
- ✅ `public/content/landing-page.json`
- ✅ `public/content/nordictrack.json`
- ✅ API routes (already done)
- ✅ Admin interface (already done)

**Access admin:**
```
http://localhost:3000/admin/content-editor
```

**Images stored in:**
```
public/images/
```

**JSON stored in:**
```
public/content/
```

**Everything in frontend! No backend needed!**
