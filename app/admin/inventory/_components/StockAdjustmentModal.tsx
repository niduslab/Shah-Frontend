'use client';

import { useState, useEffect } from 'react';
import { X, Package, Plus, Minus } from 'lucide-react';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSubmit: (data: any) => Promise<void>;
}

export default function StockAdjustmentModal({ isOpen, onClose, product, onSubmit }: StockAdjustmentModalProps) {
  const hasVariations = product?.variations && product.variations.length > 0;

  // If opened from a variant row, _selectedVariationId is pre-set
  const preselectedVariationId: number | null = product?._selectedVariationId ?? null;

  const [formData, setFormData] = useState({
    variation_id: null as number | null,
    quantity: '',
    reason: 'adjustment' as 'adjustment' | 'damage' | 'return' | 'recount' | 'other',
    notes: '',
  });
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync variation selection when product/modal changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        variation_id: preselectedVariationId,
        quantity: '',
        reason: 'adjustment',
        notes: '',
      });
      setAdjustmentType('add');
    }
  }, [isOpen, product?.id, preselectedVariationId]);

  if (!isOpen || !product) return null;

  const selectedVariation = formData.variation_id
    ? product.variations?.find((v: any) => v.id === formData.variation_id)
    : null;

  const currentStock = selectedVariation
    ? selectedVariation.quantity
    : hasVariations
    ? null  // no variation selected yet — force selection
    : product.quantity;

  const quantityValue = parseInt(formData.quantity) || 0;
  const newStock = currentStock !== null
    ? (adjustmentType === 'add' ? currentStock + quantityValue : currentStock - quantityValue)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If product has variations, a variation must be selected
    if (hasVariations && !formData.variation_id) {
      return;
    }

    setIsSubmitting(true);
    try {
      const quantity = parseInt(formData.quantity);
      const finalQuantity = adjustmentType === 'subtract' ? -quantity : quantity;

      await onSubmit({
        variation_id: formData.variation_id,
        quantity: finalQuantity,
        reason: formData.reason,
        notes: formData.notes || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Adjust Stock</h2>
              <p className="text-sm text-gray-500">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Variation selection — required when product has variants */}
          {hasVariations && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select Variant <span className="text-red-500">*</span>
              </label>
              <div className="grid gap-2">
                {product.variations.map((variation: any) => {
                  const label = Object.entries(variation.attributes as Record<string, string>)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' / ');
                  const isSelected = formData.variation_id === variation.id;
                  return (
                    <button
                      key={variation.id}
                      type="button"
                      onClick={() => setFormData(f => ({ ...f, variation_id: variation.id }))}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                        isSelected
                          ? 'border-[#FF6F00] bg-orange-50 ring-2 ring-[#FF6F00]/20'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <span className="font-medium text-gray-900">{label || `Variant #${variation.id}`}</span>
                        <span className="ml-2 font-mono text-xs text-gray-400">{variation.sku}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-semibold ${variation.quantity === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          {variation.quantity}
                        </span>
                        <span className="ml-1 text-xs text-gray-400">in stock</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {!formData.variation_id && (
                <p className="mt-1.5 text-xs text-red-500">Please select a variant to adjust.</p>
              )}
            </div>
          )}

          {/* Current / New stock preview — only show once a target is known */}
          {currentStock !== null && (
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Current Stock</p>
                  <p className="text-3xl font-bold text-blue-900">{currentStock}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">New Stock</p>
                  <p className={`text-3xl font-bold ${newStock !== null && newStock < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {newStock !== null ? newStock : '—'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Adjustment type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Adjustment Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['add', 'subtract'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAdjustmentType(type)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    adjustmentType === type
                      ? type === 'add' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'add' ? <Plus className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
                  {type === 'add' ? 'Add Stock' : 'Subtract Stock'}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              placeholder="Enter quantity"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reason <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value as any })}
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
            <label className="mb-2 block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Negative stock warning */}
          {newStock !== null && newStock < 0 && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ Warning: This adjustment will result in negative stock ({newStock}). The system will floor it at 0.
              </p>
            </div>
          )}

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
              disabled={isSubmitting || (hasVariations && !formData.variation_id)}
              className="rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adjusting...' : 'Adjust Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
