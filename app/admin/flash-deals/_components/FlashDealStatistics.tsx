'use client';

import { X, TrendingUp, DollarSign, Package, Users, Activity } from 'lucide-react';
import { useFlashDealStatistics } from '@/lib/hooks/admin/useAdminFlashDeals';

interface FlashDealStatisticsProps {
  isOpen: boolean;
  onClose: () => void;
  flashDealId: number;
  flashDealTitle: string;
}

export default function FlashDealStatistics({
  isOpen,
  onClose,
  flashDealId,
  flashDealTitle,
}: FlashDealStatisticsProps) {
  const { data: statsData, isLoading } = useFlashDealStatistics(flashDealId, { enabled: isOpen });

  if (!isOpen) return null;

  const stats = (statsData as any)?.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Flash Deal Statistics</h2>
              <p className="text-sm text-gray-500">{flashDealTitle}</p>
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
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
                </div>
                <p className="text-sm text-gray-600">Loading statistics...</p>
              </div>
            </div>
          ) : stats ? (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-600">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.total_orders || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-emerald-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-emerald-900">${stats.total_revenue || '0.00'}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-purple-600">Unique Customers</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.unique_customers || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-4 border border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-orange-600">Items Sold</p>
                      <p className="text-2xl font-bold text-orange-900">{stats.items_sold || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Performance */}
              {stats.product_performance && stats.product_performance.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Performance</h3>
                  <div className="rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Product</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Sold</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Revenue</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Avg. Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {stats.product_performance.map((product: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{product.product_name}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right">{product.quantity_sold}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right">${product.revenue}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right">${product.average_price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Metrics */}
              {stats.conversion_rate !== undefined && (
                <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                      <p className="text-xl font-bold text-gray-900">{stats.conversion_rate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Average Order Value</p>
                      <p className="text-xl font-bold text-gray-900">${stats.average_order_value || '0.00'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Discount Given</p>
                      <p className="text-xl font-bold text-gray-900">${stats.total_discount || '0.00'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Statistics Available</h3>
              <p className="text-sm text-gray-500">Statistics will appear once the flash deal has activity.</p>
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
