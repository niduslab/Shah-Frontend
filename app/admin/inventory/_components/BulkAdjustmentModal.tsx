'use client';

import { useState } from 'react';
import { X, Package, Search, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminProducts } from '@/lib/hooks/admin/useAdminProducts';
import { useBulkStockAdjustment } from '@/lib/hooks/admin/useInventory';

interface BulkAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdjustmentItem {
  product_id: number;
  product_name: string;
  current_stock: number;
  variation_id?: number | null;
  variation_name?: string;
  quantity: string;
}

export default function BulkAdjustmentModal({ isOpen, onClose }: BulkAdjustmentModalProps) {
  const [productSearch, setProductSearch] = useState('');
  const [adjustments, setAdjustments] = useState<AdjustmentItem[]>([]);
  const [reason, setReason] = useState<'adjustment' | 'damage' | 'return' | 'recount' | 'other'>('recount');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: productsData } = useAdminProducts({ search: productSearch, per_page: 20 });
  const bulkAdjustMutation = useBulkStockAdjustment();

  const products = (productsData as any)?.data?.data || [];

  const handleAddProduct = (product: any, variation?: any) => {
    const existingIndex = adjustments.findIndex(
      a => a.product_id === product.id && a.variation_id === (variation?.id || null)
    );

    if (existingIndex >= 0) {
      toast.info('Product already added', {
        description: 'This product is already in the adjustment list.'
      });
      return;
    }

    setAdjustments([
      ...adjustments,
      {
        product_id: product.id,
        product_name: product.name,
        current_stock: variation ? variation.quantity : product.quantity,
        variation_id: variation?.id || null,
        variation_name: variation ? Object.entries(variation.attributes).map(([k, v]) => `${k}: ${v}`).join(', ') : undefined,
        quantity: '',
      }
    ]);
  };

  const handleRemoveAdjustment = (index: number) => {
    setAdjustments(adjustments.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index: number, quantity: string) => {
    const updated = [...adjustments];
    updated[index].quantity = quantity;
    setAdjustments(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (adjustments.length === 0) {
      toast.error('No adjustments', {
        description: 'Please add at least one product to adjust.'
      });
      return;
    }

    const invalidAdjustments = adjustments.filter(a => !a.quantity || parseInt(a.quantity) === 0);
    if (invalidAdjustments.length > 0) {
      toast.error('Invalid quantities', {
        description: 'Please enter valid quantities for all products.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await bulkAdjustMutation.mutateAsync({
        adjustments: adjustments.map(a => ({
          product_id: a.product_id,
          variation_id: a.variation_id,
          quantity: parseInt(a.quantity),
        })),
        reason,
        notes: notes || undefined,
      });

      toast.success('Bulk adjustment completed', {
        description: `Successfully adjusted stock for ${adjustments.length} items.`
      });

      // Reset form
      setAdjustments([]);
      setReason('recount');
      setNotes('');
      setProductSearch('');
      onClose();
    } catch (error) {
      toast.error('Failed to adjust stock', {
        description: 'Please try again or contact support if the problem persists.'
      });
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
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bulk Stock Adjustment</h2>
              <p className="text-sm text-gray-500">Adjust multiple products at once</p>
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
          {/* Product Search */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Search and Add Products
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>

            {/* Search Results */}
            {productSearch && products.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50">
                {products.map((product: any) => (
                  <div key={product.id} className="border-b border-gray-200 last:border-0">
                    <button
                      type="button"
                      onClick={() => handleAddProduct(product)}
                      className="flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-all hover:bg-white"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">SKU: {product.sku} | Stock: {product.quantity}</p>
                      </div>
                      <Plus className="h-4 w-4 text-[#FF6F00]" />
                    </button>
                    
                    {/* Variations */}
                    {product.variations && product.variations.length > 0 && (
                      <div className="bg-gray-100 px-4 py-2 space-y-1">
                        {product.variations.map((variation: any) => (
                          <button
                            key={variation.id}
                            type="button"
                            onClick={() => handleAddProduct(product, variation)}
                            className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs transition-all hover:bg-white rounded"
                          >
                            <span className="text-gray-700">
                              {Object.entries(variation.attributes).map(([k, v]) => `${k}: ${v}`).join(', ')} 
                              {' '}(Stock: {variation.quantity})
                            </span>
                            <Plus className="h-3 w-3 text-[#FF6F00]" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Adjustments List */}
          {adjustments.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Products to Adjust ({adjustments.length})
              </label>
              <div className="max-h-64 overflow-y-auto space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                {adjustments.map((item, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 bg-white p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                        {item.variation_name && (
                          <p className="text-xs text-gray-500">{item.variation_name}</p>
                        )}
                        <p className="text-xs text-gray-500">Current Stock: {item.current_stock}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAdjustment(index)}
                        className="rounded-lg p-1 text-red-600 transition-all hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Adjustment Quantity (use negative for decrease)
                      </label>
                      <input
                        type="number"
                        required
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(index, e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                        placeholder="e.g., 10 or -5"
                      />
                      {item.quantity && (
                        <p className="mt-1 text-xs text-gray-500">
                          New Stock: {item.current_stock + parseInt(item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adjustments.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600">Search and add products to adjust their stock</p>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reason <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
            >
              <option value="adjustment">Stock Adjustment</option>
              <option value="damage">Damaged Items</option>
              <option value="return">Customer Return</option>
              <option value="recount">Inventory Recount</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              placeholder="Add any additional notes about this bulk adjustment..."
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 pt-4 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || adjustments.length === 0}
              className="rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : `Adjust ${adjustments.length} Items`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
