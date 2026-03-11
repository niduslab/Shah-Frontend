'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { mapNotificationUrl } from '@/lib/utils/notification-helper';

interface Notification {
  id: number;
  title?: string;
  message?: string;
  type?: string;
  read_at: string | null;
  created_at: string;
  action_url?: string;
  data?: {
    type?: string;
    title?: string;
    message?: string;
    action_url?: string;
    action_text?: string;
    [key: string]: any;
  };
}

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: number) => void;
  onViewAll: () => void;
  isLoading?: boolean;
  variant?: 'light' | 'dark';
  isAdmin?: boolean; // Add isAdmin prop for URL mapping
}

const notificationIcons: Record<string, string> = {
  new_order: '🛒',
  order_cancelled: '❌',
  order_status_changed: '📦',
  payment: '💳',
  new_review: '⭐',
  promotion: '🎁',
  system: '⚙️',
  user: '👤',
  product: '🏷️',
  low_stock: '⚠️',
  report: '📊',
  default: '🔔',
};

export function NotificationBell({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onViewAll,
  isLoading = false,
  variant = 'light',
  isAdmin = false,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Styling based on variant
  const buttonStyles = variant === 'dark' 
    ? 'text-white hover:bg-white/10 hover:text-white'
    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700';
  
  const badgeRingColor = variant === 'dark' ? 'ring-[#00072D]' : 'ring-white';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    // Extract action_url from nested data structure
    const rawActionUrl = notification.data?.action_url || notification.action_url;
    const actionUrl = rawActionUrl ? mapNotificationUrl(rawActionUrl, isAdmin) : '';
    
    console.log('Notification clicked:', {
      notification,
      rawActionUrl,
      mappedActionUrl: actionUrl,
      isAdmin,
      data: notification.data
    });
    
    if (!notification.read_at) {
      onMarkAsRead(notification.id);
    }
    
    if (actionUrl) {
      router.push(actionUrl);
      setIsOpen(false);
    }
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn("relative rounded-lg p-2 transition-colors", buttonStyles)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className={cn(
            "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 shadow-lg",
            badgeRingColor
          )}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 rounded-lg border border-gray-200 bg-white shadow-xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {unreadCount} unread
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAllAsRead();
                }}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-500">Loading...</p>
              </div>
            ) : recentNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentNotifications.map((notification) => {
                  // Extract notification data from nested structure
                  const notifData = notification.data || {};
                  const notifType = notifData.type || notification.type || 'default';
                  const notifTitle = notifData.title || notification.title || 'Notification';
                  const notifMessage = notifData.message || notification.message || '';
                  const notifActionUrl = notifData.action_url || notification.action_url;
                  
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'group relative p-4 transition-colors hover:bg-gray-50 cursor-pointer',
                        !notification.read_at && 'bg-blue-50/50'
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 text-2xl">
                          {notificationIcons[notifType] || notificationIcons.default}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-sm text-gray-900',
                            !notification.read_at && 'font-semibold'
                          )}>
                            {notifTitle}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notifMessage}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read_at && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Mark as read"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {!notification.read_at && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm font-medium text-gray-900">No notifications</p>
                <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {recentNotifications.length > 0 && (
            <div className="border-t border-gray-100 p-3">
              <button
                onClick={() => {
                  onViewAll();
                  setIsOpen(false);
                }}
                className="w-full rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
