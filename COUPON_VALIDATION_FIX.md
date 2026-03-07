# Coupon Validation Fix

## 🐛 Issues Found

### Error Response:
```json
{
  "message": "The name field is required. (and 1 more error)",
  "errors": {
    "name": ["The name field is required."],
    "applies_to": ["The selected applies to is invalid."]
  }
}
```

### Original Payload:
```json
{
  "description": "save 20",
  "discount_type": "percentage",
  "discount_value": 15,
  "applies_to": "categories",
  "code": "SAVE 20",
  "category_ids": [1,2,29]
}
```

## ✅ Fixes Applied

### 1. Changed `description` to `name`
**Problem**: Backend expects `name` field (required), but frontend was sending `description`

**Fix**:
- Changed form field from "Description" to "Coupon Name" (required)
- Updated interface: `description?: string` → `name?: string`
- Updated submit logic to send `name` instead of `description`

### 2. Fixed Code Formatting
**Problem**: Code "SAVE 20" contains spaces, which may cause issues

**Fix**:
- Added automatic space removal: `.replace(/\s+/g, '')`
- Code "SAVE 20" becomes "SAVE20"
- Added helper text: "No spaces allowed - will be auto-removed"

### 3. Updated Display
**Problem**: Need to show the name field in the coupon list

**Fix**:
- Added name display below the coupon code
- Shows as: `{coupon.name && <p className="text-sm text-gray-600 mb-3">{coupon.name}</p>}`

## 📝 Updated Files

### 1. `lib/hooks/admin/useCoupons.ts`
```typescript
interface CouponData {
  code?: string;
  name?: string;  // ✅ Changed from description
  discount_type: 'percentage' | 'fixed' | 'free_shipping';
  discount_value: number;
  applies_to: 'all' | 'products' | 'brands' | 'categories';
  // ... rest of fields
}
```

### 2. `app/admin/coupons/_components/CouponModal.tsx`

**Form State:**
```typescript
const [formData, setFormData] = useState({
  code: '',
  name: '',  // ✅ Changed from description
  discount_type: 'percentage',
  // ... rest
});
```

**Form Field:**
```tsx
<div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Coupon Name <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    required
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    placeholder="e.g., Summer Sale 20% Off"
  />
  <p className="mt-1 text-xs text-gray-500">Internal name for this coupon</p>
</div>
```

**Submit Logic:**
```typescript
const submitData: any = {
  name: formData.name || undefined,  // ✅ Changed from description
  discount_type: formData.discount_type,
  discount_value: formData.discount_type === 'free_shipping' ? 0 : parseFloat(formData.discount_value),
  applies_to: formData.applies_to,
  // ...
};

// Remove spaces from code
if (formData.code.trim()) {
  submitData.code = formData.code.toUpperCase().replace(/\s+/g, '');  // ✅ Added space removal
}
```

### 3. `app/admin/coupons/page.tsx`

**Interface:**
```typescript
interface Coupon {
  id: number;
  code: string;
  name?: string;  // ✅ Changed from description
  discount_type: 'percentage' | 'fixed' | 'free_shipping';
  // ... rest
}
```

**Display:**
```tsx
<div className="flex items-center gap-3 mb-2">
  <h3 className="text-lg font-bold text-gray-900 font-mono">{coupon.code}</h3>
  {/* ... badges ... */}
</div>

{coupon.name && (
  <p className="text-sm text-gray-600 mb-3">{coupon.name}</p>
)}
```

## 🎯 New Payload Structure

### Correct Payload:
```json
{
  "name": "save 20",
  "discount_type": "percentage",
  "discount_value": 15,
  "applies_to": "categories",
  "code": "SAVE20",
  "max_discount_amount": 1000,
  "min_purchase_amount": 5000,
  "usage_limit": 2000,
  "once_per_customer": true,
  "starts_at": "2026-03-06T20:18",
  "expires_at": "2026-03-10T20:18",
  "is_active": true,
  "category_ids": [1, 2, 29]
}
```

## 📋 Field Mapping

| Frontend Label | Backend Field | Required | Notes |
|---------------|---------------|----------|-------|
| Coupon Code | `code` | No | Auto-generated if empty, spaces removed |
| Coupon Name | `name` | Yes | Internal name/description |
| Discount Type | `discount_type` | Yes | percentage, fixed, free_shipping |
| Discount Value | `discount_value` | Yes* | *Not required for free_shipping |
| Applies To | `applies_to` | Yes | all, products, brands, categories |
| Min Purchase | `min_purchase_amount` | No | Minimum cart value |
| Max Discount | `max_discount_amount` | No | Cap for percentage discounts |
| Usage Limit | `usage_limit` | No | Total uses allowed |
| Once Per Customer | `once_per_customer` | No | Boolean, defaults to true |
| Start Date | `starts_at` | No | Defaults to now() |
| Expiry Date | `expires_at` | No | Optional |
| Active | `is_active` | No | Defaults to true |
| Products | `product_ids` | No | Array of product IDs |
| Brands | `brand_ids` | No | Array of brand IDs |
| Categories | `category_ids` | No | Array of category IDs |

## ✅ Validation Now Passes

The form now correctly sends:
- ✅ `name` field (required)
- ✅ `code` without spaces
- ✅ `applies_to` with valid value
- ✅ All other required fields

---

**Status**: ✅ Fixed
**Date**: March 6, 2026
