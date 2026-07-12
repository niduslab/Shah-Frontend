'use client';

import { useState } from 'react';
import { X, Package } from 'lucide-react';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  onSubmit: (status: OrderStatus) => Promise<void>;
}

export default function StatusUpdateModal({ isOpen, onClose, orderId, onSubmit }: StatusUpdateModalProps) {
  const [status, setStatus] = useState<OrderStatus>('confirmed');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(status);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions: { value: OrderStatus; label: string; description: string }[] = [
    { value: 'pending', label: 'Pending', description: 'Order is awaiting confirmation' },
    { value: 'confirmed', label: 'Confirmed', description: 'Order has been confirmed' },
    { value: 'processing', label: 'Processing', description: 'Order is being prepared' },
    { value: 'shipped', label: 'Shipped', description: 'Order has been shipped' },
    { value: 'delivered', label: 'Delivered', description: 'Order has been delivered' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Update Order Status</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Status
              </label>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      status === option.value
                        ? 'border-[#FF6F00] bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={status === option.value}
                      onChange={(e) => setStatus(e.target.value as OrderStatus)}
                      className="mt-1 h-4 w-4 text-[#FF6F00] focus:ring-[#FF6F00]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
