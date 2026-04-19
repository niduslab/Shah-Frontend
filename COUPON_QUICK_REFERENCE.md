# Coupon System - Quick Reference

## 🔑 Key Components

### CartContext
```typescript
// Access coupon state
const { appliedCoupon, setAppliedCoupon } = useCart();

// Coupon structure
interface AppliedCoupon {
  code: string;              // e.g., "BOISHAK"
  discount_amount: number;   // e.g., 150
  coupon: any;              // Full API response
}
```

### Cart Page
```typescript
// Apply coupon
validateCoupon.mutate({ code, items, subtotal }, {
  onSuccess: (response) => {
    setAppliedCoupon({
      code: response.data.coupon.code,
      discount_amount: response.data.discount,
      coupon: response.data.coupon,
    });
  }
});

// Remove coupon
setAppliedCoupon(null);
```

### Checkout Page
```typescript
// Use coupon in calculations
const discount = appliedCoupon?.discount_amount || 0;
const total = subtotal - discount + shipping;

// Include in checkout
checkoutData.coupon_code = appliedCoupon?.code;
```

## 📡 API Endpoints

### Validate Coupon
```
POST /api/cart/validate-coupon
Body: { code, items, subtotal }
Response: { success, data: { discount, coupon } }
```

### Checkout with Coupon
```
POST /api/checkout
Body: { items, coupon_code, ... }
```

## 🎨 UI Components

### Cart - Coupon Input
```tsx
<input 
  value={couponCode}
  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
  placeholder="Enter coupon code"
/>
<button onClick={handleApplyCoupon}>Apply</button>
```

### Cart - Applied Coupon Display
```tsx
<div className="border-green-200 bg-green-50">
  <span className="bg-green-600 text-white">{code}</span>
  <p>You saved ${discount}</p>
  <button onClick={handleRemoveCoupon}>Remove</button>
</div>
```

### Checkout - Discount Line
```tsx
<div className="flex justify-between">
  <span>Discount <badge>{code}</badge></span>
  <span className="text-green-600">-${discount}</span>
</div>
```

## 💾 Data Storage

### localStorage Keys
- `shopping_cart` - Cart items
- `applied_coupon` - Coupon data

### Data Persistence
- Survives page refresh
- Cleared on cart clear
- Cleared after successful order

## 🔄 State Flow

```
User Input
    ↓
API Validation
    ↓
CartContext.setAppliedCoupon()
    ↓
localStorage.setItem('applied_coupon')
    ↓
Cart Page (displays coupon)
    ↓
Checkout Page (uses coupon)
    ↓
Backend API (applies discount)
    ↓
Order Complete (clear coupon)
```

## ⚠️ Error Handling

```typescript
// Invalid coupon
toast.error('Invalid coupon code');

// Expired coupon
toast.error('This coupon has expired');

// API error
toast.error(error.response?.data?.message || 'Failed to apply coupon');
```

## ✅ Validation Rules

- Coupon code required
- Must be valid format
- Must exist in database
- Must not be expired
- Must meet minimum order amount
- Must apply to cart products

## 🎯 Common Tasks

### Check if Coupon Applied
```typescript
if (appliedCoupon) {
  // Coupon is applied
}
```

### Get Discount Amount
```typescript
const discount = appliedCoupon?.discount_amount || 0;
```

### Get Coupon Code
```typescript
const code = appliedCoupon?.code;
```

### Clear Coupon
```typescript
setAppliedCoupon(null);
```

### Calculate Total with Discount
```typescript
const total = subtotal - (appliedCoupon?.discount_amount || 0) + shipping;
```

## 🐛 Debugging

### Check localStorage
```javascript
// In browser console
localStorage.getItem('applied_coupon')
```

### Check Context State
```typescript
console.log('Applied Coupon:', appliedCoupon);
```

### Verify API Response
```typescript
console.log('Validation Response:', response.data);
```

## 📱 Responsive Behavior

- **Mobile**: Stacked layout
- **Tablet**: Horizontal layout
- **Desktop**: Sidebar layout

## 🎨 Color Scheme

- **Success**: Green (bg-green-50, text-green-600)
- **Badge**: Dark Green (bg-green-600, text-white)
- **Error**: Red (text-red-500)
- **Discount**: Green (text-green-600)

## 🔐 Security Notes

- Validation happens on backend
- Frontend only displays validated data
- Coupon code sent securely to backend
- No client-side discount calculation for orders

## 📊 Analytics Integration

```typescript
// Track coupon applied
analytics.trackEvent('coupon_applied', {
  code: appliedCoupon.code,
  discount: appliedCoupon.discount_amount,
});

// Track checkout with coupon
analytics.trackCheckout({
  status: 'order_completed',
  coupon_code: appliedCoupon?.code,
});
```

## 🚀 Quick Start

1. **Apply Coupon**:
   ```typescript
   setAppliedCoupon({ code, discount_amount, coupon });
   ```

2. **Display Discount**:
   ```tsx
   {appliedCoupon && <div>-${appliedCoupon.discount_amount}</div>}
   ```

3. **Use in Checkout**:
   ```typescript
   checkoutData.coupon_code = appliedCoupon?.code;
   ```

4. **Clear After Order**:
   ```typescript
   setAppliedCoupon(null);
   ```

## 📞 Support

For issues or questions:
1. Check console for errors
2. Verify API response structure
3. Check localStorage data
4. Review CartContext state
5. Test with valid coupon code

---

**Last Updated**: Implementation Complete
**Status**: ✅ Production Ready
