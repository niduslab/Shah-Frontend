"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/axios";
import { toast } from "sonner";

interface SearchData {
  total_searches: number;
  unique_queries: number;
  avg_results: number;
  no_results_count: number;
  click_through_rate: number;
  top_searches: any[];
}

export default function SearchAnalyticsPage() {
  const [data, setData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSearchData();
  }, []);

  const fetchSearchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/api/admin/analytics/search", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        const responseData = response.data.data;
        
        if (responseData && typeof responseData === 'object') {
          setData(responseData);
        } else {
          setData(null);
        }
      } else {
        setData(null);
        toast.error(response.data.message || "Failed to load search analytics");
      }
    } catch (error: any) {
      console.error("Error fetching search analytics:", error);
      setData(null);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to load search analytics";
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
          <div className="rounded-full bg-indigo-100 p-3">
            <Search className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Search Analytics</h1>
            <p className="text-sm text-gray-500">Search queries and performance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Searches</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data?.total_searches || 0}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Unique Queries</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data?.unique_queries || 0}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Avg Results</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data?.avg_results || 0}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">No Results</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{data?.no_results_count || 0}</p>
        </div>
      </div>

      {data?.top_searches && data.top_searches.length > 0 && (
        <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Top Search Queries</h2>
          <div className="space-y-2">
            {data.top_searches.map((search: any, index: number) => (
              <div key={index} className="flex flex-col gap-1 rounded-lg border border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className="truncate text-sm font-medium text-gray-900">{search.query}</span>
                <span className="text-sm text-gray-500">{search.count} searches</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
