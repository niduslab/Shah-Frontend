import { Calendar, MapPin, Truck, ExternalLink } from 'lucide-react';

interface OrderDetailsProps {
  trackingData: {
    order_number: string;
    status: string;
    shipping_method: string;
    tracking_number: string;
    carrier?: string | null;
    carrier_url?: string | null;
    created_at: string;
    updated_at: string;
  };
}

export default function OrderDetails({ trackingData }: OrderDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">Order Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Date */}
        <div className="rounded-xl bg-gray-50 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-600 mb-1">Order Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(trackingData.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="rounded-xl bg-gray-50 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-600 mb-1">Last Updated</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(trackingData.updated_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Method */}
        <div className="rounded-xl bg-gray-50 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <Truck className="h-5 w-5 text-[#FF6F00]" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-600 mb-1">Shipping Method</p>
              <p className="text-sm font-semibold text-gray-900">
                {trackingData.shipping_method || 'Standard Shipping'}
              </p>
            </div>
          </div>
        </div>

        {/* Tracking Number */}
        <div className="rounded-xl bg-gray-50 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-600 mb-1">
                Tracking Number {trackingData.carrier && <span className="font-normal text-gray-500">· {trackingData.carrier}</span>}
              </p>
              <p className="text-sm font-semibold text-gray-900 font-mono break-all">
                {trackingData.tracking_number || 'Not available yet'}
              </p>
              {trackingData.carrier_url && (
                <a
                  href={trackingData.carrier_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6F00] hover:underline"
                >
                  Track Live Shipment
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 Tip:</span> Save your order number for future reference. You can use it to track your order anytime.
        </p>
      </div>
    </div>
  );
}
