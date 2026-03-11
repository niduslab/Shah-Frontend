'use client';

import { useState } from 'react';
import { useOrders, useCancelOrder, useDownloadInvoice } from '@/lib/hooks/user';
import Link from 'next/link';
import { 
  Package, 
  Eye, 
  Download, 
  X, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  processing: { color: 'bg-purple-100 text-purple-800', icon: Package },
  shipped: { color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: ordersData, isLoading, error } = useOrders({
    page: currentPage,
    per_page: 10,
    ...(statusFilter && { status: statusFilter }),
    ...(searchTerm && { search: searchTerm })
  });

  const cancelOrderMutation = useCancelOrder();
  const downloadInvoice = useDownloadInvoice;

  // Handle different API response structures
  let orders: any[] = [];
  let pagination: any = {};

  if (ordersData) {
    // Try different response structures
    if (ordersData.data?.data) {
      // Laravel paginated response
      orders = ordersData.data.data;
      pagination = ordersData.data;
    } else if (ordersData.data && Array.isArray(ordersData.data)) {
      // Direct array in data
      orders = ordersData.data;
      pagination = ordersData;
    } else if (Array.isArray(ordersData)) {
      // Direct array response
      orders = ordersData;
      pagination = { total: ordersData.length, current_page: 1, last_page: 1 };
    } else {
      // Fallback
      orders = [];
      pagination = {};
    }
  }

  // Mock data for testing if no real data
  if (!isLoading && !error && orders.length === 0) {
    orders = [
      {
        id: 1,
        order_number: 'SS123456',
        status: 'delivered',
        payment_status: 'paid',
        total: '299.99',
        items_count: 2,
        created_at: '2024-03-01T10:30:00Z'
      },
      {
        id: 2,
        order_number: 'SS123457',
        status: 'processing',
        payment_status: 'paid',
        total: '149.50',
        items_count: 1,
        created_at: '2024-03-05T14:20:00Z'
      },
      {
        id: 3,
        order_number: 'SS123458',
        status: 'pending',
        payment_status: 'pending',
        total: '89.99',
        items_count: 3,
        created_at: '2024-03-08T09:15:00Z'
      }
    ];
    pagination = { total: 3, current_page: 1, last_page: 1 };
  }

  console.log('Orders API Response:', ordersData); // Debug log
  console.log('Processed Orders:', orders); // Debug log

  const handleCancelOrder = async (orderNumber: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrderMutation.mutateAsync({
          orderNumber,
          reason: 'Customer requested cancellation'
        });
      } catch (error) {
        console.error('Failed to cancel order:', error);
      }
    }
  };

  const handleDownloadInvoice = async (orderNumber: string) => {
    try {
      const download = downloadInvoice(orderNumber);
      await download();
    } catch (error) {
      console.error('Failed to download invoice:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Orders API Error:', error); // Debug log
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <XCircle className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-red-800 font-medium">Error loading orders</h3>
            <p className="text-red-600 text-sm mt-1">
              {(error as any)?.response?.data?.message || (error as any)?.message || 'Unable to load your orders. Please try refreshing the page.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-1">
          Track and manage your order history
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent appearance-none"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-blue-800 font-medium mb-2">Debug Info (Development Only)</h3>
          <div className="space-y-2 text-sm">
            <p><strong>API Response:</strong> {ordersData ? 'Received' : 'None'}</p>
            <p><strong>Orders Count:</strong> {orders.length}</p>
            <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            {ordersData && (
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-700">View Raw Response</summary>
                <pre className="text-xs text-blue-700 overflow-auto mt-2 p-2 bg-white rounded">
                  {JSON.stringify(ordersData, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}

      {/* Orders List */}
      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: any, index: number) => {
            // Handle different order object structures
            const orderNumber = order.order_number || order.id || `ORDER-${index + 1}`;
            const orderStatus = order.status || 'pending';
            const orderTotal = order.total || order.amount || '0.00';
            const orderDate = order.created_at || order.date || new Date().toISOString();
            const itemsCount = order.items_count || order.items?.length || 1;
            const paymentStatus = order.payment_status || 'pending';
            
            const StatusIcon = statusConfig[orderStatus as keyof typeof statusConfig]?.icon || Package;
            const statusColor = statusConfig[orderStatus as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800';

            return (
              <div key={order.id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex-shrink-0">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{orderNumber}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(orderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Total Amount</p>
                        <p className="font-semibold">${orderTotal}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Payment Status</p>
                        <p className="font-semibold capitalize">{paymentStatus}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Items</p>
                        <p className="font-semibold">{itemsCount} item(s)</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          statusColor
                        )}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {orderStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
                    <Link
                      href={`/dashboard/orders/${orderNumber}`}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-[#00072D] bg-white border border-[#00072D] rounded-md hover:bg-[#00072D] hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>

                    {orderStatus === 'delivered' && (
                      <button
                        onClick={() => handleDownloadInvoice(orderNumber)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Invoice
                      </button>
                    )}

                    {(orderStatus === 'pending' || orderStatus === 'confirmed') && (
                      <button
                        onClick={() => handleCancelOrder(orderNumber)}
                        disabled={cancelOrderMutation.isPending}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter 
              ? "No orders match your current filters." 
              : "You haven't placed any orders yet."
            }
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-4 py-2 bg-[#00072D] text-white text-sm font-medium rounded-md hover:bg-[#00072D]/90 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(pagination.last_page, currentPage + 1))}
              disabled={currentPage === pagination.last_page}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{pagination.from || 1}</span> to{' '}
                <span className="font-medium">{pagination.to || orders.length}</span> of{' '}
                <span className="font-medium">{pagination.total || orders.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.last_page || 1, currentPage + 1))}
                  disabled={currentPage === (pagination.last_page || 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}