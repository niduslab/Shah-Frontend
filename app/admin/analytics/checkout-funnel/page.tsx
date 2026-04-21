"use client";

import { useState, useEffect } from "react";
import { Activity, Loader2, ArrowLeft, CheckCircle, XCircle, ShoppingCart, User, Package } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/axios";
import { toast } from "sonner";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  product_id: number;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
}

interface Order {
  id: number;
  order_number: string;
  total_amount: string;
  status: string;
  payment_status: string;
}

interface VisitorSession {
  id: number;
  session_id: string;
  device_type: string;
  browser?: string;
  platform?: string;
  country?: string | null;
  city?: string | null;
}

interface CheckoutFunnelRecord {
  id: number;
  visitor_session_id: number;
  user_id: number | null;
  order_id: number | null;
  status: string;
  cart_items: CartItem[];
  cart_total: string;
  items_count: number;
  abandonment_reason: string | null;
  cart_viewed_at: string;
  checkout_initiated_at: string;
  shipping_entered_at: string | null;
  payment_entered_at: string | null;
  completed_at: string | null;
  abandoned_at: string | null;
  created_at: string;
  updated_at: string;
  user: User | null;
  order: Order | null;
  visitor_session: VisitorSession;
}

export default function CheckoutFunnelPage() {
  const [records, setRecords] = useState<CheckoutFunnelRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFunnelData();
  }, [page]);

  const fetchFunnelData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/api/admin/analytics/checkout-funnel", {
        params: { page },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        const data = response.data.data;
        
        // Handle Laravel pagination format
        if (data && data.data && Array.isArray(data.data)) {
          setRecords(data.data);
          setTotalPages(data.last_page || 1);
        } else if (Array.isArray(data)) {
          setRecords(data);
          setTotalPages(1);
        } else {
          setRecords([]);
          setTotalPages(1);
        }
      } else {
        setRecords([]);
        toast.error(response.data.message || "Failed to load checkout funnel");
      }
    } catch (error: any) {
      console.error("Error fetching checkout funnel:", error);
      setRecords([]);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to load checkout funnel";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      order_completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
      abandoned: { bg: "bg-red-100", text: "text-red-800", label: "Abandoned" },
      cart_viewed: { bg: "bg-blue-100", text: "text-blue-800", label: "Cart Viewed" },
      checkout_initiated: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Checkout Started" },
      shipping_entered: { bg: "bg-purple-100", text: "text-purple-800", label: "Shipping Entered" },
      payment_entered: { bg: "bg-indigo-100", text: "text-indigo-800", label: "Payment Entered" },
    };

    const config = statusConfig[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
    
    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: string | number | null | undefined) => {
    if (amount === null || amount === undefined) return "KES 0";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) return "KES 0";
    return `KES ${num.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getProgressPercentage = (record: CheckoutFunnelRecord) => {
    if (record.completed_at) return 100;
    if (record.payment_entered_at) return 80;
    if (record.shipping_entered_at) return 60;
    if (record.checkout_initiated_at) return 40;
    if (record.cart_viewed_at) return 20;
    return 0;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate summary stats from records
  const totalCheckouts = records.length;
  const completedCheckouts = records.filter(r => r.status === "order_completed").length;
  const abandonedCheckouts = records.filter(r => r.status === "abandoned").length;
  const conversionRate = totalCheckouts > 0 ? ((completedCheckouts / totalCheckouts) * 100).toFixed(1) : "0";
  const totalAbandonedValue = records
    .filter(r => r.status === "abandoned")
    .reduce((sum, r) => sum + parseFloat(r.cart_total), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/analytics"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-100 p-3">
            <Activity className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout Funnel</h1>
            <p className="text-sm text-gray-500">Detailed checkout flow and conversion tracking</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Checkouts</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalCheckouts}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-gray-500">Completed</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-green-600">{completedCheckouts}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm font-medium text-gray-500">Abandoned</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-red-600">{abandonedCheckouts}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{conversionRate}%</p>
        </div>
      </div>

      {/* Checkout Records Table */}
      <div className="rounded-lg bg-white shadow-sm">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Checkout Data</h3>
            <p className="mt-2 text-sm text-gray-500">
              No checkout funnel data found. Start by adding items to cart and initiating checkout.
            </p>
            <button
              onClick={fetchFunnelData}
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
                      Session
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Cart Details
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{record.id}
                        </div>
                        <div className="text-xs text-gray-500">
                          {record.visitor_session.device_type} • {record.visitor_session.browser}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {record.user ? (
                          <div>
                            <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                              <User className="h-3 w-3" />
                              {record.user.full_name}
                            </div>
                            <div className="text-xs text-gray-500">{record.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Guest</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(record.cart_total)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {record.items_count} item{record.items_count !== 1 ? "s" : ""}
                        </div>
                        {record.cart_items.length > 0 && (
                          <div className="mt-1 text-xs text-gray-400">
                            {record.cart_items[0].name}
                            {record.cart_items.length > 1 && ` +${record.cart_items.length - 1} more`}
                          </div>
                        )}
                      </td>
                      {/* <td className="whitespace-nowrap px-6 py-4">
                        {getStatusBadge(record.status)}
                        {record.abandonment_reason && (
                          <div className="mt-1 text-xs text-gray-500">
                            Reason: {record.abandonment_reason}
                          </div>
                        )}
                      </td> */}
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                            <span>Progress</span>
                            <span>{getProgressPercentage(record)}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className={`h-2 rounded-full ${
                                record.status === "order_completed" ? "bg-green-500" : 
                                record.status === "abandoned" ? "bg-red-500" : "bg-yellow-500"
                              }`}
                              style={{ width: `${getProgressPercentage(record)}%` }}
                            />
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {record.completed_at && "✓ Completed"}
                            {record.payment_entered_at && !record.completed_at && "Payment entered"}
                            {record.shipping_entered_at && !record.payment_entered_at && "Shipping entered"}
                            {record.checkout_initiated_at && !record.shipping_entered_at && "Checkout started"}
                            {!record.checkout_initiated_at && "Cart viewed"}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {getStatusBadge(record.status)}
                          {record.abandonment_reason && (
                            <div className="my-1 text-xs text-gray-500">
                              Reason: {record.abandonment_reason}
                            </div>
                          )}
                        {record.order ? (
                          <div className="mt-1">
                            <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                              <Package className="h-3 w-3" />
                              {record.order.order_number}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {record.order.status}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No order</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(record.cart_viewed_at)}
                        </div>
                        {record.abandoned_at && (
                          <div className="text-xs text-red-500">
                            Abandoned: {formatDate(record.abandoned_at)}
                          </div>
                        )}
                        {record.completed_at && (
                          <div className="text-xs text-green-500">
                            Completed: {formatDate(record.completed_at)}
                          </div>
                        )}
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

      {/* Additional Stats */}
      {abandonedCheckouts > 0 && (
        <div className="mt-6 rounded-lg bg-red-50 p-6">
          <h3 className="text-lg font-semibold text-red-900">Abandoned Cart Value</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {formatCurrency(totalAbandonedValue)}
          </p>
          <p className="mt-1 text-sm text-red-700">
            Total value of {abandonedCheckouts} abandoned cart{abandonedCheckouts !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
