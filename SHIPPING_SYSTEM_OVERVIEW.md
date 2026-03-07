# Shipping System - Complete Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SHIPPING SYSTEM                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   Admin Panel    │         │  Customer Side   │         │
│  │                  │         │                  │         │
│  │ • Shipping Rates │         │ • Product Pages  │         │
│  │ • Shipping Classes│        │ • Cart           │         │
│  │ • Product Config │         │ • Checkout       │         │
│  └────────┬─────────┘         └────────┬─────────┘         │
│           │                            │                    │
│           └────────────┬───────────────┘                    │
│                        │                                    │
│                 ┌──────▼──────┐                            │
│                 │  API Hooks   │                            │
│                 │              │                            │
│                 │ useShipping  │                            │
│                 └──────┬───────┘                            │
│                        │                                    │
│                 ┌──────▼──────┐                            │
│                 │ Backend API  │                            │
│                 │              │                            │
│                 │ Laravel      │                            │
│                 └──────────────┘                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
shah-sports/
├── lib/
│   └── hooks/
│       └── admin/
│           └── useShipping.ts              # Shipping API hooks
│
├── app/
│   └── admin/
│       ├── shipping-rates/
│       │   ├── page.tsx                    # Shipping rates list page
│       │   └── _components/
│       │       ├── ShippingRateModal.tsx   # Create/Edit modal
│       │       └── DeleteConfirmModal.tsx  # Delete confirmation
│       │
│       └── shipping-classes/
│           ├── page.tsx                    # Shipping classes list page
│           └── _components/
│               ├── ShippingClassModal.tsx  # Create/Edit modal
│               └── DeleteConfirmModal.tsx  # Delete confirmation
│
└── Documentation/
    ├── FRONTEND_SHIPPING_IMPLEMENTATION_GUIDE.md  # Complete API guide
    ├── SHIPPING_ADMIN_COMPLETE.md                 # Admin implementation
    └── SHIPPING_SYSTEM_OVERVIEW.md                # This file
```

## Components Overview

### 1. API Hooks (`lib/hooks/admin/useShipping.ts`)

Central hub for all shipping-related API calls.

**Shipping Rates Hooks:**
- `useShippingRates()` - List rates with filters
- `useShippingRate()` - Get single rate
- `useCreateShippingRate()` - Create new rate
- `useUpdateShippingRate()` - Update rate
- `useDeleteShippingRate()` - Delete rate

**Shipping Classes Hooks:**
- `useShippingClasses()` - List all classes
- `useShippingClass()` - Get single class
- `useCreateShippingClass()` - Create new class
- `useUpdateShippingClass()` - Update class
- `useDeleteShippingClass()` - Delete class

### 2. Shipping Rates Management

**Page:** `app/admin/shipping-rates/page.tsx`

Features:
- List all shipping rates in a table
- Filter by method (Shah Sports Team, Pathao Courier)
- Filter by status (Active, Inactive)
- Pagination
- Create new rate
- Edit existing rate
- Delete rate
- Visual badges for methods and status

**Modal:** `app/admin/shipping-rates/_components/ShippingRateModal.tsx`

Form fields:
- Name (required)
- Method (required) - Shah Sports Team or Pathao Courier
- Zone (optional) - e.g., Dhaka, Chittagong
- Shipping Class (optional) - Select from available classes
- Base Cost (required) - Base shipping cost
- Per KG Cost (optional) - Additional cost per kilogram
- Min/Max Weight (optional) - Weight range
- Free Shipping Threshold (optional) - Order amount for free shipping
- Delivery Time (optional) - e.g., "1-2 business days"
- Active Status (checkbox)

### 3. Shipping Classes Management

**Page:** `app/admin/shipping-classes/page.tsx`

Features:
- List all shipping classes
- Show products count per class
- Create new class
- Edit existing class
- Delete class (only if no products assigned)
- Empty state with call-to-action
- Info box explaining shipping classes

**Modal:** `app/admin/shipping-classes/_components/ShippingClassModal.tsx`

Form fields:
- Name (required)
- Description (optional)

## Data Flow

### Creating a Shipping Rate

```
User Action (Click "Add Shipping Rate")
    ↓
