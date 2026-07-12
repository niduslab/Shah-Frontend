"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Eye, 
  ShoppingCart, 
  Search,
  Package,
  Activity,
  Loader2,
  Download,
  RefreshCw,
  ArrowRight,
  FileText,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/axios";
import { toast } from "sonner";

interface DashboardStats {
  visitors: {
    total: number;
    unique: number;
    authenticated: number;
    guest: number;
    mobile_percentage: number;
    desktop_percentage: number;
    tablet_percentage: number;
  };
  page_views: {
    total: number;
    unique: number;
    avg_time_on_page: number;
  };
  products: {
    total_views: number;
    unique_products_viewed: number;
    view_to_cart_rate: number;
    view_to_purchase_rate: number;
  };
  cart: {
    total_events: number;
    items_added: number;
    items_removed: number;
  };
  checkout: {
    total: number;
    completed: number;
    abandoned: number;
    conversion_rate: number;
    abandonment_rate: number;
    avg_cart_value: number;
  };
  search: {
    total_queries: number;
    unique_queries: number;
    avg_results: number;
    no_results_count: number;
  };
}

// Helper function to safely format numbers
const formatNumber = (value: number | undefined | null): string => {
  return (value || 0).toLocaleString();
};

// Helper function to safely format decimals
const formatDecimal = (value: number | undefined | null, decimals: number = 1): string => {
  return (value || 0).toFixed(decimals);
};

// Helper to parse numeric values that might be strings
const parseNumeric = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
};

// Helper to calculate device percentages
const calculateDevicePercentages = (byDevice: any, total: number) => {
  const mobile = parseNumeric(byDevice?.mobile || 0);
  const desktop = parseNumeric(byDevice?.desktop || 0);
  const tablet = parseNumeric(byDevice?.tablet || 0);
  
  if (total === 0) return { mobile: 0, desktop: 0, tablet: 0 };
  
  return {
    mobile: (mobile / total) * 100,
    desktop: (desktop / total) * 100,
    tablet: (tablet / total) * 100,
  };
};

