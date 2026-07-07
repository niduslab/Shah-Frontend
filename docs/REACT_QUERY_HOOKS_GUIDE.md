# React Query Hooks Guide

Complete guide for using the API hooks in your Next.js application.

## 📁 Project Structure

```
lib/
├── hooks/
│   ├── public/          # Public API hooks (no auth)
│   │   ├── useProducts.ts
│   │   ├── useCategories.ts
│   │   ├── useBrands.ts
│   │   ├── useFlashDeals.ts
│   │   ├── useGalleries.ts
│   │   ├── useCart.ts
│   │   ├── useReviews.ts
│   │   ├── useCMS.ts
│   │   ├── useOrderTracking.ts
│   │   └── index.ts
│   ├── user/            # Customer API hooks (requires auth)
│   │   ├── useDashboard.ts
│   │   ├── useAddresses.ts
│   │   ├── useWishlist.ts
│   │   ├── useCheckout.ts
│   │   ├── useOrders.ts
│   │   ├── usePayments.ts
│   │   ├── useUserReviews.ts
│   │   ├── useReturns.ts
│   │   ├── useNotifications.ts
│   │   └── index.ts
│   ├── admin/           # Admin API hooks (requires admin auth)
│   │   ├── useDashboard.ts
│   │   ├── useReports.ts
│   │   ├── useAdminProducts.ts
│   │   ├── useAdminCategories.ts
│   │   ├── useAdminBrands.ts
│   │   ├── useAdminOrders.ts
│   │   ├── usePOS.ts
│   │   ├── useInventory.ts
│   │   ├── useAdminFlashDeals.ts
│   │   ├── useCoupons.ts
│   │   ├── useAdminReviews.ts
│   │   ├── useAdminUsers.ts
│   │   └── index.ts
│   └── index.ts
├── providers/
│   └── QueryProvider.tsx
└── api/
    └── axios.ts
```

## 🚀 Quick Start

### 1. Import Hooks

```tsx
// Public hooks
import { useProducts, useProduct, useCategories } from '@/lib/hooks/public';

// User hooks
import { useWishlist, useOrders, useAddresses } from '@/lib/hooks/user';

// Admin hooks
import { useAdminProducts, useAdminOrders } from '@/lib/hooks/admin';
```

### 2. Use in Components

```tsx
'use client';

import { useProducts } from '@/lib/hooks/public';

export default function ProductList() {
  const { data, isLoading, error } = useProducts({
    category_id: 1,
    per_page: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      {data?.data.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## 📖 Usage Examples

### Public Hooks (No Authentication)

#### Products

```tsx
import { useProducts, useProduct, useFeaturedProducts, useTrendingProducts } from '@/lib/hooks/public';

// Get all products with filters
function ProductsPage() {
  const { data, isLoading } = useProducts({
    search: 'laptop',
    category_id: 1,
    min_price: 100,
    max_price: 1000,
    sort_by: 'price',
    sort_order: 'asc',
    per_page: 20,
  });
}

// Get single product
function ProductDetail({ slug }: { slug: string }) {
  const { data, isLoading } = useProduct(slug);
}

// Get featured products
function FeaturedSection() {
  const { data } = useFeaturedProducts(12);
}

// Get trending products
function TrendingSection() {
  const { data } = useTrendingProducts(12);
}
```

#### Categories

```tsx
import { useCategories, useCategory, useCategoryProducts } from '@/lib/hooks/public';

// Get all categories
function CategoriesMenu() {
  const { data } = useCategories();
}

// Get single category
function CategoryPage({ slug }: { slug: string }) {
  const { data } = useCategory(slug);
}

// Get products in category
function CategoryProducts({ slug }: { slug: string }) {
  const { data } = useCategoryProducts(slug, { page: 1, per_page: 20 });
}
```

#### Brands

```tsx
import { useBrands, useBrand, useBrandProducts } from '@/lib/hooks/public';

// Get all brands
function BrandsPage() {
  const { data } = useBrands();
}

// Get single brand
function BrandPage({ slug }: { slug: string }) {
  const { data } = useBrand(slug);
}

// Get brand products
function BrandProducts({ slug }: { slug: string }) {
  const { data } = useBrandProducts(slug, { per_page: 20 });
}
```

#### Flash Deals

```tsx
import { useFlashDeals, useUpcomingFlashDeals, useFlashDeal } from '@/lib/hooks/public';

