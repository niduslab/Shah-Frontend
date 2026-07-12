"use client";

import Link from "next/link";
import { DollarSign, ShoppingCart, Clock, AlertTriangle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAdminDashboard } from "@/lib/hooks/admin/useDashboard";
import { useSalesReport } from "@/lib/hooks/admin/useReports";
import { useAdminOrders } from "@/lib/hooks/admin/useAdminOrders";
import { formatCurrency } from "@/lib/utils/currency";

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminPage() {
  const { data: dashboardData, isLoading: isDashboardLoading } = useAdminDashboard();
  const { data: salesData, isLoading: isSalesLoading } = useSalesReport({
    date_from: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    date_to: new Date().toISOString().slice(0, 10),
    group_by: 'day',
  });
  const { data: recentOrdersData, isLoading: isOrdersLoading } = useAdminOrders({ per_page: 5 });

  const dashboard = (dashboardData as any)?.data;
  const chartData = ((salesData as any)?.data?.chart_data || []).map((row: any) => ({
    date: new Date(row.period).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    value: parseFloat(row.total_sales) || 0,
  }));
  const salesSummary = (salesData as any)?.data?.summary;
  const recentOrders = (recentOrdersData as any)?.data?.data || [];

  const isLoading = isDashboardLoading || isSalesLoading || isOrdersLoading;

  const stats = [
    {
      title: "This Month's Revenue",
      value: formatCurrency(dashboard?.this_month?.revenue || 0),
      icon: DollarSign,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      title: "This Month's Orders",
      value: dashboard?.this_month?.orders ?? 0,
      icon: ShoppingCart,
      bgColor: "bg-white",
      iconColor: "text-gray-700",
    },
    {
      title: "Pending Orders",
      value: dashboard?.pending?.orders ?? 0,
      icon: Clock,
      bgColor: "bg-white",
      iconColor: "text-gray-700",
    },
    {
      title: "Low Stock Products",
      value: dashboard?.low_stock_count ?? 0,
      icon: AlertTriangle,
      bgColor: "bg-white",
      iconColor: "text-gray-700",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.title} className={`rounded-2xl ${stat.bgColor} p-6 shadow-sm`}>
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <h3 className="mt-2 truncate text-3xl font-bold text-gray-900">{stat.value}</h3>
              </div>
              <div className={`rounded-xl ${index === 0 ? "bg-orange-500" : "bg-gray-100"} p-3`}>
                <stat.icon className={`h-6 w-6 ${index === 0 ? "text-white" : stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Analytics */}
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
            <p className="mt-1 text-sm text-gray-500">Last 7 Days</p>
          </div>
        </div>
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{formatCurrency(salesSummary?.total_revenue || 0)}</span>
          <span className="text-sm text-gray-500">Revenue</span>
        </div>
        <div className="h-[240px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8A3D" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#FF8A3D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#FF8A3D" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No paid orders in this period yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="w-full rounded-lg bg-orange-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-orange-600 sm:w-auto"
          >
            View All Orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-gray-400">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: any) => {
                  const firstItem = order.items?.[0];
                  const extraItems = (order.items?.length || 0) - 1;
                  const customerName = order.user
                    ? `${order.user.first_name} ${order.user.last_name}`
                    : order.customer_name || 'Guest';

                  return (
                    <tr key={order.id} className="border-b border-gray-50 text-sm">
                      <td className="py-4 font-semibold text-gray-900">{order.order_number}</td>
                      <td className="py-4 text-gray-600">{customerName}</td>
                      <td className="py-4 text-gray-600">
                        {firstItem?.product_name || '—'}
                        {extraItems > 0 && <span className="text-gray-400"> +{extraItems} more</span>}
                      </td>
                      <td className="py-4 text-gray-600">{formatDate(order.created_at)}</td>
                      <td className="py-4 font-semibold text-gray-900">{formatCurrency(order.total_amount)}</td>
                      <td className="py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status as OrderStatus] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
