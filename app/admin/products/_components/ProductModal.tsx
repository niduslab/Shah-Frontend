'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAdminCategories } from '@/lib/hooks/admin/useAdminCategories';
import { useAdminBrands } from '@/lib/hooks/admin/useAdminBrands';
import ImageManager from './ImageManager';
import VariationManager from './VariationManager';

interface ProductImage {
  id?: number;
  path?: string;
  file?: File;
  preview?: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

interface Variation {
  id?: number;
  sku: string;
  price: string;
  quantity: string;
  attributes: Record<string, string>;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
  isLoading?: boolean;
  onSubmit: (data: any) => Promise<void>;
}

export default function ProductModal({ isOpen, onClose, product, isLoading = false, onSubmit }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    short_description: '',
    category_id: '',
    brand_id: '',
    price: '',
    compare_price: '',
    cost_price: '',
    quantity: '',
    low_stock_threshold: '10',
    weight: '',
    weight_unit: 'kg',
    is_featured: false,
    is_trending: false,
    status: 'active',
    meta_title: '',
    meta_description: '',
  });
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categoriesData } = useAdminCategories({ per_page: 100 });
  const { data: brandsData } = useAdminBrands({ per_page: 100 });

  const categories = (categoriesData as any)?.data?.data || [];
  const brands = (brandsData as any)?.data?.data || [];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        short_description: product.short_description || '',
        category_id: product.category_id?.toString() || '',
        brand_id: product.brand_id?.toString() || '',
        price: product.price?.toString() || '',
        compare_price: product.compare_price?.toString() || '',
        cost_price: product.cost_price?.toString() || '',
        quantity: product.quantity?.toString() || '',
        low_stock_threshold: product.low_stock_threshold?.toString() || '10',
        weight: product.weight?.toString() || '',
        weight_unit: product.weight_unit || 'kg',
        is_featured: product.is_featured || false,
        is_trending: product.is_trending || false,
        status: product.status || 'active',
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
      });

      // Load existing images
      if (product.images && Array.isArray(product.images)) {
        const sortedImages = [...product.images].sort((a, b) => a.sort_order - b.sort_order);
        setImages(sortedImages.map((img: any) => ({
          id: img.id,
          path: img.image_path,
          alt_text: img.alt_text || '',
          is_primary: img.is_primary || false,
          sort_order: img.sort_order || 0,
        })));
      } else {
        setImages([]);
      }

      // Load existing variations
      if (product.variations && Array.isArray(product.variations)) {
        setVariations(product.variations.map((v: any) => ({
          id: v.id,
          sku: v.sku || '',
          price: v.price?.toString() || '',
          quantity: v.quantity?.toString() || '',
          attributes: v.attributes || {},
        })));
      } else {
        setVariations([]);
      }
    } else {
      setFormData({
        name: '',
        sku: '',
        description: '',
        short_description: '',
        category_id: '',
        brand_id: '',
        price: '',
        compare_price: '',
        cost_price: '',
        quantity: '',
        low_stock_threshold: '10',
        weight: '',
        weight_unit: 'kg',
        is_featured: false,
        is_trending: false,
        status: 'active',
        meta_title: '',
        meta_description: '',
      });
      setImages([]);
      setVariations([]);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData: any = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        short_description: formData.short_description,
        category_id: parseInt(formData.category_id),
        brand_id: parseInt(formData.brand_id),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        is_featured: formData.is_featured,
        is_trending: formData.is_trending,
        status: formData.status,
      };

      if (formData.compare_price) submitData.compare_price = parseFloat(formData.compare_price);
      if (formData.cost_price) submitData.cost_price = parseFloat(formData.cost_price);
      if (formData.low_stock_threshold) submitData.low_stock_threshold = parseInt(formData.low_stock_threshold);
      if (formData.weight) submitData.weight = parseFloat(formData.weight);
      if (formData.weight_unit) submitData.weight_unit = formData.weight_unit;
      if (formData.meta_title) submitData.meta_title = formData.meta_title;
      if (formData.meta_description) submitData.meta_description = formData.meta_description;

      // Add images data
      if (images.length > 0) {
        submitData.images = images.map((img, index) => {
          const imageData: any = {
            alt_text: img.alt_text || '',
            is_primary: img.is_primary,
            sort_order: index,
          };
          
          if (img.file) {
            imageData.file = img.file;
          } else if (img.path) {
            imageData.path = img.path;
          }
          
          return imageData;
        });
      }

      // Add variations data
      if (variations.length > 0) {
        submitData.variations = variations.map((v, index) => ({
          id: v.id, // Include ID for updates
          sku: v.sku,
          price: parseFloat(v.price),
          quantity: parseInt(v.quantity),
          attributes: v.attributes,
          sort_order: index,
        }));
      }

      // ============================================
      // DEBUG: Log product data before submission
      // ============================================
      console.group('🔍 Product Submission Debug');
      console.log('Operation:', product ? 'UPDATE' : 'CREATE');
      if (product) {
        console.log('Product ID:', product.id);
      }
      console.log('Form Data:', formData);
      console.log('Images Count:', images.length);
      console.log('Images Data:', images);
      console.log('Variations Count:', variations.length);
      console.log('Variations Data:', variations);
      console.log('Final Submit Data:', submitData);
      
      // Log variations in detail
      if (submitData.variations && submitData.variations.length > 0) {
        console.group('📦 Variations Details');
        submitData.variations.forEach((v: any, index: number) => {
          console.log(`Variation #${index + 1}:`, {
            id: v.id || 'NEW',
            sku: v.sku,
            price: v.price,
            quantity: v.quantity,
            attributes: v.attributes,
            sort_order: v.sort_order
          });
        });
        console.groupEnd();
      }
      
      // Log images in detail (excluding file objects for readability)
      if (submitData.images && submitData.images.length > 0) {
        console.group('🖼️ Images Details');
        submitData.images.forEach((img: any, index: number) => {
          console.log(`Image #${index + 1}:`, {
            hasFile: !!img.file,
            fileName: img.file?.name,
            path: img.path,
            alt_text: img.alt_text,
            is_primary: img.is_primary,
            sort_order: img.sort_order
          });
        });
        console.groupEnd();
      }
      
      console.groupEnd();
      // ============================================

      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center p-16">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
              </div>
              <p className="text-sm font-medium text-gray-600">Loading product details...</p>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="PROD-001"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="">Select category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.brand_id}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="">Select brand</option>
                {brands.map((brand: any) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Short Description
              </label>
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="Brief product description"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="Detailed product description"
              />
            </div>

            {/* Pricing */}
            <div className="md:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Pricing</h3>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="99.99"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Compare Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.compare_price}
                onChange={(e) => setFormData({ ...formData, compare_price: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="129.99"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Cost Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="50.00"
              />
            </div>

            {/* Inventory */}
            <div className="md:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Inventory</h3>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Low Stock Threshold
              </label>
              <input
                type="number"
                min="0"
                value={formData.low_stock_threshold}
                onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="10"
              />
            </div>

            {/* Shipping */}
            <div className="md:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Shipping</h3>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Weight
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="1.5"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Weight Unit
              </label>
              <select
                value={formData.weight_unit}
                onChange={(e) => setFormData({ ...formData, weight_unit: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="lb">Pounds (lb)</option>
                <option value="oz">Ounces (oz)</option>
              </select>
            </div>

            {/* Features */}
            <div className="md:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Features</h3>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#FF6F00] focus:ring-2 focus:ring-[#FF6F00]/20"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                Featured Product
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_trending"
                checked={formData.is_trending}
                onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#FF6F00] focus:ring-2 focus:ring-[#FF6F00]/20"
              />
              <label htmlFor="is_trending" className="text-sm font-medium text-gray-700">
                Trending Product
              </label>
            </div>

            {/* SEO */}
            <div className="md:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">SEO</h3>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="SEO title for search engines"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Meta Description
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="SEO description for search engines"
              />
            </div>

            {/* Product Images */}
            <div className="md:col-span-2">
              <ImageManager images={images} onChange={setImages} maxImages={10} />
            </div>

            {/* Product Variations */}
            <div className="md:col-span-2">
              <VariationManager variations={variations} onChange={setVariations} />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
