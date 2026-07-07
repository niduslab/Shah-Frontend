# Dynamic Pages - NaN ID Fix

## Problem
When clicking "Manage Sections" button, the browser navigates to:
```
http://localhost:8000/api/admin/pages/NaN/sections
```

This results in a 404 error because `NaN` (Not a Number) is not a valid page ID.

## Root Causes

### 1. Missing ID in API Response
The API might be returning pages without the `id` field:
```json
[
  {
    "title": "Home-page",
    "slug": "home-page",
    // Missing: "id": 1
  }
]
```

### 2. Incorrect Data Extraction
The frontend might be extracting data from the wrong nested level, causing the `id` to be lost.

### 3. Type Mismatch
The `id` might be returned as a string instead of a number, or vice versa.

## Solutions Applied

### 1. Added Validation in Navigation Handler

**File:** `app/admin/dynamic-pages/page.tsx`

```typescript
const handleManageSections = (page: Page) => {
  if (!page || !page.id || isNaN(page.id)) {
    toast.error('Invalid page', {
      description: 'Cannot manage sections for this page. Please try refreshing.'
    });
    return;
  }
  router.push(`/admin/dynamic-pages/${page.id}/sections`);
};
```

**What it does:**
- Checks if page object exists
- Checks if page.id exists
- Checks if page.id is a valid number
- Shows error toast if validation fails
- Only navigates if ID is valid

### 2. Added Debug Logging

```typescript
// Debug: Log pages to check structure
if (pages.length > 0 && !pages[0]?.id) {
  console.error('Pages missing ID field:', pages);
}
```

**What it does:**
- Logs to console if pages are missing ID field
- Helps identify if the issue is with API response
- Only runs in development mode

### 3. Added Page ID Validation in Sections Page

**File:** `app/admin/dynamic-pages/[id]/sections/page.tsx`

```typescript
export default function PageSectionsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const pageId = parseInt(params.id);
  
  // Validate pageId
  if (isNaN(pageId) || pageId <= 0) {
    return (
      <div className="error-screen">
        <h3>Invalid Page ID</h3>
        <p>The page ID is invalid or missing.</p>
        <button onClick={() => router.push('/admin/dynamic-pages')}>
          Back to Pages
        </button>
      </div>
    );
  }
  
  // Rest of component...
}
```

**What it does:**
- Validates the page ID from URL params
- Shows error screen if ID is invalid
- Provides "Back to Pages" button
- Prevents API calls with invalid IDs

## How to Debug

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error message: "Pages missing ID field"
4. If you see this, the API response is missing IDs

### Step 2: Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Find the request to `/api/admin/pages`
4. Check the response:

**Good Response:**
```json
[
  {
    "id": 1,
    "title": "Home-page",
    "slug": "home-page",
    ...
  }
]
```

**Bad Response (Missing ID):**
```json
[
  {
    "title": "Home-page",
    "slug": "home-page",
    ...
  }
]
```

### Step 3: Check Page Object
Add this temporarily to debug:
```typescript
const handleManageSections = (page: Page) => {
  console.log('Page object:', page);
  console.log('Page ID:', page.id);
  console.log('Is NaN?', isNaN(page.id));
  // ... rest of function
};
```

## Backend Fix (If Needed)

If the API is not returning the `id` field, update your backend:

### Laravel Example:

```php
// In your controller
public function index(Request $request)
{
    $pages = Page::query()
        ->select(['id', 'title', 'slug', 'type', 'meta_title', 'meta_description', 'is_active', 'sort_order', 'created_at', 'updated_at'])
        ->withCount('sections')
        ->orderBy('sort_order')
        ->get();
    
    return response()->json($pages);
}
```

**Key points:**
- Explicitly select `id` field
- Use `withCount('sections')` for sections count
- Return as JSON

### Check Model:

```php
// In Page model
class Page extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'type',
        'meta_title',
        'meta_description',
        'is_active',
        'sort_order'
    ];
    
    // Make sure id is not in $hidden
    protected $hidden = []; // Don't hide 'id'
    
    // Ensure id is cast to integer
    protected $casts = [
        'id' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];
}
```

## Testing Checklist

After applying fixes, test these scenarios:

- [ ] Pages list loads without console errors
- [ ] Each page shows correct ID in the list
- [ ] Clicking "Manage Sections" navigates to correct URL
- [ ] URL shows numeric ID (e.g., `/admin/dynamic-pages/1/sections`)
- [ ] Sections page loads successfully
- [ ] No "NaN" appears in any URL
- [ ] Error toast shows if page has invalid ID
- [ ] Error screen shows if navigating to invalid ID directly

## Common Scenarios

### Scenario 1: API Returns String ID
**Problem:** API returns `"id": "1"` instead of `"id": 1`

**Solution:** Backend should cast to integer, or frontend can handle:
```typescript
const pageId = parseInt(page.id.toString());
```

### Scenario 2: Nested Response
**Problem:** ID is nested deeper in response

**Solution:** Adjust data extraction:
```typescript
const pages = (pagesData as any)?.data?.pages?.map(p => ({
  ...p,
  id: p.page_id || p.id // Handle different field names
})) || [];
```

### Scenario 3: ID Field Named Differently
**Problem:** Backend uses `page_id` instead of `id`

**Solution:** Map the field:
```typescript
const pages = rawPages.map(p => ({
  ...p,
  id: p.page_id || p.id
}));
```

## Prevention

To prevent this issue in the future:

1. **Type Safety:** Use TypeScript interfaces
```typescript
interface Page {
  id: number; // Required, not optional
  title: string;
  slug: string;
  // ... other fields
}
```

2. **API Contract:** Document that `id` is required
```typescript
// In API documentation
GET /api/admin/pages
Response: Array<{
  id: number;        // REQUIRED
  title: string;     // REQUIRED
  slug: string;      // REQUIRED
  // ...
}>
```

3. **Validation:** Add runtime validation
```typescript
const validatePage = (page: any): page is Page => {
  return (
    typeof page === 'object' &&
    typeof page.id === 'number' &&
    !isNaN(page.id) &&
    page.id > 0
  );
};
```

## Summary

✅ **Added:** ID validation before navigation
✅ **Added:** Error handling for invalid IDs
✅ **Added:** Debug logging for missing IDs
✅ **Added:** Error screen for invalid page IDs
✅ **Improved:** User feedback with toast messages
✅ **Documented:** How to debug and fix the issue

The system now gracefully handles invalid or missing page IDs instead of navigating to `/pages/NaN/sections`.
