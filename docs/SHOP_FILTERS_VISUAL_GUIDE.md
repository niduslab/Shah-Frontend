# Shop Page Filters - Visual Guide

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        SHOP PAGE                                 │
├─────────────────┬───────────────────────────────────────────────┤
│   SIDEBAR       │              MAIN CONTENT                      │
│   (Filters)     │                                                │
│                 │  ┌──────────────────────────────────────────┐ │
│ ┌─────────────┐ │  │  🔍 Search Bar                          │ │
│ │ Availability│ │  └──────────────────────────────────────────┘ │
│ │ ☐ In Stock  │ │                                                │
│ │ ☐ Out Stock │ │  Products: 150 | Sort By: [Best Match ▼]     │
│ └─────────────┘ │  ─────────────────────────────────────────────│
│                 │                                                │
│ ┌─────────────┐ │  ┌────────┐ ┌────────┐ ┌────────┐           │
│ │ Price Range │ │  │Product │ │Product │ │Product │           │
│ │ Min: [___]  │ │  │  Card  │ │  Card  │ │  Card  │           │
│ │ Max: [___]  │ │  └────────┘ └────────┘ └────────┘           │
│ └─────────────┘ │                                                │
│                 │  ┌────────┐ ┌────────┐ ┌────────┐           │
│ ┌─────────────┐ │  │Product │ │Product │ │Product │           │
│ │   Brands    │ │  │  Card  │ │  Card  │ │  Card  │           │
│ │ ☐ Adidas    │ │  └────────┘ └────────┘ └────────┘           │
│ │ ☐ Nike      │ │                                                │
│ │ ☐ Reebok    │ │         [Pagination: 1 2 3 4 5]               │
│ │ Show More   │ │                                                │
│ └─────────────┘ │                                                │
│                 │                                                │
│ ┌─────────────┐ │                                                │
│ │   Cardio    │ │                                                │
│ │ ☐ All Cardio│ │                                                │
│ │   ├─ Bike   │ │                                                │
│ │   ├─ Tread  │ │                                                │
│ │   └─ Ellip  │ │                                                │
│ └─────────────┘ │                                                │
│                 │                                                │
│ ┌─────────────┐ │                                                │
│ │  Strength   │ │                                                │
│ │ ☐ All Stren │ │                                                │
│ │   ├─ Dumbb  │ │                                                │
│ │   └─ Barb   │ │                                                │
│ └─────────────┘ │                                                │
└─────────────────┴───────────────────────────────────────────────┘
```

## Filter Features

### 1. Search Bar (Top of Main Content)
```
┌────────────────────────────────────────────────┐
│ 🔍  Search for products...        [Search]     │
└────────────────────────────────────────────────┘
```
- Type product name
- Click Search button or press Enter
- Filters products in real-time

### 2. Availability Filter
```
☐ In Stock (55)
☐ Out of Stock (8)
```
- Click to filter by stock status
- Click again to clear filter
- Shows product count

### 3. Price Range Filter
```
Min Price: [  $0  ]
Max Price: [$1000]
[Clear price filter]
```
- Enter min/max values
- Auto-applies after 500ms
- Clear button to reset

### 4. Brand Filter (Dynamic from API)
```
☐ Adidas (24)
☐ Nike (37)
☐ Reebok (20)
☐ NordicTrack (12)
☐ UFC (35)
☐ Wave (10)
☐ Spirit (73)
☐ XPD (10)
[Show More]
```
- Fetched from database
- Shows first 8 brands
- "Show More" reveals all
- Click to filter by brand

### 5. Categories with Children (Dynamic from API)
```
▼ Cardio
  ☐ All Cardio (56)
    ├─ ☐ Bike (14)
    ├─ ☐ Treadmill (13)
    ├─ ☐ Elliptical (12)
    └─ ☐ Rowing Machine (17)

▼ Strength
  ☐ All Strength (70)
    ├─ ☐ Selectorized Series (14)
    ├─ ☐ Plate Loaded Series (14)
    ├─ ☐ Hammer Series (13)
    └─ ☐ Multi Station Gym (12)
```
- Hierarchical structure
- Parent + child categories
- Visual indentation for children
- Product counts for each
- Click parent or child to filter

## Filter Behavior

### Single Selection Filters
- **Brand**: Only one brand at a time
- **Category**: Only one category/subcategory at a time
- **Availability**: Only one status at a time

### Toggle Behavior
All filters use toggle behavior:
1. Click once → Apply filter
2. Click again → Remove filter

### Combined Filters
All filters work together:
```
Search: "treadmill"
+ Brand: "NordicTrack"
+ Category: "Cardio > Treadmill"
+ Price: $500 - $2000
+ Availability: "In Stock"
= Shows only NordicTrack treadmills in stock between $500-$2000
```

### Pagination Reset
Changing any filter resets to page 1 automatically.

## API Integration

### Endpoints Used
1. `GET /api/catalog/brands` - Fetch all brands
2. `GET /api/catalog/categories` - Fetch categories with children
3. `GET /api/catalog/products` - Fetch filtered products

### Query Parameters
```javascript
{
  search: "treadmill",
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

### Loading States
- Brands/Categories: Load on page mount
- Products: Show spinner while filtering
- Smooth transitions between states

### Empty States
- "No brands available" if no brands
- "No products found" if filters return nothing
- "Try adjusting your filters" suggestion

### Responsive Design
- Desktop: Sidebar on left, products on right
- Mobile: Sidebar collapses, filters accessible via button
- Touch-friendly checkboxes and inputs
