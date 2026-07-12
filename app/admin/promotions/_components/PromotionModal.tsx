'use client';

import { useState, useEffect } from 'react';
import { X, Tag, Calendar, Package, AlertCircle } from 'lucide-react';
import { useAdminProducts } from '@/lib/hooks/admin/useAdminProducts';
import { PromotionData } from '@/lib/hooks/admin/usePromotions';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: PromotionData | null;
  onSubmit: (data: PromotionData) => Promise<void>;
}

export default function PromotionModal({ isOpen, onClose, promotion, onSubmit }: PromotionModalProps) {
  const [formData, setFormData] = useState<Partial<PromotionData>>({
    name: '',
    description: '',
    promotion_type: 'percentage',
    discount_value: 0,
    applies_to: 'all_products',
    apply_level: 'product',
    min_purchase_amount: 0,
    max_discount_amount: 0,
    starts_at: '',
    ends_at: '',
    is_active: true,
    priority: 0,
    conditions: {},
    product_ids: [],
    brand_ids: [],
    category_ids: [],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductSelection, setShowProductSelection] = useState(false);
  const [showBrandSelection, setShowBrandSelection] = useState(false);
  const [showCategorySelection, setShowCategorySelection] = useState(false);

  // Fetch data for selections
  const { data: productsData } = useAdminProducts({ search: searchQuery, per_page: 50 });
  const products = (productsData as any)?.data?.data || [];
  // Note: Add hooks for brands and categories if needed, similar to CouponModal

  useEffect(() => {
    if (promotion) {
      setFormData({
        ...promotion,
        starts_at: promotion.starts_at ? promotion.starts_at.slice(0, 16) : '',
        ends_at: promotion.ends_at ? promotion.ends_at.slice(0, 16) : '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        promotion_type: 'percentage',
        discount_value: 0,
        applies_to: 'all_products',
        apply_level: 'product',
        min_purchase_amount: 0,
        max_discount_amount: 0,
        starts_at: '',
        ends_at: '',
        is_active: true,
        priority: 0,
        conditions: {},
        product_ids: [],
        brand_ids: [],
        category_ids: [],
      });
    }
  }, [promotion, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData as PromotionData);
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
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {promotion ? 'Edit Promotion' : 'Create Promotion'}
              </h2>
              <p className="text-sm text-gray-500">
                {promotion ? 'Update promotion details' : 'Add a new promotion campaign'}
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
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Promotion Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              placeholder="e.g., Summer Sale 20% Off"
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
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              rows={3}
              placeholder="Internal description for this promotion..."
            />
          </div>

          {/* Type & Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Promotion Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.promotion_type}
                onChange={(e) => setFormData({ ...formData, promotion_type: e.target.value as any })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed_amount">Fixed Amount</option>
                <option value="flash_sale">Flash Sale</option>
                <option value="combo_offer">Combo Offer</option>
                <option value="free_delivery">Free Delivery</option>
              </select>
            </div>
            
            {formData.promotion_type !== 'free_delivery' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Discount Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>
            )}
          </div>

          {/* Max Discount & Min Purchase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Minimum Purchase Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.min_purchase_amount}
                onChange={(e) => setFormData({ ...formData, min_purchase_amount: parseFloat(e.target.value) })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>
            
            {formData.promotion_type === 'percentage' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Max Discount Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.max_discount_amount}
                  onChange={(e) => setFormData({ ...formData, max_discount_amount: parseFloat(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>
            )}
          </div>

          {/* Application Scope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <option value="all_products">All Products</option>
                <option value="specific_products">Specific Products</option>
                <option value="specific_brands">Specific Brands</option>
                <option value="specific_categories">Specific Categories</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Apply Level <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.apply_level}
                onChange={(e) => setFormData({ ...formData, apply_level: e.target.value as any })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="product">Product Level</option>
                <option value="cart">Cart Level</option>
              </select>
            </div>
          </div>

          {/* Product Selection - Show if applies_to is specific_products */}
          {formData.applies_to === 'specific_products' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select Products <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowProductSelection(!showProductSelection)}
                className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span>{formData.product_ids?.length || 0} Products Selected</span>
                <Package className="h-4 w-4 text-gray-500" />
              </button>
              
              {showProductSelection && (
                <div className="mt-2 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none"
                  />
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {products.map((product: any) => (
                      <label key={product.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={formData.product_ids?.includes(product.id)}
                          onChange={(e) => {
                            const currentIds = formData.product_ids || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, product_ids: [...currentIds, product.id] });
                            } else {
                              setFormData({
                                ...formData,
                                product_ids: currentIds.filter(id => id !== product.id)
                              });
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-[#FF6F00] focus:ring-[#FF6F00]"
                        />
                        <span className="text-sm text-gray-700">{product.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date & Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  type="datetime-local"
                  required
                  value={formData.starts_at}
                  onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 pl-10 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Date & Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  type="datetime-local"
                  required
                  value={formData.ends_at}
                  onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 pl-10 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>
            </div>
          </div>

          {/* Priority & Active */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Priority
              </label>
              <input
                type="number"
                min="0"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                placeholder="0 (Higher number means higher priority)"
              />
            </div>
            
            <div className="flex items-center gap-3 pt-8">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#FF6F00] focus:ring-2 focus:ring-[#FF6F00]/20"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active Status
              </label>
            </div>
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
              {isSubmitting ? 'Saving...' : promotion ? 'Update Promotion' : 'Create Promotion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
