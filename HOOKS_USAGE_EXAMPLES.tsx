// ============================================
// EXAMPLE COMPONENTS USING THE API HOOKS
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useProducts, useFeaturedProducts, useCategories } from '@/lib/hooks/public';
import { useWishlist, useAddToWishlist, useOrders } from '@/lib/hooks/user';
import { useAdminProducts, useAdminDashboard } from '@/lib/hooks/admin';

// ============================================
// PUBLIC EXAMPLES
// ============================================

// Example 1: Product Listing with Filters
export function ProductListingPage() {
  const { data, isLoading, error } = useProducts({
    category_id: 1,
    min_price: 50,
    max_price: 500,
    sort_by: 'price',
    sort_order: 'asc',
    per_page: 20,
  });

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.data.map((product: any) => (
        <div key={product.id} className="border p-4 rounded">
          <h3 className="font-bold">{product.name}</h3>
          <p className="text-gray-600">${product.price}</p>
          <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

// Example 2: Featured Products Section
export function FeaturedProductsSection() {
  const { data: featured } = useFeaturedProducts(8);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
      <div className="grid grid-cols-4 gap-6">
        {featured?.data.map((product: any) => (
          <div key={product.id} className="border rounded-lg p-4">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <h3 className="mt-2 font-semibold">{product.name}</h3>
            <p className="text-lg font-bold">${product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Example 3: Categories Navigation
export function CategoriesNav() {
  const { data: categories } = useCategories();

  return (
    <nav className="flex gap-4">
      {categories?.data.map((category: any) => (
        <a
          key={category.id}
          href={`/category/${category.slug}`}
          className="px-4 py-2 hover:bg-gray-100 rounded"
        >
          {category.name}
        </a>
      ))}
    </nav>
  );
}

// ============================================
// USER/CUSTOMER EXAMPLES
// ============================================

// Example 4: Wishlist Page
export function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();
  const addToWishlist = useAddToWishlist({
    onSuccess: () => {
      alert('Added to wishlist!');
    },
  });

  if (isLoading) return <div>Loading wishlist...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-3 gap-6">
        {wishlist?.data.map((item: any) => (
          <div key={item.id} className="border rounded-lg p-4">
            <img src={item.product.image} alt={item.product.name} className="w-full h-48 object-cover" />
            <h3 className="mt-2 font-semibold">{item.product.name}</h3>
            <p className="text-lg font-bold">${item.product.price}</p>
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 5: Orders History
export function OrdersHistoryPage() {
  const { data: orders, isLoading } = useOrders({ page: 1, per_page: 10 });

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      <div className="space-y-4">
        {orders?.data.data.map((order: any) => (
          <div key={order.id} className="border rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">Order #{order.order_number}</h3>
                <p className="text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${order.total}</p>
                <span className={`px-3 py-1 rounded text-sm ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <a href={`/orders/${order.order_number}`} className="text-blue-500 hover:underline">
                View Details
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// ADMIN EXAMPLES
// ============================================

// Example 6: Admin Dashboard
export function AdminDashboardPage() {
  const { data: dashboard, isLoading } = useAdminDashboard();

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-gray-600 text-sm">Today's Orders</h3>
          <p className="text-3xl font-bold mt-2">{dashboard?.data.today.orders}</p>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-gray-600 text-sm">Today's Revenue</h3>
          <p className="text-3xl font-bold mt-2">${dashboard?.data.today.revenue}</p>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-gray-600 text-sm">Pending Orders</h3>
          <p className="text-3xl font-bold mt-2">{dashboard?.data.pending.orders}</p>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-gray-600 text-sm">Low Stock Items</h3>
          <p className="text-3xl font-bold mt-2">{dashboard?.data.low_stock_count}</p>
        </div>
      </div>
    </div>
  );
}

// Example 7: Admin Products Management
export function AdminProductsPage() {
  const { data: products, isLoading } = useAdminProducts({
    page: 1,
    per_page: 20,
    status: 'active',
  });

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <button className="bg-blue-500 text-white px-6 py-2 rounded">
          Add New Product
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products?.data.data.map((product: any) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded" />
                    <span className="ml-3 font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                <td className="px-6 py-4 text-sm font-medium">${product.price}</td>
                <td className="px-6 py-4 text-sm">{product.quantity}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-500 hover:underline mr-3">Edit</button>
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// MUTATION EXAMPLES
// ============================================

// Example 8: Add to Wishlist with Loading State
export function ProductCard({ product }: { product: any }) {
  const addToWishlist = useAddToWishlist({
    onSuccess: () => {
      alert('Added to wishlist!');
    },
    onError: (error) => {
      alert('Failed to add to wishlist');
    },
  });

  return (
    <div className="border rounded-lg p-4">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <p className="text-lg font-bold">${product.price}</p>
      <button
        onClick={() => addToWishlist.mutate({ product_id: product.id })}
        disabled={addToWishlist.isPending}
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {addToWishlist.isPending ? 'Adding...' : '❤️ Add to Wishlist'}
      </button>
    </div>
  );
}

// Example 9: Search Products with Debounce
export function ProductSearch() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data: products, isLoading } = useProducts(
    { search: debouncedSearch },
    { enabled: debouncedSearch.length >= 3 } as any
  );

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full px-4 py-2 border rounded"
      />
      
      {isLoading && <div className="mt-2">Searching...</div>}
      
      {products && (
        <div className="mt-4 space-y-2">
          {products.data.map((product: any) => (
            <div key={product.id} className="border p-3 rounded">
              {product.name} - ${product.price}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Example 10: Pagination Component
export function PaginatedProducts() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts({ page, per_page: 12 });

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {data?.data.map((product: any) => (
          <div key={product.id} className="border p-4 rounded">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || isLoading}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        <span className="text-gray-600">
          Page {page} of {data?.data.last_page || 1}
        </span>
        
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page === data?.data.last_page || isLoading}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
