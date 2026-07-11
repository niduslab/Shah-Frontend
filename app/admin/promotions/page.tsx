'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Tag, Calendar, ToggleLeft, ToggleRight, Package } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import { 
  useAdminPromotions,
  useCreatePromotion, 
  useUpdatePromotion, 
  useDeletePromotion,
  useTogglePromotionStatus,
  PromotionData
} from '@/lib/hooks/admin/usePromotions';
import PromotionModal from '@/app/admin/promotions/_components/PromotionModal';
import DeleteConfirmModal from '@/app/admin/promotions/_components/DeleteConfirmModal';
import { formatCurrency } from '@/lib/utils/currency';

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionData | null>(null);

  const params = { page: currentPage, per_page: 15, search: searchQuery };
  const { data: promotionsData, isLoading } = useAdminPromotions(params);
  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();
  const deleteMutation = useDeletePromotion();
  const toggleStatusMutation = useTogglePromotionStatus();

  const promotions = (promotionsData as any)?.data?.data || [];
  const paginationData = (promotionsData as any)?.data;

  const filteredPromotions = promotions.filter((promotion: PromotionData) => {
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && promotion.is_active) ||
      (statusFilter === 'inactive' && !promotion.is_active);
    return matchesStatus;
  });

  const handleCreate = () => {
    setSelectedPromotion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (promotion: PromotionData) => {
    setSelectedPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleDelete = (promotion: PromotionData) => {
    setSelectedPromotion(promotion);
    setIsDeleteModalOpen(true);
  };

  const handleToggle = async (promotion: PromotionData) => {
    try {
      await toggleStatusMutation.mutateAsync(promotion.id!);
      toast.success(`Promotion ${promotion.is_active ? 'deactivated' : 'activated'}`, {
        description: `"${promotion.name}" has been ${promotion.is_active ? 'deactivated' : 'activated'}.`
      });
    } catch (error) {
      toast.error('Failed to toggle promotion', {
        description: 'Please try again or contact support if the problem persists.'
      });
    }
  };

  const confirmDelete = async () => {
    if (selectedPromotion) {
      try {
        await deleteMutation.mutateAsync(selectedPromotion.id!);
        toast.success('Promotion deleted successfully', {
          description: `"${selectedPromotion.name}" has been removed.`
        });
        setIsDeleteModalOpen(false);
        setSelectedPromotion(null);
      } catch (error) {
        toast.error('Failed to delete promotion', {
          description: 'Please try again or contact support if the problem persists.'
        });
      }
    }
  };

  const getStatusBadge = (promotion: PromotionData) => {
    const now = new Date();
    const startsAt = new Date(promotion.starts_at);
    const endsAt = new Date(promotion.ends_at);

    if (!promotion.is_active) {
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

  const getTypeBadge = (promotion: PromotionData) => {
    const typeLabels: Record<string, string> = {
      percentage: 'Percentage',
      fixed_amount: 'Fixed Amount',
      flash_sale: 'Flash Sale',
      combo_offer: 'Combo Offer',
      free_delivery: 'Free Delivery'
    };
    
    const colors: Record<string, string> = {
      percentage: 'bg-purple-100 text-purple-700 ring-purple-600/20',
      fixed_amount: 'bg-indigo-100 text-indigo-700 ring-indigo-600/20',
      flash_sale: 'bg-red-100 text-red-700 ring-red-600/20',
      combo_offer: 'bg-teal-100 text-teal-700 ring-teal-600/20',
      free_delivery: 'bg-green-100 text-green-700 ring-green-600/20'
    };

    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${colors[promotion.promotion_type] || 'bg-gray-100 text-gray-700 ring-gray-600/20'}`}>
      {typeLabels[promotion.promotion_type] || promotion.promotion_type}
    </span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading promotions...</p>
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
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
              <p className="text-sm text-gray-600">Manage promotional campaigns and offers</p>
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
                  placeholder="Search promotions..."
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
              Create Promotion
            </button>
          </div>
        </div>

        {/* Promotions List */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {!filteredPromotions || filteredPromotions.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <Tag className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {searchQuery ? 'No promotions found' : 'No promotions yet'}
              </h3>
              <p className="mb-8 text-gray-500">
                {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first promotion'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
                >
                  <Plus className="h-5 w-5" />
                  Create Promotion
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredPromotions.map((promotion: PromotionData) => (
                <div
                  key={promotion.id}
                  className="group p-6 transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{promotion.name}</h3>
                        {getStatusBadge(promotion)}
                        {getTypeBadge(promotion)}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(promotion.starts_at)} - {formatDate(promotion.ends_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Package className="h-4 w-4" />
                          <span>
                            {promotion.applies_to === 'all_products' && 'All Products'}
                            {promotion.applies_to === 'specific_products' && `${promotion.product_ids?.length || 0} Products`}
                            {promotion.applies_to === 'specific_brands' && `${promotion.brand_ids?.length || 0} Brands`}
                            {promotion.applies_to === 'specific_categories' && `${promotion.category_ids?.length || 0} Categories`}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {promotion.promotion_type === 'percentage' && `${promotion.discount_value}% Off`}
                          {promotion.promotion_type === 'fixed_amount' && `${formatCurrency(promotion.discount_value)} Off`}
                          {promotion.promotion_type === 'free_delivery' && 'Free Delivery'}
                          {promotion.promotion_type === 'flash_sale' && 'Flash Sale'}
                          {promotion.promotion_type === 'combo_offer' && 'Combo Offer'}
                        </span>
                        {(promotion.min_purchase_amount ?? 0) > 0 && (
                          <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                            Min Purchase: {formatCurrency(promotion.min_purchase_amount ?? 0)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(promotion)}
                        className={`rounded-lg p-2 transition-all focus:outline-none focus:ring-2 ${
                          promotion.is_active
                            ? 'text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500'
                            : 'text-gray-400 hover:bg-gray-50 focus:ring-gray-400'
                        }`}
                        title={promotion.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {promotion.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleEdit(promotion)}
                        className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
                        title="Edit promotion"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(promotion)}
                        className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete promotion"
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
        <PromotionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPromotion(null);
          }}
          promotion={selectedPromotion}
          onSubmit={async (data) => {
            try {
              if (selectedPromotion) {
                await updateMutation.mutateAsync({ id: selectedPromotion.id!, data });
                toast.success('Promotion updated successfully', {
                  description: `"${data.name}" has been updated.`
                });
              } else {
                await createMutation.mutateAsync(data);
                toast.success('Promotion created successfully', {
                  description: `"${data.name}" has been created.`
                });
              }
              setIsModalOpen(false);
              setSelectedPromotion(null);
            } catch (error) {
              toast.error(selectedPromotion ? 'Failed to update promotion' : 'Failed to create promotion', {
                description: 'Please try again or contact support if the problem persists.'
              });
            }
          }}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPromotion(null);
          }}
          onConfirm={confirmDelete}
          promotionName={selectedPromotion?.name || ''}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
