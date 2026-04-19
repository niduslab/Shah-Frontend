"use client";

import { useState, useEffect } from "react";
import { Package, Loader2, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/axios";
import { toast } from "sonner";

interface ProductView {
  product_id: number;
  total_sessions: number;
  total_views: string | number;
  total_time_spent: string | number;
  avg_time_spent: string | number;
  cart_additions: string | number;
  purchases: string | number;
  cart_conversion_rate: string | number;
  purchase_conversion_rate: string | number;
  product: {
    id: number;
    name: string;
    slug: string;
    sku: string;
    price: string;
  };
}

export default function ProductViewsPage() {
  const [products, setProducts] = useState<ProductView[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProductViews();
  }, [page]);

  const fetchProductViews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/api/admin/analytics/product-views", {
        params: { page, limit: 20 },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        const data = response.data.data;
        
        // Handle Laravel pagination format
        if (data && data.data && Array.isArray(data.data)) {
          setProducts(data.data);
          setTotalPages(data.last_page || 1);
        } else if (data && data.top_viewed_products && Array.isArray(data.top_viewed_products)) {
          // Fallback for nested structure
          setProducts(data.top_viewed_products);
          setTotalPages(1);
        } else if (Array.isArray(data)) {
          // Fallback for flat array
          setProducts(data);
          setTotalPages(1);
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } else {
        setProducts([]);
        toast.error(response.data.message || "Failed to load product views");
      }
    } catch (error: any) {
      console.error("Error fetching product views:", error);
      setProducts([]);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to load product views";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <Link
          href="/admin/analytics"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-purple-100 p-3">
            <Package className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Views</h1>
            <p className="text-sm text-gray-500">Most viewed products and analytics</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Package className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Product Views</h3>
            <p className="mt-2 text-sm text-gray-500">
              No product view data available yet. Products will appear here once customers start viewing them.
            </p>
            <button
              onClick={fetchProductViews}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary/90"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Total Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Cart Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Purchase Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.map((item) => (
                    <tr key={item.product_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                        <div className="text-xs text-gray-500">SKU: {item.product.sku}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        KES {parseFloat(item.product.price).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-semibold text-gray-900">{item.total_views}</span>
                        </div>
                        <div className="text-xs text-gray-500">{item.total_sessions} sessions</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          {parseFloat(String(item.cart_conversion_rate)).toFixed(1)}%
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{item.cart_additions} added</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {parseFloat(String(item.purchase_conversion_rate)).toFixed(1)}%
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{item.purchases} sold</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="text-sm text-primary hover:underline"
                        >
                          View Product
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
