# Coupons Frontend - Backend Sync Complete

## ✅ Updates Made to Match Backend Logic

### 1. Interface Changes

#### `lib/hooks/admin/useCoupons.ts`
**Updated CouponData interface:**
```typescript
interface CouponData {
  code?: string;                    // ✅ Now optional (auto-generated if not provided)
  description?: string;             // ✅ Added
  discount_type: 'percentage' | 'fixed' | 'free_shipping';  // ✅ Changed from 'fixed_amount' to 'fixed'
  discount_value: number;
  applies_to: 'all' | 'products' | 'brands' | 'categories';  // ✅ Changed from 'applicable_to'
  min_purchase_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  once_per_customer?: boolean;      // ✅ Changed from 'per_user_limit' (number to boolean)
  starts_at?: string;               // ✅ Now optional (defaults to now() in backend)
  expires_at?: string;
  is_active?: boolean;
  product_ids?: number[];           // ✅ Added
  brand_ids?: number[];             // ✅ Added
  category_ids?: number[];          // ✅ Added
}
```

### 2. Main Page Updates (`app/admin/coupons/page.tsx`)

**Coupon Interface:**
- Changed `type` → `discount_type`
- Changed `value` → `discount_value`
- Changed `applicable_to` → `applies_to`
- Changed `per_user_limit` → `once_per_customer` (boolean)
- Added `description` field
- Added `products`, `brands`, `categories` arrays

**Display Updates:**
- Updated type badge to use `discount_type` and `discount_value`
- Updated applies_to display to show counts for products/brands/categories
- Changed "Per User" limit display to "Once Per Customer" checkbox

### 3. Modal Updates (`app/admin/coupons/_components/CouponModal.tsx`)

**Form Fields:**
- ✅ **Code**: Now optional with auto-generation hint
- ✅ **Description**: Added textarea field
- ✅ **Discount Type**: Changed 'fixed_amount' to 'fixed'
- ✅ **Discount Value**: Uses `discount_value` instead of `value`
- ✅ **Applies To**: Changed from 'applicable_to' with new options:
  - `all` - All Products
  - `products` - Specific Products
  - `brands` - Specific Brands
  - `categories` - Specific Categories
- ✅ **Once Per Customer**: Changed from number input to checkbox
- ✅ **Dates**: Now optional (backend defaults starts_at to now())

**Selection UI Added:**
- **Products Selection**: Search and multi-select checkboxes
- **Brands Selection**: Multi-select checkboxes
- **Categories Selection**: Multi-select checkboxes
- Dynamic loading based on `applies_to` value

**Data Fetching:**
- Added `useAdminProducts` hook
- Added `useAdminBrands` hook
- Added `useAdminCategories` hook
- Conditional fetching based on selection

**Submit Logic:**
- Code is only included if provided (backend auto-generates if missing)
- Sends `product_ids`, `brand_ids`, or `category_ids` based on selection
- Properly handles `once_per_customer` as boolean
- Handles optional dates

### 4. Backend Validation Matched

**Required Fields:**
- ✅ `discount_type` (required)
- ✅ `discount_value` (required unless free_shipping)
- ✅ `applies_to` (required)

**Optional Fields:**
- ✅ `code` (auto-generated if not provided)
- ✅ `description`
- ✅ `min_purchase_amount`
- ✅ `max_discount_amount`
- ✅ `usage_limit`
- ✅ `once_per_customer` (defaults to true)
- ✅ `starts_at` (defaults to now())
- ✅ `expires_at`
- ✅ `is_active` (defaults to true)
- ✅ `product_ids[]`
- ✅ `brand_ids[]`
- ✅ `category_ids[]`

### 5. Key Differences from Original

| Field | Before | After |
|-------|--------|-------|
| Code | Required | Optional (auto-generated) |
| Description | Not present | Added |
| Discount Type | `fixed_amount` | `fixed` |
| Field Name | `type` | `discount_type` |
| Field Name | `value` | `discount_value` |
| Field Name | `applicable_to` | `applies_to` |
| Per User Limit | Number input | Boolean checkbox (`once_per_customer`) |
| Applies To Options | `all`, `specific_products`, `specific_categories` | `all`, `products`, `brands`, `categories` |
| Product Selection | Not implemented | Multi-select with search |
| Brand Selection | Not implemented | Multi-select |
| Category Selection | Not implemented | Multi-select |
| Start Date | Required | Optional (defaults to now) |

## 🎯 Features Now Working

### Create Coupon
1. Optional code (auto-generated if empty)
2. Description field
3. Three discount types: percentage, fixed, free_shipping
4. Applies to: all, products, brands, or categories
5. Select specific products with search
6. Select specific brands
7. Select specific categories
8. Once per customer checkbox
9. Optional date range
10. Usage limits

### Edit Coupon
- Pre-fills all fields including selected products/brands/categories
- Shows existing selections
- Updates via PUT request

### Display
- Shows discount type and value correctly
- Displays applies_to with counts
- Shows "Once Per Customer" badge
- Lists related products/brands/categories

## 📊 API Request Example

### Create Coupon Request
```json
{
  "description": "Summer sale discount",
  "discount_type": "percentage",
  "discount_value": 20,
  "applies_to": "products",
  "min_purchase_amount": 50,
  "max_discount_amount": 100,
  "usage_limit": 1000,
  "once_per_customer": true,
  "starts_at": "2026-06-01 00:00:00",
  "expires_at": "2026-08-31 23:59:59",
  "is_active": true,
  "product_ids": [1, 2, 3, 5, 8]
}
```

### Response
```json
{
  "success": true,
  "message": "Coupon created successfully.",
  "data": {
    "id": 1,
    "code": "ABCD1234",
    "description": "Summer sale discount",
    "discount_type": "percentage",
    "discount_value": 20,
    "applies_to": "products",
    "products": [...],
    "brands": [],
    "categories": []
  }
}
```

## 🔗 Related Files Updated

1. ✅ `lib/hooks/admin/useCoupons.ts` - Interface updated
2. ✅ `app/admin/coupons/page.tsx` - Display logic updated
3. ✅ `app/admin/coupons/_components/CouponModal.tsx` - Form completely updated
4. ✅ `app/admin/_components/admin-sidebar.tsx` - Coupons link added

## ✨ New Capabilities

- **Auto-generated codes**: Backend generates unique codes if not provided
- **Brand-level coupons**: Apply discounts to all products from specific brands
- **Category-level coupons**: Apply discounts to all products in categories
- **Product-level coupons**: Select specific products with search
- **Simpler per-user limit**: Boolean checkbox instead of number
- **Better UX**: Optional fields with sensible defaults

---

**Status**: ✅ Fully Synced with Backend
**Last Updated**: March 6, 2026
