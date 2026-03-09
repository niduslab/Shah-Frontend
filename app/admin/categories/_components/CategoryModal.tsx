'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, FolderTree, Tag, SortAsc, Eye, Search, Image as ImageIcon, Upload } from 'lucide-react';
import { getImageUrl, getPlaceholderImage } from '@/lib/utils/image';

interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number | null;
  is_active: boolean;
  sort_order: number;
  image?: string | null;
  meta_title?: string;
  meta_description?: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  categories: Category[];
  onSubmit: (data: any) => Promise<void>;
}

export default function CategoryModal({ 
  isOpen, 
  onClose, 
  category, 
  categories,
  onSubmit 
}: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: null as number | null,
    is_active: true,
    sort_order: 0,
    meta_title: '',
    meta_description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        parent_id: category.parent_id || null,
        is_active: category.is_active ?? true,
        sort_order: category.sort_order || 0,
        meta_title: category.meta_title || '',
        meta_description: category.meta_description || '',
      });
      
      // Handle image preview - category.image is a string path from backend
      if (category.image && category.image !== 'null' && category.image !== 'undefined') {
        console.log('Category image from backend:', category.image);
        const imageUrl = getImageUrl(category.image);
        console.log('Constructed image URL:', imageUrl);
        setImagePreview(imageUrl);
      } else {
        console.log('No category image found or image is null');
        setImagePreview('');
      }
      
      setImageFile(null);
    } else {
      setFormData({
        name: '',
        description: '',
        parent_id: null,
        is_active: true,
        sort_order: 0,
        meta_title: '',
        meta_description: '',
      });
      setImagePreview('');
      setImageFile(null);
    }
    setErrors({});
  }, [category, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)' });
        return;
      }
      
      // Validate file size (max 2MB to match backend)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size must be less than 2MB' });
        return;
      }

      // Store file and create preview
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setErrors({ ...errors, image: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (formData.name.length > 100) {
      newErrors.name = 'Category name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Create FormData for multipart/form-data submission
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('is_active', formData.is_active ? '1' : '0');
      submitData.append('sort_order', formData.sort_order.toString());
      
      if (formData.parent_id) {
        submitData.append('parent_id', formData.parent_id.toString());
      }
      
      if (formData.meta_title) {
        submitData.append('meta_title', formData.meta_title);
      }
      
      if (formData.meta_description) {
        submitData.append('meta_description', formData.meta_description);
      }
      
      // Add image file if selected
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      await onSubmit(submitData);
      onClose();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  // Filter out current category from parent options to prevent circular reference
  const parentOptions = categories.filter(c => c.id !== category?.id);

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop with animation */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        {/* Modal panel with animation */}
        <div 
          className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-300 ease-out sm:my-8 sm:w-full sm:max-w-2xl animate-in fade-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <FolderTree className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white" id="modal-title">
                    {category ? 'Edit Category' : 'Create New Category'}
                  </h3>
                  <p className="text-sm text-orange-100 mt-0.5">
                    {category ? 'Update category information' : 'Add a new category to your store'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-white/80 transition-all hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-gray-50">
            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                  <div className="mb-4 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <h4 className="text-sm font-semibold text-gray-900">Basic Information</h4>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Category Name */}
                    <div>
                      <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Category Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="category-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.name 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-gray-300 bg-white focus:border-[#FF6F00] focus:ring-[#FF6F00]/20'
                        }`}
                        placeholder="e.g., Treadmills, Yoga Mats, Dumbbells"
                        disabled={isSubmitting}
                      />
                      {errors.name && (
                        <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                          <span className="inline-block h-1 w-1 rounded-full bg-red-600"></span>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        id="category-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                        placeholder="Brief description of this category..."
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Category Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-gray-500" />
                          Category Image
                        </div>
                      </label>
                      
                      {imagePreview ? (
                        <div className="relative">
                          <div className="relative overflow-hidden rounded-lg border-2 border-gray-200">
                            <img 
                              src={imagePreview} 
                              alt="Category preview" 
                              className="h-48 w-full object-cover"
                              onError={(e) => {
                                // Use placeholder like products do
                                console.error('Failed to load image:', imagePreview);
                                e.currentTarget.src = getPlaceholderImage(formData.name || 'Category');
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            {!imageFile && category?.image && (
                              <div className="absolute bottom-2 left-2 rounded bg-blue-500/90 px-2 py-1 text-xs text-white">
                                Current Image
                              </div>
                            )}
                            {imageFile && (
                              <div className="absolute bottom-2 left-2 rounded bg-green-500/90 px-2 py-1 text-xs text-white">
                                New Image
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute right-2 top-2 rounded-lg bg-red-500 p-2 text-white shadow-lg transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            disabled={isSubmitting}
                            title="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition-all hover:border-[#FF6F00] hover:bg-orange-50">
                          <Upload className="mb-3 h-10 w-10 text-gray-400" />
                          <span className="mb-1 text-sm font-medium text-gray-700">
                            Click to upload image
                          </span>
                          <span className="text-xs text-gray-500">
                            PNG, JPG, GIF, WEBP up to 2MB
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isSubmitting}
                          />
                        </label>
                      )}
                      {errors.image && (
                        <p className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                          <span className="inline-block h-1 w-1 rounded-full bg-red-600"></span>
                          {errors.image}
                        </p>
                      )}
                      <p className="mt-1.5 text-xs text-gray-500">
                        Recommended: Square image (500x500px) for best display
                      </p>
                    </div>
                  </div>
                </div>

                {/* Organization Section */}
                <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                  <div className="mb-4 flex items-center gap-2">
                    <FolderTree className="h-4 w-4 text-gray-500" />
                    <h4 className="text-sm font-semibold text-gray-900">Organization</h4>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Parent Category */}
                    <div>
                      <label htmlFor="parent-category" className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Category
                      </label>
                      <select
                        id="parent-category"
                        value={formData.parent_id || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          parent_id: e.target.value ? Number(e.target.value) : null 
                        })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                        disabled={isSubmitting}
                      >
                        <option value="">None (Top Level Category)</option>
                        {parentOptions.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1.5 text-xs text-gray-500">
                        Select a parent to create a subcategory
                      </p>
                    </div>

                    {/* Sort Order */}
                    <div>
                      <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <SortAsc className="h-4 w-4 text-gray-500" />
                          Sort Order
                        </div>
                      </label>
                      <input
                        id="sort-order"
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                        placeholder="0"
                        disabled={isSubmitting}
                      />
                      <p className="mt-1.5 text-xs text-gray-500">
                        Lower numbers appear first in listings
                      </p>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-gray-500" />
                        <div>
                          <label htmlFor="is-active" className="text-sm font-medium text-gray-900">
                            Active Status
                          </label>
                          <p className="text-xs text-gray-500">
                            Make this category visible to customers
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        id="is-active"
                        onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2 ${
                          formData.is_active ? 'bg-[#FF6F00]' : 'bg-gray-300'
                        }`}
                        disabled={isSubmitting}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.is_active ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* SEO Section */}
                <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                  <div className="mb-4 flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-500" />
                    <h4 className="text-sm font-semibold text-gray-900">SEO Settings</h4>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Optional</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="meta-title" className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title
                      </label>
                      <input
                        id="meta-title"
                        type="text"
                        value={formData.meta_title}
                        onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                        placeholder="SEO title for search engines"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label htmlFor="meta-description" className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        id="meta-description"
                        value={formData.meta_description}
                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                        placeholder="SEO description for search engines"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-[#FF6F00] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#E65100] focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    {category ? 'Update Category' : 'Create Category'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
