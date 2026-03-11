'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useDashboard } from '@/lib/hooks/user';
import Link from 'next/link';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Star, 
  RotateCcw, 
  Heart,
  ShoppingBag,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserDashboard() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading, error } = useDashboard();

  const stats = dashboardData?.data?.statistics || {};
  const recentOrders = dashboardData?.data?.recent_orders || [];

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.total_orders || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/dashboard/orders'
    },
    {
      title: 'Pending Orders',
      value: stats.pending_orders || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      href: '/dashboard/orders?status=pending'
    },
    {
      title: 'Delivered Orders',
      value: stats.delivered_orders || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/dashboard/orders?status=delivered'
    },
    {
      title: 'Total Spent',
      value: `$${(stats.total_spent || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/dashboard/orders'
    },
    {
      title: 'Pending Reviews',
      value: stats.pending_reviews || 0,
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/dashboard/reviews'
    },
    {
      title: 'Active Returns',
      value: stats.active_returns || 0,
      icon: RotateCcw,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      href: '/dashboard/returns'
    },
    {
      title: 'Wishlist Items',
      value: stats.wishlist_count || 0,
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      href: '/dashboard/wishlist'
    },
    {
      title: 'Preorder Balance',
      value: `$${(stats.preorder_balance || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      href: '/dashboard/payments'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <XCircle className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-red-800 font-medium">Error loading dashboard</h3>
            <p className="text-red-600 text-sm mt-1">
              Unable to load your dashboard data. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your account activity and recent orders.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={cn(
                "p-3 rounded-full",
                stat.bgColor
              )}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-gray-700">
              <span>View details</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link 
              href="/dashboard/orders"
              className="text-sm text-[#00072D] hover:text-[#00072D]/80 font-medium"
            >
              View all orders
            </Link>
          </div>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {recentOrders.slice(0, 5).map((order: any) => (
              <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.order_number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${order.total}
                    </p>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      order.status === 'delivered' && "bg-green-100 text-green-800",
                      order.status === 'processing' && "bg-blue-100 text-blue-800",
                      order.status === 'pending' && "bg-yellow-100 text-yellow-800",
                      order.status === 'cancelled' && "bg-red-100 text-red-800"
                    )}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start shopping to see your orders here.
            </p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center px-4 py-2 bg-[#00072D] text-white text-sm font-medium rounded-md hover:bg-[#00072D]/90 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/shop"
          className="bg-gradient-to-r from-[#00072D] to-[#001a5c] p-6 rounded-lg text-white hover:from-[#001a5c] hover:to-[#00072D] transition-all"
        >
          <ShoppingBag className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Continue Shopping</h3>
          <p className="text-sm opacity-90">
            Discover new products and great deals
          </p>
        </Link>

        <Link
          href="/dashboard/wishlist"
          className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-lg text-white hover:from-rose-500 hover:to-pink-500 transition-all"
        >
          <Heart className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">My Wishlist</h3>
          <p className="text-sm opacity-90">
            View your saved favorite items
          </p>
        </Link>

        <Link
          href="/contact"
          className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-lg text-white hover:from-emerald-500 hover:to-green-500 transition-all"
        >
          <Star className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
          <p className="text-sm opacity-90">
            Contact our support team
          </p>
        </Link>
      </div>
    </div>
  );
}