// Mock data for development/demo
const getMockData = (): DashboardStats => ({
  visitors: {
    total: 5234,
    unique: 3891,
    authenticated: 2456,
    guest: 1435,
    mobile_percentage: 62.5,
    desktop_percentage: 32.8,
    tablet_percentage: 4.7,
  },
  page_views: {
    total: 18456,
    unique: 9234,
    avg_time_on_page: 125,
  },
  products: {
    total_views: 12345,
    unique_products_viewed: 567,
    view_to_cart_rate: 12.8,
    view_to_purchase_rate: 3.4,
  },
  cart: {
    total_events: 2456,
    items_added: 1823,
    items_removed: 412,
  },
  checkout: {
    total: 1234,
    completed: 489,
    abandoned: 745,
    conversion_rate: 39.6,
    abandonment_rate: 60.4,
    avg_cart_value: 15678,
  },
  search: {
    total_queries: 3456,
    unique_queries: 2134,
    avg_results: 18,
    no_results_count: 87,
  },
});

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7"); // days
  const [refreshing, setRefreshing] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/api/admin/analytics/dashboard", {
        params: { days: dateRange },
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
      });

      if (response.data.success) {
        // Parse the actual backend data format
        const data = response.data.data || {};
        
        // Calculate device percentages
        const totalVisitors = parseNumeric(data.visitors?.total_visitors || 0);
        const devicePercentages = calculateDevicePercentages(
          data.visitors?.by_device,
          totalVisitors
        );
        
        setStats({
          visitors: {
            total: parseNumeric(data.visitors?.total_visitors || 0),
            unique: parseNumeric(data.visitors?.unique_visitors || 0),
            authenticated: parseNumeric(data.visitors?.authenticated_visitors || 0),
            guest: parseNumeric(data.visitors?.guest_visitors || 0),
            mobile_percentage: devicePercentages.mobile,
            desktop_percentage: devicePercentages.desktop,
            tablet_percentage: devicePercentages.tablet,
          },
          page_views: {
            total: parseNumeric(data.page_views?.total_page_views || 0),
            unique: parseNumeric(data.page_views?.unique_page_views || 0),
            avg_time_on_page: parseNumeric(data.page_views?.avg_time_on_page || 0),
          },
          products: {
            total_views: parseNumeric(data.products?.total_product_views || 0),
            unique_products_viewed: parseNumeric(data.products?.unique_products_viewed || 0),
            view_to_cart_rate: parseNumeric(data.products?.view_to_cart_rate || 0),
            view_to_purchase_rate: parseNumeric(data.products?.view_to_purchase_rate || 0),
          },
          cart: {
            total_events: parseNumeric(data.cart_events?.total_events || 0),
            items_added: parseNumeric(data.cart_events?.items_added || 0),
            items_removed: parseNumeric(data.cart_events?.items_removed || 0),
          },
          checkout: {
            total: parseNumeric(data.checkout_funnel?.total_checkouts || 0),
            completed: parseNumeric(data.checkout_funnel?.completed_checkouts || 0),
            abandoned: parseNumeric(data.checkout_funnel?.abandoned_checkouts || 0),
            conversion_rate: parseNumeric(data.checkout_funnel?.conversion_rate || 0),
            abandonment_rate: parseNumeric(data.checkout_funnel?.abandonment_rate || 0),
            avg_cart_value: parseNumeric(data.checkout_funnel?.avg_cart_value || 0),
          },
          search: {
            total_queries: parseNumeric(data.search?.total_searches || 0),
            unique_queries: parseNumeric(data.search?.unique_queries || 0),
            avg_results: parseNumeric(data.search?.avg_results || 0),
            no_results_count: parseNumeric(data.search?.no_results_count || 0),
          },
        });
        setUsingMockData(false); // Using real data
      } else {
        toast.error("Failed to load analytics data");
        // Set empty stats to prevent undefined errors
        setStats({
          visitors: { total: 0, unique: 0, authenticated: 0, guest: 0, mobile_percentage: 0, desktop_percentage: 0, tablet_percentage: 0 },
          page_views: { total: 0, unique: 0, avg_time_on_page: 0 },
          products: { total_views: 0, unique_products_viewed: 0, view_to_cart_rate: 0, view_to_purchase_rate: 0 },
          cart: { total_events: 0, items_added: 0, items_removed: 0 },
          checkout: { total: 0, completed: 0, abandoned: 0, conversion_rate: 0, abandonment_rate: 0, avg_cart_value: 0 },
          search: { total_queries: 0, unique_queries: 0, avg_results: 0, no_results_count: 0 },
        });
        setUsingMockData(false);
      }
    } catch (error: any) {
      console.error("Analytics error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to load analytics";
      
      // Check if it's a 404 or network error (backend not ready)
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK' || !error.response) {
        console.log("Backend analytics API not available, using mock data for demo");
        toast.info("Using demo data - Backend analytics API not configured yet");
        setStats(getMockData());
        setUsingMockData(true);
      } else {
        toast.error(errorMessage);
        // Set empty stats to prevent undefined errors
        setStats({
          visitors: { total: 0, unique: 0, authenticated: 0, guest: 0, mobile_percentage: 0, desktop_percentage: 0, tablet_percentage: 0 },
          page_views: { total: 0, unique: 0, avg_time_on_page: 0 },
          products: { total_views: 0, unique_products_viewed: 0, view_to_cart_rate: 0, view_to_purchase_rate: 0 },
          cart: { total_events: 0, items_added: 0, items_removed: 0 },
          checkout: { total: 0, completed: 0, abandoned: 0, conversion_rate: 0, abandonment_rate: 0, avg_cart_value: 0 },
          search: { total_queries: 0, unique_queries: 0, avg_results: 0, no_results_count: 0 },
        });
        setUsingMockData(false);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/admin/analytics/export", {
        params: { days: dateRange },
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `analytics-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Analytics exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export analytics");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Activity className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">No Analytics Data</h2>
          <p className="mt-2 text-sm text-gray-500">
            Start tracking by visiting your store pages
          </p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Mock Data Banner */}
      {usingMockData && (
        <div className="mb-6 rounded-lg border-2 border-yellow-400 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900">Demo Mode - Using Sample Data</h3>
              <p className="mt-1 text-sm text-yellow-800">
                The backend analytics API is not configured yet. This dashboard is showing sample data for demonstration purposes.
              </p>
              <p className="mt-2 text-sm text-yellow-800">
                <strong>To see real data:</strong> Follow the setup instructions in <code className="bg-yellow-100 px-1 py-0.5 rounded">SETUP_COMPLETE.md</code> to configure the backend analytics system.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track customer behavior and optimize your store
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto"
          >
            <option value="1">Last 24 Hours</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchAnalytics}
            disabled={refreshing}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary/90 sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Visitors */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Total Visitors</p>
              <p className="mt-2 truncate text-3xl font-bold text-gray-900">{formatNumber(stats.visitors.total)}</p>
              <p className="mt-1 text-xs text-gray-500">
                {formatNumber(stats.visitors.unique)} unique
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Page Views */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Page Views</p>
              <p className="mt-2 truncate text-3xl font-bold text-gray-900">{formatNumber(stats.page_views.total)}</p>
              <p className="mt-1 text-xs text-gray-500">
                {formatDecimal(stats.page_views.avg_time_on_page, 0)}s avg time
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Product Views */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Product Views</p>
              <p className="mt-2 truncate text-3xl font-bold text-gray-900">{formatNumber(stats.products.total_views)}</p>
              <p className="mt-1 text-xs text-gray-500">
                {formatDecimal(stats.products.view_to_cart_rate)}% to cart
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Cart Events */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Cart Events</p>
              <p className="mt-2 truncate text-3xl font-bold text-gray-900">{formatNumber(stats.cart.total_events)}</p>
              <p className="mt-1 text-xs text-gray-500">
                {formatNumber(stats.cart.items_added)} items added
              </p>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <ShoppingCart className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Detailed Analytics</h2>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        <p className="mb-4 text-sm text-gray-500">
          Explore detailed analytics reports and insights
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Visitors List */}
          <Link
            href="/admin/analytics/visitors"
            className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-500 hover:bg-blue-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 group-hover:bg-blue-200">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Visitors</p>
                <p className="text-xs text-gray-500">Session details</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
          </Link>

          {/* Product Views */}
          <Link
            href="/admin/analytics/product-views"
            className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-purple-500 hover:bg-purple-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2 group-hover:bg-purple-200">
                <Package className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Products</p>
                <p className="text-xs text-gray-500">View analytics</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
          </Link>

          {/* Cart Events */}
          <Link
            href="/admin/analytics/cart-events"
            className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-orange-500 hover:bg-orange-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2 group-hover:bg-orange-200">
                <ShoppingCart className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Cart Events</p>
                <p className="text-xs text-gray-500">Add/Remove</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600" />
          </Link>

          {/* Search Analytics */}
          <Link
            href="/admin/analytics/search"
            className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-indigo-500 hover:bg-indigo-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-2 group-hover:bg-indigo-200">
                <Search className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Search</p>
                <p className="text-xs text-gray-500">Query analytics</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
          </Link>

          {/* Page Views */}
          <Link
            href="/admin/analytics/page-views"
            className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-green-500 hover:bg-green-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 group-hover:bg-green-200">
                <Eye className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Page Views</p>
                <p className="text-xs text-gray-500">Traffic stats</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
          </Link>

          {/* Checkout Funnel */}
          <Link
            href="/admin/analytics/checkout-funnel"
            className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-emerald-500 hover:bg-emerald-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-2 group-hover:bg-emerald-200">
                <Activity className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Funnel</p>
                <p className="text-xs text-gray-500">Checkout flow</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600" />
          </Link>

          {/* Abandoned Carts */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 opacity-60 cursor-not-allowed">
  <div className="flex items-center gap-3">
    <div className="rounded-full bg-red-100 p-2">
      <ShoppingCart className="h-4 w-4 text-red-600" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-900">Abandoned</p>
      <p className="text-xs text-gray-500">Lost carts</p>
    </div>
  </div>
  <ArrowRight className="h-4 w-4 text-gray-400" />
</div>

          {/* Reports - Placeholder for future */}
          <div className="flex items-center justify-between rounded-lg border border-dashed border-gray-300 p-4 opacity-50">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-2">
                <FileText className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Reports</p>
                <p className="text-xs text-gray-400">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Device Breakdown</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-500">Mobile</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatDecimal(stats.visitors.mobile_percentage)}%
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-500">Desktop</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatDecimal(stats.visitors.desktop_percentage)}%
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-500">Tablet</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatDecimal(stats.visitors.tablet_percentage)}%
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Funnel */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Checkout Funnel</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Checkouts</span>
            <span className="font-semibold text-gray-900">{formatNumber(stats.checkout.total)}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm font-semibold text-green-600">Completed</span>
            <span className="font-bold text-green-600">{formatNumber(stats.checkout.completed)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-red-600">Abandoned</span>
            <span className="font-bold text-red-600">{formatNumber(stats.checkout.abandoned)}</span>
          </div>
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-lg font-bold text-green-600">
                {formatDecimal(stats.checkout.conversion_rate)}%
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">Abandonment Rate</span>
              <span className="text-lg font-bold text-red-600">
                {formatDecimal(stats.checkout.abandonment_rate)}%
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Cart Value</span>
              <span className="text-lg font-bold text-gray-900">
                KES {formatNumber(stats.checkout.avg_cart_value)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Analytics */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Search Analytics</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-2">
                <Search className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Searches</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.search.total_queries)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-yellow-100 p-2">
                <Activity className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Results</p>
                <p className="text-2xl font-bold text-gray-900">{formatDecimal(stats.search.avg_results, 0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Product Conversion</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">View to Cart</span>
              <span className="font-semibold text-gray-900">{formatDecimal(stats.products.view_to_cart_rate)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">View to Purchase</span>
              <span className="font-semibold text-gray-900">{formatDecimal(stats.products.view_to_purchase_rate)}%</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Visitor Insights</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Authenticated Visitors</span>
              <span className="font-semibold text-gray-900">{formatNumber(stats.visitors.authenticated)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Guest Visitors</span>
              <span className="font-semibold text-gray-900">{formatNumber(stats.visitors.guest)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
