'use client';

import { useState, useEffect } from 'react';
import { X, Layers } from 'lucide-react';

interface Section {
  id: number;
  page_id: number;
  section_type: string;
  title?: string;
  content: any;
  settings?: any;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: Section | null;
  pageId: number;
  onSubmit: (data: any) => Promise<void>;
}

const SECTION_TYPES = [
  { value: 'hero_slider', label: 'Hero Slider' },
  { value: 'product_grid', label: 'Product Grid' },
  { value: 'brand_showcase', label: 'Brand Showcase' },
  { value: 'category_grid', label: 'Category Grid' },
  { value: 'banner', label: 'Banner' },
  { value: 'video_section', label: 'Video Section' },
  { value: 'text_content', label: 'Text Content' },
  { value: 'custom', label: 'Custom' },
];

export default function SectionModal({ isOpen, onClose, section, pageId, onSubmit }: SectionModalProps) {
  const [formData, setFormData] = useState({
    section_type: '',
    title: '',
    sort_order: 1,
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (section) {
      setFormData({
        section_type: section.section_type,
        title: section.title || '',
        sort_order: section.sort_order,
        is_active: section.is_active,
      });
    } else {
      setFormData({
        section_type: '',
        title: '',
        sort_order: 1,
        is_active: true,
      });
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {section ? 'Edit Section' : 'Add Section'}
              </h2>
              <p className="text-sm text-gray-500">
                {section ? 'Update section details' : 'Create a new section'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Section Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Section Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.section_type}
                onChange={(e) => setFormData({ ...formData, section_type: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                required
                disabled={!!section}
              >
                <option value="">Select section type</option>
                {SECTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {section && (
                <p className="mt-1 text-xs text-gray-500">
                  Section type cannot be changed after creation
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="Optional section title"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sort Order <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 1 })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                min="1"
                required
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-5 w-5 rounded border-gray-300 text-[#FF6F00] focus:ring-2 focus:ring-[#FF6F00]/20"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : section ? 'Update Section' : 'Create Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