ShippingRateModal Opens
    ↓
User Fills Form
    ↓
User Clicks "Create"
    ↓
useCreateShippingRate Hook
    ↓
POST /api/admin/shipping-rates
    ↓
Backend Validates & Saves
    ↓
Success Response
    ↓
Query Cache Invalidated
    ↓
Table Refreshes with New Rate
    ↓
Modal Closes
```

### Filtering Shipping Rates

```
User Selects Filter (e.g., Method = "Pathao Courier")
    ↓
State Updates
    ↓
useShippingRates Hook Re-fetches
    ↓
GET /api/admin/shipping-rates?method=pathao_courier
    ↓
Backend Returns Filtered Results
    ↓
Table Updates with Filtered Data
```

## Integration Points

### 1. Admin Navigation

Add to your admin sidebar:

```typescript
{
  name: 'Shipping',
  icon: TruckIcon,
  children: [
    {
      name: 'Shipping Rates',
      href: '/admin/shipping-rates',
    },
    {
      name: 'Shipping Classes',
      href: '/admin/shipping-classes',
    },
  ],
}
```

### 2. Product Management

When editing products, you can:
- Assign a shipping class
- Set custom shipping type (default, free, fixed, per_item)
- Set custom shipping cost
- Mark if requires shipping
- Mark if needs separate shipping
- Add shipping notes

### 3. Checkout Flow

During checkout:
1. Customer selects shipping address
2. System calculates available shipping methods
3. Customer selects preferred method
4. Shipping cost is added to order total
5. Order is created with shipping details

## API Endpoints Reference

### Shipping Rates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/shipping-rates` | List all rates |
| GET | `/api/admin/shipping-rates/{id}` | Get single rate |
| POST | `/api/admin/shipping-rates` | Create new rate |
| PUT | `/api/admin/shipping-rates/{id}` | Update rate |
| DELETE | `/api/admin/shipping-rates/{id}` | Delete rate |

### Shipping Classes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/shipping-classes` | List all classes |
| GET | `/api/admin/shipping-classes/{id}` | Get single class |
| POST | `/api/admin/shipping-classes` | Create new class |
| PUT | `/api/admin/shipping-classes/{id}` | Update class |
| DELETE | `/api/admin/shipping-classes/{id}` | Delete class |

### Customer APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/checkout/shipping-methods` | Get available methods |
| POST | `/api/checkout/preview` | Preview order with shipping |
| POST | `/api/checkout/process` | Process order |
| GET | `/api/orders/{orderNumber}/track` | Track order |

## Shipping Calculation Logic

### How Shipping Cost is Calculated

1. **Product Level:**
   - Check if product has custom shipping (free, fixed, per_item)
   - If custom, use product's shipping cost
   - If default, proceed to method calculation

2. **Method Level:**
   - Get base cost from shipping rate
   - Add per-kg cost if weight-based
   - Check if order qualifies for free shipping threshold
   - Apply shipping class rates if assigned

3. **Order Level:**
   - Sum all product shipping costs
   - Check for free shipping coupons
   - Apply final shipping method cost
   - Return total shipping cost

### Example Calculation

```
Product A: Treadmill
- Shipping Type: default
- Weight: 50kg
- Shipping Class: Heavy Equipment

Product B: Yoga Mat
- Shipping Type: fixed
- Shipping Cost: ৳50

Selected Method: Pathao Courier
- Base Cost: ৳80
- Per KG Cost: ৳10
- Free Shipping Threshold: ৳5000

Calculation:
Product A: ৳80 (base) + (50kg × ৳10) = ৳580
Product B: ৳50 (fixed)
Total Shipping: ৳630

If order total > ৳5000: Shipping = ৳0 (Free)
```

## Shipping Methods

