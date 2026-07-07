# Simple JSON-Based Dynamic Content Solution

## 🎯 Simple Approach

Instead of a complex database system, we'll use JSON files stored in the backend that can be edited through an admin interface.

## 📁 File Structure

```
backend/
└── content/
    ├── landing-page.json       # Landing page content
    ├── nordictrack.json        # NordicTrack brand page
    ├── proform.json            # ProForm brand page
    └── ... (other brands)

app/
├── api/
│   ├── content/
│   │   ├── landing/route.ts    # Get landing page JSON
│   │   └── brand/[slug]/route.ts  # Get brand page JSON
│   └── admin/
│       └── content/
│           ├── route.ts         # List all content files
│           └── [file]/route.ts  # Get/Update specific file
└── admin/
    └── content-editor/
        ├── page.tsx             # List all content files
        └── [file]/page.tsx      # Edit specific file
```

## 📄 JSON Structure

### Landing Page JSON (`landing-page.json`)

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

### Brand Page JSON (`nordictrack.json`)

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
      "backgroundImage": "/images/brands/nordictrack/hero-bg.jpg",
      "logo": "/images/brands/nordictrack/logo.png"
    },
    {
      "id": "categories",
      "type": "brand-categories",
      "enabled": true,
      "title": "Shop by Category",
      "categories": [
        {
          "name": "Treadmills",
          "image": "/images/brands/nordictrack/treadmills.jpg",
          "url": "/shop?brand=nordictrack&category=treadmills"
        },
        {
          "name": "Ellipticals",
          "image": "/images/brands/nordictrack/ellipticals.jpg",
          "url": "/shop?brand=nordictrack&category=ellipticals"
        },
        {
          "name": "Bikes",
          "image": "/images/brands/nordictrack/bikes.jpg",
          "url": "/shop?brand=nordictrack&category=bikes"
        }
      ]
    },
    {
      "id": "behind-work",
      "type": "brand-behind-work",
      "enabled": true,
      "title": "Behind The Work",
      "description": "Discover the innovation and craftsmanship behind NordicTrack equipment",
      "image": "/images/brands/nordictrack/behind-work.jpg",
      "features": [
        "Advanced iFit Technology",
        "Premium Build Quality",
        "Interactive Training"
      ]
    }
  ]
}
```

## 🔧 Backend Implementation (Django)

### 1. Create Content Directory
```bash
mkdir -p backend/content
```

### 2. Django View (`backend/apps/api/views/content_views.py`)

```python
import os
import json
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

CONTENT_DIR = os.path.join(settings.BASE_DIR, 'content')

