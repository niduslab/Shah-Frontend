# 🚀 Analytics Quick Start Guide

## ✅ What's Already Done

The analytics tracking system has been fully integrated into your frontend. Here's what's tracking:

### Automatic Tracking (No Action Needed)
- ✅ Home page views
- ✅ Product page views
- ✅ Product add to cart
- ✅ Cart page views
- ✅ Cart item updates/removals
- ✅ Checkout funnel (all stages)
- ✅ Search queries

---

## 🎯 How to Use

### For New Pages

#### Option 1: Auto-track Page Views
```typescript
import { usePageViewTracking } from '@/lib/hooks/useAnalytics';

export default function MyPage() {
  usePageViewTracking({
    page_type: 'other',
    page_title: 'My Custom Page',
  });
  
  return <div>My Page Content</div>;
}
```

#### Option 2: Manual Tracking
```typescript
import { useAnalytics } from '@/lib/hooks/useAnalytics';

export default function MyPage() {
  const analytics = useAnalytics();
  
  useEffect(() => {
    analytics.trackPageView({
      page_type: 'other',
      page_title: 'My Custom Page',
    });
  }, []);
  
  return <div>My Page Content</div>;
}
```

### For Custom Events

```typescript
import { useAnalytics } from '@/lib/hooks/useAnalytics';

function MyComponent() {
  const analytics = useAnalytics();
  
  const handleCustomAction = () => {
    // Track add to cart
    analytics.trackAddToCart(productId, quantity, price, variationId);
    
    // Track search
    analytics.trackSearch({
      query: 'laptop',
      results_count: 25,
    });
    
    // Track checkout stage
    analytics.trackCheckout({
      status: 'shipping_info_entered',
    });
  };
}
```

---

## 📊 View Analytics Data

### Admin Dashboard
Access the analytics dashboard:
```
GET /api/admin/analytics/dashboard
```

### Export Data
Export analytics data:
```
GET /api/admin/analytics/export?start_date=2024-01-01&end_date=2024-12-31
```

---

## 🐛 Troubleshooting

### Check if Tracking is Working

1. **Open Browser DevTools** (F12)
2. **Go to Network Tab**
3. **Filter by "analytics"**
4. **Perform an action** (view product, add to cart, etc.)
5. **Look for POST requests** to `/api/analytics/track/*`

### Expected Response
```json
{
  "success": true,
  "message": "Page view tracked"
}
```

### Common Issues

#### No requests showing up
- Check if you're in development mode (debug logs should appear)
- Verify API URL is correct in `.env.local`
- Check browser console for errors

#### 419 CSRF Token Mismatch
- This is handled automatically by the axios interceptor
- Should retry automatically with fresh token

#### 404 Not Found
- Verify backend routes are registered
- Run: `php artisan route:list | grep analytics`

---

## 🔧 Configuration

### Enable/Disable Tracking
```typescript
import analyticsService from '@/lib/services/analyticsService';

// Disable tracking
analyticsService.setEnabled(false);

// Enable tracking
analyticsService.setEnabled(true);

// Check if enabled
const isEnabled = analyticsService.isAnalyticsEnabled();
```

### Debug Mode
Debug mode is automatically enabled in development:
- Console logs all tracking events
- Shows errors if tracking fails
- Disabled in production

---

## 📈 What's Being Tracked

### User Journey
```
1. User visits home page → Page view tracked
2. User searches for "laptop" → Search tracked
3. User clicks product → Product view tracked
4. User adds to cart → Cart event tracked
5. User views cart → Cart viewed tracked
6. User clicks checkout → Checkout initiated tracked
7. User enters shipping → Shipping info tracked
8. User enters payment → Payment info tracked
9. User completes order → Order completed tracked
```

### Data Points
- Session information (automatic)
- Device type (automatic)
- Browser info (automatic)
- Page views
- Product views
- Cart interactions
- Checkout funnel
- Search queries

---

## 🎨 Best Practices

### Do's ✅
- Use hooks for automatic tracking
- Track user actions that matter
- Keep tracking calls simple
- Let errors fail silently

### Don'ts ❌
- Don't track sensitive data (passwords, payment info)
- Don't block UI for tracking
- Don't track every single click
- Don't retry failed tracking calls

---

## 📚 Available Methods

### useAnalytics Hook
```typescript
const analytics = useAnalytics();

// Page views
analytics.trackPageView(data);

// Product views
analytics.trackProductView(data);

// Cart events
analytics.trackCartEvent(data);
analytics.trackAddToCart(productId, quantity, price, variationId);
analytics.trackRemoveFromCart(productId, quantity, price);
analytics.trackUpdateCartQuantity(productId, quantity, price, variationId);

// Checkout
analytics.trackCheckout(data);

// Search
analytics.trackSearch(data);
```

### Auto-tracking Hooks
```typescript
// Auto-track page view on mount
usePageViewTracking(data);

// Auto-track product view on mount
useProductViewTracking(productId);
```

---

## 🎉 You're All Set!

The analytics system is fully integrated and working. Just use the hooks in your components and the tracking will happen automatically.

For more details, see:
- `ANALYTICS_FRONTEND_INTEGRATION_COMPLETE.md` - Complete integration details
- `FRONTEND_TRACKING_GUIDE.md` - API reference
- `SETUP_COMPLETE.md` - Backend setup

---

**Happy Tracking! 📊**
