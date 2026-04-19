# Coupon Display UI Guide

## Cart Page - Coupon Section

### Before Applying Coupon
```
┌─────────────────────────────────────────────────┐
│ Order Summary                                   │
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌─────────────────────────┬─────────┐          │
│ │ Enter coupon code       │ Apply   │          │
│ └─────────────────────────┴─────────┘          │
│                                                 │
│ Total Items              05                     │
│ Sub Total                $1,500.00              │
│ Total Price              $1,500.00              │
│                                                 │
│ [Proceed to Checkout]                           │
│ [Continue Shopping]                             │
└─────────────────────────────────────────────────┘
```

### After Applying Coupon (Success)
```
┌─────────────────────────────────────────────────┐
│ Order Summary                                   │
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ ┌─────────┐ Coupon Applied                  │ │
│ │ │BOISHAK  │                                  │ │
│ │ └─────────┘ BOISHAK                         │ │
│ │             You saved $150.00        Remove │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Total Items              05                     │
│ Sub Total                $1,500.00              │
│ Discount                 -$150.00 (green)       │
│ Total Price              $1,350.00              │
│                                                 │
│ [Proceed to Checkout]                           │
│ [Continue Shopping]                             │
└─────────────────────────────────────────────────┘
```

## Checkout Page - Order Summary

### Without Coupon
```
┌─────────────────────────────────────────────────┐
│ Order Summary                                   │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Product 1 with image and details]              │
│ [Product 2 with image and details]              │
│                                                 │
│ ─────────────────────────────────────────────── │
│                                                 │
│ Subtotal (5 items)       $1,500.00              │
│ Shipping                 $50.00                 │
│ ─────────────────────────────────────────────── │
│ Total                    $1,550.00              │
│                                                 │
│ [Place Order / Pay Now]                         │
└─────────────────────────────────────────────────┘
```

### With Applied Coupon
```
┌─────────────────────────────────────────────────┐
│ Order Summary                                   │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Product 1 with image and details]              │
│ [Product 2 with image and details]              │
│                                                 │
│ ─────────────────────────────────────────────── │
│                                                 │
│ Subtotal (5 items)       $1,500.00              │
│ Discount ┌─────────┐     -$150.00 (green)       │
│          │BOISHAK  │                            │
│          └─────────┘                            │
│ Shipping                 $50.00                 │
│ ─────────────────────────────────────────────── │
│ Total                    $1,400.00              │
│                                                 │
│ [Place Order / Pay Now]                         │
└─────────────────────────────────────────────────┘
```

## Color Scheme

### Cart Page - Applied Coupon Box
- **Background**: Light green (`bg-green-50`)
- **Border**: Green 200 (`border-green-200`)
- **Badge Background**: Green 600 (`bg-green-600`)
- **Badge Text**: White
- **Coupon Name**: Green 800 (`text-green-800`)
- **Savings Text**: Green 600 (`text-green-600`)
- **Remove Button**: Red 600 (`text-red-600`)

### Checkout Page - Discount Line
- **Badge Background**: Green 100 (`bg-green-100`)
- **Badge Text**: Green 800 (`text-green-800`)
- **Discount Amount**: Green 600 (`text-green-600`)

## Component Breakdown

### Cart Page Coupon Section
```tsx
{appliedCoupon ? (
  // Applied coupon display
  <div className="space-y-3">
    <div className="flex items-center justify-between rounded-sm border border-green-200 bg-green-50 p-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-bold text-white">
            {appliedCoupon.code}
          </span>
          <span className="text-sm font-medium text-green-800">
            Coupon Applied
          </span>
        </div>
        <p className="text-sm text-green-700">
          {appliedCoupon.coupon?.name || 'Discount Applied'}
        </p>
        <p className="text-xs text-green-600 mt-1">
          You saved ${appliedCoupon.discount_amount.toFixed(2)}
        </p>
      </div>
      <button onClick={handleRemoveCoupon}>
        Remove
      </button>
    </div>
  </div>
) : (
  // Coupon input form
  <div className="flex gap-2">
    <input type="text" placeholder="Enter coupon code" />
    <button>Apply</button>
  </div>
)}
```

### Checkout Page Discount Line
```tsx
{appliedCoupon && discount > 0 && (
  <div className="flex justify-between text-sm">
    <div className="flex items-center gap-2">
      <span className="text-gray-600">Discount</span>
      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
        {appliedCoupon.code}
      </span>
    </div>
    <span className="font-medium text-green-600">
      -${discount.toFixed(2)}
    </span>
  </div>
)}
```

## User Interactions

### Apply Coupon Flow
1. User types coupon code (auto-converts to uppercase)
2. User clicks "Apply" button
3. Button shows "Applying..." with disabled state
4. API validates coupon
5. Success: Green box appears with coupon details
6. Error: Toast notification shows error message

### Remove Coupon Flow
1. User clicks "Remove" button
2. Coupon box disappears
3. Input field reappears
4. Discount removed from totals
5. Toast notification: "Coupon removed"

### Navigation Flow
1. Coupon applied in cart
2. User clicks "Proceed to Checkout"
3. Checkout page loads with coupon already applied
4. Discount automatically shown in order summary
5. No need to re-enter coupon code

## Responsive Behavior

### Mobile (< 640px)
- Coupon input and button stack vertically if needed
- Applied coupon box adjusts padding
- Badge and text wrap appropriately

### Tablet (640px - 1024px)
- Coupon section maintains horizontal layout
- Order summary sidebar appears below main content

### Desktop (> 1024px)
- Order summary appears as fixed sidebar
- Coupon section has optimal spacing
- All elements display in single line

## Accessibility Features
- Proper ARIA labels on buttons
- Keyboard navigation support
- Color contrast meets WCAG AA standards
- Screen reader friendly text
- Focus indicators on interactive elements

## Animation & Transitions
- Smooth fade-in when coupon applied
- Button hover states
- Loading spinner during validation
- Toast notifications for feedback

## Error States

### Invalid Coupon
```
Toast: "Invalid coupon code"
- Red background
- Error icon
- Auto-dismiss after 3 seconds
```

### Expired Coupon
```
Toast: "This coupon has expired"
- Red background
- Error icon
- Auto-dismiss after 3 seconds
```

### Minimum Order Not Met
```
Toast: "Minimum order amount not met"
- Red background
- Error icon
- Auto-dismiss after 3 seconds
```

## Success States

### Coupon Applied
```
Toast: "Coupon applied successfully!"
- Green background
- Success icon
- Auto-dismiss after 3 seconds
```

### Coupon Removed
```
Toast: "Coupon removed"
- Default background
- Info icon
- Auto-dismiss after 2 seconds
```
