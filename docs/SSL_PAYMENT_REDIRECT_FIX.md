# SSL Commerce Payment Redirect Fix

## Issue
When proceeding to checkout with SSL Commerce payment method, the page was reloading and redirecting to cart instead of the SSL payment gateway.

---

## Root Causes Identified

### 1. Cart Clearing Before Redirect
**Problem**: Cart was being cleared immediately after order creation, triggering the "empty cart" redirect logic.

**Solution**: 
- Only clear cart for COD payments
- For SSL Commerce, keep cart until payment is confirmed
- Cart will be cleared after successful payment callback

### 2. Empty Cart Redirect During Processing
**Problem**: The useEffect that checks for empty cart was triggering during checkout processing.

**Solution**: Added `isProcessing` check to prevent redirect during checkout.

### 3. Missing Redirect URL Handling
**Problem**: Not checking all possible locations for the redirect URL in the API response.

**Solution**: Check multiple possible response fields:
- `response.data.payment.redirect_url`
- `response.data.redirect_url`
- `response.data.payment_url`
- `response.data.gatewayPageURL`

---

## Changes Made

### 1. Updated Checkout Handler

```typescript
// Before
if (response.success) {
  clearCart(); // ❌ Cleared cart immediately
  
  if (paymentMethod === 'ssl' && response.data?.payment?.redirect_url) {
    window.location.href = response.data.payment.redirect_url;
  }
}

// After
if (response.success) {
  if (paymentMethod === 'ssl') {
    const redirectUrl = response.data?.payment?.redirect_url 
      || response.data?.redirect_url 
      || response.data?.payment_url
      || response.data?.gatewayPageURL;
    
    if (redirectUrl) {
      // ✅ Don't clear cart - will be cleared after payment
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 100);
      return;
    }
  } else {
    // ✅ Only clear cart for COD
    clearCart();
    // Redirect to order confirmation
  }
}
```

### 2. Updated Empty Cart Check

```typescript
// Before
useEffect(() => {
  if (!authLoading && items.length === 0 && isClient) {
    window.location.href = '/cart';
  }
}, [items, authLoading, isClient]);

// After
useEffect(() => {
  if (!authLoading && items.length === 0 && isClient && !isProcessing) {
    // ✅ Added isProcessing check
    window.location.href = '/cart';
  }
}, [items, authLoading, isClient, isProcessing]);
```

### 3. Added Debugging

```typescript
console.log('Checkout response:', response);
console.log('Redirecting to SSL Commerce:', redirectUrl);
console.error('SSL Commerce redirect URL not found:', response);
```

---

## Payment Flow

### SSL Commerce Flow
```
1. User clicks "Proceed to Payment"
2. Order created in database
3. SSL Commerce payment initiated
4. Redirect URL received from API
5. User redirected to SSL Commerce
6. User completes payment
7. SSL Commerce sends callback (IPN)
8. Cart cleared on success callback
9. User redirected to order confirmation
```

### Cash on Delivery Flow
```
1. User clicks "Place Order"
2. Order created in database
3. Cart cleared immediately
4. User redirected to order confirmation
```

---

## API Response Structure

### Expected SSL Commerce Response
```json
{
  "success": true,
  "data": {
    "order_number": "SS20240309ABCD",
    "payment": {
      "redirect_url": "https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q=..."
    }
  }
}
```

### Alternative Response Structures
```json
// Option 1
{
  "success": true,
  "data": {
    "redirect_url": "https://..."
  }
}

// Option 2
{
  "success": true,
  "data": {
    "payment_url": "https://..."
  }
}

// Option 3
{
  "success": true,
  "data": {
    "gatewayPageURL": "https://..."
  }
}
```

---

## Testing Checklist

### SSL Commerce Payment
- [ ] Click "Proceed to Payment" with SSL selected
- [ ] Verify console shows "Redirecting to SSL Commerce: [URL]"
- [ ] Verify redirect happens to SSL Commerce page
- [ ] Cart should NOT be empty during redirect
- [ ] Complete payment on SSL Commerce
- [ ] Verify redirect back to site
- [ ] Verify cart is cleared after successful payment

### Cash on Delivery
- [ ] Click "Place Order" with COD selected
- [ ] Verify cart is cleared immediately
- [ ] Verify redirect to order confirmation
- [ ] No SSL Commerce redirect should occur

### Error Handling
- [ ] If redirect URL missing, show error message
- [ ] Processing state prevents double submission
- [ ] Network errors handled gracefully
- [ ] User can retry after error

---

## Debugging Tips

### Check Browser Console
Look for these log messages:
```
Checkout response: {...}
Redirecting to SSL Commerce: https://...
```

### Check Network Tab
1. Look for POST to `/api/checkout/process`
2. Check response contains redirect URL
3. Verify redirect happens after response

### Common Issues

#### Issue: Page reloads to cart
**Cause**: Cart being cleared before redirect
**Fix**: Ensure SSL payment doesn't clear cart

#### Issue: No redirect happens
**Cause**: Redirect URL not found in response
**Fix**: Check API response structure, add console.log

#### Issue: "Cart is empty" error
**Cause**: Empty cart check triggering during processing
**Fix**: Ensure `isProcessing` check is in place

---

## Environment Variables

Ensure these are set:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_IMAGE_BASE_URL=your_image_base_url
```

---

## Backend Requirements

### SSL Commerce Configuration
```php
// .env
SSLCZ_STORE_ID=your_store_id
SSLCZ_STORE_PASSWORD=your_password
SSLCZ_TESTMODE=true

// config/services.php
'sslcommerz' => [
    'store_id' => env('SSLCZ_STORE_ID'),
    'store_password' => env('SSLCZ_STORE_PASSWORD'),
    'sandbox' => env('SSLCZ_TESTMODE', true),
],
```

### Callback URLs
Ensure these routes are accessible:
- Success: `/api/payments/ssl-commerz/success`
- Fail: `/api/payments/ssl-commerz/fail`
- Cancel: `/api/payments/ssl-commerz/cancel`
- IPN: `/api/payments/ssl-commerz/ipn`

---

## Success Indicators

### ✅ Working Correctly When:
1. SSL payment redirects to SSL Commerce page
2. Cart remains intact during redirect
3. Console shows redirect URL
4. No "cart is empty" error during checkout
5. COD orders clear cart immediately
6. Error messages show if redirect URL missing

### ❌ Still Broken If:
1. Page reloads to cart page
2. "Cart is empty" error appears
3. No redirect to SSL Commerce
4. Console shows errors
5. Cart clears before SSL redirect

---

## Related Files

- `app/(public)/checkout/page.tsx` - Main checkout page
- `lib/hooks/user/useCheckout.ts` - Checkout API hook
- `lib/context/CartContext.tsx` - Cart state management

---

## Support

### If Issues Persist:

1. **Check API Response**:
   ```bash
   # Test checkout API
   curl -X POST http://your-api/api/checkout/process \
     -H "Content-Type: application/json" \
     -d '{"items":[...],"payment_method":"ssl_commerz"}'
   ```

2. **Verify SSL Commerce Setup**:
   - Check store credentials
   - Verify sandbox mode
   - Test with SSL Commerce test cards

3. **Check Browser Console**:
   - Look for JavaScript errors
   - Check network requests
   - Verify redirect URL format

4. **Test with COD First**:
   - Ensure basic checkout works
   - Then test SSL Commerce

---

**Status**: ✅ FIXED

**Last Updated**: March 9, 2026

**Version**: 1.1.0
