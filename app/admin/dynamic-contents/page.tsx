"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";

interface DynamicPage {
  id: number;
  page_type: "landing" | "brand";
  page_key: string;
  title: string;
  slug?: string;
  is_active: boolean;
  sections_count: number;
  created_at: string;
  updated_at: string;
}

export default function DynamicContentsPage() {
  const [pages, setPages] = useState<DynamicPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "landing" | "brand">("all");

  useEffect(() => {
    fetchPages();
  }, [filter]);

  const fetchPages = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "all") {
        params.append("page_type", filter);
      }

      const response = await fetch(`/api/admin/dynamic-pages?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPages(data.data?.pages || []);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePageStatus = async (pageKey: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/dynamic-pages/${pageKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error("Error toggling page status:", error);
    }
  };

  const deletePage = async (pageKey: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const response = await fetch(`/api/admin/dynamic-pages/${pageKey}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dynamic Content Management</h1>
            <p className="mt-2 text-gray-600">
              Manage landing pages and brand pages content
            </p>
          </div>
          <Link
            href="/admin/dynamic-contents/create"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-3 text-sm font-medium text-white hover:from-orange-500 hover:to-orange-600"
          >
            <Plus className="h-4 w-4" />
            Create New Page
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 rounded-lg bg-white p-2 shadow">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-orange-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Pages
          </button>
          <button
            onClick={() => setFilter("landing")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              filter === "landing"
                ? "bg-orange-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Landing Pages
          </button>
          <button
            onClick={() => setFilter("brand")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              filter === "brand"
                ? "bg-orange-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Brand Pages
          </button>
        </div>

        {/* Pages Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <div
              key={page.id}
              className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
            >
              {/* Page Type Badge */}
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    page.page_type === "landing"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {page.page_type === "landing" ? "Landing Page" : "Brand Page"}
                </span>
                <button
                  onClick={() => togglePageStatus(page.page_key, page.is_active)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {page.is_active ? (
                    <ToggleRight className="h-6 w-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Page Info */}
              <h3 className="mb-2 text-xl font-bold text-gray-900">{page.title}</h3>
              <p className="mb-1 text-sm text-gray-600">
                Key: <span className="font-mono text-gray-900">{page.page_key}</span>
              </p>
              {page.slug && (
                <p className="mb-1 text-sm text-gray-600">
                  Slug: <span className="font-mono text-gray-900">{page.slug}</span>
                </p>
              )}
              <p className="mb-4 text-sm text-gray-600">
                Sections: <span className="font-semibold">{page.sections_count}</span>
              </p>

              {/* Status */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    page.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {page.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/admin/dynamic-contents/${page.page_key}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Link>
                <Link
                  href={
                    page.page_type === "landing"
                      ? "/"
                      : `/brand/${page.slug || page.page_key}`
                  }
                  target="_blank"
                  className="flex items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => deletePage(page.page_key)}
                  className="flex items-center justify-center rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {pages.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No pages found</h3>
            <p className="mb-6 text-gray-600">
              Get started by creating your first dynamic content page
            </p>
            <Link
              href="/admin/dynamic-contents/create"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              Create New Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
