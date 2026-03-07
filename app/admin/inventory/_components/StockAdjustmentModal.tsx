'use client';

import { useState } from 'react';
import { X, Package, Plus, Minus } from 'lucide-react';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSubmit: (data: any) => Promise<void>;
}

export default function StockAdjustmentModal({ isOpen, onClose, product, onSubmit }: StockAdjustmentModalProps) {
  const [formData, setFormData] = useState({
    variation_id: null as number | null,
    quantity: '',
    reason: 'adjustment' as 'adjustment' | 'damage' | 'return' | 'recount' | 'other',
    notes: '',
  });
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // Reset form
      setFormData({
        variation_id: null,
        quantity: '',
        reason: 'adjustment',
        notes: '',
      });
      setAdjustmentType('add');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const hasVariations = product.variations && product.variations.length > 0;
  const currentStock = formData.variation_id
    ? product.variations.find((v: any) => v.id === formData.variation_id)?.quantity || 0
    : product.quantity;

  const quantityValue = parseInt(formData.quantity) || 0;
  const newStock = adjustmentType === 'add' 
    ? currentStock + quantityValue 
    : currentStock - quantityValue;

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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Stock Info */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Current Stock</p>
                <p className="text-3xl font-bold text-blue-900">{currentStock}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">New Stock</p>
                <p className={`text-3xl font-bold ${newStock < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {newStock}
                </p>
              </div>
            </div>
          </div>

          {/* Variation Selection */}
          {hasVariations && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select Variation (Optional)
              </label>
              <select
                value={formData.variation_id || ''}
                onChange={(e) => setFormData({ ...formData, variation_id: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="">Main Product (Stock: {product.quantity})</option>
                {product.variations.map((variation: any) => (
                  <option key={variation.id} value={variation.id}>
                    {Object.entries(variation.attributes).map(([key, value]) => `${key}: ${value}`).join(', ')} 
                    {' '}(Stock: {variation.quantity})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Adjustment Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Adjustment Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdjustmentType('add')}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  adjustmentType === 'add'
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Plus className="h-5 w-5" />
                Add Stock
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('subtract')}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  adjustmentType === 'subtract'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Minus className="h-5 w-5" />
                Subtract Stock
              </button>
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
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Warning for negative stock */}
          {newStock < 0 && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ Warning: This adjustment will result in negative stock ({newStock})
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
              disabled={isSubmitting}
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
