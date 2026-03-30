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
  ArrowRight,
  Loader2,
  AlertCircle
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
      borderColor: 'border-blue-200',
      hoverBg: 'hover:bg-blue-100',
      href: '/dashboard/orders',
      description: 'All time orders'
    },
    {
      title: 'Pending Orders',
      value: stats.pending_orders || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      hoverBg: 'hover:bg-yellow-100',
      href: '/dashboard/orders?status=pending',
      description: 'Awaiting confirmation'
    },
    {
      title: 'Processing Orders',
      value: stats.processing_orders || 0,
      icon: Loader2,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      hoverBg: 'hover:bg-cyan-100',
      href: '/dashboard/orders?status=processing',
      description: 'Being prepared'
    },
    {
      title: 'Delivered Orders',
      value: stats.delivered_orders || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverBg: 'hover:bg-green-100',
      href: '/dashboard/orders?status=delivered',
      description: 'Successfully delivered'
    },
    {
      title: 'Cancelled Orders',
      value: stats.cancelled_orders || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      hoverBg: 'hover:bg-red-100',
      href: '/dashboard/orders?status=cancelled',
      description: 'Cancelled orders'
    },
    {
      title: 'Total Spent',
      value: `$${(stats.total_spent || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverBg: 'hover:bg-purple-100',
      href: '/dashboard/orders',
      description: 'Lifetime spending'
    },
    {
      title: 'Pending Reviews',
      value: stats.pending_reviews || 0,
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverBg: 'hover:bg-orange-100',
      href: '/dashboard/reviews',
      description: 'Products to review'
    },
    // {
    //   title: 'Active Returns',
    //   value: stats.active_returns || 0,
    //   icon: RotateCcw,
    //   color: 'text-rose-600',
    //   bgColor: 'bg-rose-50',
    //   borderColor: 'border-rose-200',
    //   hoverBg: 'hover:bg-rose-100',
    //   href: '/dashboard/returns',
    //   description: 'Return requests'
    // },
    {
      title: 'Wishlist Items',
      value: stats.wishlist_count || 0,
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      hoverBg: 'hover:bg-pink-100',
      href: '/dashboard/wishlist',
      description: 'Saved for later'
    },
    // {
    //   title: 'Preorder Balance',
    //   value: `$${(stats.preorder_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    //   icon: TrendingUp,
    //   color: 'text-indigo-600',
    //   bgColor: 'bg-indigo-50',
    //   borderColor: 'border-indigo-200',
    //   hoverBg: 'hover:bg-indigo-100',
    //   href: '/dashboard/payments',
    //   description: 'Preorder deposits'
    // }
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-3"></div>
          <div className="h-5 bg-gray-200 rounded-lg w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Dashboard</h3>
            <p className="text-red-700 text-sm mb-4">
              We're having trouble loading your dashboard data. This could be a temporary issue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00072D] to-[#001a5c] rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-blue-100 text-lg">
              Here's an overview of your account activity and recent orders.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm text-blue-100 mb-1">Member Since</p>
              <p className="text-xl font-semibold">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              href={stat.href}
              className={cn(
                "bg-white rounded-xl shadow-sm border-2 transition-all duration-200 group relative overflow-hidden",
                stat.borderColor,
                "hover:shadow-lg hover:-translate-y-1"
              )}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">
                      {stat.description}
                    </p>
                  </div>
                  <div className={cn(
                    "p-3 rounded-xl transition-transform group-hover:scale-110",
                    stat.bgColor
                  )}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  <span>View details</span>
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1 transition-all",
                stat.bgColor,
                "opacity-0 group-hover:opacity-100"
              )}></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-600 mt-1">Track and manage your recent purchases</p>
            </div>
            <Link 
              href="/dashboard/orders"
              className="inline-flex items-center px-4 py-2 bg-[#00072D] text-white text-sm font-medium rounded-lg hover:bg-[#00072D]/90 transition-colors"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {recentOrders.slice(0, 5).map((order: any) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.order_number}`}
                className="block px-6 py-5 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={cn(
                      "flex-shrink-0 p-3 rounded-xl",
                      order.status === 'delivered' && "bg-green-50",
                      order.status === 'processing' && "bg-blue-50",
                      order.status === 'pending' && "bg-yellow-50",
                      order.status === 'cancelled' && "bg-red-50"
                    )}>
                      <Package className={cn(
                        "h-6 w-6",
                        order.status === 'delivered' && "text-green-600",
                        order.status === 'processing' && "text-blue-600",
                        order.status === 'pending' && "text-yellow-600",
                        order.status === 'cancelled' && "text-red-600"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900">
                          Order #{order.order_number}
                        </p>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          order.status === 'delivered' && "bg-green-100 text-green-800",
                          order.status === 'processing' && "bg-blue-100 text-blue-800",
                          order.status === 'pending' && "bg-yellow-100 text-yellow-800",
                          order.status === 'cancelled' && "bg-red-100 text-red-800"
                        )}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      {order.items && order.items.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-gray-900">
                      ${parseFloat(order.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 mt-1">
                      <span>View details</span>
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Start shopping to see your orders here. Browse our collection of premium fitness equipment.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-[#00072D] text-white text-sm font-medium rounded-lg hover:bg-[#00072D]/90 transition-colors shadow-sm"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/shop"
            className="relative bg-gradient-to-br from-[#00072D] to-[#001a5c] p-8 rounded-xl text-white hover:shadow-xl transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="inline-flex p-3 bg-white/10 rounded-xl mb-4 group-hover:bg-white/20 transition-colors">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Continue Shopping</h3>
              <p className="text-sm text-blue-100 mb-4">
                Discover new products and great deals on fitness equipment
              </p>
              <div className="flex items-center text-sm font-medium">
                <span>Browse Products</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/wishlist"
            className="relative bg-gradient-to-br from-pink-500 to-rose-600 p-8 rounded-xl text-white hover:shadow-xl transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="inline-flex p-3 bg-white/10 rounded-xl mb-4 group-hover:bg-white/20 transition-colors">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">My Wishlist</h3>
              <p className="text-sm text-pink-100 mb-4">
                View and manage your saved favorite items
              </p>
              <div className="flex items-center text-sm font-medium">
                <span>View Wishlist</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </Link>

          <Link
            href="/contact"
            className="relative bg-gradient-to-br from-emerald-500 to-green-600 p-8 rounded-xl text-white hover:shadow-xl transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="inline-flex p-3 bg-white/10 rounded-xl mb-4 group-hover:bg-white/20 transition-colors">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Need Help?</h3>
              <p className="text-sm text-emerald-100 mb-4">
                Contact our support team for assistance
              </p>
              <div className="flex items-center text-sm font-medium">
                <span>Get Support</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}