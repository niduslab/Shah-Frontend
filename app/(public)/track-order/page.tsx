'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api/axios';
import TrackingTimeline from '@/app/(public)/track-order/_components/TrackingTimeline';
import OrderDetails from '@/app/(public)/track-order/_components/OrderDetails';

interface TrackingData {
  order_number: string;
  status: string;
  shipping_method: string;
  tracking_number: string;
  created_at: string;
  updated_at: string;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderNumber.trim()) {
      toast.error('Please enter an order number');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await api.get(`/api/orders/${orderNumber.trim()}/track`);

      if (response.data.success) {
        setTrackingData(response.data.data);
      } else {
        toast.error('Order not found');
        setTrackingData(null);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error('Order not found. Please check the order number.');
      } else {
        toast.error('Failed to track order. Please try again.');
      }
      setTrackingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'processing':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'shipped':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'delivered':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'cancelled':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order number to see the latest status and delivery information</p>
        </div>

        {/* Search Section */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your order number (e.g., ORD-123456)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3.5 pl-12 pr-4 text-base transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {hasSearched && !isLoading && !trackingData && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg ring-1 ring-gray-200">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Order Not Found</h3>
            <p className="text-gray-600">
              We couldn't find an order with that number. Please check and try again.
            </p>
          </div>
        )}

        {/* Tracking Results - Two Column Layout */}
        {trackingData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Timeline (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Timeline */}
              <TrackingTimeline status={trackingData.status} createdAt={trackingData.created_at} />
            </div>

            {/* Right Column - Order Details (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Status Card */}
              <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 sticky top-24">
                {/* Status Badge */}
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 border w-fit mb-6 ${getStatusColor(trackingData.status)}`}>
                  {getStatusIcon(trackingData.status)}
                  <span className="font-semibold capitalize text-sm">{trackingData.status}</span>
                </div>

                {/* Order Number */}
                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-600 mb-2">Order Number</p>
                  <p className="text-xl font-bold text-gray-900 break-all">{trackingData.order_number}</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 mb-6"></div>

                {/* Shipping Method */}
                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-600 mb-2">Shipping Method</p>
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-[#FF6F00]" />
                    <p className="text-sm font-semibold text-gray-900">{trackingData.shipping_method || 'Standard Shipping'}</p>
                  </div>
                </div>

                {/* Tracking Number */}
                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-600 mb-2">Tracking Number</p>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs font-mono text-gray-900 break-all">{trackingData.tracking_number || 'Not available yet'}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 mb-6"></div>

                {/* Order Details Summary */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Order Date</p>
                    <p className="text-sm text-gray-900">
                      {new Date(trackingData.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Last Updated</p>
                    <p className="text-sm text-gray-900">
                      {new Date(trackingData.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Help Section */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white flex-shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Need Help?</h3>
                    <p className="text-xs text-blue-800 mt-1">
                      Contact our support team for any questions
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <a
                    href="tel:+8801615550080"
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors w-full"
                  >
                    <Phone className="h-4 w-4" />
                    Call Us
                  </a>
                  <a
                    href="mailto:info@shahsports.com.bd"
                    className="flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors w-full"
                  >
                    <Mail className="h-4 w-4" />
                    Email Us
                  </a>
                </div>
              </div>
                </div>
              </div>

              

              {/* Info Tip */}
              {/* <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-xs text-amber-900">
                  <span className="font-semibold">💡 Tip:</span> Bookmark this page or save your order number for future reference.
                </p>
              </div> */}
            </div>
          </div>
        )}

        {/* Info Cards */}
        {!trackingData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                <Package className="h-6 w-6 text-[#FF6F00]" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Real-time Updates</h3>
              <p className="text-sm text-gray-600">Get instant notifications about your order status and delivery updates.</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Tracking Number</h3>
              <p className="text-sm text-gray-600">Use your tracking number to monitor your shipment with our carrier.</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">Delivery Confirmation</h3>
              <p className="text-sm text-gray-600">Receive confirmation once your order has been successfully delivered.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
