'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationBell } from '@/lib/components/NotificationBell';
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '@/lib/hooks/user';

export function UserNotificationBell() {
  const router = useRouter();
  const { data: notificationsData, isLoading } = useNotifications({ page: 1, per_page: 20 });
  const { data: unreadData } = useUnreadCount();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const allNotifications = (notificationsData as any)?.data?.data || [];
  const notifications = allNotifications.slice(0, 5); // Show only 5 in dropdown
  
  // Calculate unread count from all fetched notifications
  const unreadCount = (unreadData as any)?.count || (unreadData as any)?.unread_count || 
    allNotifications.filter((n: any) => !n.read_at).length;

  // Debug logging
  useEffect(() => {
    console.log('User Notifications:', {
      total: allNotifications.length,
      unreadCount,
      unreadData,
      notifications: allNotifications
    });
  }, [allNotifications, unreadCount, unreadData]);

  return (
    <NotificationBell
      notifications={notifications}
      unreadCount={unreadCount}
      onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
      onMarkAllAsRead={() => markAllAsReadMutation.mutate()}
      onDelete={(id) => deleteNotificationMutation.mutate(id)}
      onViewAll={() => router.push('/dashboard/notifications')}
      isLoading={isLoading}
      variant="dark"
      isAdmin={false}
    />
  );
}
