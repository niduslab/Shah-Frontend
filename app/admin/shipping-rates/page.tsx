'use client';

import { useState } from 'react';
import { useShippingRates, useDeleteShippingRate } from '@/lib/hooks/admin/useShipping';
import { Pencil, Trash2, Plus, Truck, Package } from 'lucide-react';
import ShippingRateModal from './_components/ShippingRateModal';
import DeleteConfirmModal from './_components/DeleteConfirmModal';

export default function ShippingRatesPage() {
  const [filters, setFilters] = useState({
    method: '',
    is_active: '',
  });
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState<any>(null);

  const { data, isLoading } = useShippingRates({ ...filters, page, per_page: 15 });
  const deleteRate = useDeleteShippingRate();

  const rates = (data as any)?.data?.data || [];
  const pagination = (data as any)?.data?.pagination;

  const handleEdit = (rate: any) => {
    setSelectedRate(rate);
    setIsModalOpen(true);
  };

  const handleDelete = (rate: any) => {
    setSelectedRate(rate);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedRate) {
      await deleteRate.mutateAsync(selectedRate.id);
      setIsDeleteModalOpen(false);
      setSelectedRate(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRate(null);
  };

  const getMethodBadge = (method: string) => {
    const badges = {
      shah_sports_team: (
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 ring-1 ring-blue-600/20">
          <Truck className="h-3 w-3" />
          Shah Sports Team
        </span>
      ),
      pathao_courier: (
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 ring-1 ring-purple-600/20">
          <Package className="h-3 w-3" />
          Pathao Courier
        </span>
      ),
      standard: (
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 ring-1 ring-gray-600/20">
          <Truck className="h-3 w-3" />
          Standard Shipping
        </span>
      ),
    };
    return badges[method as keyof typeof badges] || method;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipping Rates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage shipping rates for different methods and zones
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Shipping Rate
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Method
            </label>
            <select
              value={filters.method}
              onChange={(e) => setFilters({ ...filters, method: e.target.value })}
              className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">All Methods</option>
              <option value="shah_sports_team">Shah Sports Team</option>
              <option value="pathao_courier">Pathao Courier</option>
              <option value="standard">Standard Shipping</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filters.is_active}
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
              className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sm border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Shipping Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Base Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Free Shipping
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Weight Pricing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : rates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                    No shipping rates found
                  </td>
                </tr>
              ) : (
                rates.map((rate: any) => (
                  <tr key={rate.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {rate.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {getMethodBadge(rate.method)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {rate.shipping_class?.name || 'Default (no class)'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      ৳{parseFloat(rate.base_cost).toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {parseFloat(rate.free_shipping_min_order) > 0
                        ? `৳${parseFloat(rate.free_shipping_min_order).toFixed(2)}`
                        : 'Disabled'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {rate.weight_pricing_enabled ? (
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 ring-1 ring-blue-600/20">
                          Enabled
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-500 ring-1 ring-gray-600/20">
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {rate.is_active ? (
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 ring-1 ring-green-600/20">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 ring-1 ring-gray-600/20">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(rate)}
                          className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rate)}
                          className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex flex-col gap-3 border-t border-gray-200 bg-white px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-500">
              Showing {pagination.from} to {pagination.to} of {pagination.total} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="rounded-sm border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.last_page}
                className="rounded-sm border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ShippingRateModal
          rate={selectedRate}
          onClose={handleModalClose}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          title="Delete Shipping Rate"
          message={`Are you sure you want to delete "${selectedRate?.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedRate(null);
          }}
          isLoading={deleteRate.isPending}
        />
      )}
    </div>
  );
}
