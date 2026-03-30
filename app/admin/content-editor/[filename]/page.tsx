"use client";

import { useState, useEffect } from "react";
import { Save, Eye, AlertCircle, ArrowLeft, Code } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function EditContentPage() {
  const params = useParams();
  const filename = params.filename as string;

  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [filename]);

  useEffect(() => {
    setHasChanges(content !== originalContent);
  }, [content, originalContent]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/admin/content/${filename}`);
      if (response.ok) {
        const data = await response.json();
        const formatted = JSON.stringify(data.data, null, 2);
        setContent(formatted);
        setOriginalContent(formatted);
      } else {
        setError("Failed to load content");
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      // Validate JSON
      const jsonData = JSON.parse(content);

      const response = await fetch(`/api/admin/content/${filename}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        setSuccess(true);
        setOriginalContent(content);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Failed to save content");
      }
    } catch (err) {
      setError("Invalid JSON format. Please check your syntax.");
    } finally {
      setSaving(false);
    }
  };

  const formatJSON = () => {
    try {
      const jsonData = JSON.parse(content);
      setContent(JSON.stringify(jsonData, null, 2));
      setError("");
    } catch (err) {
      setError("Invalid JSON format. Cannot format.");
    }
  };

  const resetChanges = () => {
    if (confirm("Are you sure you want to discard all changes?")) {
      setContent(originalContent);
      setError("");
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
        <div className="mb-6">
          <Link
            href="/admin/content-editor"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Content Editor
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
              <div className="mt-2 flex items-center gap-2">
                <Code className="h-4 w-4 text-gray-500" />
                <p className="text-gray-600">{filename}.json</p>
                {hasChanges && (
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                    Unsaved changes
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              {hasChanges && (
                <button
                  onClick={resetChanges}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Discard Changes
                </button>
              )}
              <button
                onClick={formatJSON}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Format JSON
              </button>
              <Link
                href={filename === "landing-page" ? "/" : `/brand/${filename}`}
                target="_blank"
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Link>
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>Content saved successfully!</span>
          </div>
        )}

        <div className="rounded-xl bg-white shadow-lg">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm font-medium text-gray-700">
                  JSON Editor
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Lines: {content.split('\n').length}
              </div>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-[calc(100vh-350px)] w-full resize-none border-0 p-6 font-mono text-sm focus:outline-none focus:ring-0"
            spellCheck={false}
            style={{
              tabSize: 2,
              lineHeight: "1.5",
            }}
          />
        </div>

        <div className="mt-4 rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-blue-900">Tips:</h3>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Use "Format JSON" to auto-format your code</li>
            <li>• Make sure all quotes are properly closed</li>
            <li>• Use \n in text fields for line breaks</li>
            <li>• Click "Preview" to see changes on the live site</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
