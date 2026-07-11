'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Percent, DollarSign, Package, Search, Plus, Trash2 } from 'lucide-react';
import { useAdminProducts } from '@/lib/hooks/admin/useAdminProducts';
import { useAdminCategories } from '@/lib/hooks/admin/useAdminCategories';
import { formatCurrency } from '@/lib/utils/currency';

interface FlashDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashDeal: any | null;
  onSubmit: (data: any) => Promise<void>;
}

export default function FlashDealModal({ isOpen, onClose, flashDeal, onSubmit }: FlashDealModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    starts_at: '',
    ends_at: '',
    discount_type: 'percentage' as 'percentage' | 'fixed_amount',
    discount_value: '',
    max_discount_amount: '',
    quantity_limit: '',
    per_user_limit: '',
    is_active: true,
    priority: '1',
  });

  const [selectionMode, setSelectionMode] = useState<'products' | 'categories'>('products');
  const [selectedProducts, setSelectedProducts] = useState<Array<{ product_id: number; name: string; price: number; flash_price?: string; quantity_limit?: string }>>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch products and categories
  const { data: productsData } = useAdminProducts({ search: productSearch, per_page: 50 });
  const { data: categoriesData } = useAdminCategories({ per_page: 100 });

  const products = (productsData as any)?.data?.data || [];
  const categories = (categoriesData as any)?.data?.data || [];

  useEffect(() => {
    setErrors({});
    if (flashDeal) {
      setFormData({
        title: flashDeal.title || '',
        description: flashDeal.description || '',
        starts_at: flashDeal.starts_at ? flashDeal.starts_at.slice(0, 16) : '',
        ends_at: flashDeal.ends_at ? flashDeal.ends_at.slice(0, 16) : '',
        discount_type: flashDeal.discount_type || 'percentage',
        discount_value: flashDeal.discount_value?.toString() || '',
        max_discount_amount: flashDeal.max_discount_amount?.toString() || '',
        quantity_limit: flashDeal.quantity_limit?.toString() || '',
        per_user_limit: flashDeal.per_user_limit?.toString() || '',
        is_active: flashDeal.is_active ?? true,
        priority: flashDeal.priority?.toString() || '1',
      });
      
      // Load existing products if editing
      if (flashDeal.products && flashDeal.products.length > 0) {
        setSelectionMode('products');
        setSelectedProducts(flashDeal.products.map((p: any) => ({
          product_id: p.product_id || p.id,
          name: p.product?.name || p.name || 'Unknown Product',
          price: p.product?.price || p.price || 0,
          flash_price: p.flash_price?.toString() || '',
          quantity_limit: p.quantity_limit?.toString() || '',
        })));
      }
    } else {
      setFormData({
        title: '',
        description: '',
        starts_at: '',
        ends_at: '',
        discount_type: 'percentage',
        discount_value: '',
        max_discount_amount: '',
        quantity_limit: '',
        per_user_limit: '',
        is_active: true,
        priority: '1',
      });
      setSelectedProducts([]);
      setSelectedCategories([]);
      setSelectionMode('products');
    }
  }, [flashDeal, isOpen]);

  const validate = (): Record<string, string> => {
    const validationErrors: Record<string, string> = {};
    const now = new Date();
    const startsAt = formData.starts_at ? new Date(formData.starts_at) : null;
    const endsAt = formData.ends_at ? new Date(formData.ends_at) : null;

    // Editing an existing deal may legitimately have a start date in the past
    if (startsAt && !flashDeal && startsAt <= now) {
      validationErrors.starts_at = 'Start date & time must be in the future.';
    }
    if (startsAt && endsAt && endsAt <= startsAt) {
      validationErrors.ends_at = 'End date & time must be after the start date & time.';
    }
    if (!formData.discount_value || parseFloat(formData.discount_value) <= 0) {
      validationErrors.discount_value = 'Discount value must be greater than 0.';
    }
    if (formData.discount_type === 'percentage' && parseFloat(formData.discount_value) > 100) {
      validationErrors.discount_value = 'Percentage discount cannot exceed 100.';
    }

    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const submitData: any = {
        title: formData.title,
        description: formData.description || undefined,
        starts_at: formData.starts_at,
        ends_at: formData.ends_at,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        is_active: formData.is_active,
        priority: parseInt(formData.priority),
      };

      if (formData.max_discount_amount) {
        submitData.max_discount_amount = parseFloat(formData.max_discount_amount);
      }
      if (formData.quantity_limit) {
        submitData.quantity_limit = parseInt(formData.quantity_limit);
      }
      if (formData.per_user_limit) {
        submitData.per_user_limit = parseInt(formData.per_user_limit);
      }

      // Add products or categories based on selection mode
      if (selectionMode === 'products' && selectedProducts.length > 0) {
        submitData.products = selectedProducts.map(p => ({
          product_id: p.product_id,
          flash_price: p.flash_price ? parseFloat(p.flash_price) : undefined,
          quantity_limit: p.quantity_limit ? parseInt(p.quantity_limit) : undefined,
        }));
      } else if (selectionMode === 'categories' && selectedCategories.length > 0) {
        submitData.categories = selectedCategories;
      }

      await onSubmit(submitData);
    } catch (error: any) {
      const backendErrors = error?.response?.data?.errors;
      if (backendErrors) {
        const flattened: Record<string, string> = {};
        Object.entries(backendErrors).forEach(([field, messages]) => {
          flattened[field] = Array.isArray(messages) ? messages[0] : String(messages);
        });
        setErrors(flattened);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProduct = (product: any) => {
    if (!selectedProducts.find(p => p.product_id === product.id)) {
      setSelectedProducts([...selectedProducts, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        flash_price: '',
        quantity_limit: '',
      }]);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.product_id !== productId));
  };

  const handleUpdateProduct = (productId: number, field: 'flash_price' | 'quantity_limit', value: string) => {
    setSelectedProducts(selectedProducts.map(p => 
      p.product_id === productId ? { ...p, [field]: value } : p
    ));
  };

  const handleToggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
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
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {flashDeal ? 'Edit Flash Deal' : 'Create Flash Deal'}
              </h2>
              <p className="text-sm text-gray-500">
                {flashDeal ? 'Update flash deal details' : 'Add a new time-limited promotional deal'}
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
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              placeholder="e.g., Weekend Flash Sale"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              placeholder="Brief description of the flash deal"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.starts_at}
                onChange={(e) => {
                  setFormData({ ...formData, starts_at: e.target.value });
                  setErrors((prev) => ({ ...prev, starts_at: '' }));
                }}
                className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.starts_at
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-gray-300 focus:border-[#FF6F00] focus:ring-[#FF6F00]/20'
                }`}
              />
              {errors.starts_at && <p className="mt-1 text-xs text-red-600">{errors.starts_at}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.ends_at}
                onChange={(e) => {
                  setFormData({ ...formData, ends_at: e.target.value });
                  setErrors((prev) => ({ ...prev, ends_at: '' }));
                }}
                className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.ends_at
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-gray-300 focus:border-[#FF6F00] focus:ring-[#FF6F00]/20'
                }`}
              />
              {errors.ends_at && <p className="mt-1 text-xs text-red-600">{errors.ends_at}</p>}
            </div>
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed_amount' })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed_amount">Fixed Amount</option>
              </select>
            </div>
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
                  value={formData.discount_value}
                  onChange={(e) => {
                    setFormData({ ...formData, discount_value: e.target.value });
                    setErrors((prev) => ({ ...prev, discount_value: '' }));
                  }}
                  className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 pl-10 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                    errors.discount_value
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                      : 'border-gray-300 focus:border-[#FF6F00] focus:ring-[#FF6F00]/20'
                  }`}
                  placeholder={formData.discount_type === 'percentage' ? '20' : '50.00'}
                />
              </div>
              {errors.discount_value && <p className="mt-1 text-xs text-red-600">{errors.discount_value}</p>}
            </div>
          </div>

          {/* Max Discount Amount (for percentage) */}
          {formData.discount_type === 'percentage' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Max Discount Amount
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
              <p className="mt-1 text-xs text-gray-500">Maximum discount amount for percentage-based deals</p>
            </div>
          )}

          {/* Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Total Quantity Limit
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Package className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity_limit}
                  onChange={(e) => setFormData({ ...formData, quantity_limit: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 pl-10 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  placeholder="1000"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Per User Limit
              </label>
              <input
                type="number"
                min="0"
                value={formData.per_user_limit}
                onChange={(e) => setFormData({ ...formData, per_user_limit: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="5"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Priority
            </label>
            <input
              type="number"
              min="1"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              placeholder="1"
            />
            <p className="mt-1 text-xs text-gray-500">Higher priority deals are displayed first</p>
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
              Active
            </label>
          </div>

          {/* Product/Category Selection */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Products or Categories</h3>
            
            {/* Selection Mode Toggle */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setSelectionMode('products')}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  selectionMode === 'products'
                    ? 'bg-[#FF6F00] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Select Products Manually
              </button>
              <button
                type="button"
                onClick={() => setSelectionMode('categories')}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  selectionMode === 'categories'
                    ? 'bg-[#FF6F00] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Select by Categories
              </button>
            </div>

            {/* Products Selection */}
            {selectionMode === 'products' && (
              <div className="space-y-4">
                {/* Product Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  />
                </div>

                {/* Available Products */}
                {productSearch && (
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50">
                    {products.length > 0 ? (
                      products.map((product: any) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleAddProduct(product)}
                          disabled={selectedProducts.some(p => p.product_id === product.id)}
                          className="flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{formatCurrency(product.price)}</p>
                          </div>
                          <Plus className="h-4 w-4 text-[#FF6F00]" />
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm text-gray-500">No products found</p>
                    )}
                  </div>
                )}

                {/* Selected Products */}
                {selectedProducts.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected Products ({selectedProducts.length})</p>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {selectedProducts.map((product) => (
                        <div key={product.product_id} className="rounded-lg border border-gray-200 bg-white p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                              <p className="text-xs text-gray-500">Original: {formatCurrency(product.price)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(product.product_id)}
                              className="rounded-lg p-1 text-red-600 transition-all hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Flash Price (optional)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Auto-calculated"
                                value={product.flash_price}
                                onChange={(e) => handleUpdateProduct(product.product_id, 'flash_price', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Quantity Limit
                              </label>
                              <input
                                type="number"
                                min="0"
                                placeholder="No limit"
                                value={product.quantity_limit}
                                onChange={(e) => handleUpdateProduct(product.product_id, 'quantity_limit', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProducts.length === 0 && !productSearch && (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                    <Package className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Search and add products to this flash deal</p>
                  </div>
                )}
              </div>
            )}

            {/* Categories Selection */}
            {selectionMode === 'categories' && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Select Categories ({selectedCategories.length} selected)
                </p>
                <div className="max-h-64 overflow-y-auto space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  {categories.length > 0 ? (
                    categories.map((category: any) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 cursor-pointer transition-all hover:bg-orange-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleToggleCategory(category.id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#FF6F00] focus:ring-2 focus:ring-[#FF6F00]/20"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{category.name}</p>
                          {category.description && (
                            <p className="text-xs text-gray-500">{category.description}</p>
                          )}
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No categories available</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  All products in selected categories will be included in this flash deal
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
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
              {isSubmitting ? 'Saving...' : flashDeal ? 'Update Flash Deal' : 'Create Flash Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
