# JSON-Based Content Management - Quick Setup Guide

## 🎯 Simple Solution

Store page content in JSON files that can be edited through an admin interface. No database required!

## 📁 What Was Created

### Frontend Files (4 files)
1. ✅ `app/admin/content-editor/page.tsx` - List all JSON files
2. ✅ `app/admin/content-editor/[filename]/page.tsx` - Edit JSON file
3. ✅ `app/api/admin/content/route.ts` - API to list files
4. ✅ `app/api/admin/content/[filename]/route.ts` - API to get/update file

### Backend (You need to add)
1. Django view to handle JSON files
2. URL configuration

## 🚀 Quick Setup (15 Minutes)

### Step 1: Create Content Directory (2 minutes)

```bash
# In your backend directory
mkdir -p backend/content

# Create landing page JSON
cat > backend/content/landing-page.json << 'EOF'
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
EOF

# Create NordicTrack brand page JSON
cat > backend/content/nordictrack.json << 'EOF'
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
      "backgroundImage": "/images/brands/nordictrack/hero-bg.jpg"
    }
  ]
}
EOF
```

### Step 2: Add Django Backend Code (5 minutes)

Create file: `backend/apps/api/views/content_views.py`

```python
import os
import json
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

CONTENT_DIR = os.path.join(settings.BASE_DIR, 'content')
os.makedirs(CONTENT_DIR, exist_ok=True)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_landing_page_content(request):
    """Get landing page content from JSON file"""
    try:
        file_path = os.path.join(CONTENT_DIR, 'landing-page.json')
        
        if not os.path.exists(file_path):
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
    """Get brand page content from JSON file"""
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
    """List all JSON content files"""
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
    """Get or update a JSON content file"""
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
            
            if not isinstance(data, dict):
                return Response({
                    'success': False,
                    'error': 'Invalid JSON structure'
                }, status=status.HTTP_400_BAD_REQUEST)
            
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

### Step 3: Add URLs (3 minutes)

Add to your `backend/apps/api/urls.py`:

```python
from django.urls import path
from .views import content_views

urlpatterns = [
    # ... your existing URLs
    
    # Public endpoints
    path('hero-sections/', content_views.get_landing_page_content, name='landing-content'),
    path('content/landing/', content_views.get_landing_page_content, name='landing-content-alt'),
    path('content/brand/<str:slug>/', content_views.get_brand_page_content, name='brand-content'),
    
    # Admin endpoints
    path('admin/content/', content_views.list_content_files, name='list-content'),
    path('admin/content/<str:filename>/', content_views.manage_content_file, name='manage-content'),
]
```

### Step 4: Update Existing Hero Sections API (2 minutes)

Update `app/api/admin/hero-sections/route.ts`:

```typescript
// The GET method now reads from JSON file via backend
// The POST method now writes to JSON file via backend
// Backend handles the file operations
```

### Step 5: Test It! (3 minutes)

```bash
# Start backend
cd backend
python manage.py runserver

# Start frontend (in another terminal)
cd frontend
npm run dev

# Visit the content editor
open http://localhost:3000/admin/content-editor
```

## 🎨 How to Use

### 1. List All Content Files
```
http://localhost:3000/admin/content-editor
```
- See all JSON files
- Filter by type (landing/brand)
- Click "Edit JSON" to edit

### 2. Edit JSON File
```
http://localhost:3000/admin/content-editor/landing-page
```
- Edit JSON directly
- Click "Format JSON" to auto-format
- Click "Save Changes" to save
- Click "Preview" to see live changes

### 3. Create New Brand Page
```bash
# Create new JSON file in backend/content/
cat > backend/content/proform.json << 'EOF'
{
  "pageType": "brand",
  "pageKey": "proform",
  "slug": "proform",
  "title": "ProForm",
  "sections": []
}
EOF
```

## 📝 JSON Structure Examples

### Landing Page
```json
{
  "pageType": "landing",
  "pageKey": "home",
  "title": "Home Page",
  "heroSections": [
    {
      "id": "main",
      "position": "main",
      "title": "Your Title\nLine 2",
      "buttonText": "Shop Now",
      "buttonUrl": "/shop",
      "image": "/path/to/image.png",
      "discountBadge": {
        "enabled": true,
        "text": "Up to",
        "percentage": "40%"
      }
    }
  ],
  "preOrderSection": {
    "enabled": true,
    "sectionTitle": "Pre-Order Now",
    "mainFeature": { ... },
    "gridImages": [ ... ]
  }
}
```

### Brand Page
```json
{
  "pageType": "brand",
  "pageKey": "nordictrack",
  "slug": "nordictrack",
  "title": "NordicTrack",
  "metaTitle": "NordicTrack - Home Fitness",
  "metaDescription": "Description here",
  "sections": [
    {
      "id": "hero",
      "type": "brand-hero",
      "enabled": true,
      "title": "NordicTrack",
      "buttonText": "Shop Now",
      "buttonUrl": "/shop?brand=nordictrack"
    }
  ]
}
```

## ✅ Benefits

1. **Super Simple** - Just JSON files, no database
2. **Easy to Edit** - Visual JSON editor in admin
3. **Version Control** - Commit JSON files to Git
4. **Fast** - No database queries
5. **Portable** - Copy files between environments
6. **Backup** - Just backup the content folder

## 🎯 What You Can Do

### Update Landing Page
1. Go to `/admin/content-editor`
2. Click "Edit JSON" on "landing-page.json"
3. Modify the JSON
4. Click "Save Changes"
5. Refresh homepage to see changes

### Create Brand Page
1. Create new JSON file in `backend/content/`
2. Add brand data
3. Refresh `/admin/content-editor`
4. Edit as needed

### Change Images
1. Edit JSON file
2. Update `image` field with new path
3. Save

### Toggle Sections
1. Edit JSON file
2. Set `enabled: false` to hide section
3. Save

## 🔧 Troubleshooting

### Files not showing up
- Check `backend/content/` directory exists
- Check files have `.json` extension
- Check JSON is valid

### Can't save changes
- Check backend is running
- Check you're logged in as admin
- Check file permissions

### Changes not showing on site
- Clear browser cache
- Check JSON syntax is valid
- Check backend is reading correct file

## 📚 Files Created

Frontend:
- ✅ `app/admin/content-editor/page.tsx`
- ✅ `app/admin/content-editor/[filename]/page.tsx`
- ✅ `app/api/admin/content/route.ts`
- ✅ `app/api/admin/content/[filename]/route.ts`

Backend (you add):
- `backend/apps/api/views/content_views.py`
- Update `backend/apps/api/urls.py`

Content:
- `backend/content/landing-page.json`
- `backend/content/nordictrack.json`
- `backend/content/[other-brands].json`

## 🎉 Done!

You now have a simple JSON-based content management system!

Access it at: `http://localhost:3000/admin/content-editor`

Total setup time: 15 minutes
No database required!
