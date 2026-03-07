'use client';

import { useState } from 'react';
import { X, History, Calendar, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { useInventoryLogs } from '@/lib/hooks/admin/useInventory';
import Pagination from '@/components/ui/Pagination';

interface InventoryLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
}

export default function InventoryLogsModal({ isOpen, onClose, productId, productName }: InventoryLogsModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [reasonFilter, setReasonFilter] = useState<string>('');

  const filters = {
    product_id: productId,
    reason: reasonFilter || undefined,
    per_page: 15,
    page: currentPage,
  };

  const { data: logsData, isLoading } = useInventoryLogs(filters, { enabled: isOpen });

  const logs = (logsData as any)?.data?.data || [];
  const paginationData = (logsData as any)?.data;

  const getReasonBadge = (reason: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      sale: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sale' },
      adjustment: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Adjustment' },
      damage: { bg: 'bg-red-100', text: 'text-red-700', label: 'Damage' },
      return: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Return' },
      recount: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Recount' },
      other: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Other' },
    };

    const badge = badges[reason] || badges.other;
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text} ring-1 ring-inset ring-${badge.text}/20`}>
        {badge.label}
      </span>
    );
  };

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
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <History className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Inventory Logs</h2>
              <p className="text-sm text-gray-500">{productName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Filter by Reason:</label>
            <select
              value={reasonFilter}
              onChange={(e) => {
                setReasonFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Reasons</option>
              <option value="sale">Sale</option>
              <option value="adjustment">Adjustment</option>
              <option value="damage">Damage</option>
              <option value="return">Return</option>
              <option value="recount">Recount</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
                </div>
                <p className="text-sm text-gray-600">Loading logs...</p>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <History className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Logs Found</h3>
              <p className="text-sm text-gray-500">
                {reasonFilter ? 'No logs found for the selected filter.' : 'No inventory logs available for this product.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log: any) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        log.quantity_change > 0 ? 'bg-emerald-100' : 'bg-red-100'
                      }`}>
                        {log.quantity_change > 0 ? (
                          <TrendingUp className={`h-5 w-5 ${log.quantity_change > 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-lg font-bold ${
                            log.quantity_change > 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {log.quantity_change > 0 ? '+' : ''}{log.quantity_change}
                          </span>
                          {getReasonBadge(log.reason)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(log.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Stock After</p>
                      <p className="text-lg font-semibold text-gray-900">{log.quantity_after}</p>
                    </div>
                  </div>

                  {log.variation && (
                    <div className="mb-2 flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Variation: {Object.entries(log.variation.attributes || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </span>
                    </div>
                  )}

                  {log.notes && (
                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                      <p className="text-sm text-gray-700">{log.notes}</p>
                    </div>
                  )}

                  {log.user && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <span>By: {log.user.first_name} {log.user.last_name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

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

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
