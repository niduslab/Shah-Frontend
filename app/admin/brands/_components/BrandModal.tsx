'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Tag, FileText, Image as ImageIcon, ToggleLeft, ToggleRight, Upload, ArrowUpDown } from 'lucide-react';
import { getImageUrl } from '@/lib/utils/image';

interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  is_active: boolean;
  sort_order: number;
}

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
  onSubmit: (data: any) => Promise<void>;
}

export default function BrandModal({ isOpen, onClose, brand, onSubmit }: BrandModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null as File | null,
    logoPreview: '',
    is_active: true,
    sort_order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        description: brand.description || '',
        logo: null,
        logoPreview: brand.logo ? getImageUrl(brand.logo) : '',
        is_active: brand.is_active,
        sort_order: brand.sort_order,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        logo: null,
        logoPreview: '',
        is_active: true,
        sort_order: 0,
      });
    }
  }, [brand, isOpen]);

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, or WebP)');
        return;
      }
      
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        logo: file,
        logoPreview: previewUrl,
      }));
    }
  };

  const handleRemoveLogo = () => {
    if (formData.logoPreview && formData.logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(formData.logoPreview);
    }
    setFormData(prev => ({
      ...prev,
      logo: null,
      logoPreview: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submitData: any = {
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      };

      // Only include logo if a new file was selected
      if (formData.logo) {
        submitData.logo = formData.logo;
      }

      await onSubmit(submitData);
      
      // Clean up preview URL
      if (formData.logoPreview && formData.logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(formData.logoPreview);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {brand ? 'Edit Brand' : 'Create New Brand'}
              </h2>
              <p className="text-sm text-gray-500">
                {brand ? 'Update brand information' : 'Add a new brand to your store'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Brand Name */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag className="h-4 w-4 text-[#FF6F00]" />
              Brand Name
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              placeholder="e.g., Apple, Samsung, Nike"
              required
            />
            <p className="mt-1.5 text-xs text-gray-500">
              The slug will be auto-generated from the brand name
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4 text-[#FF6F00]" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              placeholder="Brief description about the brand..."
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <ImageIcon className="h-4 w-4 text-[#FF6F00]" />
              Brand Logo
            </label>
            
            {/* Upload Area */}
            <div className="space-y-3">
              {!formData.logoPreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition-all hover:border-[#FF6F00] hover:bg-orange-50"
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click to upload logo
                  </p>
                  <p className="text-xs text-gray-500">
                    JPEG, PNG or WebP (Max 2MB)
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="mb-2 text-xs font-medium text-gray-600">Logo Preview:</p>
                  <div className="relative flex items-center justify-center bg-white rounded-lg p-6 border border-gray-200">
                    <img
                      src={formData.logoPreview}
                      alt="Logo preview"
                      className="max-h-32 max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-2 right-2 rounded-lg bg-red-100 p-2 text-red-600 transition-all hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                  >
                    Change Logo
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            <p className="mt-2 text-xs text-gray-500">
              Recommended: Square image with transparent background for best results
            </p>
          </div>

          {/* Sort Order */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <ArrowUpDown className="h-4 w-4 text-[#FF6F00]" />
              Sort Order
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              placeholder="0"
              min="0"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Lower numbers appear first. Use 0 for default ordering.
            </p>
          </div>

          {/* Active Status */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {formData.is_active ? (
                  <ToggleRight className="h-6 w-6 text-emerald-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">Brand Status</p>
                  <p className="text-xs text-gray-500">
                    {formData.is_active ? 'Brand is visible to customers' : 'Brand is hidden from customers'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.is_active ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.is_active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
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
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {brand ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                brand ? 'Update Brand' : 'Create Brand'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
