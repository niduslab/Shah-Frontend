'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Zap, Calendar, TrendingUp, ToggleLeft, ToggleRight } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import { 
  useAdminFlashDeals,
  useCreateFlashDeal, 
  useUpdateFlashDeal, 
  useDeleteFlashDeal,
  useToggleFlashDeal
} from '@/lib/hooks/admin/useAdminFlashDeals';
import FlashDealModal from './_components/FlashDealModal';
import DeleteConfirmModal from './_components/DeleteConfirmModal';
import FlashDealStatistics from './_components/FlashDealStatistics';

interface FlashDeal {
  id: number;
  title: string;
  description?: string;
  starts_at: string;
  ends_at: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  max_discount_amount?: number;
  quantity_limit?: number;
  per_user_limit?: number;
  is_active: boolean;
  priority: number;
  products?: Array<{
    id: number;
    product_id: number;
    flash_price: number;
    quantity_limit?: number;
    product?: {
      id: number;
      name: string;
      price: number;
    };
  }>;
}

export default function FlashDealsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedFlashDeal, setSelectedFlashDeal] = useState<FlashDeal | null>(null);

  const params = statusFilter === 'all' ? { page: currentPage, per_page: 15 } : { status: statusFilter, page: currentPage, per_page: 15 };
  const { data: flashDealsData, isLoading } = useAdminFlashDeals(params);
  const createMutation = useCreateFlashDeal();
  const updateMutation = useUpdateFlashDeal();
  const deleteMutation = useDeleteFlashDeal();
  const toggleMutation = useToggleFlashDeal();

  const flashDeals = (flashDealsData as any)?.data?.data || [];
  const paginationData = (flashDealsData as any)?.data;

  const filteredFlashDeals = flashDeals.filter((deal: FlashDeal) =>
    deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedFlashDeal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (deal: FlashDeal) => {
    setSelectedFlashDeal(deal);
    setIsModalOpen(true);
  };

  const handleDelete = (deal: FlashDeal) => {
    setSelectedFlashDeal(deal);
    setIsDeleteModalOpen(true);
  };

  const handleViewStats = (deal: FlashDeal) => {
    setSelectedFlashDeal(deal);
    setIsStatsModalOpen(true);
  };

  const handleToggle = async (deal: FlashDeal) => {
    try {
      await toggleMutation.mutateAsync(deal.id);
      toast.success(`Flash deal ${deal.is_active ? 'deactivated' : 'activated'}`, {
        description: `"${deal.title}" has been ${deal.is_active ? 'deactivated' : 'activated'}.`
      });
    } catch (error) {
      toast.error('Failed to toggle flash deal', {
        description: 'Please try again or contact support if the problem persists.'
      });
    }
  };

  const confirmDelete = async () => {
    if (selectedFlashDeal) {
      try {
        await deleteMutation.mutateAsync(selectedFlashDeal.id);
        toast.success('Flash deal deleted successfully', {
          description: `"${selectedFlashDeal.title}" has been removed.`
        });
        setIsDeleteModalOpen(false);
        setSelectedFlashDeal(null);
      } catch (error) {
        toast.error('Failed to delete flash deal', {
          description: 'Please try again or contact support if the problem persists.'
        });
      }
    }
  };

  const getStatusBadge = (deal: FlashDeal) => {
    const now = new Date();
    const startsAt = new Date(deal.starts_at);
    const endsAt = new Date(deal.ends_at);

    if (!deal.is_active) {
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-600/20">Inactive</span>;
    }

    if (now < startsAt) {
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 ring-1 ring-blue-600/20">Upcoming</span>;
    }

    if (now >= startsAt && now <= endsAt) {
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20">Active</span>;
    }

    return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 ring-1 ring-red-600/20">Expired</span>;
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading flash deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Flash Deals</h1>
              <p className="text-sm text-gray-600">Manage time-limited promotional deals</p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search flash deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    statusFilter === 'all'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    statusFilter === 'active'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    statusFilter === 'inactive'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2"
            >
              <Plus className="h-5 w-5" />
              Create Flash Deal
            </button>
          </div>
        </div>

        {/* Flash Deals List */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {!filteredFlashDeals || filteredFlashDeals.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <Zap className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {searchQuery ? 'No flash deals found' : 'No flash deals yet'}
              </h3>
              <p className="mb-8 text-gray-500">
                {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first flash deal'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
                >
                  <Plus className="h-5 w-5" />
                  Create Flash Deal
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredFlashDeals.map((deal: FlashDeal) => (
                <div
                  key={deal.id}
                  className="group p-6 transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{deal.title}</h3>
                        {getStatusBadge(deal)}
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 ring-1 ring-purple-600/20">
                          {deal.discount_type === 'percentage' ? `${deal.discount_value}% OFF` : `$${deal.discount_value} OFF`}
                        </span>
                      </div>

                      {deal.description && (
                        <p className="text-sm text-gray-600 mb-3">{deal.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(deal.starts_at)} - {formatDate(deal.ends_at)}</span>
                        </div>
                        {deal.products && deal.products.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="h-4 w-4" />
                            <span>{deal.products.length} {deal.products.length === 1 ? 'product' : 'products'}</span>
                          </div>
                        )}
                        {deal.quantity_limit && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                            Limit: {deal.quantity_limit}
                          </span>
                        )}
                        {deal.per_user_limit && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                            Per User: {deal.per_user_limit}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(deal)}
                        className={`rounded-lg p-2 transition-all focus:outline-none focus:ring-2 ${
                          deal.is_active
                            ? 'text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500'
                            : 'text-gray-400 hover:bg-gray-50 focus:ring-gray-400'
                        }`}
                        title={deal.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {deal.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleViewStats(deal)}
                        className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="View statistics"
                      >
                        <TrendingUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(deal)}
                        className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
                        title="Edit flash deal"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(deal)}
                        className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete flash deal"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {paginationData && paginationData.last_page > 1 && (
            <Pagination
              currentPage={paginationData.current_page}
              lastPage={paginationData.last_page}
              total={paginationData.total}
              perPage={paginationData.per_page}
              from={paginationData.from}
              to={paginationData.to}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>

        {/* Modals */}
        <FlashDealModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedFlashDeal(null);
          }}
          flashDeal={selectedFlashDeal}
          onSubmit={async (data) => {
            try {
              if (selectedFlashDeal) {
                await updateMutation.mutateAsync({ id: selectedFlashDeal.id, data });
                toast.success('Flash deal updated successfully', {
                  description: `"${data.title}" has been updated.`
                });
              } else {
                await createMutation.mutateAsync(data);
                toast.success('Flash deal created successfully', {
                  description: `"${data.title}" has been created.`
                });
              }
              setIsModalOpen(false);
              setSelectedFlashDeal(null);
            } catch (error) {
              toast.error(selectedFlashDeal ? 'Failed to update flash deal' : 'Failed to create flash deal', {
                description: 'Please try again or contact support if the problem persists.'
              });
            }
          }}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedFlashDeal(null);
          }}
          onConfirm={confirmDelete}
          flashDealTitle={selectedFlashDeal?.title || ''}
          isLoading={deleteMutation.isPending}
        />

        {selectedFlashDeal && (
          <FlashDealStatistics
            isOpen={isStatsModalOpen}
            onClose={() => {
              setIsStatsModalOpen(false);
              setSelectedFlashDeal(null);
            }}
            flashDealId={selectedFlashDeal.id}
            flashDealTitle={selectedFlashDeal.title}
          />
        )}
      </div>
    </div>
  );
}
