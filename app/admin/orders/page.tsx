'use client';

import { useState, useEffect, useRef } from 'react';
import { Package, Search, Eye, X, Truck, FileText, Calendar, DollarSign, User, MapPin, Filter, Download } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import api from '@/lib/api/axios';
import { 
  useAdminOrders,
  useAdminOrder,
  useUpdateOrderStatus,
  useCancelAdminOrder,
  useAssignTracking,
  useUpdateOrderNotes
} from '@/lib/hooks/admin/useAdminOrders';
import OrderDetailsModal from '@/app/admin/orders/_components/OrderDetailsModal';
import CancelOrderModal from '@/app/admin/orders/_components/CancelOrderModal';
import TrackingModal from '@/app/admin/orders/_components/TrackingModal';
import NotesModal from '@/app/admin/orders/_components/NotesModal';
import StatusUpdateModal from '@/app/admin/orders/_components/StatusUpdateModal';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
type OrderType = 'regular' | 'preorder';

interface Order {
  id: number;
  order_number: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  order_type: OrderType;
  subtotal: string | number;
  discount: string | number;
  discount_amount?: string | number;
  tax: string | number;
  tax_amount?: string | number;
  shipping_cost: string | number;
  total: string | number;
  total_amount?: string | number;
  tracking_number?: string;
  carrier?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<OrderType | 'all'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filters = {
    page: currentPage,
    per_page: perPage,
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(paymentFilter !== 'all' && { payment_status: paymentFilter }),
    ...(orderTypeFilter !== 'all' && { order_type: orderTypeFilter }),
    ...(dateFrom && { date_from: dateFrom }),
    ...(dateTo && { date_to: dateTo }),
    ...(debouncedSearch && { search: debouncedSearch })
  };

  const { data: ordersData, isLoading, isFetching } = useAdminOrders(filters);
  const updateStatusMutation = useUpdateOrderStatus();
  const cancelMutation = useCancelAdminOrder();
  const trackingMutation = useAssignTracking();
  const notesMutation = useUpdateOrderNotes();

