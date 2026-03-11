'use client';

import { X, User, Mail, Phone, Calendar, ShoppingBag, DollarSign, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useAdminUser } from '@/lib/hooks/admin/useAdminUsers';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export default function UserDetailsModal({ isOpen, onClose, userId }: UserDetailsModalProps) {
  const { data: userData, isLoading } = useAdminUser(userId);
  
  if (!isOpen) return null;

  const user = (userData as any)?.data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'admin':
        return <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 ring-1 ring-purple-600/20">Admin</span>;
      case 'vendor':
        return <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 ring-1 ring-blue-600/20">Vendor</span>;
      case 'customer':
        return <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-teal-100 text-teal-700 ring-1 ring-teal-600/20">Customer</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              <p className="text-sm text-gray-500">Complete user information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
        ) : user ? (
          <div className="p-6 space-y-6">
            {/* User Header */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white text-2xl font-bold">
                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {getUserTypeBadge(user.user_type)}
                  {user.status ? (
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-600/20">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </span>
                  )}
                  {user.email_verified_at && (
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 ring-1 ring-blue-600/20">
                      Email Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="rounded-xl bg-gray-50 p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{user.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="rounded-xl bg-gray-50 p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Account Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">User ID</p>
                  <p className="font-medium text-gray-900">#{user.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">User Type</p>
                  <p className="font-medium text-gray-900 capitalize">{user.user_type}</p>
                </div>
                <div>
                  <p className="text-gray-500">Account Status</p>
                  <p className="font-medium text-gray-900">{user.status ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email Verification</p>
                  <p className="font-medium text-gray-900">
                    {user.email_verified_at ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Statistics */}
            {(user.orders_count !== undefined || user.total_spent !== undefined) && (
              <div className="rounded-xl bg-gray-50 p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Activity Statistics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {user.orders_count !== undefined && (
                    <div>
                      <p className="text-gray-500">Total Orders</p>
                      <p className="font-medium text-gray-900">{user.orders_count}</p>
                    </div>
                  )}
                  {user.total_spent !== undefined && (
                    <div>
                      <p className="text-gray-500">Total Spent</p>
                      <p className="font-medium text-gray-900">${user.total_spent.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="rounded-xl bg-gray-50 p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timestamps
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Created At</p>
                  <p className="font-medium text-gray-900">{formatDate(user.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">{formatDate(user.updated_at)}</p>
                </div>
                {user.email_verified_at && (
                  <div>
                    <p className="text-gray-500">Email Verified At</p>
                    <p className="font-medium text-gray-900">{formatDate(user.email_verified_at)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray-500">User not found</p>
          </div>
        )}

        <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-all hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
