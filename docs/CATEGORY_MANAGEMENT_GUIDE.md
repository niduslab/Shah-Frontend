# Category Management System - Complete Guide

## Overview
A professional category management system with tree view, CRUD operations, and subcategory support.

## Features Implemented

### 1. Category Page (`/admin/categories`)
- Tree view and list view toggle
- Search functionality
- Create, edit, and delete categories
- Expandable/collapsible category tree
- Status indicators (Active/Inactive)
- Professional UI with Tailwind CSS

### 2. Category Modal
- Create new categories
- Edit existing categories
- Set parent category (for subcategories)
- Description field
- Sort order
- Active/Inactive toggle
- SEO settings (meta title & description)
- Form validation

### 3. Delete Confirmation Modal
- Warning message
- Category name display
- Loading state during deletion
- Cannot be undone warning

## File Structure

```
app/admin/categories/
├── page.tsx                              # Main categories page
└── _components/
    ├── CategoryModal.tsx                 # Create/Edit modal
    └── DeleteConfirmModal.tsx            # Delete confirmation

lib/hooks/admin/
└── useAdminCategories.ts                 # API hooks (already exists)

app/admin/_components/
└── admin-sidebar.tsx                     # Updated with Categories link
```

## API Endpoints Used

The system uses these endpoints from your Laravel backend:

```typescript
GET    /api/admin/categories              // List all categories (paginated)
GET    /api/admin/categories/tree         // Get category tree structure
GET    /api/admin/categories/:id          // Get single category
POST   /api/admin/categories              // Create category
PUT    /api/admin/categories/:id          // Update category
DELETE /api/admin/categories/:id          // Delete category
```

## Category Data Structure

```typescript
interface CategoryData {
  parent_id?: number | null;      // Parent category ID (null for top-level)
  name: string;                   // Category name (required)
  description?: string;           // Category description
  image?: string;                 // Category image URL
  is_active?: boolean;            // Active status
  sort_order?: number;            // Display order
  meta_title?: string;            // SEO meta title
  meta_description?: string;      // SEO meta description
}
```

## Usage Guide

### Creating a Category

1. Click "Add Category" button
2. Fill in the form:
   - Category Name (required)
   - Parent Category (optional - leave empty for top-level)
   - Description (optional)
   - Sort Order (default: 0)
   - Active checkbox (default: checked)
   - SEO settings (optional)
3. Click "Create Category"

### Creating a Subcategory

1. Click "Add Category"
2. Select a parent from the "Parent Category" dropdown
3. Fill in other fields
4. Click "Create Category"

### Editing a Category

1. Click the edit icon (pencil) next to any category
2. Modify the fields
3. Click "Update Category"

### Deleting a Category

1. Click the delete icon (trash) next to any category
2. Confirm deletion in the modal
3. Category and its relationships will be removed

### Tree View vs List View

- **Tree View**: Shows hierarchical structure with expand/collapse
- **List View**: Shows flat list of all categories

### Search

Type in the search box to filter categories by name (frontend filtering).

## Styling & UI

The system uses:
- Tailwind CSS for styling
- Lucide React for icons
- Professional color scheme (blue primary, red for delete)
- Responsive design
- Smooth transitions and hover effects
- Loading states

## Integration with Backend

Make sure your Laravel backend has:

1. **Category Model** with these fields:
   - id
   - parent_id (nullable)
   - name
   - description (nullable)
   - image (nullable)
   - is_active (boolean, default: true)
   - sort_order (integer, default: 0)
   - meta_title (nullable)
   - meta_description (nullable)
   - created_at
   - updated_at

2. **API Routes** in `routes/api.php`:
```php
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/tree', [CategoryController::class, 'tree']);
    Route::get('categories/{id}', [CategoryController::class, 'show']);
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{id}', [CategoryController::class, 'update']);
    Route::delete('categories/{id}', [CategoryController::class, 'destroy']);
});
```

3. **Category Controller** with CRUD methods

## Session Persistence Issue

### The Problem
Users are logged out after page reload. This is a **backend configuration issue**.

### Root Cause
Laravel session cookies are not being set or persisted properly.

### Debug Steps

1. **Check Browser Cookies** (DevTools → Application → Cookies)
   - Look for `laravel_session` cookie
   - If missing, backend is not setting it

2. **Check Laravel .env**
```env
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost
SESSION_SECURE_COOKIE=false
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

3. **Check config/session.php**
```php
'domain' => env('SESSION_DOMAIN', 'localhost'),
'secure' => env('SESSION_SECURE_COOKIE', false),
'http_only' => true,
'same_site' => 'lax',
```

4. **Clear Laravel Cache**
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan serve --host=localhost --port=8000
```

### Frontend is Already Correct
- ✅ `withCredentials: true` in axios
- ✅ Using `localhost` not `127.0.0.1`
- ✅ AuthContext checks session on mount
- ✅ CSRF token handling

**The session issue is 100% on the backend side.**

## Testing Checklist

- [ ] Can create top-level category
- [ ] Can create subcategory
- [ ] Can edit category
- [ ] Can delete category
- [ ] Tree view expands/collapses correctly
- [ ] List view shows all categories
- [ ] Search filters categories
- [ ] Active/Inactive status displays correctly
- [ ] Form validation works
- [ ] Loading states display
- [ ] Modals open/close properly
- [ ] Navigation link works in sidebar

## Next Steps

1. Test the category management system
2. Fix backend session configuration (see SESSION_DEBUG_GUIDE.md)
3. Add image upload functionality (optional)
4. Add bulk actions (optional)
5. Add category reordering via drag & drop (optional)

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Network tab for API responses
3. Verify backend API endpoints are working
4. Check Laravel logs for backend errors
5. Refer to SESSION_DEBUG_GUIDE.md for session issues
