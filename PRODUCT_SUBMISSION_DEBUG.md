# Product Submission Debug Guide

## Overview
Comprehensive console logging has been added to track product data through the entire submission pipeline.

## Debug Logging Locations

### 1. ProductModal.tsx - Form Submission
**When:** Before data is sent to the parent component
**Location:** `handleSubmit` function

**Console Output:**
```
🔍 Product Submission Debug
├─ Operation: CREATE | UPDATE
├─ Product ID: (if updating)
├─ Form Data: { name, sku, price, ... }
├─ Images Count: X
├─ Images Data: [...]
├─ Variations Count: X
├─ Variations Data: [...]
├─ Final Submit Data: { ... }
│
├─ 📦 Variations Details
│  ├─ Variation #1: { id, sku, price, quantity, attributes, sort_order }
│  ├─ Variation #2: { ... }
│  └─ ...
│
└─ 🖼️ Images Details
   ├─ Image #1: { hasFile, fileName, path, alt_text, is_primary, sort_order }
   ├─ Image #2: { ... }
   └─ ...
```

### 2. ProductsPage.tsx - API Call Handler
**When:** When the mutation is triggered
**Location:** `ProductModal` `onSubmit` prop

**Console Output:**
```
📤 Product API Call
├─ Operation: CREATE | UPDATE
├─ Product ID: (if updating)
└─ Data being sent to API: { ... }

🔄 Calling UPDATE mutation... | ➕ Calling CREATE mutation...
✅ Update successful: { ... } | ✅ Create successful: { ... }

OR

❌ Product API Error
├─ Error details: { ... }
├─ Failed operation: CREATE | UPDATE
└─ Data that failed: { ... }
```

### 3. useAdminProducts.ts - Data Processing
**When:** Inside the mutation function before API call
**Location:** `useCreateProduct` and `useUpdateProduct` hooks

**Console Output:**
```
🔧 useCreateProduct - Processing Data | 🔧 useUpdateProduct - Processing Data
├─ Product ID: (if updating)
├─ Input data: { ... }
├─ Has file uploads: true | false
│
├─ Processing images: X
│  ├─ Image 0: File upload - filename.jpg | Existing path - /path/to/image.jpg
│  ├─ Image 1: ...
│  └─ ...
│
├─ Processing variations: X
│  ├─ Variation 0: { id: NEW | 123, sku, price, quantity, attributes }
│  │  ├─ Attribute: color = red
│  │  ├─ Attribute: size = large
│  │  └─ ...
│  ├─ Variation 1: ...
│  └─ ...
│
└─ Sending FormData to API... | Sending JSON data to API...
```

## How to Use

### Step 1: Open Browser Console
1. Press F12 (Windows/Linux) or Cmd+Option+I (Mac)
2. Go to the "Console" tab
3. Clear the console (optional)

### Step 2: Perform Product Operation
1. Go to Admin → Products
2. Click "Add Product" or edit an existing product
3. Fill in the form
4. Add images (optional)
5. Add variations (optional)
6. Click "Create Product" or "Update Product"

### Step 3: Review Console Output
The console will show a complete trace of the data flow:

```
🔍 Product Submission Debug
  Operation: CREATE
  Form Data: {...}
  Images Count: 2
  Variations Count: 3
  Final Submit Data: {...}
  
  📦 Variations Details
    Variation #1: {
      id: "NEW",
      sku: "TSHIRT-RED-L",
      price: 29.99,
      quantity: 100,
      attributes: { color: "red", size: "large" },
      sort_order: 0
    }
    ...

📤 Product API Call
  Operation: CREATE
  Data being sent to API: {...}

🔧 useCreateProduct - Processing Data
  Input data: {...}
  Has file uploads: true
  Processing images: 2
    Image 0: File upload - product1.jpg
    Image 1: File upload - product2.jpg
  Processing variations: 3
    Variation 0: { id: "NEW", sku: "TSHIRT-RED-L", ... }
      - Attribute: color = red
      - Attribute: size = large
    ...
  Sending FormData to API...

➕ Calling CREATE mutation...
✅ Create successful: {...}
```

## What to Check

### Basic Product Data
- ✅ All required fields are present (name, sku, price, quantity, category_id, brand_id)
- ✅ Numeric fields are properly converted (price, quantity, etc.)
- ✅ Boolean fields are present (is_featured, is_trending)
- ✅ Optional fields are included only if filled

### Images Data
- ✅ Images count matches what you uploaded
- ✅ File uploads show `hasFile: true` and `fileName`
- ✅ Existing images show `path` instead of file
- ✅ Primary image is marked correctly
- ✅ Sort order is sequential (0, 1, 2, ...)

