'use client';

import { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';

interface PageModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: any;
  onSubmit: (data: any) => Promise<void>;
}

export default function PageModal({ isOpen, onClose, page, onSubmit }: PageModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'landing' as 'landing' | 'brand' | 'flash_deal' | 'gallery' | 'custom',
    meta_title: '',
    meta_description: '',
    is_active: true,
    sort_order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        type: page.type || 'landing',
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        is_active: page.is_active ?? true,
        sort_order: page.sort_order || 0,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        type: 'landing',
        meta_title: '',
        meta_description: '',
        is_active: true,
        sort_order: 0,
      });
    }
  }, [page, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !page ? generateSlug(title) : prev.slug,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {page ? 'Edit Page' : 'Create Page'}
              </h2>
              <p className="text-sm text-gray-500">
                {page ? 'Update page information' : 'Add a new dynamic page'}
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
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Page Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="e.g., Home Page"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-mono transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="e.g., home"
                required
              />
              <p className="mt-1 text-xs text-gray-500">URL: /{formData.slug}</p>
            </div>

            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Page Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                required
              >
                <option value="landing">Landing Page</option>
                <option value="brand">Brand Page</option>
                <option value="flash_deal">Flash Deal Page</option>
                <option value="gallery">Gallery Page</option>
                <option value="custom">Custom Page</option>
              </select>
            </div>

            {/* Meta Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Meta Title (SEO)
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="e.g., Best Fitness Equipment Store"
                maxLength={60}
              />
              <p className="mt-1 text-xs text-gray-500">{formData.meta_title.length}/60 characters</p>
            </div>

            {/* Meta Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Meta Description (SEO)
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="e.g., Shop the best fitness equipment for your home gym"
                rows={3}
                maxLength={160}
              />
              <p className="mt-1 text-xs text-gray-500">{formData.meta_description.length}/160 characters</p>
            </div>

            {/* Sort Order */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sort Order
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#FF6F00] focus:ring-2 focus:ring-[#FF6F00]/20"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active (visible to users)
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : page ? 'Update Page' : 'Create Page'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
