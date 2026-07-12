'use client';

import { useState, useEffect } from 'react';
import { X, Package, User, MapPin, CreditCard, Truck, FileText, Calendar, DollarSign } from 'lucide-react';
import { useAdminOrder } from '@/lib/hooks/admin/useAdminOrders';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
}

export default function OrderDetailsModal({ isOpen, onClose, orderId }: OrderDetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const { data: orderData, isLoading } = useAdminOrder(orderId, { 
    enabled: isOpen 
  } as any);
  const order = (orderData as any)?.data;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    if (!mounted) return '';

    return `৳${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    if (!mounted) return '';
    
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              {order && (
                <p className="text-sm text-gray-600 font-mono">{order.order_number}</p>
              )}
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
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-5 w-5 text-[#FF6F00]" />
                    <h3 className="font-semibold text-gray-900">Customer Information</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="break-words">
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {order.user ? `${order.user.first_name} ${order.user.last_name}` : order.customer_name || 'Guest / POS Order'}
                      </span>
                    </div>
                    <div className="break-words">
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {order.user?.email || order.customer_email || 'N/A'}
                      </span>
                    </div>
                    <div className="break-words">
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {order.user?.phone || order.customer_phone || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-5 w-5 text-[#FF6F00]" />
                    <h3 className="font-semibold text-gray-900">Order Status</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="ml-2 font-medium text-gray-900 capitalize">{order.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment:</span>
                      <span className="ml-2 font-medium text-gray-900 capitalize">{order.payment_status}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium text-gray-900 capitalize">{order.order_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <span className="ml-2 font-medium text-gray-900">{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shipping_address && (
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-[#FF6F00]" />
                      <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p>{order.shipping_address.address_line_1}</p>
                      {order.shipping_address.address_line_2 && (
                        <p>{order.shipping_address.address_line_2}</p>
                      )}
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}
                      </p>
                      {order.shipping_address.contact_no && (
                        <p className="mt-2">Phone: {order.shipping_address.contact_no}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Billing Address */}
                {order.billing_address && (
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="h-5 w-5 text-[#FF6F00]" />
                      <h3 className="font-semibold text-gray-900">Billing Address</h3>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p>{order.billing_address.address_line_1}</p>
                      {order.billing_address.address_line_2 && (
                        <p>{order.billing_address.address_line_2}</p>
                      )}
                      <p>
                        {order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip_code}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tracking Information */}
              {(order.tracking_number || order.carrier) && (
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="h-5 w-5 text-[#FF6F00]" />
                    <h3 className="font-semibold text-gray-900">Tracking Information</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    {order.tracking_number && (
                      <div>
                        <span className="text-gray-600">Tracking Number:</span>
                        <span className="ml-2 font-mono font-medium text-gray-900">{order.tracking_number}</span>
                      </div>
                    )}
                    {order.carrier && (
                      <div>
                        <span className="text-gray-600">Carrier:</span>
                        <span className="ml-2 font-medium text-gray-900">{order.carrier}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items?.map((item: any) => {
                    const unitPrice = parseFloat(item.unit_price || item.price || '0');
                    const totalPrice = parseFloat(item.total_price || item.subtotal || '0');
                    const primaryImage = item.product?.images?.find((img: any) => img.is_primary)?.full_url || item.product?.images?.[0]?.full_url;
                    
                    return (
                      <div key={item.id} className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-gray-50">
                        {primaryImage && (
                          <img
                            src={primaryImage.startsWith('http') ? primaryImage : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${primaryImage}`}
                            alt={item.product_name || item.product?.name}
                            className="h-16 w-16 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-[140px]">
                          <h4 className="font-medium text-gray-900 break-words">{item.product_name || item.product?.name}</h4>
                          {item.variation_details && (
                            <p className="text-sm text-gray-600 break-words">
                              Variation: {typeof item.variation_details === 'string' ? item.variation_details : JSON.stringify(item.variation_details)}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × {formatCurrency(unitPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(totalPrice)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(parseFloat(order.subtotal || '0'))}
                    </span>
                  </div>
                  {parseFloat(order.discount_amount || order.discount || '0') > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span className="font-medium">
                        -{formatCurrency(parseFloat(order.discount_amount || order.discount || '0'))}
                      </span>
                    </div>
                  )}
                  {parseFloat(order.tax_amount || order.tax || '0') > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(parseFloat(order.tax_amount || order.tax || '0'))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(parseFloat(order.shipping_cost || '0'))}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-[#FF6F00]">
                      {formatCurrency(parseFloat(order.total_amount || order.total || '0'))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-[#FF6F00]" />
                    <h3 className="font-semibold text-gray-900">Order Notes</h3>
                  </div>
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">Order not found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
