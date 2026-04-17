'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOrder, useCancelOrder, useDownloadInvoice } from '@/lib/hooks/user';
import { useOrderItemReviews, useSubmitReview } from '@/lib/hooks/user/useUserReviews';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  Download,
  X,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
  ShoppingBag,
  Star,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPrimaryImageUrl } from '@/lib/utils/image';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  processing: { color: 'bg-purple-100 text-purple-800', icon: Package },
  shipped: { color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
};

interface OrderDetailPageProps {
  params: {
    orderNumber: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  
  // Handle params properly for Next.js 13+ app router
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await Promise.resolve(params);
      setOrderNumber(resolvedParams.orderNumber);
    };
    resolveParams();
    setMounted(true);
  }, [params]);

  const { data: orderData, isLoading, error } = useOrder(orderNumber || '');
  const { data: reviewsData } = useOrderItemReviews(orderNumber || '');
  const cancelOrderMutation = useCancelOrder();
  const downloadInvoice = useDownloadInvoice(orderNumber || '');
  const submitReviewMutation = useSubmitReview();

  // Handle API response - the API returns {success: true, data: {order object}}
  let order = null;
  if (orderData) {
    // Handle the actual API response structure
    if (orderData.success && orderData.data) {
      // Direct order object in data
      order = orderData.data;
    } else if (orderData.data) {
      // Order object in data
      order = orderData.data;
    } else if (Array.isArray(orderData)) {
      // Array of orders - find matching one
      order = orderData.find((o: any) => o.order_number === orderNumber);
    } else if (orderData.order_number) {
      // Direct order object
      order = orderData;
    }
  }

  // Handle reviews data - Updated to handle new API structure
  let itemReviews: any = {};
  if (reviewsData) {
    const data = reviewsData as any;
    console.log('Reviews API Response:', data);
    
    if (data.success && data.data) {
      // New API structure: reviews are in data.products array
      if (data.data.products && Array.isArray(data.data.products)) {
        data.data.products.forEach((product: any) => {
          if (product.has_reviewed && product.review) {
            // Map by product_id since we don't have order_item_id in this structure
            itemReviews[product.product_id] = {
              ...product.review,
              product_id: product.product_id,
            };
          }
        });
      }
      // Old API structure: reviews are in data array
      else if (Array.isArray(data.data)) {
        data.data.forEach((review: any) => {
          if (review.order_item_id) {
            itemReviews[review.order_item_id] = review;
          }
        });
      }
    }
    
    console.log('Extracted item reviews:', itemReviews);
  }
  
  // Also check if reviews are embedded in order items
  if (order && order.items) {
    order.items.forEach((item: any) => {
      if (item.has_reviewed && item.review) {
        itemReviews[item.product_id] = {
          ...item.review,
          product_id: item.product_id,
        };
      }
    });
  }

  const handleOpenReviewForm = (item: any) => {
    setSelectedItem(item);
    setReviewForm({
      rating: 5,
      title: '',
      comment: '',
    });
    setShowReviewForm(true);
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
    setSelectedItem(null);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItem) return;

    try {
      await submitReviewMutation.mutateAsync({
        product_id: selectedItem.product_id,
        order_item_id: selectedItem.id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
      });
      handleCloseReviewForm();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-4 h-4",
              interactive && "cursor-pointer hover:scale-110 transition-transform",
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            )}
            onClick={() => interactive && onChange && onChange(i + 1)}
          />
        ))}
      </div>
    );
  };

  const handleCancelOrder = async () => {
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

  const handleDownloadInvoice = async () => {
    try {
      await downloadInvoice();
    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  if (!orderNumber || isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    console.error('Order API Error:', error);
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center text-[#00072D] hover:text-[#00072D]/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-red-800 font-medium">Order not found</h3>
              <p className="text-red-600 text-sm mt-1">
                Unable to load order details. The order may not exist or you may not have permission to view it.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package;
  const statusColor = statusConfig[order.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center text-[#00072D] hover:text-[#00072D]/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.order_number}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Show download invoice button for delivered orders or if invoice exists */}
          {(order.status === 'delivered' || order.invoice) && (
            <button
              onClick={handleDownloadInvoice}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </button>
          )}

          {(order.status === 'pending' || order.status === 'confirmed') && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelOrderMutation.isPending}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4 mr-2" />
              {cancelOrderMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <StatusIcon className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
              <span className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                statusColor
              )}>
                <StatusIcon className="w-4 h-4 mr-2" />
                {order.status}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">${order.total_amount}</p>
          </div>
        </div>

        {order.tracking_number && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Truck className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                <p className="text-blue-700">{order.tracking_number}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info Cards */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Order Type</p>
                  <p className="font-medium text-gray-900 capitalize">{order.order_type || 'Online'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="font-medium text-gray-900 capitalize">{order.payment_status}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Shipping Method</p>
                  <p className="font-medium text-gray-900">{order.shipping_method || 'Standard'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items ({order.items?.length || 0})
            </h3>
            
            {order.items && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => {
                  const productSlug = item.product?.slug;
                  // Handle images from various possible locations in the API response
                  const productImages = item.product?.images || item.images || item.product_images;
                  const productImage = getPrimaryImageUrl(productImages);
                  // Check for review by product_id (new API structure) or item.id (old structure)
                  const hasReview = itemReviews[item.product_id] || itemReviews[item.id];
                  const canReview = order.status === 'delivered' || order.status === 'shipped';
                  
                  return (
                    <div key={item.id || index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-4">
                        <Link 
                          href={productSlug ? `/product/${productSlug}` : '#'}
                          className="flex-shrink-0"
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                            <img
                              src={productImage}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        </Link>
                        
                        <div className="flex-1 min-w-0">
                          <Link 
                            href={productSlug ? `/product/${productSlug}` : '#'}
                            className="hover:text-[#00072D]/80 transition-colors"
                          >
                            <h5 className="font-medium text-gray-900 truncate">{item.product_name}</h5>
                          </Link>
                          {item.product_variation && item.product_variation.variation_values && (
                            <p className="text-sm text-gray-600 truncate">
                              {item.product_variation.variation_values.map((val: any) => 
                                `${val.variation_option.variation.name}: ${val.variation_option.label}`
                              ).join(', ')}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">SKU: {item.product?.sku || 'N/A'}</p>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-gray-600">
                            ${item.unit_price} × {item.quantity}
                          </p>
                          <p className="font-semibold text-gray-900">
                            ${item.total_price}
                          </p>
                        </div>
                      </div>

                      {/* Review Section for Item */}
                      {canReview && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          {hasReview ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <MessageSquare className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-800">You reviewed this product</span>
                                    {hasReview.status && (
                                      <span className={cn(
                                        "px-2 py-0.5 rounded-full text-xs font-medium",
                                        hasReview.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        hasReview.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                      )}>
                                        {hasReview.status}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mb-2">
                                    {renderStars(hasReview.rating)}
                                    <span className="text-sm text-gray-600">{hasReview.rating}.0</span>
                                  </div>
                                  {hasReview.title && (
                                    <p className="text-sm font-medium text-gray-900 mt-2">{hasReview.title}</p>
                                  )}
                                  {hasReview.comment && (
                                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">{hasReview.comment}</p>
                                  )}
                                  {hasReview.created_at && (
                                    <p className="text-xs text-gray-500 mt-2">
                                      Reviewed on {new Date(hasReview.created_at).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                <Link
                                  href="/dashboard/reviews"
                                  className="text-sm text-green-700 hover:text-green-800 font-medium ml-3 flex-shrink-0"
                                >
                                  View
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenReviewForm(item)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-[#00072D] bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Write a Review
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No items found in this order.</p>
              </div>
            )}
          </div>

          {/* Shipping & Billing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="font-semibold text-gray-900">Shipping Address</h3>
              </div>
              <div className="text-gray-700 text-sm">
                <p>Address ID: {order.shipping_address_id}</p>
                <p className="text-gray-500 mt-2">
                  Full address details would be loaded from the address API
                </p>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="font-semibold text-gray-900">Billing Address</h3>
              </div>
              <div className="text-gray-700 text-sm">
                <p>Address ID: {order.billing_address_id}</p>
                <p className="text-gray-500 mt-2">
                  Full billing address details would be loaded from the address API
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {order.payments && order.payments.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="font-semibold text-gray-900">Payment Information</h3>
              </div>
              <div className="space-y-3">
                {order.payments.map((payment: any, index: number) => (
                  <div key={payment.id || index} className="text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500">Method:</span>
                      <span className="text-gray-900 font-medium capitalize">
                        {payment.payment_method.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500">Amount:</span>
                      <span className="text-gray-900 font-medium">{payment.amount} {payment.currency}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500">Status:</span>
                      <span className={cn(
                        "capitalize font-medium",
                        payment.status === 'completed' || payment.status === 'paid' ? 'text-green-600' : 
                        payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      )}>
                        {payment.status}
                      </span>
                    </div>
                    {payment.transaction_id && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Transaction ID:</span>
                        <span className="text-gray-700 text-xs font-mono">{payment.transaction_id}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Information */}
          {(order.customer_name || order.customer_email || order.customer_phone) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Package className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="font-semibold text-gray-900">Customer Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                {order.customer_name && (
                  <p className="text-gray-700"><span className="text-gray-500">Name:</span> {order.customer_name}</p>
                )}
                {order.customer_email && (
                  <p className="text-gray-700"><span className="text-gray-500">Email:</span> {order.customer_email}</p>
                )}
                {order.customer_phone && (
                  <p className="text-gray-700"><span className="text-gray-500">Phone:</span> {order.customer_phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Order Notes</h4>
              <p className="text-yellow-700 text-sm">{order.notes}</p>
            </div>
          )}

          {/* Preorder Information */}
          {order.is_preorder && (
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-900">Preorder Information</h4>
              </div>
              <div className="space-y-2 text-sm text-blue-800">
                <p><span className="font-medium">Status:</span> {order.preorder_payment_status}</p>
                {order.preorder_deposit_paid && (
                  <p><span className="font-medium">Deposit Paid:</span> ${order.preorder_deposit_paid}</p>
                )}
                {order.preorder_remaining_amount && (
                  <p><span className="font-medium">Remaining Amount:</span> ${order.preorder_remaining_amount}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900 font-medium">${order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-gray-900 font-medium">${order.shipping_cost || '0.00'}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span className="font-medium">-${order.discount_amount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="text-gray-900 font-medium">${order.tax_amount || '0.00'}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-xl text-gray-900">${order.total_amount}</span>
              </div>
            </div>

            {/* Download Invoice Button */}
            {(order.status === 'delivered' || order.invoice) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {mounted && showReviewForm && selectedItem && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
              onClick={handleCloseReviewForm}
              aria-hidden="true"
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-[10000]">
              <form onSubmit={handleSubmitReview}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Write a Review
                    </h3>
                    <button
                      type="button"
                      onClick={handleCloseReviewForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="flex gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={getPrimaryImageUrl(selectedItem.product?.images)}
                        alt={selectedItem.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">
                        {selectedItem.product_name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Order #{orderNumber}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating *
                      </label>
                      {renderStars(reviewForm.rating, true, (rating) => setReviewForm({ ...reviewForm, rating }))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Review Title *
                      </label>
                      <input
                        type="text"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                        placeholder="Sum up your experience"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Review *
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Share your thoughts about this product"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={submitReviewMutation.isPending}
                    className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#00072D] text-base font-medium text-white hover:bg-[#00072D]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00072D] sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {submitReviewMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseReviewForm}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
