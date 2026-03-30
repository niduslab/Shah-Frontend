"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface ContentEditorProps {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
  sectionType?: string;
}

export default function ContentEditor({ content, onChange, sectionType }: ContentEditorProps) {
  const [viewMode, setViewMode] = useState<"visual" | "json">("visual");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const updateField = (path: string, value: any) => {
    const newContent = { ...content };
    const keys = path.split(".");
    let current: any = newContent;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    onChange(newContent);
  };

  const getField = (path: string): any => {
    const keys = path.split(".");
    let current: any = content;

    for (const key of keys) {
      if (current === undefined || current === null) return undefined;
      current = current[key];
    }

    return current;
  };

  const addArrayItem = (path: string, defaultItem: any) => {
    const currentArray = getField(path) || [];
    updateField(path, [...currentArray, defaultItem]);
  };

  const removeArrayItem = (path: string, index: number) => {
    const currentArray = getField(path) || [];
    updateField(path, currentArray.filter((_: any, i: number) => i !== index));
  };

  const renderField = (label: string, path: string, type: "text" | "textarea" | "image" | "number" | "checkbox" = "text") => {
    const value = getField(path);

    if (type === "image") {
      return (
        <ImageUpload
          value={value}
          onChange={(url) => updateField(path, url)}
          label={label}
        />
      );
    }

    if (type === "checkbox") {
      return (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => updateField(path, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </label>
      );
    }

    return (
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
        {type === "textarea" ? (
          <textarea
            value={value || ""}
            onChange={(e) => updateField(path, e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        ) : (
          <input
            type={type}
            value={value || ""}
            onChange={(e) => updateField(path, type === "number" ? parseFloat(e.target.value) : e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        )}
      </div>
    );
  };

  const renderArray = (label: string, path: string, itemRenderer: (index: number) => React.ReactNode, defaultItem: any) => {
    const items = getField(path) || [];

    return (
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-medium text-gray-900">{label}</h4>
          <button
            type="button"
            onClick={() => addArrayItem(path, defaultItem)}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
          >
            <Plus className="h-3 w-3" />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item: any, index: number) => (
            <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeArrayItem(path, index)}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
              {itemRenderer(index)}
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-center text-sm text-gray-500">No items yet. Click "Add Item" to create one.</p>
          )}
        </div>
      </div>
    );
  };

  // Common section templates
  const renderHeroSection = () => (
    <div className="space-y-6">
      {renderField("Background Image", "backgroundImage", "image")}
      {renderField("Title", "title", "textarea")}
      {renderField("Highlighted Text", "highlightedText", "text")}
      {renderField("Description", "description", "textarea")}
      {renderField("Button Text", "buttonText", "text")}
      {renderField("Button URL", "buttonUrl", "text")}
      
      <div className="rounded-lg border border-gray-200 p-4">
        <h4 className="mb-4 font-medium text-gray-900">Discount Badge</h4>
        {renderField("Show Badge", "discountBadge.enabled", "checkbox")}
        {getField("discountBadge.enabled") && (
          <div className="mt-4 space-y-4">
            {renderField("Badge Text", "discountBadge.text", "text")}
            {renderField("Percentage", "discountBadge.percentage", "text")}
          </div>
        )}
      </div>
    </div>
  );

  const renderCategoriesSection = () => (
    <div className="space-y-6">
      {renderField("Section Title", "sectionTitle", "text")}
      {renderArray(
        "Categories",
        "items",
        (index) => (
          <div className="space-y-4">
            {renderField("Name", `items.${index}.name`, "text")}
            {renderField("Image", `items.${index}.image`, "image")}
            {renderField("Link URL", `items.${index}.href`, "text")}
          </div>
        ),
        { name: "", image: "", href: "" }
      )}
    </div>
  );

  const renderBehindTheWorkSection = () => (
    <div className="space-y-6">
      {renderField("Title", "title", "text")}
      {renderField("Description", "description", "textarea")}
      
      {renderArray(
        "Stats",
        "stats",
        (index) => (
          <div className="grid gap-4 md:grid-cols-2">
            {renderField("Value", `stats.${index}.value`, "text")}
            {renderField("Label", `stats.${index}.label`, "text")}
          </div>
        ),
        { value: "", label: "" }
      )}

      <div className="rounded-lg border border-gray-200 p-4">
        <h4 className="mb-4 font-medium text-gray-900">Images</h4>
        <div className="space-y-4">
          {renderField("Left Image", "images.left", "image")}
          {renderField("Center Image", "images.center", "image")}
          {renderField("Right Image", "images.right", "image")}
        </div>
      </div>
    </div>
  );

  const renderVisualEditor = () => {
    // Auto-detect section type from content structure
    if (content.backgroundImage && content.buttonText) {
      return renderHeroSection();
    } else if (content.items && Array.isArray(content.items)) {
      return renderCategoriesSection();
    } else if (content.stats && content.images) {
      return renderBehindTheWorkSection();
    } else {
      // Generic editor
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            No visual template available for this content structure. Use JSON mode or add fields manually.
          </p>
          <button
            type="button"
            onClick={() => setViewMode("json")}
            className="text-sm text-orange-500 hover:text-orange-600"
          >
            Switch to JSON Editor
          </button>
        </div>
      );
    }
  };

  const renderJsonEditor = () => (
    <div>
      <textarea
        value={JSON.stringify(content, null, 2)}
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            onChange(parsed);
            setJsonError(null);
          } catch (err) {
            setJsonError("Invalid JSON");
          }
        }}
        rows={20}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
      />
      {jsonError && (
        <p className="mt-2 text-sm text-red-600">{jsonError}</p>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Content</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode("visual")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              viewMode === "visual"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => setViewMode("json")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              viewMode === "json"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            JSON
          </button>
        </div>
      </div>

      {viewMode === "visual" ? renderVisualEditor() : renderJsonEditor()}
    </div>
  );
}
