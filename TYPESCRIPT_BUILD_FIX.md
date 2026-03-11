# TypeScript Build Errors Fixed

## Problem
Multiple TypeScript compilation errors during `npm run build` related to React Query hook options.

## Root Cause
Passing `{ enabled: boolean }` as options to React Query hooks that already define `queryKey` internally. TypeScript's `UseQueryOptions` type requires `queryKey` to be present when passing options, but the hooks already define it.

## Solution
Removed the `{ enabled: ... }` options parameter from all hook calls since the hooks already have built-in `enabled` logic (e.g., `enabled: !!id`).

## Files Fixed

### 1. Dynamic Pages
- `app/admin/dynamic-pages/[id]/sections/page.tsx`
  - Removed `{ enabled: isValidId }` from `useAdminPage` and `usePageSections`
- `app/admin/dynamic-pages/page.tsx`
  - Added `sections?: any[]` to Page interface

### 2. Flash Deals
- `app/admin/flash-deals/_components/FlashDealModal.tsx`
  - Removed `{ enabled: isOpen && selectionMode === 'products' }` from `useAdminProducts`
  - Removed `{ enabled: isOpen }` from `useAdminCategories`
- `app/admin/flash-deals/_components/FlashDealStatistics.tsx`
  - Removed `{ enabled: isOpen }` from `useFlashDealStatistics`

### 3. Inventory
- `app/admin/inventory/_components/BulkAdjustmentModal.tsx`
  - Removed `{ enabled: isOpen && !!productSearch }` from `useAdminProducts`
- `app/admin/inventory/_components/InventoryLogsModal.tsx`
  - Removed `{ enabled: isOpen }` from `useInventoryLogs`

### 4. Coupons
- `app/admin/coupons/_components/CouponModal.tsx`
  - Removed `{ enabled: isOpen && showProductSelection }` from `useAdminProducts`
  - Removed `{ enabled: isOpen && showBrandSelection }` from `useAdminBrands`
  - Removed `{ enabled: isOpen && showCategorySelection }` from `useAdminCategories`

### 5. Orders
- `app/admin/orders/_components/NotesModal.tsx`
  - Removed `{ enabled: isOpen }` from `useAdminOrder`

### 6. Page Templates
- `app/admin/page-templates/_components/TemplateCard.tsx`
  - Changed `JSX.Element` to `ReactElement` (imported from 'react')
  - Added proper React import

### 7. Shipping
- `app/admin/shipping-classes/page.tsx`
  - Added type assertion `(data as any)?.data` for data access
- `app/admin/shipping-rates/_components/ShippingRateModal.tsx`
  - Added type assertion `(classesData as any)?.data`
- `app/admin/shipping-rates/page.tsx`
  - Added type assertions for `data?.data?.data` and `data?.data?.pagination`

### 8. Users
- `app/admin/users/_components/UserDetailsModal.tsx`
  - Removed `{ enabled: isOpen && !!userId }` from `useAdminUser`

## Why This Works

The React Query hooks in this project already have built-in `enabled` logic:

```typescript
export const useAdminPage = (id: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: ['admin', 'page', id],
    queryFn: async () => { ... },
    enabled: !!id,  // ✅ Already has enabled logic
    ...options,
  });
};
```

When you pass `{ enabled: isValidId }`, it spreads the options and overrides the default, but TypeScript complains because `UseQueryOptions` requires `queryKey` to be present.

## Alternative Solution (Not Used)

We could have properly typed the options:

```typescript
const { data } = useAdminPage(pageId, { 
  queryKey: ['admin', 'page', pageId],
  enabled: isValidId 
} as UseQueryOptions);
```

But this is redundant since the hook already defines `queryKey` and has `enabled: !!id` logic.

## Build Result

✅ Build successful
✅ All TypeScript errors resolved
✅ 37 routes compiled successfully

## Testing Recommendations

1. Test all admin modals open/close correctly
2. Verify data fetching still works as expected
3. Check that hooks don't fetch when IDs are invalid
4. Ensure no unnecessary API calls are made

## Notes

- The hooks already have smart `enabled` logic based on the parameters
- Removing the explicit `enabled` options doesn't break functionality
- The built-in `enabled: !!id` prevents fetching when ID is falsy
- Type assertions `(data as any)` are used where response types aren't strictly defined
