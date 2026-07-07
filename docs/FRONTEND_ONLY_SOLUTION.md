# Frontend-Only JSON Content Solution

## 🎯 Pure Frontend Solution (No Backend Changes!)

Store JSON files and images directly in your Next.js project.

## 📁 File Structure

```
your-nextjs-project/
├── public/
│   ├── images/
│   │   ├── landing/
│   │   │   ├── hero-section/
│   │   │   │   ├── main.png
│   │   │   │   ├── top-right.png
│   │   │   │   └── ...
│   │   │   └── pre-order/
│   │   │       ├── main-feature.png
│   │   │       └── grid-1.png
│   │   └── brands/
│   │       ├── nordictrack/
│   │       │   ├── hero.jpg
│   │       │   └── ...
│   │       └── proform/
│   │           └── ...
│   └── content/
│       ├── landing-page.json
│       ├── nordictrack.json
│       ├── proform.json
│       └── ... (25 brand files)
│
├── app/
│   ├── api/
│   │   └── content/
│   │       ├── route.ts              ← List JSON files
│   │       ├── [filename]/
│   │       │   └── route.ts          ← Get/Update JSON
│   │       └── upload/
│   │           └── route.ts          ← Upload images
│   └── admin/
│       └── content-editor/
│           ├── page.tsx               ← List files
│           └── [filename]/
│               └── page.tsx           ← Edit JSON + Upload images
```

## 🖼️ Image Storage

### Option 1: Public Folder (Recommended) ✅
```
public/images/
├── landing/
│   ├── hero-section/
│   │   ├── main.png
│   │   ├── top-right.png
│   │   ├── bottom-right.png
│   │   └── tall-right.png
│   └── pre-order/
│       ├── main-feature.png
│       ├── grid-1.png
│       ├── grid-2.png
│       ├── grid-3.png
│       └── grid-4.png
└── brands/
    ├── nordictrack/
    │   ├── hero.jpg
    │   ├── category-1.jpg
    │   └── ...
    └── proform/
        └── ...
```

**Benefits:**
- ✅ Simple - Just drop images in public folder
- ✅ Fast - Served directly by Next.js
- ✅ No upload needed - Copy/paste images
- ✅ Version control - Commit images to Git
- ✅ CDN ready - Works with Vercel/Netlify CDN

**Usage in JSON:**
```json
{
  "image": "/images/landing/hero-section/main.png"
}
```

### Option 2: Upload to Public Folder
- Admin can upload images through interface
- Images saved to `public/images/uploads/`
- Requires file upload API route

### Option 3: External CDN (Advanced)
- Upload to Cloudinary, AWS S3, etc.
- Store URLs in JSON
- Better for large sites

## 📝 JSON Storage

### Location: `public/content/`

```
public/content/
├── landing-page.json
├── nordictrack.json
├── proform.json
├── schwinn.json
└── ... (22 more brands)
```

**Why public folder?**
- ✅ Easy to access
- ✅ Can be fetched directly
- ✅ No API route needed for reading
- ✅ Version control friendly

## 🚀 Implementation

### Step 1: Create Directories (2 minutes)

```bash
# In your Next.js project root
mkdir -p public/content
mkdir -p public/images/landing/hero-section
mkdir -p public/images/landing/pre-order
mkdir -p public/images/brands/nordictrack
mkdir -p public/images/uploads
```

