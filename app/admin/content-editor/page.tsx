"use client";

import { useState, useEffect } from "react";
import { FileJson, Edit2, Eye, Plus } from "lucide-react";
import Link from "next/link";

interface ContentFile {
  filename: string;
  pageKey: string;
  pageType: string;
  title: string;
  lastModified: number;
}

export default function ContentEditorPage() {
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "landing" | "brand">("all");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/admin/content");
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter((file) => {
    if (filter === "all") return true;
    return file.pageType === filter;
  });

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Editor</h1>
            <p className="mt-2 text-gray-600">
              Manage your page content using JSON files
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-3 text-sm font-medium text-white hover:from-orange-500 hover:to-orange-600">
            <Plus className="h-4 w-4" />
            Create New File
          </button>
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
            All Files
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file) => (
            <div
              key={file.filename}
              className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <FileJson className="h-8 w-8 text-orange-500" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{file.title}</h3>
                  <p className="text-sm text-gray-600">{file.filename}</p>
                </div>
              </div>

              <div className="mb-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    file.pageType === "landing"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {file.pageType}
                </span>
              </div>

              <p className="mb-4 text-xs text-gray-500">
                Last modified: {new Date(file.lastModified * 1000).toLocaleString()}
              </p>

              <div className="flex gap-2">
                <Link
                  href={`/admin/content-editor/${file.pageKey}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit JSON
                </Link>
                <Link
                  href={file.pageType === "landing" ? "/" : `/brand/${file.pageKey}`}
                  target="_blank"
                  className="flex items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-lg">
            <FileJson className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No files found</h3>
            <p className="mb-6 text-gray-600">
              Create your first content file to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
