'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface RejectReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export default function RejectReviewModal({ isOpen, onClose, onConfirm, isLoading }: RejectReviewModalProps) {
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  if (!isOpen) return null;

  const predefinedReasons = [
    'Inappropriate content',
    'Spam or promotional content',
    'Offensive language',
    'Not related to the product',
    'Fake or fraudulent review',
    'Violates community guidelines',
    'Other'
  ];

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Other' ? reason : selectedReason;
    if (!finalReason.trim()) return;
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Reject Review</h2>
              <p className="text-sm text-gray-500">Provide a reason for rejection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Reason
            </label>
            <div className="space-y-2">
              {predefinedReasons.map((reasonOption) => (
                <label
                  key={reasonOption}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer transition-all hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reasonOption}
                    checked={selectedReason === reasonOption}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="h-4 w-4 text-[#FF6F00] focus:ring-[#FF6F00]"
                  />
                  <span className="text-sm text-gray-700">{reasonOption}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter your reason for rejecting this review..."
                rows={4}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>
          )}

          <div className="rounded-lg bg-amber-50 p-4 border border-amber-100">
            <p className="text-sm text-amber-800">
              The customer will be notified about the rejection. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !selectedReason || (selectedReason === 'Other' && !reason.trim())}
            className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-500/30 transition-all hover:shadow-xl hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Rejecting...' : 'Reject Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
