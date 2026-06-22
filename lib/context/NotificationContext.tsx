'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

// Expose Pusher globally so Laravel Echo's reverb broadcaster can find it
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}
import { playNotificationSound } from '@/lib/utils/notification-helper';

interface NotificationContextType {
  unreadCount: number;
  isConnected: boolean;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  isConnected: false,
  refreshNotifications: () => {},
});

export const useNotificationContext = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: React.ReactNode;
  userId?: number;
  isAdmin?: boolean;
}

export function NotificationProvider({ children, userId, isAdmin = false }: NotificationProviderProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  const refreshNotifications = useCallback(() => {
    const queryKey = isAdmin ? ['admin-notifications', 'unread-count'] : ['notifications', 'unread-count'];
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, isAdmin]);

  useEffect(() => {
    if (!userId) return;

    // Initialize Echo with Laravel Reverb
    const pusher = new Pusher(process.env.NEXT_PUBLIC_REVERB_APP_KEY || '', {
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
      wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8080'),
      wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8080'),
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http') === 'https',
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
    } as any);

    const echo = new Echo({
      broadcaster: 'reverb',
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
      wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8080'),
      wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8080'),
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http') === 'https',
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      },
    });

    // Connection status
    pusher.connection.bind('connected', () => {
      setIsConnected(true);
      console.log('✅ Reverb notification service connected');
    });

    pusher.connection.bind('disconnected', () => {
      setIsConnected(false);
      console.log('❌ Reverb notification service disconnected');
    });

    // Subscribe to user/admin channel
    const channelName = isAdmin ? `admin.${userId}` : `user.${userId}`;
    const channel = echo.private(channelName);

    // Listen for notifications
    channel.notification((notification: any) => {
      console.log('📬 New notification:', notification);
      
      // Play notification sound
      playNotificationSound();
      
      // Update unread count
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast.info(
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">🔔</span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {notification.title}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {notification.message}
            </p>
          </div>
        </div>,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // Refresh notifications list
      refreshNotifications();
    });

    return () => {
      channel.stopListening('.notification');
      echo.leave(channelName);
      echo.disconnect();
    };
  }, [userId, isAdmin, refreshNotifications]);

  return (
    <NotificationContext.Provider value={{ unreadCount, isConnected, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}
