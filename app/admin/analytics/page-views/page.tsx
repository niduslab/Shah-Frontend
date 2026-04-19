"use client";

import { useState, useEffect } from "react";
import { Eye, Loader2, ArrowLeft, TrendingUp, Users, Clock } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/axios";
import { toast } from "sonner";

interface PageView {
  page_type: string;
  page_url: string;
  view_count: number;
  avg_time_spent: string | number;
  unique_visitors: number;
}

export default function PageViewsPage() {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    fetchPageViews();
  }, [page]);

  const fetchPageViews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/api/admin/analytics/page-views", {
        params: { page, limit: 20 },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        const data = response.data.data;
        
        // Handle Laravel pagination format
        if (data && data.data && Array.isArray(data.data)) {
          setPageViews(data.data);
          setTotalPages(data.last_page || 1);
          setTotalViews(data.total || 0);
        } else if (Array.isArray(data)) {
          setPageViews(data);
          setTotalPages(1);
          setTotalViews(data.length);
        } else {
          setPageViews([]);
          setTotalPages(1);
          setTotalViews(0);
        }
      } else {
        setPageViews([]);
        toast.error(response.data.message || "Failed to load page views");
      }
    } catch (error: any) {
      console.error("Error fetching page views:", error);
      setPageViews([]);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to load page views";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPageTypeColor = (pageType: string) => {
    const colors: Record<string, string> = {
      home: "bg-blue-100 text-blue-800",
      product: "bg-purple-100 text-purple-800",
      category: "bg-green-100 text-green-800",
      cart: "bg-orange-100 text-orange-800",
      checkout: "bg-red-100 text-red-800",
      search: "bg-indigo-100 text-indigo-800",
    };
    return colors[pageType.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const formatTime = (seconds: string | number) => {
    const secs = parseFloat(String(seconds));
    if (!secs || secs === 0) return "0s";
    if (secs < 60) return `${Math.round(secs)}s`;
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.round(secs % 60);
    return `${mins}m ${remainingSecs}s`;
  };

  // Calculate summary stats
  const totalViewCount = pageViews.reduce((sum, pv) => sum + pv.view_count, 0);
  const totalUniqueVisitors = pageViews.reduce((sum, pv) => sum + pv.unique_visitors, 0);

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
          <div className="rounded-full bg-green-100 p-3">
            <Eye className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Page Views</h1>
            <p className="text-sm text-gray-500">Track page traffic and engagement by page type</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-gray-500">Total Page Views</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalViewCount}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <p className="text-sm font-medium text-gray-500">Unique Visitors</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-600">{totalUniqueVisitors}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <p className="text-sm font-medium text-gray-500">Page Types</p>
          </div>
          <p className="mt-2 text-3xl font-bold text-purple-600">{pageViews.length}</p>
        </div>
      </div>

      {/* Page Views Table */}
      <div className="rounded-lg bg-white shadow-sm">
        {pageViews.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Eye className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Page Views</h3>
            <p className="mt-2 text-sm text-gray-500">
              No page view data available yet. Data will appear here once pages are visited.
            </p>
            <button
              onClick={fetchPageViews}
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
                      Page Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Page URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Total Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Unique Visitors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Avg Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {pageViews.map((pageView, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPageTypeColor(
                            pageView.page_type
                          )}`}
                        >
                          {pageView.page_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md truncate text-sm text-gray-900">
                          {pageView.page_url}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            {pageView.view_count}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            {pageView.unique_visitors}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span className="text-sm text-gray-900">
                            {formatTime(pageView.avg_time_spent)}
                          </span>
                        </div>
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