// Get active flash deals
function FlashDealsPage() {
  const { data } = useFlashDeals('active');
}

// Get upcoming deals
function UpcomingDeals() {
  const { data } = useUpcomingFlashDeals();
}

// Get single flash deal
function FlashDealDetail({ id }: { id: number }) {
  const { data } = useFlashDeal(id);
}
```

#### Cart Operations

```tsx
import { useCalculateCartSummary, useValidateCoupon, useCheckAvailability } from '@/lib/hooks/public';

function CartPage() {
  const calculateSummary = useCalculateCartSummary({
    onSuccess: (data) => {
      console.log('Cart total:', data.data.total);
    },
  });

  const validateCoupon = useValidateCoupon({
    onSuccess: (data) => {
      console.log('Coupon valid:', data);
    },
    onError: (error) => {
      console.error('Invalid coupon');
    },
  });

  const checkAvailability = useCheckAvailability();

  const handleCalculate = () => {
    calculateSummary.mutate({
      items: [
        { product_id: 1, quantity: 2 },
        { product_id: 2, quantity: 1 },
      ],
    });
  };

  const handleValidateCoupon = (code: string) => {
    validateCoupon.mutate({
      code,
      subtotal: 199.99,
    });
  };

  return (
    <div>
      <button onClick={handleCalculate}>Calculate Total</button>
      <button onClick={() => handleValidateCoupon('SAVE20')}>Apply Coupon</button>
    </div>
  );
}
```

### User Hooks (Requires Authentication)

#### Dashboard

```tsx
import { useDashboard, useProfile } from '@/lib/hooks/user';

function UserDashboard() {
  const { data: stats } = useDashboard();
  const { data: profile } = useProfile();

  return (
    <div>
      <h1>Welcome, {profile?.data.name}</h1>
      <p>Total Orders: {stats?.data.statistics.total_orders}</p>
      <p>Total Spent: ${stats?.data.statistics.total_spent}</p>
    </div>
  );
}
```

#### Wishlist

```tsx
import { useWishlist, useAddToWishlist, useRemoveFromWishlist, useCheckWishlist } from '@/lib/hooks/user';

