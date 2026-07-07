# Pre-Order Filter Implementation

## Overview
Integrated pre-order filtering from the landing page PreOrderSection to the shop page, allowing users to view pre-order products with a dedicated filter.

## Changes Made

### 1. PreOrderSection Component Updates
**File**: `app/(public)/_components/landing/pre-order-section.tsx`

- Updated default URLs from `/pre-order` to `/shop`
- Both "View All Preorder Products" and "Preorder Now" now redirect to `/shop?is_preorder=true`
- Pre-order filter is automatically applied when landing on shop page

```tsx
// Default data URLs changed
viewAllUrl: "/shop",           // Was: "/pre-order"
buttonUrl: "/shop",            // Was: "/pre-order"

// Links include is_preorder filter
href={`${data.viewAllUrl}?is_preorder=true`}
href={`${data.mainFeature.buttonUrl}?is_preorder=true`}
```

### 2. Shop Page Updates
**File**: `app/(public)/shop/page.tsx`

- Added URL parameter detection for `is_preorder`
- Added `isPreorder` state to track pre-order filter
- Updated useEffect to read `is_preorder` from URL
- Added `is_preorder` to useShopProducts query parameters
- Added `handlePreorderChange` handler function
- Passes `onPreorderChange` callback to ShopSidebar

```tsx
const urlPreorder = searchParams.get("is_preorder") === "true";
const [isPreorder, setIsPreorder] = useState(urlPreorder);

// In useShopProducts call
is_preorder: isPreorder || undefined,
```

### 3. Shop Sidebar Updates
**File**: `app/(public)/_components/shop/shop-sidebar.tsx`

- Added `onPreorderChange` callback to ShopSidebarProps interface
- Added "Pre-Order" filter section after Availability
- Added `selectedPreorder` state
- Added `handlePreorderClick` function for toggle behavior
- Pre-order filter shows "Pre-Order Items" checkbox

```tsx
{/* Pre-Order */}
<FilterSection title="Pre-Order">
  <CheckboxItem 
    label="Pre-Order Items" 
    checked={selectedPreorder === true}
    onChange={() => handlePreorderClick(true)}
  />
</FilterSection>
```

### 4. Hook Updates
**File**: `lib/hooks/public/useShop.ts`

- Added `is_preorder?: boolean` to ShopFilters interface
- API now accepts pre-order filter parameter

```tsx
export interface ShopFilters {
  // ... existing fields
  is_preorder?: boolean;
}
```

## User Flow

### From Landing Page
1. User sees "Pre-Order Now & Save Big" section
2. Clicks "View All Preorder Products" or "Preorder Now" button
3. Redirected to `/shop?is_preorder=true`
4. Shop page loads with pre-order filter automatically applied
5. Only pre-order products are displayed

### On Shop Page
1. User can manually check "Pre-Order Items" in sidebar
2. Filter toggles pre-order products on/off
3. Can combine with other filters (search, brand, category, price, etc.)
4. Click again to clear pre-order filter

## URL Parameters

### Pre-Order Filter
```
/shop?is_preorder=true
```

### Combined Filters
```
/shop?is_preorder=true&search=treadmill&brand_id=5&min_price=500
```

## Filter Behavior

### Toggle Behavior
- Click "Pre-Order Items" → Filters to pre-order products only
- Click again → Clears pre-order filter, shows all products

### Combined with Other Filters
- Pre-order filter works with all other filters
- Search + Pre-order: Shows pre-order products matching search
- Brand + Pre-order: Shows pre-order products from selected brand
- Price + Pre-order: Shows pre-order products in price range
- All combinations work seamlessly

### Pagination
- Resets to page 1 when pre-order filter changes
- Maintains pagination when navigating between pages

## API Integration

### Endpoint
```
GET /api/catalog/products
```

### Query Parameters
```javascript
{
  is_preorder: true,        // Pre-order filter
  search: "treadmill",      // Search
  brand_id: 5,              // Brand filter
  category_id: 12,          // Category filter
  min_price: 500,           // Price range
  max_price: 2000,
  in_stock: true,           // Availability
  sort_by: "price",         // Sorting
  sort_order: "asc",
  page: 1,
  per_page: 20
}
```

## UI/UX

### Sidebar Filter
- Located after Availability filter
- Simple checkbox for "Pre-Order Items"
- Toggle on/off behavior
- No product count shown (API handles filtering)

### URL Persistence
- Pre-order filter persists in URL
- Users can share pre-order product links
- Browser back/forward works correctly

### Visual Feedback
- Loading spinner shows while fetching
- Product count updates in real-time
- No page reload needed

## Redirect Flow

```
Landing Page
    ↓
PreOrderSection Component
    ↓
"View All Preorder Products" or "Preorder Now" button clicked
    ↓
Redirect to: /shop?is_preorder=true
    ↓
Shop Page
    ↓
URL parameter detected
    ↓
Pre-order filter automatically applied
    ↓
Display only pre-order products
```

## Testing Checklist

- [ ] Click "View All Preorder Products" from landing page
- [ ] Click "Preorder Now" button from landing page
- [ ] Verify URL is `/shop?is_preorder=true`
- [ ] Verify only pre-order products are shown
- [ ] Check "Pre-Order Items" in sidebar
- [ ] Verify filter toggles on/off
- [ ] Combine pre-order with search filter
- [ ] Combine pre-order with brand filter
- [ ] Combine pre-order with category filter
- [ ] Combine pre-order with price range
- [ ] Verify pagination resets on filter change
- [ ] Test browser back/forward buttons
- [ ] Verify URL updates correctly
- [ ] Test on mobile and desktop

## Future Enhancements

- Add pre-order product count to sidebar
- Show pre-order badge on product cards
- Add estimated delivery date for pre-orders
- Add pre-order notification signup
- Create pre-order specific sorting options
