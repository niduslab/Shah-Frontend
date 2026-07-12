"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/axios";
import { toast } from "sonner";

interface AbandonedCart {
  id: string;
  session_id: string;
  customer_email?: string;
  customer_name?: string;
  items_count: number;
  cart_value: number;
  abandoned_at: string;
  last_step: string;
  device_type: string;
}

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchAbandonedCarts();
  }, []);

  const fetchAbandonedCarts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/api/admin/analytics/abandoned-carts", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        const data = response.data.data;
        
        // Handle different response formats
        if (Array.isArray(data)) {
          setCarts(data);
        } else if (data && typeof data === 'object') {
          const cartsArray = data.carts || data.data || [];
          setCarts(Array.isArray(cartsArray) ? cartsArray : []);
        } else {
          setCarts([]);
        }
        
        setSummary(response.data.summary || null);
      } else {
        setCarts([]);
        setSummary(null);
        toast.error(response.data.message || "Failed to load abandoned carts");
      }
    } catch (error: any) {
      console.error("Error fetching abandoned carts:", error);
      setCarts([]);
      setSummary(null);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to load abandoned carts";
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mb-6">
        <Link
          href="/admin/analytics"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-red-100 p-3">
            <ShoppingCart className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Abandoned Carts</h1>
            <p className="text-sm text-gray-500">Recover lost sales opportunities</p>
          </div>
        </div>
      </div>

      {summary && (
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Abandoned</p>
            <p className="mt-2 text-3xl font-bold text-red-600">{summary.total_abandoned || 0}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Value</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              KES {(summary.total_value || 0).toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Avg Cart Value</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              KES {(summary.avg_cart_value || 0).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-white shadow-sm">
        {carts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Abandoned Carts</h3>
            <p className="mt-2 text-sm text-gray-500">Great! No carts have been abandoned recently.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Cart Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last Step
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Abandoned At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {carts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {cart.customer_name || "Guest"}
                      </div>
                      <div className="text-xs text-gray-500">{cart.customer_email || "No email"}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {cart.items_count} items
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                      KES {cart.cart_value.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 capitalize">
                        {cart.last_step}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-900">
                      {cart.device_type}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(cart.abandoned_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