function WishlistPage() {
  const { data: wishlist } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleAdd = (productId: number) => {
    addToWishlist.mutate({ product_id: productId });
  };

  const handleRemove = (id: number) => {
    removeFromWishlist.mutate(id);
  };

  return (
    <div>
      {wishlist?.data.map((item) => (
        <div key={item.id}>
          <h3>{item.product.name}</h3>
          <button onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

// Check if product is in wishlist
function ProductCard({ productId }: { productId: number }) {
  const { data: isInWishlist } = useCheckWishlist(productId);

  return (
    <div>
      {isInWishlist?.data.in_wishlist ? '❤️' : '🤍'}
    </div>
  );
}
```

#### Orders

```tsx
import { useOrders, useOrder, useCancelOrder, useDownloadInvoice } from '@/lib/hooks/user';

function OrdersPage() {
  const { data: orders } = useOrders({ page: 1, per_page: 10 });
  const cancelOrder = useCancelOrder();

  const handleCancel = (orderNumber: string) => {
    cancelOrder.mutate({
      orderNumber,
      reason: 'Changed my mind',
    });
  };

  return (
    <div>
      {orders?.data.data.map((order) => (
        <div key={order.id}>
          <p>Order #{order.order_number}</p>
          <button onClick={() => handleCancel(order.order_number)}>Cancel</button>
        </div>
      ))}
    </div>
  );
}

// Single order detail
function OrderDetail({ orderNumber }: { orderNumber: string }) {
  const { data: order } = useOrder(orderNumber);
  const downloadInvoice = useDownloadInvoice(orderNumber);

  return (
    <div>
      <h2>Order #{order?.data.order_number}</h2>
      <button onClick={downloadInvoice}>Download Invoice</button>
    </div>
  );
}
```

#### Addresses

```tsx
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from '@/lib/hooks/user';

function AddressesPage() {
  const { data: addresses } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();

  const handleCreate = () => {
    createAddress.mutate({
      address_line_1: '123 Main St',
      contact_no: '+1234567890',
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      address_type: 'shipping_address',
      is_default: true,
    });
  };

  const handleSetDefault = (id: number) => {
    setDefault.mutate(id);
  };

  return (
    <div>
      <button onClick={handleCreate}>Add Address</button>
      {addresses?.data.map((address) => (
        <div key={address.id}>
          <p>{address.address_line_1}</p>
          <button onClick={() => handleSetDefault(address.id)}>Set Default</button>
          <button onClick={() => deleteAddress.mutate(address.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

#### Checkout

```tsx
import { useGetShippingMethods, usePreviewOrder, useProcessCheckout } from '@/lib/hooks/user';

function CheckoutPage() {
  const getShippingMethods = useGetShippingMethods();
  const previewOrder = usePreviewOrder();
  const processCheckout = useProcessCheckout();

  const handleCheckout = () => {
    processCheckout.mutate({
      items: [{ product_id: 1, quantity: 2 }],
      shipping_address_id: 1,
      billing_address_id: 1,
      shipping_method: 'standard',
      payment_method: 'ssl_commerz',
      coupon_code: 'SAVE20',
    }, {
      onSuccess: (data) => {
        console.log('Order created:', data);
        // Redirect to payment or success page
      },
    });
  };

  return (
    <div>
      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
}
```

### Admin Hooks (Requires Admin Authentication)

#### Dashboard & Reports

```tsx
import { useAdminDashboard, useSalesReport, useInventoryReport } from '@/lib/hooks/admin';

function AdminDashboard() {
  const { data: dashboard } = useAdminDashboard();
  const { data: salesReport } = useSalesReport({
    date_from: '2026-01-01',
    date_to: '2026-03-01',
    group_by: 'day',
  });

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Today's Orders: {dashboard?.data.today.orders}</p>
      <p>Today's Revenue: ${dashboard?.data.today.revenue}</p>
    </div>
  );
}
```

#### Products Management

```tsx
import { useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/lib/hooks/admin';

function ProductsManagement() {
  const { data: products } = useAdminProducts({ page: 1, per_page: 20 });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const handleCreate = () => {
    createProduct.mutate({
      category_id: 1,
      brand_id: 2,
      name: 'New Product',
      sku: 'PROD-001',
      description: 'Product description',
      price: 99.99,
      quantity: 100,
    });
  };

  const handleUpdate = (id: number) => {
    updateProduct.mutate({
      id,
      data: { price: 89.99, quantity: 150 },
    });
  };

  return (
    <div>
      <button onClick={handleCreate}>Add Product</button>
      {products?.data.data.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <button onClick={() => handleUpdate(product.id)}>Edit</button>
          <button onClick={() => deleteProduct.mutate(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

#### Orders Management

```tsx
import { useAdminOrders, useUpdateOrderStatus, useAssignTracking } from '@/lib/hooks/admin';

function OrdersManagement() {
  const { data: orders } = useAdminOrders({
    status: 'pending',
    page: 1,
    per_page: 20,
  });
  const updateStatus = useUpdateOrderStatus();
  const assignTracking = useAssignTracking();

  const handleUpdateStatus = (id: number, status: string) => {
    updateStatus.mutate({ id, status: status as any });
  };

  const handleAssignTracking = (id: number) => {
    assignTracking.mutate({
      id,
      tracking_number: 'TRACK123456',
      carrier: 'DHL',
    });
  };

  return (
    <div>
      {orders?.data.data.map((order) => (
        <div key={order.id}>
          <p>Order #{order.order_number}</p>
          <button onClick={() => handleUpdateStatus(order.id, 'processing')}>
            Mark Processing
          </button>
          <button onClick={() => handleAssignTracking(order.id)}>
            Add Tracking
          </button>
        </div>
      ))}
    </div>
  );
}
```

#### Inventory Management

```tsx
import { useInventory, useLowStockProducts, useAdjustStock } from '@/lib/hooks/admin';

function InventoryManagement() {
  const { data: inventory } = useInventory({ stock_status: 'low' });
  const { data: lowStock } = useLowStockProducts();
  const adjustStock = useAdjustStock();

  const handleAdjust = (productId: number) => {
    adjustStock.mutate({
      productId,
      data: {
        quantity: 50,
        reason: 'recount',
        notes: 'Monthly inventory count',
      },
    });
  };

  return (
    <div>
      <h2>Low Stock Products</h2>
      {lowStock?.data.map((product) => (
        <div key={product.id}>
          <p>{product.name} - Stock: {product.quantity}</p>
          <button onClick={() => handleAdjust(product.id)}>Adjust Stock</button>
        </div>
      ))}
    </div>
  );
}
```

## 🎯 Advanced Patterns

### Optimistic Updates

```tsx
import { useAddToWishlist } from '@/lib/hooks/user';
import { useQueryClient } from '@tanstack/react-query';

function ProductCard({ product }: { product: any }) {
  const queryClient = useQueryClient();
  const addToWishlist = useAddToWishlist({
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });

      // Snapshot previous value
      const previousWishlist = queryClient.getQueryData(['wishlist']);

      // Optimistically update
      queryClient.setQueryData(['wishlist'], (old: any) => ({
        ...old,
        data: [...(old?.data || []), { product_id: newItem.product_id, product }],
      }));

      return { previousWishlist };
    },
    onError: (err, newItem, context) => {
      // Rollback on error
      queryClient.setQueryData(['wishlist'], context?.previousWishlist);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  return (
    <button onClick={() => addToWishlist.mutate({ product_id: product.id })}>
      Add to Wishlist
    </button>
  );
}
```

### Pagination

```tsx
import { useAdminProducts } from '@/lib/hooks/admin';
import { useState } from 'react';

function ProductsList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminProducts({ page, per_page: 20 });

  return (
    <div>
      {data?.data.data.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
      
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>Page {page} of {data?.data.last_page}</span>
      <button onClick={() => setPage(page + 1)} disabled={page === data?.data.last_page}>
        Next
      </button>
    </div>
  );
}
```

### Dependent Queries

```tsx
import { useOrder, usePaymentStatus } from '@/lib/hooks/user';

function OrderDetail({ orderNumber }: { orderNumber: string }) {
  const { data: order } = useOrder(orderNumber);
  
  // Only fetch payment status if order exists and payment is pending
  const { data: paymentStatus } = usePaymentStatus(orderNumber, {
    enabled: !!order && order.data.payment_status === 'pending',
    refetchInterval: 5000, // Poll every 5 seconds
  });

  return (
    <div>
      <h2>Order #{order?.data.order_number}</h2>
      {paymentStatus && <p>Payment Status: {paymentStatus.data.status}</p>}
    </div>
  );
}
```

### Error Handling

```tsx
import { useProducts } from '@/lib/hooks/public';

function ProductsList() {
  const { data, isLoading, error, refetch } = useProducts();

  if (isLoading) return <div>Loading...</div>;
  
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      {data?.data.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## 🔧 Configuration

### Query Client Options

The QueryProvider is configured with these defaults:

```tsx
{
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minute
      refetchOnWindowFocus: false,  // Don't refetch on window focus
      retry: 1,                     // Retry failed requests once
    },
  },
}
```

You can override these per-hook:

```tsx
const { data } = useProducts(
  { category_id: 1 },
  {
    staleTime: 5 * 60 * 1000,  // 5 minutes
    refetchInterval: 30000,     // Refetch every 30 seconds
    retry: 3,                   // Retry 3 times
  }
);
```

## 📝 Best Practices

1. **Use Optimistic Updates** for better UX on mutations
2. **Enable/Disable Queries** based on conditions to avoid unnecessary requests
3. **Invalidate Queries** after mutations to keep data fresh
4. **Handle Loading and Error States** properly
5. **Use Pagination** for large datasets
6. **Implement Retry Logic** for failed requests
7. **Cache Strategically** based on data volatility

## 🐛 Troubleshooting

### Query Not Refetching

```tsx
// Force refetch
const { refetch } = useProducts();
refetch();

// Or invalidate the query
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ['products'] });
```

### Mutation Not Updating UI

```tsx
// Make sure to invalidate related queries
const createProduct = useCreateProduct({
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
  },
});
```

### Authentication Errors

```tsx
// The axios instance automatically includes auth cookies
// If you get 401 errors, check:
// 1. User is logged in
// 2. Cookies are being sent (check Network tab)
// 3. Backend session is valid
```

## 📚 Additional Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [API Documentation](./COMPLETE_API_DOCUMENTATION.md)
- [Sanctum Setup Guide](./SANCTUM_SETUP_GUIDE.md)
