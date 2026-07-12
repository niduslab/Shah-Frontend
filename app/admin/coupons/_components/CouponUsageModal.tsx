'use client';

import { useState } from 'react';
import { X, TrendingUp, User, Calendar, DollarSign, ShoppingCart } from 'lucide-react';
import { useCouponUsageHistory } from '@/lib/hooks/admin/useCoupons';
import Pagination from '@/components/ui/Pagination';
import { formatCurrency } from '@/lib/utils/currency';

interface CouponUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponId: number;
  couponCode: string;
}

export default function CouponUsageModal({ isOpen, onClose, couponId, couponCode }: CouponUsageModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: usageData, isLoading } = useCouponUsageHistory(
    couponId,
    { page: currentPage, per_page: 10 },
    { enabled: isOpen } as any
  );

  const usageHistory = (usageData as any)?.data?.data || [];
  const paginationData = (usageData as any)?.data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Usage History</h2>
              <p className="text-sm text-gray-500">
                Coupon: <span className="font-mono font-semibold">{couponCode}</span>
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

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
                </div>
                <p className="text-sm text-gray-600">Loading usage history...</p>
              </div>
            </div>
          ) : usageHistory.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No usage history</h3>
              <p className="text-gray-500">This coupon hasn't been used yet</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {usageHistory.map((usage: any) => (
                  <div
                    key={usage.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* User Info */}
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {usage.user?.first_name} {usage.user?.last_name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{usage.user?.email}</p>
                          </div>
                        </div>

                        {/* Order Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <ShoppingCart className="h-4 w-4" />
                            <span>Order: <span className="font-mono font-medium">{usage.order?.order_number || 'N/A'}</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span>Discount: <span className="font-semibold text-emerald-600">{formatCurrency(usage.discount_amount || '0.00')}</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(usage.used_at || usage.created_at)}</span>
                          </div>
                        </div>

                        {/* Order Status */}
                        {usage.order?.status && (
                          <div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              usage.order.status === 'delivered' 
                                ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20'
                                : usage.order.status === 'cancelled'
                                ? 'bg-red-100 text-red-700 ring-1 ring-red-600/20'
                                : usage.order.status === 'processing'
                                ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20'
                                : 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20'
                            }`}>
                              {usage.order.status.charAt(0).toUpperCase() + usage.order.status.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {paginationData && paginationData.last_page > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={paginationData.current_page}
                    lastPage={paginationData.last_page}
                    total={paginationData.total}
                    perPage={paginationData.per_page}
                    from={paginationData.from}
                    to={paginationData.to}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
