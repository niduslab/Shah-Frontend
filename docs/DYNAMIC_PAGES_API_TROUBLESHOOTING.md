# Dynamic Pages API Troubleshooting Guide

## Issue: Pages Not Showing Despite Data Being Available

### Problem
The admin interface shows "No pages yet" even though the API returns data like:
```json
[{
  "id": 1,
  "title": "Home-page",
  "slug": "home-page",
  "type": "landing",
  "meta_title": null,
  "meta_description": null,
  "is_active": true,
  "sort_order": 0,
  "created_at": "2026-03-07T15:36:10.000000Z",
  "updated_at": "2026-03-07T15:36:10.000000Z",
  "sections": []
}]
```

### Root Cause
The frontend code was expecting a paginated response format:
```json
{
  "data": {
    "data": [...],
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

But the API was returning a direct array format.

### Solution Applied
Updated the code to handle both response formats:

#### In `app/admin/dynamic-pages/page.tsx`:
```typescript
// Handle both response formats: direct array or paginated object
const pages = Array.isArray(pagesData) 
  ? pagesData 
  : (pagesData as any)?.data?.data || (pagesData as any)?.data || [];
const paginationData = Array.isArray(pagesData) ? null : (pagesData as any)?.data;
```

#### In `app/admin/dynamic-pages/[id]/sections/page.tsx`:
```typescript
// Handle both response formats: direct object/array or nested data
const page = (pageData as any)?.data || pageData;
const sections = Array.isArray(sectionsData) 
  ? sectionsData 
  : (sectionsData as any)?.data || [];
```

### Sections Count Display
Also updated to calculate sections count from the sections array if `sections_count` is not provided:
```typescript
{page.sections_count ?? page.sections?.length ?? 0}
```

## Issue: "The content field is required" Error

### Problem
When creating a new section, you get this error:
```json
{
  "message": "The content field is required.",
  "errors": {
    "content": ["The content field is required."]
  }
}
```

### Root Cause
The backend API requires the `content` field when creating a section, but the frontend was sending an empty object `{}`.

### Solution Applied
Updated `SectionModal.tsx` to include default content structure based on section type:

```typescript
const getDefaultContent = (sectionType: string) => {
  const defaults: Record<string, any> = {
    hero_slider: { slides: [] },
    product_grid: { layout: 'grid', columns: 4, items: [] },
    brand_showcase: { background_type: 'image', background_url: '', description: '' },
    category_grid: { categories: [] },
    banner: { image: '', title: '', cta_text: 'Shop Now', cta_link: '/' },
    video_section: { video_url: '', title: '' },
    text_content: { html: '', text_align: 'left' },
    custom: { component_name: '', props: {} }
  };
  return defaults[sectionType] || {};
};
```

Now when you create a section, it automatically includes the appropriate default content structure.

### Result
- ✅ Sections create successfully
- ✅ Default content structure is included
- ✅ You can still edit content after creation
- ✅ No more "content field required" errors

---

## API Response Format Options

The frontend now supports three response formats:

### Format 1: Direct Array (Current API)
```json
[
  { "id": 1, "title": "Home-page", ... }
]
```

### Format 2: Wrapped in Data Object
```json
{
  "data": [
    { "id": 1, "title": "Home-page", ... }
  ]
}
```

### Format 3: Paginated Response (Recommended)
```json
{
  "data": {
    "data": [
      { "id": 1, "title": "Home-page", ... }
    ],
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1,
    "from": 1,
    "to": 1
  }
}
```

## Recommended Backend Response Format

For consistency with other admin endpoints (coupons, orders, etc.), use the paginated format:

### GET /api/admin/pages
```php
return response()->json([
    'data' => Page::with('sections')
        ->orderBy('sort_order')
        ->paginate($request->get('per_page', 15))
]);
```

### GET /api/admin/pages/{id}
```php
return response()->json([
    'data' => Page::with('sections')->findOrFail($id)
]);
```

### GET /api/admin/pages/{id}/sections
```php
return response()->json([
    'data' => $page->sections()->orderBy('sort_order')->get()
]);
```

## Testing the Fix

1. Open browser console (F12)
2. Navigate to `/admin/dynamic-pages`
3. Check Network tab for API response
4. Verify pages are displayed
5. Click "Manage Sections" on a page
6. Verify sections are displayed (even if empty)

## Common Issues

### Issue: Empty sections array shows as "undefined Sections"
**Fix Applied**: Use nullish coalescing to default to 0
```typescript
{page.sections_count ?? page.sections?.length ?? 0}
```

### Issue: Pagination not working
**Cause**: API returns direct array instead of paginated object
**Solution**: Either:
1. Update backend to return paginated response (recommended)
2. Frontend already handles this by checking `Array.isArray(pagesData)`

### Issue: Page details not loading
**Cause**: Response wrapped differently than expected
**Solution**: Code now checks both `data.data` and direct `data`

## Verification Checklist

- [x] Pages list displays when API returns direct array
- [x] Pages list displays when API returns paginated object
- [x] Sections count displays correctly (from count or array length)
- [x] Single page details load correctly
- [x] Sections list loads correctly
- [x] No console errors
- [x] Pagination works (if API supports it)
- [x] Search and filters work
- [x] Create/Edit/Delete operations work

## Additional Notes

### sections_count Field
If the backend doesn't provide `sections_count`, the frontend will calculate it from the `sections` array. For better performance, consider adding this to the backend:

```php
// In Page model
protected $appends = ['sections_count'];

public function getSectionsCountAttribute()
{
    return $this->sections()->count();
}
```

Or use `withCount()` in queries:
```php
Page::withCount('sections')->get();
```

### Response Consistency
For best results, ensure all admin API endpoints follow the same response format pattern used by coupons, orders, and other existing endpoints.
