# 🚀 START HERE - Quick Setup Guide

## ✅ Installation Complete!

Your Next.js application is now fully integrated with:
- ✅ Laravel Sanctum HTTP-only cookie authentication
- ✅ React Query (TanStack Query) for state management
- ✅ 34 custom hooks covering all 197 API endpoints
- ✅ TypeScript support throughout

## 📁 What Was Created

### Core Files
- `lib/api/axios.ts` - Axios instance with Sanctum configuration
- `lib/services/authService.ts` - Authentication methods
- `lib/context/AuthContext.tsx` - Auth state management
- `lib/providers/QueryProvider.tsx` - React Query provider
- `app/layout.tsx` - Updated with providers

### Authentication Pages
- `app/(auth)/login/page.tsx` - Login form
- `app/(auth)/register/page.tsx` - Registration form
- `app/_components/ProtectedRoute.tsx` - Route protection

### API Hooks (34 files)
- `lib/hooks/public/` - 9 public hooks (no auth)
- `lib/hooks/user/` - 9 customer hooks (requires auth)
- `lib/hooks/admin/` - 12 admin hooks (requires admin auth)

### Documentation
- `SANCTUM_SETUP_GUIDE.md` - Complete setup guide
- `REACT_QUERY_HOOKS_GUIDE.md` - Hooks documentation
- `HOOKS_USAGE_EXAMPLES.tsx` - Example components
- `API_INTEGRATION_COMPLETE.md` - Full summary

## 🎯 Quick Start (3 Steps)

### Step 1: Configure Environment

Your `.env.local` is already created with:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Step 2: Start Servers

**Terminal 1 - Laravel Backend:**
```bash
cd your-laravel-project
php artisan serve
```

**Terminal 2 - Next.js Frontend:**
```bash
npm run dev
```

### Step 3: Test Authentication

1. Visit `http://localhost:3000/register`
2. Create an account
3. You'll be logged in and redirected to `/admin`

## 💻 Usage Examples

### Example 1: Display Products

```tsx
'use client';

import { useProducts } from '@/lib/hooks/public';

export default function ProductsPage() {
  const { data, isLoading } = useProducts({ per_page: 20 });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.data.map((product) => (
        <div key={product.id} className="border p-4">
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Add to Wishlist

```tsx
'use client';

import { useAddToWishlist } from '@/lib/hooks/user';

export default function ProductCard({ product }) {
  const addToWishlist = useAddToWishlist({
    onSuccess: () => alert('Added to wishlist!'),
  });

  return (
    <button 
      onClick={() => addToWishlist.mutate({ product_id: product.id })}
      disabled={addToWishlist.isPending}
    >
      {addToWishlist.isPending ? 'Adding...' : 'Add to Wishlist'}
    </button>
  );
}
```

### Example 3: Admin Dashboard

```tsx
'use client';

import { useAdminDashboard } from '@/lib/hooks/admin';
import ProtectedRoute from '@/app/_components/ProtectedRoute';

export default function AdminDashboard() {
  const { data } = useAdminDashboard();

  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Today's Orders: {data?.data.today.orders}</p>
        <p>Today's Revenue: ${data?.data.today.revenue}</p>
      </div>
    </ProtectedRoute>
  );
}
```

## 📚 Available Hooks

### Public Hooks (No Auth Required)
```tsx
import {
  useProducts,          // Product listing & search
  useProduct,           // Single product
  useFeaturedProducts,  // Featured products
  useTrendingProducts,  // Trending products
  useCategories,        // All categories
  useCategory,          // Single category
  useBrands,            // All brands
  useBrand,             // Single brand
  useFlashDeals,        // Flash deals
  useGalleries,         // Galleries
  useCalculateCartSummary, // Cart calculations
  useValidateCoupon,    // Coupon validation
} from '@/lib/hooks/public';
```

### User Hooks (Requires Auth)
```tsx
import {
  useDashboard,         // User dashboard
  useProfile,           // User profile
  useWishlist,          // Wishlist items
  useAddToWishlist,     // Add to wishlist
  useOrders,            // Order history
  useOrder,             // Single order
  useAddresses,         // User addresses
  useCreateAddress,     // Create address
  useCheckout,          // Checkout process
  useNotifications,     // User notifications
} from '@/lib/hooks/user';
```

### Admin Hooks (Requires Admin Auth)
```tsx
import {
  useAdminDashboard,    // Admin dashboard
  useAdminProducts,     // Product management
  useCreateProduct,     // Create product
  useAdminOrders,       // Order management
  useUpdateOrderStatus, // Update order status
  useInventory,         // Inventory management
  useAdminReviews,      // Review moderation
  useAdminUsers,        // User management
  useSalesReport,       // Sales reports
} from '@/lib/hooks/admin';
```

## 🎨 Import Patterns

### Option 1: Named Imports (Recommended)
```tsx
import { useProducts, useCategories } from '@/lib/hooks/public';
import { useWishlist, useOrders } from '@/lib/hooks/user';
import { useAdminProducts } from '@/lib/hooks/admin';
```

### Option 2: Namespace Imports
```tsx
import { PublicHooks, UserHooks, AdminHooks } from '@/lib/hooks';