### Variations Data
- ✅ Variations count matches what you added
- ✅ Each variation has unique SKU
- ✅ Price and quantity are numbers (not strings)
- ✅ Attributes object contains all selected attributes
- ✅ For updates: existing variations have `id`, new ones show "NEW"

### FormData Processing
- ✅ When files are present: "Has file uploads: true"
- ✅ Images are processed and added to FormData
- ✅ Variations are processed with all attributes
- ✅ Attributes are added as individual FormData entries

## Common Issues and Solutions

### Issue: Variations not being sent
**Check:**
- Variations Count should be > 0
- Each variation should have sku, price, quantity
- Attributes object should not be empty

**Solution:**
- Ensure you clicked "Add Variation"
- Fill in all required fields (SKU, Price, Stock)
- Add at least one attribute

### Issue: Images not uploading
**Check:**
- Images Count should be > 0
- Each image should show `hasFile: true` or `path`
- File names should be visible

**Solution:**
- Ensure images were selected
- Check file size (might be too large)
- Verify file format is supported

### Issue: Attributes not saving
**Check:**
- In Variations Details, attributes object should contain key-value pairs
- In Processing variations, each attribute should be logged

**Solution:**
- Ensure you clicked "Add Attribute" and selected/entered values
- Verify attributes are showing in the variation card before submitting

### Issue: Data type errors
**Check:**
- Price, quantity should be numbers, not strings
- Boolean fields should be true/false, not "1"/"0"

**Solution:**
- The code handles conversion automatically
- If you see strings, there might be a parsing issue

## Debugging Specific Scenarios

### Scenario 1: Creating Product with Variations
Expected console output:
1. Form submission shows variations array
2. API call shows data being sent
3. Processing shows each variation with attributes
4. Success message appears

### Scenario 2: Updating Product - Adding New Variation
Expected console output:
1. Existing variations show with `id` numbers
2. New variation shows `id: "NEW"`
3. All variations are sent to API
4. Backend should handle create/update accordingly

### Scenario 3: Updating Product - Modifying Variation
Expected console output:
1. Modified variation shows existing `id`
2. Changed fields show new values
3. Attributes object reflects changes

### Scenario 4: Product with Images and Variations
Expected console output:
1. Both images and variations sections appear
2. FormData processing shows both being added
3. "Has file uploads: true" if new images added

## Performance Notes

- Console logging adds minimal overhead
- Grouped logs can be collapsed for cleaner view
- File objects are not fully logged (only metadata)
- Large datasets might slow console rendering

## Cleanup

Once debugging is complete, you can remove the console.log statements from:
1. `app/admin/products/_components/ProductModal.tsx` - handleSubmit function
2. `app/admin/products/page.tsx` - ProductModal onSubmit prop
3. `lib/hooks/admin/useAdminProducts.ts` - useCreateProduct and useUpdateProduct

Or keep them for future debugging (they don't affect production builds significantly).

## Additional Tips

### Filter Console Output
Use the console filter to show only relevant logs:
- Type "Product" to see product-related logs
- Type "Variation" to see variation-specific logs
- Type "🔍" or "📤" to see specific stages

### Copy Console Output
Right-click on a log group → "Copy object" to share with developers

### Save Console Log
Right-click in console → "Save as..." to export full log

### Network Tab
Also check the Network tab to see:
- Actual HTTP request/response
- Request payload (FormData entries)
- Response status and data
- Any error messages from backend

## Example Complete Flow

```javascript
// 1. Form Submission (ProductModal)
🔍 Product Submission Debug
  Operation: CREATE
  Variations Count: 2
  📦 Variations Details
    Variation #1: { sku: "PROD-RED-L", price: 29.99, attributes: { color: "red", size: "large" } }
    Variation #2: { sku: "PROD-BLUE-L", price: 29.99, attributes: { color: "blue", size: "large" } }

// 2. API Call (ProductsPage)
📤 Product API Call
  Operation: CREATE
  Data being sent to API: { name: "T-Shirt", variations: [...] }

// 3. Data Processing (useAdminProducts)
🔧 useCreateProduct - Processing Data
  Has file uploads: false
  Processing variations: 2
    Variation 0: { id: "NEW", sku: "PROD-RED-L", ... }
      - Attribute: color = red
      - Attribute: size = large
    Variation 1: { id: "NEW", sku: "PROD-BLUE-L", ... }
      - Attribute: color = blue
      - Attribute: size = large
  Sending JSON data to API...

// 4. Success
➕ Calling CREATE mutation...
✅ Create successful: { id: 123, name: "T-Shirt", ... }
```

This complete trace helps identify exactly where any issue occurs in the data flow.
