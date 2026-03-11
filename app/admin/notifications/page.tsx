'use client';

import { useState } from 'react';
import { 
  useAdminNotifications, 
  useAdminMarkAsRead, 
  useAdminMarkAllAsRead, 
  useAdminDeleteNotification, 
  useAdminClearNotifications 
} from '@/lib/hooks/admin';
import { 
  Bell, 
  Package, 
  CreditCard, 
  Star, 
  Gift, 
  AlertCircle, 
  CheckCircle, 
  Trash2,
  X,
  Users,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { mapNotificationUrl } from '@/lib/utils/notification-helper';

const notificationIcons = {
  new_order: ShoppingCart,
  order_cancelled: ShoppingCart,
  order_status_changed: ShoppingCart,
  payment: CreditCard,
  new_review: Star,
  promotion: Gift,
  system: AlertCircle,
  user: Users,
  product: Package,
  low_stock: Package,
  report: TrendingUp,
  default: Bell,
};

const notificationColors = {
  new_order: 'text-blue-600 bg-blue-50',
  order_cancelled: 'text-red-600 bg-red-50',
  order_status_changed: 'text-blue-600 bg-blue-50',
  payment: 'text-green-600 bg-green-50',
  new_review: 'text-yellow-600 bg-yellow-50',
  promotion: 'text-purple-600 bg-purple-50',
  system: 'text-red-600 bg-red-50',
  user: 'text-indigo-600 bg-indigo-50',
  product: 'text-orange-600 bg-orange-50',
  low_stock: 'text-orange-600 bg-orange-50',
  report: 'text-teal-600 bg-teal-50',
  default: 'text-gray-600 bg-gray-50',
};

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const { data: notificationsData, isLoading, error } = useAdminNotifications({
    page: currentPage,
    per_page: 20,
    ...(filter !== 'all' && { read: filter === 'read' })
  });

  const markAsReadMutation = useAdminMarkAsRead();
  const markAllAsReadMutation = useAdminMarkAllAsRead();
  const deleteNotificationMutation = useAdminDeleteNotification();
  const clearNotificationsMutation = useAdminClearNotifications();

  const notifications = (notificationsData as any)?.data?.data || [];
  const pagination = (notificationsData as any)?.data || {};
  const unreadCount = notifications.filter((n: any) => !n.read_at).length;

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteNotificationMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      try {
        await clearNotificationsMutation.mutateAsync();
      } catch (error) {
        console.error('Failed to clear notifications:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <X className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-red-800 font-medium">Error loading notifications</h3>
            <p className="text-red-600 text-sm mt-1">
              Unable to load notifications. Please try refreshing the page.
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 && (
              <span className="text-orange-600 font-medium">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </span>
            )}
            {unreadCount === 0 && "All caught up!"}
          </p>
        </div>
        
        {notifications.length > 0 && (
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-sm disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All Read
              </button>
            )}
            <button
              onClick={handleClearAll}
              disabled={clearNotificationsMutation.isPending}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex space-x-2">
          {(['all', 'unread', 'read'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => {
                setFilter(filterOption);
                setCurrentPage(1);
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize",
                filter === filterOption
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {filterOption}
              {filterOption === 'unread' && unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification: any) => {
            // Extract notification data from nested structure
            const notifData = notification.data || {};
            const notifType = notifData.type || 'default';
            const notifTitle = notifData.title || 'Notification';
            const notifMessage = notifData.message || '';
            const rawActionUrl = notifData.action_url;
            const notifActionUrl = rawActionUrl ? mapNotificationUrl(rawActionUrl, true) : '';
            const notifActionText = notifData.action_text;
            
            const NotificationIcon = notificationIcons[notifType as keyof typeof notificationIcons] || notificationIcons.default;
            const iconColor = notificationColors[notifType as keyof typeof notificationColors] || notificationColors.default;

            return (
              <div
                key={notification.id}
                onClick={() => {
                  // Mark as read and navigate if there's an action URL
                  if (!notification.read_at) {
                    handleMarkAsRead(notification.id);
                  }
                  if (notifActionUrl) {
                    router.push(notifActionUrl);
                  }
                }}
                className={cn(
                  "bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md cursor-pointer",
                  !notification.read_at && "border-l-4 border-l-orange-500 bg-orange-50/20"
                )}
              >
                <div className="flex items-start space-x-4">
                  <div className={cn("p-3 rounded-full flex-shrink-0", iconColor)}>
                    <NotificationIcon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={cn(
                          "text-sm font-medium text-gray-900",
                          !notification.read_at && "font-semibold"
                        )}>
                          {notifTitle}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notifMessage}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read_at && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={markAsReadMutation.isPending}
                            className="p-1.5 text-gray-400 hover:text-orange-600 transition-colors disabled:opacity-50"
                            title="Mark as read"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          disabled={deleteNotificationMutation.isPending}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {notifActionUrl && (
                      <div className="mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(notifActionUrl);
                          }}
                          className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                        >
                          {notifActionText || 'View Details'}
                          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Bell className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
          </h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? "You're all caught up! New notifications will appear here."
              : `You don't have any ${filter} notifications at the moment.`
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(pagination.last_page, currentPage + 1))}
              disabled={currentPage === pagination.last_page}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{pagination.from}</span> to{' '}
                <span className="font-medium">{pagination.to}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Page {currentPage} of {pagination.last_page}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.last_page, currentPage + 1))}
                  disabled={currentPage === pagination.last_page}
                  className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