// Usage
const { data } = PublicHooks.useProducts();
const { data } = UserHooks.useWishlist();
const { data } = AdminHooks.useAdminProducts();
```

## 🔐 Authentication

### Check if User is Logged In
```tsx
'use client';

import { useAuth } from '@/lib/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      {user ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </header>
  );
}
```

### Protect Routes
```tsx
import ProtectedRoute from '@/app/_components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {/* Your protected content */}
    </ProtectedRoute>
  );
}
```

## 📖 Documentation Files

1. **SANCTUM_QUICK_REFERENCE.md** - Quick reference card
2. **SANCTUM_SETUP_GUIDE.md** - Complete Sanctum guide
3. **REACT_QUERY_HOOKS_GUIDE.md** - Comprehensive hooks guide
4. **HOOKS_USAGE_EXAMPLES.tsx** - 10 example components
5. **COMPLETE_API_DOCUMENTATION.md** - Full API reference
6. **API_INTEGRATION_COMPLETE.md** - Complete summary

## 🎯 Common Tasks

### Fetch Products with Filters
```tsx
const { data } = useProducts({
  category_id: 1,
  min_price: 50,
  max_price: 500,
  sort_by: 'price',
  sort_order: 'asc',
  per_page: 20,
});
```

### Handle Loading & Errors
```tsx
const { data, isLoading, error } = useProducts();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
```

### Mutations with Callbacks
```tsx
const createProduct = useCreateProduct({
  onSuccess: (data) => {
    console.log('Product created:', data);
  },
  onError: (error) => {
    console.error('Failed:', error);
  },
});

createProduct.mutate({ name: 'New Product', price: 99.99 });
```

### Pagination
```tsx
const [page, setPage] = useState(1);
const { data } = useProducts({ page, per_page: 20 });

// Navigate
<button onClick={() => setPage(page - 1)}>Previous</button>
<button onClick={() => setPage(page + 1)}>Next</button>
```

## 🐛 Troubleshooting

### Issue: CORS Errors
**Solution:** Check `FRONTEND_URL` in Laravel `.env` matches `http://localhost:3000`

### Issue: 401 Unauthorized
**Solution:** 
1. Verify user is logged in
2. Check cookies in browser DevTools → Network tab
3. Ensure session hasn't expired

### Issue: Hooks Not Working
**Solution:**
1. Make sure component has `'use client'` directive
2. Verify QueryProvider is in layout
3. Check import paths are correct

## 🎉 You're All Set!

Your application is ready to use. Start building your UI components with the hooks!

### Next Steps:
1. ✅ Read `REACT_QUERY_HOOKS_GUIDE.md` for detailed documentation
2. ✅ Check `HOOKS_USAGE_EXAMPLES.tsx` for example components
3. ✅ Start building your pages using the hooks
4. ✅ Refer to `COMPLETE_API_DOCUMENTATION.md` for API details

### Need Help?
- Check the documentation files
- Review the example components
- Test with the provided examples

Happy coding! 🚀
