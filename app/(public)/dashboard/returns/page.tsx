'use client';

import { useState } from 'react';
import { useReturns } from '@/lib/hooks/user';
import Link from 'next/link';
import Image from 'next/image';
import { 
  RotateCcw, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Eye,
  MessageSquare,
  Filter,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

const returnStatusConfig = {
  pending: { 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    icon: Clock,
    description: 'Return request is being reviewed'
  },
  approved: { 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: CheckCircle,
    description: 'Return approved, please ship the item'
  },
  rejected: { 
    color: 'bg-red-100 text-red-800 border-red-200', 
    icon: XCircle,
    description: 'Return request has been rejected'
  },
  processing: { 
    color: 'bg-purple-100 text-purple-800 border-purple-200', 
    icon: Package,
    description: 'Return is being processed'
  },
  completed: { 
    color: 'bg-green-100 text-green-800 border-green-200', 
    icon: CheckCircle,
    description: 'Return completed and refund processed'
  },
};

export default function ReturnsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: returnsData, isLoading, error } = useReturns({
    page: currentPage,
    per_page: 10,
    ...(statusFilter && { status: statusFilter }),
    ...(searchTerm && { search: searchTerm })
  });

  // Handle different API response structures
  let returns: any[] = [];
  let pagination: any = {};

  if (returnsData) {
    if ((returnsData as any).data?.data) {
      returns = (returnsData as any).data.data;
      pagination = (returnsData as any).data;
    } else if ((returnsData as any).data && Array.isArray((returnsData as any).data)) {
      returns = (returnsData as any).data;
      pagination = returnsData as any;
    } else if (Array.isArray(returnsData)) {
      returns = returnsData;
      pagination = { total: returnsData.length, current_page: 1, last_page: 1 };
    }
  }

  // Mock data for testing if no real data
  if (!isLoading && !error && returns.length === 0) {
    returns = [
      {
        id: 1,
        return_number: 'RET-001',
        order_number: 'SS123456',
        status: 'pending',
        reason: 'defective',
        description: 'Product arrived damaged',
        quantity: 1,
        refund_amount: '99.99',
        created_at: '2024-03-01T10:30:00Z',
        updated_at: '2024-03-01T10:30:00Z',
        product: {
          id: 1,
          name: 'Wireless Bluetooth Headphones',
          image: '/placeholder-product.jpg',
          price: '99.99'
        },
        images: ['/return-image-1.jpg']
      },
      {
        id: 2,
        return_number: 'RET-002',
        order_number: 'SS123457',
        status: 'approved',
        reason: 'wrong_item',
        description: 'Received wrong color',
        quantity: 1,
        refund_amount: '149.50',
        created_at: '2024-02-28T14:20:00Z',
        updated_at: '2024-03-02T09:15:00Z',
        product: {
          id: 2,
          name: 'Smart Fitness Watch',
          image: '/placeholder-product.jpg',
          price: '149.50'
        },
        images: []
      },
      {
        id: 3,
        return_number: 'RET-003',
        order_number: 'SS123458',
        status: 'completed',
        reason: 'not_as_described',
        description: 'Product quality not as expected',
        quantity: 2,
        refund_amount: '179.98',
        created_at: '2024-02-25T16:45:00Z',
        updated_at: '2024-03-05T11:30:00Z',
        product: {
          id: 3,
          name: 'USB-C Charging Cable',
          image: '/placeholder-product.jpg',
          price: '89.99'
        },
        images: ['/return-image-2.jpg', '/return-image-3.jpg']
      }
    ];
    pagination = { total: 3, current_page: 1, last_page: 1 };
  }

  const handleCreateReturn = () => {
    // Navigate to create return page or open modal
    console.log('Create new return');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Returns API Error:', error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <XCircle className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-red-800 font-medium">Error loading returns</h3>
            <p className="text-red-600 text-sm mt-1">
              Unable to load your returns. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Returns</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your return requests
          </p>
        </div>
        
        <button
          onClick={handleCreateReturn}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-[#00072D] text-white text-sm font-medium rounded-md hover:bg-[#00072D]/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Request Return
        </button>
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
                placeholder="Search returns..."
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-medium mb-2">Debug Info (Development Only)</h3>
          <div className="space-y-2 text-sm">
            <p><strong>API Response:</strong> {returnsData ? 'Received' : 'None'}</p>
            <p><strong>Returns Count:</strong> {returns.length}</p>
            <p><strong>Error:</strong> {error ? String(error) : 'None'}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}

      {/* Returns List */}
      {returns && returns.length > 0 ? (
        <div className="space-y-4">
          {returns.map((returnItem: any, index: number) => {
            const returnNumber = returnItem.return_number || returnItem.id || `RET-${index + 1}`;
            const returnStatus = returnItem.status || 'pending';
            const statusConfig = returnStatusConfig[returnStatus as keyof typeof returnStatusConfig] || returnStatusConfig.pending;
            const StatusIcon = statusConfig.icon;

            return (
              <div key={returnItem.id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* Return Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={returnItem.product?.image || '/placeholder-product.jpg'}
                            alt={returnItem.product?.name || 'Product'}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Return Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Return #{returnNumber}
                          </h3>
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                            statusConfig.color
                          )}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {returnStatus}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Product:</strong> {returnItem.product?.name || 'Unknown Product'}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Order:</strong> #{returnItem.order_number}
                        </p>
                        <p className="text-sm text-gray-500">
                          {statusConfig.description}
                        </p>
                      </div>
                    </div>

                    {/* Return Actions */}
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
                      <Link
                        href={`/dashboard/returns/${returnItem.id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-[#00072D] bg-white border border-[#00072D] rounded-md hover:bg-[#00072D] hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                      
                      {returnStatus === 'pending' && (
                        <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Add Note
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Return Details Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm border-t border-gray-200 pt-4">
                    <div>
                      <p className="text-gray-500">Reason</p>
                      <p className="font-semibold capitalize">
                        {returnItem.reason?.replace('_', ' ') || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Quantity</p>
                      <p className="font-semibold">{returnItem.quantity || 1}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Refund Amount</p>
                      <p className="font-semibold">${returnItem.refund_amount || '0.00'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Requested</p>
                      <p className="font-semibold">
                        {new Date(returnItem.created_at || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Return Description */}
                  {returnItem.description && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">
                        <strong>Description:</strong> {returnItem.description}
                      </p>
                    </div>
                  )}

                  {/* Return Images */}
                  {returnItem.images && returnItem.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Attached Images:</p>
                      <div className="flex space-x-2">
                        {returnItem.images.slice(0, 3).map((image: string, imgIndex: number) => (
                          <div key={imgIndex} className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                            <Image
                              src={image}
                              alt={`Return image ${imgIndex + 1}`}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {returnItem.images.length > 3 && (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{returnItem.images.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <RotateCcw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No returns found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter 
              ? "No returns match your current filters." 
              : "You haven't requested any returns yet."
            }
          </p>
          <button
            onClick={handleCreateReturn}
            className="inline-flex items-center px-4 py-2 bg-[#00072D] text-white text-sm font-medium rounded-md hover:bg-[#00072D]/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Request Return
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.last_page && pagination.last_page > 1 && (
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
              onClick={() => setCurrentPage(Math.min(pagination.last_page || 1, currentPage + 1))}
              disabled={currentPage === (pagination.last_page || 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{pagination.from || 1}</span> to{' '}
                <span className="font-medium">{pagination.to || returns.length}</span> of{' '}
                <span className="font-medium">{pagination.total || returns.length}</span> results
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