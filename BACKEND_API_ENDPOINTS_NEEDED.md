# Backend API Endpoints Needed for Page Builder

## Issue
The page builder is trying to call `/api/admin/pages` but this endpoint returns 404 (Not Found).

## Required Backend Endpoints

### Base URL
`http://localhost:8000` (Laravel backend)

### Endpoints to Create

#### 1. Create Page
```
POST /api/admin/pages
```

**Request Body**:
```json
{
  "title": "Home Page",
  "slug": "home",
  "type": "landing",
  "is_active": true,
  "sort_order": 0
}
```

**Response**:
```json
{
  "id": 1,
  "title": "Home Page",
  "slug": "home",
  "type": "landing",
  "is_active": true,
  "sort_order": 0,
  "created_at": "2024-01-01T00:00:00.000000Z",
  "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

Or wrapped:
```json
{
  "data": {
    "id": 1,
    ...
  }
}
```

#### 2. Get All Pages
```
GET /api/admin/pages?page=1&per_page=15&type=landing
```

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Home Page",
      "slug": "home",
      "type": "landing",
      "is_active": true,
      "sections_count": 5
    }
  ],
  "current_page": 1,
  "last_page": 1,
  "per_page": 15,
  "total": 1,
  "from": 1,
  "to": 1
}
```

#### 3. Get Single Page
```
GET /api/admin/pages/{id}
```

**Response**:
```json
{
  "data": {
    "id": 1,
    "title": "Home Page",
    "slug": "home",
    "type": "landing",
    "is_active": true,
    "sections": [...]
  }
}
```

#### 4. Update Page
```
PUT /api/admin/pages/{id}
```

**Request Body**:
```json
{
  "title": "Updated Title",
  "is_active": false
}
```

#### 5. Delete Page
```
DELETE /api/admin/pages/{id}
```

**Response**:
```json
{
  "message": "Page deleted successfully"
}
```

#### 6. Create Section
```
POST /api/admin/pages/{pageId}/sections
```

**Request Body**:
```json
{
  "section_type": "landing_hero_grid",
  "title": "Hero Section",
  "content": {
    "main_card_image": "/images/hero.jpg",
    "main_card_heading": "Welcome"
  },
  "settings": {
    "text_color": "#ffffff"
  },
  "sort_order": 1,
  "is_active": true
}
```

**Response**:
```json
{
  "id": 1,
  "page_id": 1,
  "section_type": "landing_hero_grid",
  "title": "Hero Section",
  "content": {...},
  "settings": {...},
  "sort_order": 1,
  "is_active": true
}
```

#### 7. Get Page Sections
```
GET /api/admin/pages/{pageId}/sections
```

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "section_type": "landing_hero_grid",
      "title": "Hero Section",
      "content": {...},
      "settings": {...},
      "sort_order": 1,
      "is_active": true
    }
  ]
}
```

#### 8. Update Section
```
PUT /api/admin/pages/{pageId}/sections/{sectionId}
```

**Request Body**:
```json
{
  "content": {...},
  "settings": {...},
  "is_active": false
}
```

#### 9. Delete Section
```
DELETE /api/admin/pages/{pageId}/sections/{sectionId}
```

#### 10. Reorder Sections
```
POST /api/admin/pages/{pageId}/sections/reorder
```

**Request Body**:
```json
{
  "sections": [
    { "id": 1, "sort_order": 1 },
    { "id": 2, "sort_order": 2 }
  ]
}
```

## Database Schema

### pages table
```sql
CREATE TABLE pages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    type ENUM('landing', 'brand', 'flash_deal', 'gallery', 'custom') NOT NULL,
    meta_title VARCHAR(255) NULL,
    meta_description TEXT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_type (type),
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active)
);
```

### page_sections table
```sql
CREATE TABLE page_sections (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    page_id BIGINT UNSIGNED NOT NULL,
    section_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NULL,
    content JSON NOT NULL,
    settings JSON NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
    INDEX idx_page_id (page_id),
    INDEX idx_sort_order (sort_order),
    INDEX idx_is_active (is_active)
);
```

## Laravel Implementation Example

### Routes (routes/api.php)
```php
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Pages
    Route::get('/pages', [PageController::class, 'index']);
    Route::post('/pages', [PageController::class, 'store']);
    Route::get('/pages/{id}', [PageController::class, 'show']);
    Route::put('/pages/{id}', [PageController::class, 'update']);
    Route::delete('/pages/{id}', [PageController::class, 'destroy']);
    
    // Sections
    Route::get('/pages/{pageId}/sections', [PageSectionController::class, 'index']);
    Route::post('/pages/{pageId}/sections', [PageSectionController::class, 'store']);
    Route::get('/pages/{pageId}/sections/{id}', [PageSectionController::class, 'show']);
    Route::put('/pages/{pageId}/sections/{id}', [PageSectionController::class, 'update']);
    Route::delete('/pages/{pageId}/sections/{id}', [PageSectionController::class, 'destroy']);
    Route::post('/pages/{pageId}/sections/reorder', [PageSectionController::class, 'reorder']);
});
```

### Controller Example (app/Http/Controllers/Admin/PageController.php)
```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index(Request $request)
    {
        $query = Page::query();
        
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        $pages = $query->withCount('sections')
            ->orderBy('sort_order')
            ->paginate($request->per_page ?? 15);
            
        return response()->json($pages);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages',
            'type' => 'required|in:landing,brand,flash_deal,gallery,custom',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);
        
        $page = Page::create($validated);
        
        return response()->json($page, 201);
    }
    
    public function show($id)
    {
        $page = Page::with('sections')->findOrFail($id);
        return response()->json(['data' => $page]);
    }
    
    public function update(Request $request, $id)
    {
        $page = Page::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'string|max:255',
            'slug' => 'string|max:255|unique:pages,slug,' . $id,
            'type' => 'in:landing,brand,flash_deal,gallery,custom',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);
        
        $page->update($validated);
        
        return response()->json($page);
    }
    
    public function destroy($id)
    {
        $page = Page::findOrFail($id);
        $page->delete();
        
        return response()->json(['message' => 'Page deleted successfully']);
    }
}
```

### Model Example (app/Models/Page.php)
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'type',
        'meta_title',
        'meta_description',
        'is_active',
        'sort_order',
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
    
    public function sections()
    {
        return $this->hasMany(PageSection::class)->orderBy('sort_order');
    }
}
```

## Testing the Endpoints

### Using cURL
```bash
# Create a page
curl -X POST http://localhost:8000/api/admin/pages \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "Test Page",
    "slug": "test-page",
    "type": "landing",
    "is_active": true
  }'

# Get all pages
curl http://localhost:8000/api/admin/pages

# Create a section
curl -X POST http://localhost:8000/api/admin/pages/1/sections \
  -H "Content-Type: application/json" \
  -d '{
    "section_type": "landing_hero_grid",
    "title": "Hero",
    "content": {},
    "sort_order": 1
  }'
```

## Frontend is Ready

The frontend code is already configured to use these endpoints through:
- `lib/hooks/admin/useDynamicPages.ts` - React Query hooks
- `lib/api/axios.ts` - Axios instance with CSRF protection
- `app/admin/page-templates/[type]/page.tsx` - Page builder using hooks

Once the backend endpoints are created, the page builder will work immediately without any frontend changes needed.

## Priority

**HIGH PRIORITY** - The page builder cannot save pages without these endpoints.

Create these endpoints in the Laravel backend to enable the page builder functionality.