  const orders = (ordersData as any)?.data?.data || [];
  const paginationData = (ordersData as any)?.data;

  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateStatus = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsStatusModalOpen(true);
  };

  const handleCancelOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsCancelModalOpen(true);
  };

  const handleAssignTracking = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsTrackingModalOpen(true);
  };

  const handleUpdateNotes = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsNotesModalOpen(true);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
      confirmed: 'bg-blue-100 text-blue-700 ring-blue-600/20',
      processing: 'bg-purple-100 text-purple-700 ring-purple-600/20',
      shipped: 'bg-indigo-100 text-indigo-700 ring-indigo-600/20',
      delivered: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
      cancelled: 'bg-red-100 text-red-700 ring-red-600/20'
    };

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
      paid: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
      failed: 'bg-red-100 text-red-700 ring-red-600/20',
      refunded: 'bg-gray-100 text-gray-700 ring-gray-600/20'
    };

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getOrderTypeBadge = (type: OrderType) => {
    return type === 'preorder' ? (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 ring-1 ring-orange-600/20">
        Pre-order
      </span>
    ) : null;
  };

  const formatDate = (dateString: string) => {
    if (!mounted) return ''; // Return empty string during SSR
    
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  };

  const formatCurrency = (amount: number) => {
    if (!mounted) return ''; // Return empty string during SSR
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setPaymentFilter('all');
    setOrderTypeFilter('all');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
    setDebouncedSearch('');
  };

  const handleDownloadInvoice = async (orderNumber: string) => {
    try {
      toast.info('Downloading invoice...', {
        description: 'Please wait while we prepare your invoice.'
      });

      const response = await api.get(`/api/admin/orders/${orderNumber}/invoice`, {
        responseType: 'blob',
      });

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Invoice downloaded', {
        description: `Invoice for order ${orderNumber} has been downloaded.`
      });
    } catch (error: any) {
      console.error('Failed to download invoice:', error);
      toast.error('Failed to download invoice', {
        description: error.response?.data?.message || 'Please try again or contact support if the problem persists.'
      });
    }
  };

  if (isLoading && !ordersData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading orders...</p>
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
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-sm text-gray-600">View and manage customer orders</p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
          <div className="flex flex-col gap-4">
            {/* Search and Filter Toggle */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number or customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-10 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
                {isFetching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-[#FF6F00]"></div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                  showFilters
                    ? 'bg-[#FF6F00] text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="h-5 w-5" />
                Filters
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Order Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Payment Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Payment Status</label>
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | 'all')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                    >
                      <option value="all">All Payments</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  {/* Order Type Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Order Type</label>
                    <select
                      value={orderTypeFilter}
                      onChange={(e) => setOrderTypeFilter(e.target.value as OrderType | 'all')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                    >
                      <option value="all">All Types</option>
                      <option value="regular">Regular</option>
                      <option value="preorder">Pre-order</option>
                    </select>
                  </div>

                  {/* Date From */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">From</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                    />
                  </div>

                  {/* Date To */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">To</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {!orders || orders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No orders found</h3>
              <p className="text-gray-500">
                {searchQuery || statusFilter !== 'all' || paymentFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Orders will appear here once customers place them'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th> */}
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order: Order) => (
                    <tr key={order.id} className="group hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono font-semibold text-gray-900">{order.order_number}</span>
                          <div className="flex items-center gap-2 mt-1">
                            {getOrderTypeBadge(order.order_type)}
                            {order.tracking_number && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <Truck className="h-3 w-3" />
                                {order.tracking_number}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white text-xs font-semibold">
                            {order.user ? (
                              `${order.user.first_name?.charAt(0) || ''}${order.user.last_name?.charAt(0) || ''}`
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.user ? (
                                `${order.user.first_name || ''} ${order.user.last_name || ''}`
                              ) : (
                                'Guest / POS Order'
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.user?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4">
                        {getPaymentBadge(order.payment_status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(parseFloat(String(order.total_amount || order.total || '0')))}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.created_at)}
                        </div>
                      </td> */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(order.id)}
                            className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="View details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(order.order_number)}
                            className="rounded-lg p-2 text-green-600 transition-all hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                            title="Download invoice"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                          {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(order.id)}
                                className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
                                title="Update status"
                              >
                                <Package className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleAssignTracking(order.id)}
                                className="rounded-lg p-2 text-indigo-600 transition-all hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                title="Assign tracking"
                              >
                                <Truck className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                title="Cancel order"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleUpdateNotes(order.id)}
                            className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            title="Update notes"
                          >
                            <FileText className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {paginationData && paginationData.last_page > 1 && (
            <div className="border-t border-gray-200">
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

          {/* Per Page Selector */}
          {orders && orders.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Show per page:</label>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing per page
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              {paginationData && (
                <div className="text-sm text-gray-600">
                  Showing {paginationData.from} to {paginationData.to} of {paginationData.total} orders
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {selectedOrderId && (
          <>
            <OrderDetailsModal
              isOpen={isDetailsModalOpen}
              onClose={() => {
                setIsDetailsModalOpen(false);
                setSelectedOrderId(null);
              }}
              orderId={selectedOrderId}
            />

            <StatusUpdateModal
              isOpen={isStatusModalOpen}
              onClose={() => {
                setIsStatusModalOpen(false);
                setSelectedOrderId(null);
              }}
              orderId={selectedOrderId}
              onSubmit={async (status) => {
                try {
                  await updateStatusMutation.mutateAsync({ id: selectedOrderId, status });
                  toast.success('Order status updated', {
                    description: `Order status has been updated to ${status}.`
                  });
                  setIsStatusModalOpen(false);
                  setSelectedOrderId(null);
                } catch (error) {
                  toast.error('Failed to update status', {
                    description: 'Please try again or contact support if the problem persists.'
                  });
                }
              }}
            />

            <CancelOrderModal
              isOpen={isCancelModalOpen}
              onClose={() => {
                setIsCancelModalOpen(false);
                setSelectedOrderId(null);
              }}
              orderId={selectedOrderId}
              onSubmit={async (reason) => {
                try {
                  await cancelMutation.mutateAsync({ id: selectedOrderId, reason });
                  toast.success('Order cancelled', {
                    description: 'The order has been cancelled successfully.'
                  });
                  setIsCancelModalOpen(false);
                  setSelectedOrderId(null);
                } catch (error) {
                  toast.error('Failed to cancel order', {
                    description: 'Please try again or contact support if the problem persists.'
                  });
                }
              }}
            />

            <TrackingModal
              isOpen={isTrackingModalOpen}
              onClose={() => {
                setIsTrackingModalOpen(false);
                setSelectedOrderId(null);
              }}
              orderId={selectedOrderId}
              onSubmit={async (data) => {
                try {
                  await trackingMutation.mutateAsync({ id: selectedOrderId, ...data });
                  toast.success('Tracking information added', {
                    description: 'Tracking number has been assigned to the order.'
                  });
                  setIsTrackingModalOpen(false);
                  setSelectedOrderId(null);
                } catch (error) {
                  toast.error('Failed to assign tracking', {
                    description: 'Please try again or contact support if the problem persists.'
                  });
                }
              }}
            />

            <NotesModal
              isOpen={isNotesModalOpen}
              onClose={() => {
                setIsNotesModalOpen(false);
                setSelectedOrderId(null);
              }}
              orderId={selectedOrderId}
              onSubmit={async (notes) => {
                try {
                  await notesMutation.mutateAsync({ id: selectedOrderId, notes });
                  toast.success('Notes updated', {
                    description: 'Order notes have been updated successfully.'
                  });
                  setIsNotesModalOpen(false);
                  setSelectedOrderId(null);
                } catch (error) {
                  toast.error('Failed to update notes', {
                    description: 'Please try again or contact support if the problem persists.'
                  });
                }
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