### 1. Shah Sports Team
- In-house delivery team
- Configurable rates per zone
- Custom delivery times
- Direct control over delivery

### 2. Pathao Courier
- Third-party courier service
- Zone-based pricing
- Faster delivery times
- Tracking integration

### 3. Custom Shipping
- Product-specific rates
- Used when products have unique shipping
- Bypasses standard rate calculation

## Best Practices

### 1. Setting Up Shipping Rates

1. Create shipping classes first (Heavy, Fragile, Standard)
2. Create rates for each method and zone
3. Set appropriate free shipping thresholds
4. Test with sample orders

### 2. Assigning Shipping Classes

- Heavy Equipment: Treadmills, weight benches
- Fragile Items: Glass water bottles, electronics
- Standard: Clothing, accessories, small items
- Oversized: Large equipment requiring special handling

### 3. Free Shipping Strategy

- Set threshold based on average order value
- Consider different thresholds per method
- Use free shipping as marketing tool
- Monitor impact on conversion rates

### 4. Zone Configuration

- Dhaka: Lower rates, faster delivery
- Major Cities: Medium rates
- Remote Areas: Higher rates, longer delivery
- International: Special handling

## Troubleshooting

### Common Issues

**1. Shipping rates not showing in checkout**
- Check if rates are active
- Verify zone matches customer address
- Ensure products have shipping enabled
- Check weight ranges if configured

**2. Free shipping not applying**
- Verify order total exceeds threshold
- Check if coupon is interfering
- Ensure rate is active
- Verify calculation logic

**3. Cannot delete shipping class**
- Check if products are assigned to class
- Reassign products to different class first
- Then delete the class

**4. Shipping cost calculation incorrect**
- Verify product shipping types
- Check rate configuration
- Review weight-based calculations
- Test with different scenarios

## Future Enhancements

### Potential Features

1. **Real-time Shipping Quotes**
   - Integration with Pathao API
   - Live rate calculation
   - Delivery time estimates

2. **Shipping Zones**
   - Geographic zone management
   - Automatic zone detection
   - Zone-based rate selection

3. **Shipping Labels**
   - Print shipping labels
   - Barcode generation
   - Tracking number assignment

4. **Delivery Scheduling**
   - Customer selects delivery date
   - Time slot selection
   - Calendar integration

5. **Shipping Analytics**
   - Cost analysis
   - Method popularity
   - Delivery performance
   - Zone profitability

6. **Multi-package Shipping**
   - Split orders into packages
   - Calculate per-package costs
   - Track multiple packages

## Testing Scenarios

### Admin Testing

- [ ] Create shipping rate for each method
- [ ] Edit rate and verify changes
- [ ] Delete rate and confirm removal
- [ ] Filter rates by method
- [ ] Filter rates by status
- [ ] Toggle rate active/inactive
- [ ] Create shipping class
- [ ] Edit shipping class
- [ ] Try to delete class with products (should fail)
- [ ] Delete class without products
- [ ] Assign class to rate

### Customer Testing

- [ ] View product with free shipping
- [ ] View product with fixed shipping
- [ ] Add products to cart
- [ ] View shipping options in cart
- [ ] Select shipping address
- [ ] View available shipping methods
- [ ] Select shipping method
- [ ] Verify shipping cost in order preview
- [ ] Complete order
- [ ] Track order with shipping info

## Support & Documentation

- **API Documentation:** `FRONTEND_SHIPPING_IMPLEMENTATION_GUIDE.md`
- **Admin Guide:** `SHIPPING_ADMIN_COMPLETE.md`
- **Quick Reference:** `API_QUICK_REFERENCE.md`

## Summary

The shipping system is now complete with:
- ✅ Admin management for rates and classes
- ✅ API hooks for all operations
- ✅ Full CRUD operations
- ✅ Filtering and pagination
- ✅ Validation and error handling
- ✅ Clean UI with modals
- ✅ Comprehensive documentation

Ready for production use! 🚀