### Step 2: Create JSON Files (5 minutes)

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
      "image": "/images/landing/hero-section/main.png",
      "discountBadge": {
        "enabled": true,
        "text": "Up to",
        "percentage": "40%"
      }
    }
  ],
  "preOrderSection": {
    "enabled": true,
    "sectionTitle": "Pre-Order Now & Save Big",
    "mainFeature": {
      "image": "/images/landing/pre-order/main-feature.png",
      "title": "Nordictrack T Series\n10 Treadmill"
    }
  }
}
```

Create `public/content/nordictrack.json`:
```json
{
  "pageType": "brand",
  "pageKey": "nordictrack",
  "slug": "nordictrack",
  "title": "NordicTrack",
  "sections": [
    {
      "id": "hero",
      "type": "brand-hero",
      "title": "NordicTrack",
      "backgroundImage": "/images/brands/nordictrack/hero.jpg"
    }
  ]
}
```

### Step 3: Add Your Images (5 minutes)

Copy your existing images to the new structure:
```bash
# Copy existing images
cp /path/to/existing/images/landing/* public/images/landing/hero-section/
cp /path/to/existing/images/preorder/* public/images/landing/pre-order/
cp /path/to/existing/images/nordictrack/* public/images/brands/nordictrack/
```

Or just reference existing paths in JSON:
```json
{
  "image": "/images/landing/hero-section/6da4e59475159602882c3fabee07c1388d618dbb.png"
}
```

### Step 4: Update Frontend Components (Already Done!)

Your existing components already fetch from API:
- `app/(public)/_components/landing/hero-section.tsx`
- `app/(public)/_components/landing/pre-order-section.tsx`

They'll work with the new JSON structure!

## 🎨 Admin Interface

### Reading JSON Files

Update `app/api/admin/content/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const contentDir = path.join(process.cwd(), "public/content");
    const files = fs.readdirSync(contentDir);
    
    const result = files
      .filter(file => file.endsWith(".json"))
      .map(file => {
        const filePath = path.join(contentDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const stats = fs.statSync(filePath);
        
        return {
          filename: file,
          pageKey: content.pageKey || file.replace(".json", ""),
          pageType: content.pageType || "unknown",
          title: content.title || file,
          lastModified: stats.mtimeMs / 1000,
        };
      });

    return NextResponse.json({
      success: true,
      files: result,
    });
  } catch (error) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}
```

### Reading/Writing Specific File

Update `app/api/admin/content/[filename]/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filePath = path.join(
      process.cwd(),
      "public/content",
      `${params.filename}.json`
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return NextResponse.json(
      { error: "Failed to read file" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const body = await request.json();
    const filePath = path.join(
      process.cwd(),
      "public/content",
      `${params.filename}.json`
    );

    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Content updated successfully",
      data: body,
    });
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json(
      { error: "Failed to update file" },
      { status: 500 }
    );
  }
}
```

### Image Upload API

Create `app/api/admin/content/upload/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "uploads";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public/images", folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filePath = path.join(uploadDir, filename);

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Return public URL
    const publicUrl = `/images/${folder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
```

## 🎯 How It Works

### Reading Content (Public Pages):

```typescript
// Option 1: Direct fetch from public folder
const response = await fetch("/content/landing-page.json");
const data = await response.json();

// Option 2: Through API route (for consistency)
const response = await fetch("/api/content/landing");
const data = await response.json();
```

### Editing Content (Admin):

```typescript
// 1. Fetch current content
const response = await fetch("/api/admin/content/landing-page");
const data = await response.json();

// 2. Edit JSON in admin interface

// 3. Save changes
await fetch("/api/admin/content/landing-page", {
  method: "PUT",
  body: JSON.stringify(updatedData),
});
```

### Uploading Images (Admin):

```typescript
// Upload image
const formData = new FormData();
formData.append("file", imageFile);
formData.append("folder", "landing/hero-section");

const response = await fetch("/api/admin/content/upload", {
  method: "POST",
  body: formData,
});

const { url } = await response.json();
// url = "/images/landing/hero-section/1234567890-image.png"

// Update JSON with new image URL
data.heroSections[0].image = url;
```

## ✅ Benefits

1. **No Backend Changes** - Everything in Next.js
2. **Simple** - Just files in public folder
3. **Fast** - Direct file access
4. **Version Control** - Commit everything to Git
5. **Easy Deployment** - Works on Vercel, Netlify, etc.
6. **No Database** - No MySQL tables needed
7. **CDN Ready** - Images served through CDN

## 📊 Storage Breakdown

```
public/
├── content/              (~150 KB)
│   ├── landing-page.json (5 KB)
│   └── 25 brand files    (145 KB)
│
└── images/               (~50 MB typical)
    ├── landing/          (10 MB)
    └── brands/           (40 MB)
```

## 🎨 Admin Workflow

1. **Edit Content:**
   - Go to `/admin/content-editor`
   - Click "Edit JSON"
   - Modify content
   - Save

2. **Change Image:**
   - Option A: Replace file in `public/images/`
   - Option B: Upload new image through admin
   - Update JSON with new path
   - Save

3. **Add Brand:**
   - Create `public/content/newbrand.json`
   - Add images to `public/images/brands/newbrand/`
   - Edit JSON through admin

## 🚀 Quick Start

```bash
# 1. Create directories
mkdir -p public/content
mkdir -p public/images/landing/hero-section
mkdir -p public/images/brands

# 2. Add JSON files
# (Copy from examples above)

# 3. Add images
# (Copy your existing images)

# 4. Update API routes
# (Use code examples above)

# 5. Test
npm run dev
open http://localhost:3000/admin/content-editor
```

## 🎉 Summary

**Everything in Frontend:**
- ✅ JSON files in `public/content/`
- ✅ Images in `public/images/`
- ✅ Admin interface already created
- ✅ No backend changes needed
- ✅ No database tables needed

**Total Setup: 15 minutes**
