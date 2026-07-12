'use client';

import { useState, useEffect } from 'react';
import { X, Wallet, Paperclip } from 'lucide-react';
import { useAdminOrder } from '@/lib/hooks/admin/useAdminOrders';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  onSubmit: (data: {
    amount: number;
    payment_method: 'cash' | 'bkash' | 'nagad' | 'bank_transfer' | 'card' | 'manual';
    reference_number?: string;
    note?: string;
    proof?: File;
  }) => Promise<void>;
}

const PAYMENT_METHODS: { value: 'cash' | 'bkash' | 'nagad' | 'bank_transfer' | 'card' | 'manual'; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'bkash', label: 'bKash' },
  { value: 'nagad', label: 'Nagad' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Card' },
  { value: 'manual', label: 'Other / Manual' },
];

export default function RecordPaymentModal({ isOpen, onClose, orderId, onSubmit }: RecordPaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bkash' | 'nagad' | 'bank_transfer' | 'card' | 'manual'>('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [note, setNote] = useState('');
  const [proof, setProof] = useState<File | undefined>(undefined);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: orderData } = useAdminOrder(orderId, { enabled: isOpen } as any);
  const order = (orderData as any)?.data;

  const total = parseFloat(order?.total_amount || order?.total || '0');
  const paid = (order?.payments || [])
    .filter((p: any) => p.status === 'completed')
    .reduce((sum: number, p: any) => sum + parseFloat(p.amount || '0'), 0);
  const remaining = Math.max(0, total - paid);

  useEffect(() => {
    if (isOpen && order) {
      setAmount(remaining > 0 ? remaining.toFixed(2) : '');
    }
  }, [isOpen, order?.id]);

  useEffect(() => {
    if (!proof) {
      setProofPreview(null);
      return;
    }
    if (proof.type.startsWith('image/')) {
      const url = URL.createObjectURL(proof);
      setProofPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setProofPreview(null);
  }, [proof]);

  if (!isOpen) return null;

  const resetForm = () => {
    setAmount('');
    setPaymentMethod('cash');
    setReferenceNumber('');
    setNote('');
    setProof(undefined);
    setProofPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        amount: numericAmount,
        payment_method: paymentMethod,
        reference_number: referenceNumber || undefined,
        note: note || undefined,
        proof,
      });
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
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
          {order && (
            <div className="mb-4 rounded-xl bg-gray-50 p-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Order Total</span>
                <span className="font-medium text-gray-900">৳{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Already Paid</span>
                <span className="font-medium text-gray-900">৳{paid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 mt-1 pt-1">
                <span>Remaining</span>
                <span>৳{remaining.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the full remaining balance, or a partial/advance amount.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Transaction ID, bank slip no., etc."
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proof Document <span className="font-normal text-gray-400">(image or PDF)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 transition-all hover:border-[#FF6F00] hover:bg-orange-50/50">
                <Paperclip className="h-4 w-4 shrink-0" />
                <span className="truncate">{proof ? proof.name : 'Attach receipt, invoice, or screenshot'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  className="hidden"
                  onChange={(e) => setProof(e.target.files?.[0])}
                />
              </label>
              {proofPreview && (
                <img src={proofPreview} alt="Proof preview" className="mt-2 h-24 w-24 rounded-lg object-cover ring-1 ring-gray-200" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Internal note about this payment..."
                rows={3}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
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
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
