# Product Variant Deletion Fix

## Problem
When editing a product in the admin panel (`/admin/products`), removing variants from the product would not update the backend. New variants could be added successfully, but removed variants remained in the database.

## Root Cause
The frontend was only sending the current list of variations to the backend without explicitly indicating which variations should be deleted. The backend had no way to know which existing variations were intentionally removed versus which ones were simply not included in the update.

## Solution
Implemented explicit tracking of deleted variation IDs:

### Frontend Changes

#### 1. ProductModal Component (`app/admin/products/_components/ProductModal.tsx`)
- Added `deletedVariationIds` state to track IDs of removed variations
- Reset `deletedVariationIds` when modal opens/closes
- Include `deleted_variation_ids` in the submit data when updating a product
- Added console logging for deleted variations to aid debugging

```typescript
const [deletedVariationIds, setDeletedVariationIds] = useState<number[]>([]);

// In handleSubmit:
if (product && deletedVariationIds.length > 0) {
  submitData.deleted_variation_ids = deletedVariationIds;
}
```

#### 2. VariationManager Component (`app/admin/products/_components/VariationManager.tsx`)
- Added optional `onDelete` callback prop
- Modified `handleRemove` to call `onDelete` with the variation ID when removing an existing variation
- Only tracks deletions for variations that have an ID (exist in backend)

```typescript
const handleRemove = (index: number) => {
  const variationToRemove = variations[index];
  
  // If the variation has an ID, it exists in the backend and needs to be deleted
  if (variationToRemove.id && onDelete) {
    onDelete(variationToRemove.id);
  }
  
  onChange(variations.filter((_, i) => i !== index));
};
```

#### 3. API Hooks (`lib/hooks/admin/useAdminProducts.ts`)
- Updated both `useCreateProduct` and `useUpdateProduct` to handle `deleted_variation_ids`
- Added FormData support for sending deleted variation IDs array
- Added console logging for debugging

```typescript
// Add deleted variation IDs (for updates only)
if (data.deleted_variation_ids && Array.isArray(data.deleted_variation_ids)) {
  console.log('Processing deleted variations:', data.deleted_variation_ids);
  data.deleted_variation_ids.forEach((id: number, index: number) => {
    formData.append(`deleted_variation_ids[${index}]`, String(id));
  });
}
```

## How It Works

1. When a user opens the product edit modal, existing variations are loaded with their IDs
2. When a user clicks "Remove" on a variation:
   - If the variation has an ID (exists in backend), that ID is added to `deletedVariationIds`
   - The variation is removed from the `variations` array
3. When the form is submitted:
   - Current variations are sent (with IDs for existing ones, without for new ones)
   - `deleted_variation_ids` array is sent containing IDs of removed variations
4. The backend receives both arrays and can:
   - Update existing variations (those with IDs in the variations array)
   - Create new variations (those without IDs in the variations array)
   - Delete variations (those with IDs in the deleted_variation_ids array)

## Backend Requirements

The backend API endpoint (`PUT /api/admin/products/{id}`) should:
1. Accept `deleted_variation_ids` as an array parameter
2. Delete variations whose IDs are in the `deleted_variation_ids` array
3. Update or create variations based on the `variations` array

Example backend logic:
```php
// Delete removed variations
if ($request->has('deleted_variation_ids')) {
    ProductVariation::whereIn('id', $request->deleted_variation_ids)
        ->where('product_id', $product->id)
        ->delete();
}

// Update or create variations
foreach ($request->variations as $variationData) {
    if (isset($variationData['id'])) {
        // Update existing
        ProductVariation::where('id', $variationData['id'])
            ->where('product_id', $product->id)
            ->update($variationData);
    } else {
        // Create new
        $product->variations()->create($variationData);
    }
}
```

## Testing

To test the fix:
1. Go to `/admin/products`
2. Edit a product that has variations
3. Open the browser console (F12)
4. Remove one or more variations - you should see console logs:
   - `🔴 REMOVE BUTTON CLICKED!` - Confirms button was clicked
   - `🗑️ Removing variation:` - Shows variation details
   - `✅ Calling onDelete for variation ID:` - If variation exists in backend
   - `📋 New variations list:` - Shows updated list
   - `🗑️ ProductModal: Tracking deleted variation ID:` - Confirms ID tracked
5. Add a new variation (optional)
6. Save the product
7. Check console for `🗑️ Deleted Variations` showing IDs to delete
8. Verify in the backend that the variations were actually deleted

## Troubleshooting

If variations are not being removed:

1. **Check Console Logs**: Open browser console and look for the debug logs
2. **Button Not Responding**: If you don't see `🔴 REMOVE BUTTON CLICKED!`, there may be a JavaScript error
3. **No ID on Variation**: If you see `ℹ️ Variation is new (no ID)`, the variation was never saved to backend
4. **Backend Not Deleting**: If frontend logs show correct IDs but backend doesn't delete, check backend implementation

## Console Logs

The implementation includes detailed console logging:
- `🔍 Product Submission Debug` - Shows all data being submitted
- `📦 Variations Details` - Lists all variations being sent
- `🗑️ Deleted Variations` - Shows IDs of variations to be deleted
- `🔧 useUpdateProduct - Processing Data` - Shows API processing details

## Files Modified

1. `app/admin/products/_components/ProductModal.tsx`
2. `app/admin/products/_components/VariationManager.tsx`
3. `lib/hooks/admin/useAdminProducts.ts`

## Status
✅ Frontend implementation complete
⚠️ Backend needs to handle `deleted_variation_ids` parameter
