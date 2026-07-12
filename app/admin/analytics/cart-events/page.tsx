"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Loader2, ArrowLeft, Plus, Minus, Edit } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/axios";
import { toast } from "sonner";

interface CartEvent {
  id: number;
  visitor_session_id: number;
  user_id: number | null;
  product_id: number;
  product_variation_id: number | null;
  event_type: string;
  quantity: number;
  price: string;
  event_at: string;
  created_at: string;
  product: {
    id: number;
    name: string;
    slug: string;
    sku: string;
    price: string;
  };
  product_variation: any | null;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
    user_type: string;
  } | null;
}

export default function CartEventsPage() {
  const [events, setEvents] = useState<CartEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    fetchCartEvents();
  }, [page]);

  const fetchCartEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/api/admin/analytics/cart-events", {
        params: { page, limit: 20 },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        const data = response.data.data;
        
        // Handle Laravel pagination format
        if (data && data.data && Array.isArray(data.data)) {
          setEvents(data.data);
          setTotalPages(data.last_page || 1);
          setTotalEvents(data.total || 0);
        } else if (Array.isArray(data)) {
          setEvents(data);
          setTotalPages(1);
          setTotalEvents(data.length);
        } else {
          setEvents([]);
          setTotalPages(1);
          setTotalEvents(0);
        }
      } else {
        setEvents([]);
        toast.error(response.data.message || "Failed to load cart events");
      }
    } catch (error: any) {
      console.error("Error fetching cart events:", error);
      setEvents([]);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to load cart events";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case "added":
        return <Plus className="h-4 w-4 text-green-600" />;
      case "removed":
        return <Minus className="h-4 w-4 text-red-600" />;
      case "updated":
        return <Edit className="h-4 w-4 text-blue-600" />;
      default:
        return <ShoppingCart className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventBadgeColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case "added":
        return "bg-green-100 text-green-800";
      case "removed":
        return "bg-red-100 text-red-800";
      case "updated":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate summary stats
  const addedCount = events.filter(e => e.event_type === "added").length;
  const removedCount = events.filter(e => e.event_type === "removed").length;
  const updatedCount = events.filter(e => e.event_type === "updated").length;

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
          <div className="rounded-full bg-orange-100 p-3">
            <ShoppingCart className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cart Events</h1>
            <p className="text-sm text-gray-500">Track items added, removed, and updated in cart</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Events</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalEvents}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-gray-500">Items Added</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-green-600">{addedCount}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Minus className="h-5 w-5 text-red-600" />
            <p className="text-sm font-medium text-gray-500">Items Removed</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-red-600">{removedCount}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            <p className="text-sm font-medium text-gray-500">Items Updated</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-600">{updatedCount}</p>
        </div>
      </div>

      {/* Cart Events Table */}
      <div className="rounded-lg bg-white shadow-sm">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Cart Events</h3>
            <p className="mt-2 text-sm text-gray-500">
              No cart activity recorded yet. Data will appear here once customers start adding items to cart.
            </p>
            <button
              onClick={fetchCartEvents}
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
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getEventIcon(event.event_type)}
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getEventBadgeColor(
                              event.event_type
                            )}`}
                          >
                            {event.event_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{event.product.name}</div>
                        <div className="text-xs text-gray-500">SKU: {event.product.sku}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {event.user ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{event.user.full_name}</div>
                            <div className="text-xs text-gray-500">{event.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Guest</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {event.quantity}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        KES {parseFloat(event.price).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(event.event_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
                >
                  Previous
                </button>
                <span className="text-center text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
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
