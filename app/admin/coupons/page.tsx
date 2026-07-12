'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Ticket, Calendar, TrendingUp, ToggleLeft, ToggleRight, Copy } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import { 
  useAdminCoupons,
  useCreateCoupon, 
  useUpdateCoupon, 
  useDeleteCoupon
} from '@/lib/hooks/admin/useCoupons';
import CouponModal from '@/app/admin/coupons/_components/CouponModal';
import DeleteConfirmModal from '@/app/admin/coupons/_components/DeleteConfirmModal';
import CouponUsageModal from '@/app/admin/coupons/_components/CouponUsageModal';
import { formatCurrency } from '@/lib/utils/currency';

interface Coupon {
  id: number;
  code: string;
  name?: string;
  discount_type: 'percentage' | 'fixed' | 'free_shipping';
  discount_value: number;
  applies_to: 'all' | 'products' | 'brands' | 'categories';
  min_purchase_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  once_per_customer?: boolean;
  times_used: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  products?: any[];
  brands?: any[];
  categories?: any[];
}

export default function CouponsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const params = { page: currentPage, per_page: 15 };
  const { data: couponsData, isLoading } = useAdminCoupons(params);
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();

  const coupons = (couponsData as any)?.data?.data || [];
  const paginationData = (couponsData as any)?.data;

  const filteredCoupons = coupons.filter((coupon: Coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && coupon.is_active) ||
      (statusFilter === 'inactive' && !coupon.is_active);
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setSelectedCoupon(null);
    setIsModalOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteModalOpen(true);
  };

  const handleViewUsage = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsUsageModalOpen(true);
  };

  const handleToggle = async (coupon: Coupon) => {
    try {
      await updateMutation.mutateAsync({ 
        id: coupon.id, 
        data: { is_active: !coupon.is_active } 
      });
      toast.success(`Coupon ${coupon.is_active ? 'deactivated' : 'activated'}`, {
        description: `"${coupon.code}" has been ${coupon.is_active ? 'deactivated' : 'activated'}.`
      });
    } catch (error) {
      toast.error('Failed to toggle coupon', {
        description: 'Please try again or contact support if the problem persists.'
      });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied', {
      description: `"${code}" has been copied to clipboard.`
    });
  };

  const confirmDelete = async () => {
    if (selectedCoupon) {
      try {
        await deleteMutation.mutateAsync(selectedCoupon.id);
        toast.success('Coupon deleted successfully', {
          description: `"${selectedCoupon.code}" has been removed.`
        });
        setIsDeleteModalOpen(false);
        setSelectedCoupon(null);
      } catch (error) {
        toast.error('Failed to delete coupon', {
          description: 'Please try again or contact support if the problem persists.'
        });
      }
    }
  };

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date();
    const startsAt = new Date(coupon.starts_at);
    const expiresAt = new Date(coupon.expires_at);

    if (!coupon.is_active) {
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-600/20">Inactive</span>;
    }

    if (now < startsAt) {
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 ring-1 ring-blue-600/20">Upcoming</span>;
    }

    if (now >= startsAt && now <= expiresAt) {
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20">Active</span>;
    }

    return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 ring-1 ring-red-600/20">Expired</span>;
  };

  const getTypeBadge = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 ring-1 ring-purple-600/20">{coupon.discount_value}% OFF</span>;
    }
    if (coupon.discount_type === 'fixed') {
      return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 ring-1 ring-indigo-600/20">{formatCurrency(coupon.discount_value)} OFF</span>;
    }
    return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-teal-100 text-teal-700 ring-1 ring-teal-600/20">Free Shipping</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coupons & Discounts</h1>
              <p className="text-sm text-gray-600">Manage discount codes and promotional offers</p>
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
                  placeholder="Search coupon codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 overflow-x-auto">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    statusFilter === 'all'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    statusFilter === 'active'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2 sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              Create Coupon
            </button>
          </div>
        </div>

        {/* Coupons List */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {!filteredCoupons || filteredCoupons.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <Ticket className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {searchQuery ? 'No coupons found' : 'No coupons yet'}
              </h3>
              <p className="mb-8 text-gray-500">
                {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first coupon'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
                >
                  <Plus className="h-5 w-5" />
                  Create Coupon
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredCoupons.map((coupon: Coupon) => (
                <div
                  key={coupon.id}
                  className="group p-6 transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 font-mono truncate">{coupon.code}</h3>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="rounded-lg p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
                          title="Copy code"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        {getStatusBadge(coupon)}
                        {getTypeBadge(coupon)}
                      </div>

                      {coupon.name && (
                        <p className="text-sm text-gray-600 mb-3">{coupon.name}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(coupon.starts_at)} - {formatDate(coupon.expires_at)}</span>
                        </div>
                        {coupon.times_used > 0 && (
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="h-4 w-4" />
                            <span>Used {coupon.times_used} {coupon.usage_limit ? `/ ${coupon.usage_limit}` : ''} times</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {coupon.min_purchase_amount && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                            Min: {formatCurrency(coupon.min_purchase_amount)}
                          </span>
                        )}
                        {coupon.max_discount_amount && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                            Max: {formatCurrency(coupon.max_discount_amount)}
                          </span>
                        )}
                        {coupon.once_per_customer && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                            Once Per Customer
                          </span>
                        )}
                        {coupon.applies_to === 'all' ? (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            All Products
                          </span>
                        ) : (
                          <>
                            {coupon.products && coupon.products.length > 0 && (
                              <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                                {coupon.products.length} {coupon.products.length === 1 ? 'Product' : 'Products'}
                              </span>
                            )}
                            {coupon.brands && coupon.brands.length > 0 && (
                              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                                {coupon.brands.length} {coupon.brands.length === 1 ? 'Brand' : 'Brands'}
                              </span>
                            )}
                            {coupon.categories && coupon.categories.length > 0 && (
                              <span className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                                {coupon.categories.length} {coupon.categories.length === 1 ? 'Category' : 'Categories'}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                      <button
                        onClick={() => handleToggle(coupon)}
                        className={`rounded-lg p-2 transition-all focus:outline-none focus:ring-2 ${
                          coupon.is_active
                            ? 'text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500'
                            : 'text-gray-400 hover:bg-gray-50 focus:ring-gray-400'
                        }`}
                        title={coupon.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {coupon.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleViewUsage(coupon)}
                        className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="View usage history"
                      >
                        <TrendingUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
                        title="Edit coupon"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon)}
                        className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete coupon"
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
        <CouponModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCoupon(null);
          }}
          coupon={selectedCoupon}
          onSubmit={async (data) => {
            try {
              if (selectedCoupon) {
                await updateMutation.mutateAsync({ id: selectedCoupon.id, data });
                toast.success('Coupon updated successfully', {
                  description: `"${data.code}" has been updated.`
                });
              } else {
                await createMutation.mutateAsync(data);
                toast.success('Coupon created successfully', {
                  description: `"${data.code}" has been created.`
                });
              }
              setIsModalOpen(false);
              setSelectedCoupon(null);
            } catch (error) {
              toast.error(selectedCoupon ? 'Failed to update coupon' : 'Failed to create coupon', {
                description: 'Please try again or contact support if the problem persists.'
              });
            }
          }}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedCoupon(null);
          }}
          onConfirm={confirmDelete}
          couponCode={selectedCoupon?.code || ''}
          isLoading={deleteMutation.isPending}
        />

        {selectedCoupon && (
          <CouponUsageModal
            isOpen={isUsageModalOpen}
            onClose={() => {
              setIsUsageModalOpen(false);
              setSelectedCoupon(null);
            }}
            couponId={selectedCoupon.id}
            couponCode={selectedCoupon.code}
          />
        )}
      </div>
    </div>
  );
}
