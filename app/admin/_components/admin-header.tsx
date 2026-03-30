"use client";

import { Bell, MessageSquare, Search, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { NotificationBell } from "@/lib/components/NotificationBell";
import { useAdminNotifications, useAdminUnreadCount, useAdminMarkAsRead, useAdminMarkAllAsRead, useAdminDeleteNotification } from "@/lib/hooks/admin";

// Temporary debug import - remove after testing
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('@/lib/utils/csrf-debug').then(({ debugCSRFToken }) => {
    (window as any).debugCSRF = debugCSRFToken;
  });
}

export function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Notification hooks - fetch more notifications to get accurate unread count
  const { data: notificationsData, isLoading: notificationsLoading } = useAdminNotifications({ page: 1, per_page: 20 });
  const { data: unreadData } = useAdminUnreadCount();
  const markAsReadMutation = useAdminMarkAsRead();
  const markAllAsReadMutation = useAdminMarkAllAsRead();
  const deleteNotificationMutation = useAdminDeleteNotification();

  const allNotifications = (notificationsData as any)?.data?.data || [];
  const notifications = allNotifications.slice(0, 5); // Show only 5 in dropdown
  
  // Calculate unread count from all fetched notifications
  const unreadCount = (unreadData as any)?.count || (unreadData as any)?.unread_count || 
    allNotifications.filter((n: any) => !n.read_at).length;

  // Debug logging
  useEffect(() => {
    console.log('Admin Notifications:', {
      total: allNotifications.length,
      unreadCount,
      unreadData,
      notifications: allNotifications
    });
  }, [allNotifications, unreadCount, unreadData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API fails
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  // Get user initials
  const getInitials = () => {
    if (!user) return "AD";
    const name = user.name || user.first_name || "Admin";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return "Admin User";
    return user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;
  };

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-gray-100 bg-white px-8">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search stock, order, etc"
          className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Message Icon */}
        <button className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700">
          <MessageSquare className="h-5 w-5" />
        </button>

        {/* Notification Bell */}
        <NotificationBell
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
          onMarkAllAsRead={() => markAllAsReadMutation.mutate()}
          onDelete={(id) => deleteNotificationMutation.mutate(id)}
          onViewAll={() => router.push('/admin/notifications')}
          isLoading={notificationsLoading}
          variant="light"
          isAdmin={true}
        />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 transition-all hover:border-gray-300 hover:shadow-sm"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-orange-500">
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
                {getInitials()}
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-900">{getDisplayName()}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{getDisplayName()}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <div className="py-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push('/admin/profile');
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push('/admin/settings');
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>

              <div className="border-t border-gray-100 py-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
