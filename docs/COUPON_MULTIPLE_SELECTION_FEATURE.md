# Coupon Multiple Selection Feature

## ✨ New Feature: Select Multiple Types Simultaneously

Admin can now select products, brands, AND categories all at once for a single coupon!

## 🎯 What Changed

### Before:
- Admin could only select ONE type at a time
- If `applies_to` = "products", only products could be selected
- If `applies_to` = "brands", only brands could be selected
- If `applies_to` = "categories", only categories could be selected

### After:
- Admin can select ANY COMBINATION of products, brands, and categories
- Toggle buttons to show/hide each selection panel
- All selections are sent together in the payload
- More flexible coupon targeting

## 🎨 UI Changes

### 1. Toggle Buttons
Three toggle buttons appear when `applies_to` is not "all":
- **Products** - Shows count in badge
- **Brands** - Shows count in badge
- **Categories** - Shows count in badge

Active buttons are highlighted in orange, inactive in gray.

### 2. Selection Panels
Each panel can be toggled independently:
- Click "Products" → Shows product search and selection
- Click "Brands" → Shows brand checkboxes
- Click "Categories" → Shows category checkboxes
- Can have multiple panels open at once

### 3. Display Badges
In the coupon list, shows separate badges for each type:
- 🟣 Purple badge: "X Products"
- 🔵 Indigo badge: "X Brands"
- 🟢 Teal badge: "X Categories"

## 📝 Updated Code

### Modal State (`CouponModal.tsx`)
```typescript
const [showProductSelection, setShowProductSelection] = useState(false);
const [showBrandSelection, setShowBrandSelection] = useState(false);
const [showCategorySelection, setShowCategorySelection] = useState(false);
const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
```

### Submit Logic
```typescript
// Add all selected items (can be multiple types at once)
if (selectedProducts.length > 0) {
  submitData.product_ids = selectedProducts;
}
if (selectedBrands.length > 0) {
  submitData.brand_ids = selectedBrands;
}
if (selectedCategories.length > 0) {
  submitData.category_ids = selectedCategories;
}
```

### Toggle Buttons UI
```tsx
<div className="flex flex-wrap gap-2">
  <button
    type="button"
    onClick={() => setShowProductSelection(!showProductSelection)}
    className={showProductSelection ? 'bg-[#FF6F00] text-white' : 'bg-gray-100 text-gray-600'}
  >
    Products {selectedProducts.length > 0 && `(${selectedProducts.length})`}
  </button>
  <button
    type="button"
    onClick={() => setShowBrandSelection(!showBrandSelection)}
    className={showBrandSelection ? 'bg-[#FF6F00] text-white' : 'bg-gray-100 text-gray-600'}
  >
    Brands {selectedBrands.length > 0 && `(${selectedBrands.length})`}
  </button>
  <button
    type="button"
    onClick={() => setShowCategorySelection(!showCategorySelection)}
    className={showCategorySelection ? 'bg-[#FF6F00] text-white' : 'bg-gray-100 text-gray-600'}
  >
    Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
  </button>
</div>
```

## 📤 Example Payloads

### Example 1: Products + Brands
```json
{
  "name": "Multi-type discount",
  "code": "MULTI20",
  "discount_type": "percentage",
  "discount_value": 20,
  "applies_to": "products",
  "product_ids": [1, 2, 3, 5],
  "brand_ids": [10, 15],
  "is_active": true
}
```

### Example 2: All Three Types
```json
{
  "name": "Everything discount",
  "code": "EVERYTHING15",
  "discount_type": "percentage",
  "discount_value": 15,
  "applies_to": "categories",
  "product_ids": [1, 2],
  "brand_ids": [10],
  "category_ids": [1, 2, 29],
  "is_active": true
}
```

### Example 3: Only Categories
```json
{
  "name": "Category sale",
  "code": "CATSALE",
  "discount_type": "fixed",
  "discount_value": 50,
  "applies_to": "categories",
  "category_ids": [1, 2, 29],
  "is_active": true
}
```

## 🎯 Use Cases

### 1. Targeted Campaign
Select specific products from specific brands in specific categories:
- 5 products from Brand A
- 3 products from Brand B
- All products in Category "Electronics"

### 2. Brand + Category Mix
Apply discount to:
- All products from "Nike" brand
- All products in "Running Shoes" category
- Specific featured products

### 3. Flexible Exclusions
Select everything except:
- Choose all categories except one
- Choose all brands except one
- Add specific products as exceptions

## 🎨 Visual Indicators

### In Modal:
- **Orange buttons** = Selection panel is open
- **Gray buttons** = Selection panel is closed
- **Badge counts** = Number of items selected (e.g., "Products (5)")

### In List View:
- **Purple badge** = Products selected
- **Indigo badge** = Brands selected
- **Teal badge** = Categories selected
- **Blue badge** = All products (no specific selection)

## 🔄 Workflow

1. Admin creates coupon
2. Sets `applies_to` to any value except "all"
3. Toggle buttons appear
4. Click "Products" → Search and select products
5. Click "Brands" → Select brands from list
6. Click "Categories" → Select categories from list
7. All selections are saved together
8. Backend receives all three arrays

## ✅ Benefits

1. **More Flexibility**: Mix and match different targeting types
2. **Better Targeting**: Precise control over which items get discount
3. **Easier Management**: One coupon instead of multiple
4. **Better UX**: Visual feedback with toggle buttons and counts
5. **Scalable**: Can select from 1 to all items in each type

## 📊 Display Logic

### Main Page Display:
```typescript
{coupon.applies_to === 'all' ? (
  <span>All Products</span>
) : (
  <>
    {coupon.products?.length > 0 && <span>{coupon.products.length} Products</span>}
    {coupon.brands?.length > 0 && <span>{coupon.brands.length} Brands</span>}
    {coupon.categories?.length > 0 && <span>{coupon.categories.length} Categories</span>}
  </>
)}
```

## 🎓 Admin Instructions

### To Create Multi-Type Coupon:
1. Fill in basic coupon details (name, code, discount)
2. Set "Applies To" to any option (products/brands/categories)
3. Click toggle buttons to open selection panels
4. Select items from any or all panels
5. Save coupon

### To Edit Selections:
1. Open coupon for editing
2. Toggle buttons show current selections
3. Add or remove items from any panel
4. Save changes

---

**Status**: ✅ Complete
**Feature Type**: Enhancement
**Impact**: High - More flexible coupon targeting
**Date**: March 6, 2026