# Ensure content directory exists
os.makedirs(CONTENT_DIR, exist_ok=True)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_landing_page_content(request):
    """Get landing page content"""
    try:
        file_path = os.path.join(CONTENT_DIR, 'landing-page.json')
        
        if not os.path.exists(file_path):
            # Return default content if file doesn't exist
            return Response({
                'success': True,
                'sections': [],
                'preOrderSection': None
            })
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return Response({
            'success': True,
            'sections': data.get('heroSections', []),
            'preOrderSection': data.get('preOrderSection')
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_brand_page_content(request, slug):
    """Get brand page content"""
    try:
        file_path = os.path.join(CONTENT_DIR, f'{slug}.json')
        
        if not os.path.exists(file_path):
            return Response({
                'success': False,
                'error': 'Brand page not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return Response({
            'success': True,
            'data': data
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_content_files(request):
    """List all content files (Admin only)"""
    try:
        files = []
        
        for filename in os.listdir(CONTENT_DIR):
            if filename.endswith('.json'):
                file_path = os.path.join(CONTENT_DIR, filename)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                files.append({
                    'filename': filename,
                    'pageKey': data.get('pageKey', filename.replace('.json', '')),
                    'pageType': data.get('pageType', 'unknown'),
                    'title': data.get('title', filename),
                    'lastModified': os.path.getmtime(file_path)
                })
        
        return Response({
            'success': True,
            'files': files
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def manage_content_file(request, filename):
    """Get or update a content file (Admin only)"""
    try:
        file_path = os.path.join(CONTENT_DIR, f'{filename}.json')
        
        if request.method == 'GET':
            if not os.path.exists(file_path):
                return Response({
                    'success': False,
                    'error': 'File not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            return Response({
                'success': True,
                'data': data
            })
        
        elif request.method == 'PUT':
            data = request.data
            
            # Validate JSON structure
            if not isinstance(data, dict):
                return Response({
                    'success': False,
                    'error': 'Invalid JSON structure'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Save to file
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            return Response({
                'success': True,
                'message': 'Content updated successfully',
                'data': data
            })
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

### 3. URLs (`backend/apps/api/urls.py`)

```python
from django.urls import path
from .views import content_views

urlpatterns = [
    # Public endpoints
    path('hero-sections/', content_views.get_landing_page_content, name='landing-content'),
    path('content/landing/', content_views.get_landing_page_content, name='landing-content-alt'),
    path('content/brand/<str:slug>/', content_views.get_brand_page_content, name='brand-content'),
    
    # Admin endpoints
    path('admin/content/', content_views.list_content_files, name='list-content'),
    path('admin/content/<str:filename>/', content_views.manage_content_file, name='manage-content'),
]
```

## 🎨 Frontend Implementation

### 1. API Routes

#### `app/api/admin/content/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/content/`, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch content files" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching content files:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### `app/api/admin/content/[filename]/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/content/${params.filename}/`,
      {
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch content" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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

    const response = await fetch(
      `${API_BASE_URL}/admin/content/${params.filename}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to update content" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 2. Admin Interface

#### `app/admin/content-editor/page.tsx`
```typescript
"use client";

import { useState, useEffect } from "react";
import { FileJson, Edit2, Eye } from "lucide-react";
import Link from "next/link";

interface ContentFile {
  filename: string;
  pageKey: string;
  pageType: string;
  title: string;
  lastModified: number;
}

export default function ContentEditorPage() {
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/admin/content");
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Editor</h1>
          <p className="mt-2 text-gray-600">
            Manage your page content using JSON files
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <div
              key={file.filename}
              className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <FileJson className="h-8 w-8 text-orange-500" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{file.title}</h3>
                  <p className="text-sm text-gray-600">{file.filename}</p>
                </div>
              </div>

              <div className="mb-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    file.pageType === "landing"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {file.pageType}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/content-editor/${file.pageKey}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit JSON
                </Link>
                <Link
                  href={file.pageType === "landing" ? "/" : `/brand/${file.pageKey}`}
                  target="_blank"
                  className="flex items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### `app/admin/content-editor/[filename]/page.tsx`
```typescript
"use client";

import { useState, useEffect } from "react";
import { Save, Eye, AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditContentPage() {
  const params = useParams();
  const router = useRouter();
  const filename = params.filename as string;

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContent();
  }, [filename]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/admin/content/${filename}`);
      if (response.ok) {
        const data = await response.json();
        setContent(JSON.stringify(data.data, null, 2));
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);

    try {
      // Validate JSON
      const jsonData = JSON.parse(content);

      const response = await fetch(`/api/admin/content/${filename}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        alert("Content saved successfully!");
      } else {
        setError("Failed to save content");
      }
    } catch (err) {
      setError("Invalid JSON format");
    } finally {
      setSaving(false);
    }
  };

  const formatJSON = () => {
    try {
      const jsonData = JSON.parse(content);
      setContent(JSON.stringify(jsonData, null, 2));
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
            <p className="mt-2 text-gray-600">{filename}.json</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={formatJSON}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Format JSON
            </button>
            <Link
              href={filename === "landing-page" ? "/" : `/brand/${filename}`}
              target="_blank"
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-[calc(100vh-300px)] w-full font-mono text-sm"
            style={{
              resize: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1rem",
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

## 🚀 Quick Setup

### 1. Create Initial JSON Files

```bash
# Create content directory in backend
mkdir -p backend/content

# Create landing page JSON
cat > backend/content/landing-page.json << 'EOF'
{
  "pageType": "landing",
  "pageKey": "home",
  "title": "Home Page",
  "heroSections": [],
  "preOrderSection": {
    "enabled": false
  }
}
EOF

# Create NordicTrack JSON
cat > backend/content/nordictrack.json << 'EOF'
{
  "pageType": "brand",
  "pageKey": "nordictrack",
  "slug": "nordictrack",
  "title": "NordicTrack",
  "sections": []
}
EOF
```

### 2. Add Backend URLs

Add the content views to your Django URLs.

### 3. Access Admin

```
http://localhost:3000/admin/content-editor
```

## ✅ Benefits

1. **Simple** - Just JSON files, no database migrations
2. **Easy to Edit** - Edit JSON directly in admin or text editor
3. **Version Control** - JSON files can be committed to Git
4. **Backup** - Easy to backup (just copy files)
5. **Fast** - No database queries
6. **Portable** - Easy to move between environments

## 📝 Summary

This solution gives you:
- ✅ JSON-based content storage
- ✅ Simple admin interface to edit JSON
- ✅ No database required
- ✅ Easy to understand and maintain
- ✅ Version control friendly
- ✅ Fast implementation (30 minutes)

Access your content editor at:
```
http://localhost:3000/admin/content-editor
```
