# ✅ Analytics Testing Checklist

Use this checklist to verify that analytics tracking is working correctly.

---

## 🔧 Prerequisites

- [ ] Backend API is running
- [ ] Frontend is running (`npm run dev`)
- [ ] Browser DevTools is open (F12)
- [ ] Network tab is open and filtered by "analytics"

---

## 🏠 Home Page Testing

### Steps
1. Navigate to home page (`/`)
2. Check Network tab for POST request to `/api/analytics/track/page-view`

### Expected Request
```json
{
  "page_type": "home",
  "page_title": "Home Page"
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Page view tracked"
}
```

### Checklist
- [ ] Request sent successfully
- [ ] Status code: 200
- [ ] Response success: true
- [ ] No console errors

---

## 🛍️ Product Page Testing

### Steps
1. Navigate to any product page (e.g., `/product/some-product`)
2. Check Network tab for POST request to `/api/analytics/track/product-view`

### Expected Request
```json
{
  "product_id": 123
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Product view tracked"
}
```

### Checklist
- [ ] Request sent on page load
- [ ] Product ID is correct
- [ ] Status code: 200
- [ ] No console errors

---

## 🛒 Add to Cart Testing

### Steps
1. On a product page, click "Add to Cart"
2. Check Network tab for POST request to `/api/analytics/track/cart-event`

### Expected Request
```json
{
  "event_type": "added",
  "product_id": 123,
  "quantity": 1,
  "price": 99.99,
  "variation_id": null
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Cart event tracked"
}
```

### Checklist
- [ ] Request sent on add to cart
- [ ] Event type is "added"
- [ ] Product ID is correct
- [ ] Quantity is correct
- [ ] Price is correct
- [ ] Variation ID included if applicable
- [ ] Status code: 200

---

## 🛒 Cart Page Testing

### Test 1: Cart Viewed
#### Steps
1. Navigate to cart page (`/cart`)
2. Check Network tab for POST request to `/api/analytics/track/checkout`

#### Expected Request
```json
{
  "status": "cart_viewed",
  "cart_items": [
    {
      "product_id": 123,
      "name": "Product Name",
      "quantity": 1,
      "price": 99.99
    }
  ],
  "cart_total": 99.99,
  "items_count": 1
}
```

#### Checklist
- [ ] Request sent on page load
- [ ] Status is "cart_viewed"
- [ ] Cart items included
- [ ] Cart total is correct
- [ ] Items count is correct

### Test 2: Update Quantity
#### Steps
1. Click + or - button to change quantity
2. Check Network tab for POST request to `/api/analytics/track/cart-event`

#### Expected Request
```json
{
  "event_type": "updated",
  "product_id": 123,
  "quantity": 2,
  "price": 99.99
}
```

#### Checklist
- [ ] Request sent on quantity change
- [ ] Event type is "updated"
- [ ] New quantity is correct

### Test 3: Remove Item
#### Steps
1. Click "Remove" button
2. Check Network tab for POST request to `/api/analytics/track/cart-event`

#### Expected Request
```json
{
  "event_type": "removed",
  "product_id": 123,
  "quantity": 1,
  "price": 99.99
}
```

#### Checklist
- [ ] Request sent on remove
- [ ] Event type is "removed"
- [ ] Product ID is correct

### Test 4: Proceed to Checkout
#### Steps
1. Click "Proceed to Checkout" button
2. Check Network tab for POST request to `/api/analytics/track/checkout`

#### Expected Request
```json
{
  "status": "checkout_initiated",
  "cart_total": 99.99,
  "items_count": 1
}
```

#### Checklist
- [ ] Request sent on button click
- [ ] Status is "checkout_initiated"
- [ ] Cart total is correct

---

## 💳 Checkout Page Testing

### Test 1: Shipping Info
#### Steps
1. Fill in shipping information
2. Click submit/continue
3. Check Network tab for POST request to `/api/analytics/track/checkout`

#### Expected Request
```json
{
  "status": "shipping_info_entered"
}
```

#### Checklist
- [ ] Request sent when shipping info submitted
- [ ] Status is "shipping_info_entered"

### Test 2: Payment Info
#### Steps
1. Select payment method
2. Continue to next step
3. Check Network tab for POST request to `/api/analytics/track/checkout`

#### Expected Request
```json
{
  "status": "payment_info_entered"
}
```

#### Checklist
- [ ] Request sent when payment info submitted
- [ ] Status is "payment_info_entered"

### Test 3: Order Completed
#### Steps
1. Complete the order
2. Check Network tab for POST request to `/api/analytics/track/checkout`

#### Expected Request
```json
{
  "status": "order_completed",
  "order_id": 789,
  "product_ids": [123, 456]
}
```

#### Checklist
- [ ] Request sent on order completion
- [ ] Status is "order_completed"
- [ ] Order ID is included
- [ ] Product IDs are included

---

## 🔍 Search Testing

### Steps
1. Navigate to shop page (`/shop`)
2. Type a search query (e.g., "laptop")
3. Wait 500ms (debounce delay)
4. Check Network tab for POST request to `/api/analytics/track/search`

### Expected Request
```json
{
  "query": "laptop",
  "results_count": 25
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Search tracked"
}
```

### Checklist
- [ ] Request sent after debounce delay
- [ ] Query is correct
- [ ] Results count is correct
- [ ] Status code: 200

---

## 🐛 Error Testing

### Test 1: Network Error
#### Steps
1. Disconnect from internet
2. Perform any tracked action
3. Check console

#### Expected Behavior
- [ ] No UI disruption
- [ ] Error logged in console (dev mode only)
- [ ] User can continue using the site

### Test 2: API Error
#### Steps
1. Stop backend server
2. Perform any tracked action
3. Check console

#### Expected Behavior
- [ ] No UI disruption
- [ ] Error logged in console (dev mode only)
- [ ] User can continue using the site

---

## 📊 Admin Dashboard Testing

### Steps
1. Login to admin panel
2. Navigate to analytics dashboard
3. Check if data is visible

### Checklist
- [ ] Dashboard loads successfully
- [ ] Visitor data is visible
- [ ] Product views are visible
- [ ] Cart events are visible
- [ ] Checkout funnel is visible
- [ ] Search queries are visible

---

## 🎯 Final Verification

### Overall Checklist
- [ ] All page views tracked
- [ ] All product views tracked
- [ ] All cart events tracked
- [ ] All checkout stages tracked
- [ ] All search queries tracked
- [ ] No console errors
- [ ] No UI disruptions
- [ ] Performance is good
- [ ] Data appears in admin dashboard

---

## 📝 Notes

### Common Issues

#### Request not showing up
- Check if backend is running
- Verify API URL in `.env.local`
- Check CORS settings
- Check CSRF token

#### 419 CSRF Token Mismatch
- Should auto-retry with fresh token
- If persists, check cookie settings

#### 404 Not Found
- Verify backend routes are registered
- Run: `php artisan route:list | grep analytics`

#### Data not in dashboard
- Check database connection
- Verify migrations ran
- Check if data is being saved

---

## ✅ Sign Off

Once all tests pass:

- [ ] All tracking events working
- [ ] No errors in console
- [ ] No UI disruptions
- [ ] Data visible in admin dashboard
- [ ] Performance is acceptable

**Tested by:** _______________  
**Date:** _______________  
**Status:** _______________

---

## 🎉 Success!

If all tests pass, your analytics system is working correctly and ready for production!

For support, see:
- `ANALYTICS_QUICK_START.md`
- `ANALYTICS_FRONTEND_INTEGRATION_COMPLETE.md`
- `FRONTEND_TRACKING_GUIDE.md`
