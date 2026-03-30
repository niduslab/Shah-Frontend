import { Clock, Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';

interface TrackingTimelineProps {
  status: string;
  createdAt?: string;
}

export default function TrackingTimeline({ status, createdAt }: TrackingTimelineProps) {
  const statuses = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStatusIndex = statuses.indexOf(status?.toLowerCase() || 'pending');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const timelineSteps = [
    {
      id: 'pending',
      label: 'Order Placed',
      description: 'Your order has been received',
      date: createdAt ? formatDate(createdAt) : null,
      icon: Clock,
    },
    {
      id: 'processing',
      label: 'Processing',
      description: 'We are preparing your order',
      icon: Package,
    },
    {
      id: 'shipped',
      label: 'Shipped',
      description: 'Your order is on the way',
      icon: Truck,
    },
    {
      id: 'delivered',
      label: 'Delivered',
      description: 'Order delivered successfully',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
      <h3 className="mb-8 text-lg font-semibold text-gray-900">Delivery Timeline</h3>

      <div className="space-y-8">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;

          return (
            <div key={step.id} className="flex gap-6">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all flex-shrink-0 ${
                    isCompleted
                      ? 'border-[#FF6F00] bg-[#FF6F00] text-white'
                      : 'border-gray-300 bg-gray-100 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-[#FF6F00]/20 shadow-lg' : ''}`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`mt-3 h-16 w-1 ${
                      isCompleted ? 'bg-[#FF6F00]' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4
                      className={`font-bold text-base ${
                        isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p
                      className={`text-sm mt-1 ${
                        isCompleted ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                  {step.date && (
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                        isCompleted
                          ? 'bg-orange-50 text-[#FF6F00]'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {step.date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {status?.toLowerCase() === 'cancelled' && (
        <div className="mt-8 rounded-lg bg-red-50 border border-red-200 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Order Cancelled</p>
            <p className="text-sm text-red-800">This order has been cancelled. Please contact support for more information.</p>
          </div>
        </div>
      )}
    </div>
  );
}
