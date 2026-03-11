'use client';

import { useState, useEffect } from 'react';
import { useOrder } from '@/lib/hooks/user';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Download,
  Printer,
  CheckCircle,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { getPrimaryImageUrl } from '@/lib/utils/image';

interface InvoicePageProps {
  params: {
    orderNumber: string;
  };
}

export default function InvoicePage({ params }: InvoicePageProps) {
  const [orderNumber, setOrderNumber] = useState<string>('');
  
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await Promise.resolve(params);
      setOrderNumber(resolvedParams.orderNumber);
    };
    resolveParams();
  }, [params]);

  const { data: orderData, isLoading } = useOrder(orderNumber || '');

  let order = null;
  if (orderData) {
    if (orderData.success && orderData.data) {
      order = orderData.data;
    } else if (orderData.data) {
      order = orderData.data;
    } else if (orderData.order_number) {
      order = orderData;
    }
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  if (!orderNumber || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3B2D]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <p className="text-gray-600 mb-4">Unable to load invoice details</p>
          <Link href="/" className="text-[#0B3B2D] hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Action Buttons - Hidden on print */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link
            href="/"
            className="inline-flex items-center text-[#0B3B2D] hover:text-[#0B3B2D]/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#0B3B2D] rounded-md hover:bg-[#0B3B2D]/90"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </button>
          </div>
        </div>

        {/* Success Message - Hidden on print */}
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6 print:hidden">
          <div className="flex items-start">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-green-900 font-semibold text-lg">Order Placed Successfully!</h3>
              <p className="text-green-700 mt-1">
                Thank you for your order. We've received your order and will process it shortly.
              </p>
              <p className="text-green-600 text-sm mt-2">
                Order Number: <span className="font-mono font-bold">#{order.order_number}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Invoice */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 print:shadow-none print:border-0">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-gray-600 mt-2">Order #{order.order_number}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-[#0B3B2D]">Shah Sports</h2>
                <p className="text-sm text-gray-600 mt-2">
                  123 Sports Avenue<br />
                  Dhaka, Bangladesh<br />
                  Phone: +880 1XXX-XXXXXX<br />
                  Email: info@shahsports.com
                </p>
              </div>
            </div>
          </div>

          {/* Customer & Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Bill To */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3">Bill To</h3>
              <div className="text-sm text-gray-700 space-y-1">
                {order.customer_name && <p className="font-medium">{order.customer_name}</p>}
                {order.customer_email && (
                  <p className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {order.customer_email}
                  </p>
                )}
                {order.customer_phone && (
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {order.customer_phone}
                  </p>
                )}
              </div>
            </div>

            {/* Order Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3">Order Details</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">
                    {order.payments?.[0]?.payment_method?.replace('_', ' ') || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-medium capitalize">{order.payment_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Method:</span>
                  <span className="font-medium capitalize">{order.shipping_method || 'Standard'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address_id && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Shipping Address
              </h3>
              <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                <p>Address ID: {order.shipping_address_id}</p>
                <p className="text-gray-500 mt-1 text-xs">
                  Full address details will be displayed here
                </p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Order Items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Item</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Unit Price</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items && order.items.map((item: any, index: number) => {
                    // Handle images from various possible locations in the API response
                    const productImages = item.product?.images || item.images || item.product_images;
                    const productImage = getPrimaryImageUrl(productImages);
                    
                    return (
                      <tr key={item.id || index} className="border-b border-gray-100">
                        <td className="py-4 px-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0 print:hidden">
                              <img
                                src={productImage}
                                alt={item.product_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                              {item.product_variation && item.product_variation.variation_values && (
                                <p className="text-xs text-gray-500">
                                  {item.product_variation.variation_values.map((val: any) => 
                                    `${val.variation_option.variation.name}: ${val.variation_option.label}`
                                  ).join(', ')}
                                </p>
                              )}
                              {item.product?.sku && (
                                <p className="text-xs text-gray-400">SKU: {item.product.sku}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-center text-sm text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="py-4 px-2 text-right text-sm text-gray-700">
                          ${parseFloat(item.unit_price).toFixed(2)}
                        </td>
                        <td className="py-4 px-2 text-right text-sm font-medium text-gray-900">
                          ${parseFloat(item.total_price).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-end">
              <div className="w-full md:w-1/2 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900 font-medium">${parseFloat(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900 font-medium">
                    ${parseFloat(order.shipping_cost || '0').toFixed(2)}
                  </span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span className="font-medium">-${parseFloat(order.discount_amount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900 font-medium">
                    ${parseFloat(order.tax_amount || '0').toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900 text-lg">Total:</span>
                  <span className="font-bold text-xl text-[#0B3B2D]">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Thank you for shopping with Shah Sports!
            </p>
            {order.notes && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Note:</span> {order.notes}
                </p>
              </div>
            )}
            <p className="text-xs text-gray-500 text-center mt-4">
              For any questions or concerns, please contact us at info@shahsports.com or +880 1XXX-XXXXXX
            </p>
          </div>
        </div>

        {/* Additional Actions - Hidden on print */}
        <div className="mt-6 text-center print:hidden">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center text-[#0B3B2D] hover:text-[#0B3B2D]/80 font-medium"
          >
            View All Orders
          </Link>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
