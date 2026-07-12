'use client';

import { useState } from 'react';
import { X, Truck } from 'lucide-react';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  onSubmit: (data: { tracking_number: string; carrier: string }) => Promise<void>;
}

export default function TrackingModal({ isOpen, onClose, orderId, onSubmit }: TrackingModalProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim() || !carrier.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ tracking_number: trackingNumber, carrier });
      setTrackingNumber('');
      setCarrier('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonCarriers = [
    'DHL',
    'FedEx',
    'UPS',
    'USPS',
    'DPD',
    'TNT',
    'Aramex',
    'Blue Dart',
    'Other'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Assign Tracking</h2>
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
                Tracking Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carrier <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="Enter carrier name"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Common Carriers
              </label>
              <div className="flex flex-wrap gap-2">
                {commonCarriers.map((commonCarrier) => (
                  <button
                    key={commonCarrier}
                    type="button"
                    onClick={() => setCarrier(commonCarrier)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      carrier === commonCarrier
                        ? 'border-[#FF6F00] bg-orange-50 text-[#FF6F00]'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {commonCarrier}
                  </button>
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
              disabled={isSubmitting || !trackingNumber.trim() || !carrier.trim()}
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Assigning...' : 'Assign Tracking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
