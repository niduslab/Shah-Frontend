# Shop Page - Search & Filters Implementation

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  3 products  [🔍 Search for products...]  Sort By: [Best ▼] │
│  ─────────────────────────────────────────────────────────  │
│  [Product Grid]                                              │
└─────────────────────────────────────────────────────────────┘
```

**All in one line:**
1. **Product Count** (left) - Shows number of available products
2. **Search Bar** (center/flex) - Takes available space
3. **Sort By** (right) - Fixed width dropdown

## Changes Made

### 1. Real-Time Search with Debouncing
- Search updates automatically as user types (no Enter key needed)
- 500ms debounce to avoid excessive API calls
- When input is empty, fetches all products
- Resets to page 1 when search changes
- Smooth, responsive search experience

### 2. Single Line Toolbar Layout
- Product count, search, and sort by all on one line
- Responsive: Stacks on mobile, single line on desktop
- Product count: `3 products available` (compact format)
- Search bar: Takes flexible width
- Sort By: Fixed width, doesn't shrink
- `justify-between` spreads items across full width

### 3. Main Navbar Search Integration
- Desktop navbar search (top right) now redirects to shop page with search query
- Mobile navbar search also redirects to shop page
- URL format: `/shop?search=query`
- Shop page automatically reads and applies search from URL parameter
- Seamless integration between navbar and shop page search

### 4. Price Range Filter (Working)
- Replaced static price range slider with functional input fields
- Min and Max price input fields
- Debounced input (500ms) to avoid excessive API calls
- Clear filter button to reset price range
- Automatically filters products when values change

### 5. Availability Filter (Working)
- "In Stock" and "Out of Stock" checkboxes now functional
- Toggle behavior - click again to uncheck
- Filters products based on stock status
- Resets to page 1 when filter changes

### 6. Real Brands from API
- Fetches actual brands from the database using `useBrands()` hook
- Displays brand name and product count for each brand
- Shows first 8 brands by default with "Show More/Show Less" toggle
- Click to filter products by brand
- Toggle behavior - click again to clear brand filter

### 7. Categories with Child Categories
- Fetches real categories from the database using `useCategories()` hook
- Each category displayed as a collapsible section
- Shows parent category with "All [Category Name]" option
- Child categories displayed indented with visual hierarchy (border-left)
- Product count shown for each category and subcategory
- Click any category or subcategory to filter products
- Toggle behavior - click again to clear category filter

### 8. State Management
- Added state for: searchQuery, searchInput, minPrice, maxPrice, inStock, brandId, categoryId
- All filters integrated with useShopProducts hook
- Proper callback handlers passed to ShopSidebar component
- URL search parameter handling with useSearchParams
- Debounced search effect for real-time filtering

### 9. UI Improvements
- All controls in single line for better space utilization
- Product count uses compact format
- Clean, modern search input with icon
- Better price range inputs with labels
- Hierarchical category display with visual indentation
- Show More/Less functionality for brands
- Responsive design maintained

## How It Works

### Real-Time Search Flow
1. **User types in search bar** → Debounce timer starts (500ms)
2. **User stops typing** → Timer completes, search query updates
3. **Products filter automatically** → No Enter key needed
4. **Empty search** → Fetches all products (no filter applied)

### Search Behavior
- **Typing**: Input updates immediately, search waits for debounce
- **Debounce**: 500ms delay after user stops typing
- **Empty Input**: Clears search filter, shows all products
- **URL Parameter**: If user comes from navbar search, applies immediately

### Filter Usage
1. **Search**: Type to filter, empty to show all
2. **Price Range**: Enter min/max prices - filters apply automatically after 500ms
3. **Availability**: Click "In Stock" or "Out of Stock" to filter, click again to clear
4. **Brands**: Click any brand to filter products, click again to clear
5. **Categories**: Click parent or child category to filter, click again to clear
6. **Sort By**: Select sorting option from dropdown

All filters work together and reset pagination to page 1 when changed.

## Responsive Behavior

### Desktop (sm and above)
- All controls on single line
- Product count: fixed width
- Search: flexible width (flex-1)
- Sort By: fixed width
- Gap: 16px between elements
- `justify-between` spreads items

### Mobile (below sm)
- Stacks vertically
- Each control takes full width
- Gap: 12px between elements
- Maintains functionality

## API Integration

### Endpoints Used
1. `GET /api/catalog/brands` - Fetch all brands
2. `GET /api/catalog/categories` - Fetch categories with children
3. `GET /api/catalog/products` - Fetch filtered products

### Query Parameters
```javascript
{
  search: "treadmill",      // From navbar or shop page search (empty = all)
  brand_id: 5,
  category_id: 12,
  min_price: 500,
  max_price: 2000,
  in_stock: true,
  sort_by: "price",
  sort_order: "asc",
  page: 1,
  per_page: 20
}
```

## User Experience

### Search Journey
1. User searches in navbar → Redirected to shop with results
2. User can refine search by typing in inline search bar
3. Results update automatically as they type (with debounce)
4. User can apply additional filters (brand, category, price, etc.)
5. All filters work together seamlessly
6. Clear search to see all products

### Real-Time Feedback
- Instant visual feedback as user types
- Loading spinner shows while fetching
- Product count updates in real-time
- No page reload needed
- Smooth, responsive experience
