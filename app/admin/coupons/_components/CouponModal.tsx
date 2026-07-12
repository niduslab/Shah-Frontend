'use client';

import { useState, useEffect } from 'react';
import { X, Ticket, Percent, DollarSign, Calendar, Package, Tag, Search } from 'lucide-react';
import { useAdminProducts } from '@/lib/hooks/admin/useAdminProducts';
import { useAdminBrands } from '@/lib/hooks/admin/useAdminBrands';
import { useAdminCategories } from '@/lib/hooks/admin/useAdminCategories';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: any | null;
  onSubmit: (data: any) => Promise<void>;
}

export default function CouponModal({ isOpen, onClose, coupon, onSubmit }: CouponModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discount_type: 'percentage' as 'percentage' | 'fixed_amount' | 'free_shipping',
    discount_value: '',
    max_discount_amount: '',
    min_purchase_amount: '',
    usage_limit: '',
    once_per_customer: true,
    starts_at: '',
    expires_at: '',
    is_active: true,
    applies_to: 'all' as 'all' | 'products' | 'brands' | 'categories',
  });

  const [showProductSelection, setShowProductSelection] = useState(false);
  const [showBrandSelection, setShowBrandSelection] = useState(false);
  const [showCategorySelection, setShowCategorySelection] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data when selections are shown
  const { data: productsData } = useAdminProducts({ search: searchQuery, per_page: 50 });
  const { data: brandsData } = useAdminBrands({ per_page: 100 });
  const { data: categoriesData } = useAdminCategories({ per_page: 100 });

  const products = (productsData as any)?.data?.data || [];
  const brands = (brandsData as any)?.data?.data || [];
  const categories = (categoriesData as any)?.data?.data || [];

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || '',
        name: coupon.name || '',
        discount_type: coupon.discount_type || 'percentage',
        discount_value: coupon.discount_value?.toString() || '',
        max_discount_amount: coupon.max_discount_amount?.toString() || '',
        min_purchase_amount: coupon.min_purchase_amount?.toString() || '',
        usage_limit: coupon.usage_limit?.toString() || '',
        once_per_customer: coupon.once_per_customer ?? true,
        starts_at: coupon.starts_at ? coupon.starts_at.slice(0, 16) : '',
        expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : '',
        is_active: coupon.is_active ?? true,
        applies_to: coupon.applies_to || 'all',
      });
      
      // Load existing selections
      if (coupon.products && coupon.products.length > 0) {
        setSelectedProducts(coupon.products.map((p: any) => p.id));
        setShowProductSelection(true);
      }
      if (coupon.brands && coupon.brands.length > 0) {
        setSelectedBrands(coupon.brands.map((b: any) => b.id));
        setShowBrandSelection(true);
      }
      if (coupon.categories && coupon.categories.length > 0) {
        setSelectedCategories(coupon.categories.map((c: any) => c.id));
        setShowCategorySelection(true);
      }
    } else {
      setFormData({
        code: '',
        name: '',
        discount_type: 'percentage',
        discount_value: '',
        max_discount_amount: '',
        min_purchase_amount: '',
        usage_limit: '',
        once_per_customer: true,
        starts_at: '',
        expires_at: '',
        is_active: true,
        applies_to: 'all',
      });
      setSelectedProducts([]);
      setSelectedBrands([]);
      setSelectedCategories([]);
      setShowProductSelection(false);
      setShowBrandSelection(false);
      setShowCategorySelection(false);
    }
  }, [coupon, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData: any = {
        name: formData.name || undefined,
        discount_type: formData.discount_type,
        discount_value: formData.discount_type === 'free_shipping' ? 0 : parseFloat(formData.discount_value),
        applies_to: formData.applies_to,
        starts_at: formData.starts_at || undefined,
        expires_at: formData.expires_at || undefined,
        is_active: formData.is_active,
        once_per_customer: formData.once_per_customer,
      };

      // Only include code if provided (backend will auto-generate if missing)
      if (formData.code.trim()) {
        submitData.code = formData.code.toUpperCase().replace(/\s+/g, '');
      }

      if (formData.max_discount_amount) {
        submitData.max_discount_amount = parseFloat(formData.max_discount_amount);
      }
      if (formData.min_purchase_amount) {
        submitData.min_purchase_amount = parseFloat(formData.min_purchase_amount);
      }
      if (formData.usage_limit) {
        submitData.usage_limit = parseInt(formData.usage_limit);
      }

      // Add all selected items (can be multiple types at once)
      if (selectedProducts.length > 0) {
        submitData.product_ids = selectedProducts;
      }
      if (selectedBrands.length > 0) {
        submitData.brand_ids = selectedBrands;
      }
      if (selectedCategories.length > 0) {
        submitData.category_ids = selectedCategories;
      }

      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {coupon ? 'Edit Coupon' : 'Create Coupon'}
              </h2>
              <p className="text-sm text-gray-500">
                {coupon ? 'Update coupon details' : 'Add a new discount coupon'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Coupon Code */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Coupon Code {!coupon && <span className="text-xs text-gray-500">(optional - auto-generated if empty)</span>}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Tag className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 pl-10 text-sm font-mono uppercase transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="e.g., SAVE20 (leave empty for auto-generation)"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">No spaces allowed - will be auto-removed</p>
          </div>

          {/* Name/Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Coupon Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              placeholder="e.g., Summer Sale 20% Off"
            />
            <p className="mt-1 text-xs text-gray-500">Internal name for this coupon</p>
          </div>

          {/* Coupon Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Discount Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.discount_type}
              onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as any })}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
            >
              <option value="percentage">Percentage Discount</option>
              <option value="fixed_amount">Fixed Amount Discount</option>
              <option value="free_shipping">Free Shipping</option>
            </select>
          </div>

          {/* Discount Value */}
          {formData.discount_type !== 'free_shipping' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {formData.discount_type === 'percentage' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                </div>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  max={formData.discount_type === 'percentage' ? '100' : undefined}
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 pl-10 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  placeholder={formData.discount_type === 'percentage' ? '20' : '50.00'}
                />
              </div>
            </div>
          )}

          {/* Max Discount Amount (for percentage) */}
          {formData.discount_type === 'percentage' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Maximum Discount Amount
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <DollarSign className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.max_discount_amount}
                  onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 pl-10 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  placeholder="100.00"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Cap the maximum discount amount</p>
            </div>
          )}

          {/* Min Purchase Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Minimum Purchase Amount
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <DollarSign className="h-4 w-4" />
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.min_purchase_amount}
                onChange={(e) => setFormData({ ...formData, min_purchase_amount: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 pl-10 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="50.00"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Minimum cart value required to use this coupon</p>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date & Time
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  type="datetime-local"
                  value={formData.starts_at}
                  onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 pl-10 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Expiry Date & Time
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 pl-10 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Total Usage Limit
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Package className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  min="0"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 pl-10 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  placeholder="1000"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Total times this coupon can be used</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Once Per Customer
              </label>
              <div className="flex items-center gap-3 h-[42px]">
                <input
                  type="checkbox"
                  id="once_per_customer"
                  checked={formData.once_per_customer}
                  onChange={(e) => setFormData({ ...formData, once_per_customer: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[#FF6F00] focus:ring-2 focus:ring-[#FF6F00]/20"
                />
                <label htmlFor="once_per_customer" className="text-sm text-gray-600">
                  Limit to one use per customer
                </label>
              </div>
            </div>
          </div>

          {/* Applicable To */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Applies To <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.applies_to}
              onChange={(e) => setFormData({ ...formData, applies_to: e.target.value as any })}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
            >
              <option value="all">All Products</option>
              <option value="products">Specific Products</option>
              <option value="brands">Specific Brands</option>
              <option value="categories">Specific Categories</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              You can select multiple types below (products, brands, and/or categories)
            </p>
          </div>

          {/* Selection Type Toggles */}
          {formData.applies_to !== 'all' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Items to Apply Discount
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductSelection(!showProductSelection)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    showProductSelection
                      ? 'bg-[#FF6F00] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Products {selectedProducts.length > 0 && `(${selectedProducts.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBrandSelection(!showBrandSelection)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    showBrandSelection
                      ? 'bg-[#FF6F00] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Brands {selectedBrands.length > 0 && `(${selectedBrands.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategorySelection(!showCategorySelection)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    showCategorySelection
                      ? 'bg-[#FF6F00] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Click to toggle selection panels. You can select from multiple types.
              </p>
            </div>
          )}

          {/* Selection UI for Products */}
          {showProductSelection && (
            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Products ({selectedProducts.length} selected)
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm"
                />
              </div>
              {searchQuery && products.length > 0 && (
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {products.map((product: any) => (
                    <label key={product.id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 cursor-pointer hover:bg-orange-50">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product.id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-[#FF6F00]"
                      />
                      <span className="text-sm">{product.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selection UI for Brands */}
          {showBrandSelection && (
            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Brands ({selectedBrands.length} selected)
              </label>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {brands.map((brand: any) => (
                  <label key={brand.id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 cursor-pointer hover:bg-orange-50">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands([...selectedBrands, brand.id]);
                        } else {
                          setSelectedBrands(selectedBrands.filter(id => id !== brand.id));
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-[#FF6F00]"
                    />
                    <span className="text-sm">{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Selection UI for Categories */}
          {showCategorySelection && (
            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Categories ({selectedCategories.length} selected)
              </label>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {categories.map((category: any) => (
                  <label key={category.id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 cursor-pointer hover:bg-orange-50">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.id]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-[#FF6F00]"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

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
              Active
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 pt-4 border-t border-gray-200 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : coupon ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
