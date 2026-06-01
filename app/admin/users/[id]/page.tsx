'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, User, Mail, Phone, Shield, CheckCircle, XCircle,
  ShoppingBag, Heart, ShoppingCart, Calendar, Package,
  ToggleLeft, ToggleRight, Edit2,
} from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { useAdminUser, useUpdateUser, useToggleUserStatus } from '@/lib/hooks/admin/useAdminUsers';
import UserModal from '@/app/admin/users/_components/UserModal';
import { toast } from 'sonner';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

function resolveImageUrl(fullUrl?: string): string | undefined {
  if (!fullUrl) return undefined;
  if (fullUrl.startsWith('http')) return fullUrl;
  return `${apiUrl}${fullUrl}`;
}

const PER_PAGE = 10;

type Tab = 'overview' | 'orders' | 'wishlist' | 'cart';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const userId = parseInt(id, 10);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [ordersPage, setOrdersPage] = useState(1);
  const [wishlistPage, setWishlistPage] = useState(1);
  const [cartPage, setCartPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const toggleStatusMutation = useToggleUserStatus();
  const updateMutation = useUpdateUser();

  const params = {
    per_page: PER_PAGE,
    orders_page: ordersPage,
    wishlist_page: wishlistPage,
    cart_page: cartPage,
  };

  const { data: userData, isLoading } = useAdminUser(userId, params);
  const user = (userData as any)?.data;

  const orders        = user?.orders;
  const wishlist      = user?.wishlist;
  const abandonedCart = user?.abandoned_cart;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'admin':
        return <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 ring-1 ring-purple-600/20">Admin</span>;
      case 'vendor':
        return <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 ring-1 ring-blue-600/20">Vendor</span>;
      default:
        return <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-teal-100 text-teal-700 ring-1 ring-teal-600/20">Customer</span>;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending:    'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
      processing: 'bg-blue-100 text-blue-700 ring-blue-600/20',
      shipped:    'bg-indigo-100 text-indigo-700 ring-indigo-600/20',
      delivered:  'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
      cancelled:  'bg-red-100 text-red-700 ring-red-600/20',
    };
    const cls = map[status] ?? 'bg-gray-100 text-gray-700 ring-gray-600/20';
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 capitalize ${cls}`}>
        {status}
      </span>
    );
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'overview',  label: 'Overview',       icon: <User className="h-4 w-4" /> },
    { key: 'orders',    label: 'Orders',          icon: <Package className="h-4 w-4" />,       count: orders?.total },
    { key: 'wishlist',  label: 'Wishlist',        icon: <Heart className="h-4 w-4" />,          count: wishlist?.total },
    { key: 'cart',      label: 'Abandoned Cart',  icon: <ShoppingCart className="h-4 w-4" />,   count: abandonedCart?.total },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading user...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Back + Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow ring-1 ring-gray-200 transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-sm text-gray-500">User #{user.id}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#FF6F00] shadow ring-1 ring-gray-200 transition hover:bg-orange-50"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={async () => {
                try {
                  await toggleStatusMutation.mutateAsync(user.id);
                  toast.success(`User ${user.status ? 'deactivated' : 'activated'}`);
                } catch {
                  toast.error('Failed to toggle status');
                }
              }}
              disabled={toggleStatusMutation.isPending}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium shadow ring-1 ring-gray-200 transition ${
                user.status
                  ? 'bg-white text-emerald-600 hover:bg-emerald-50'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {user.status
                ? <><ToggleRight className="h-4 w-4" /> Active</>
                : <><ToggleLeft className="h-4 w-4" /> Inactive</>
              }
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 p-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white text-3xl font-bold">
              {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900">
                {user.first_name} {user.last_name}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {getUserTypeBadge(user.user_type)}
                {user.status ? (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20">
                    <CheckCircle className="h-3 w-3 mr-1" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-600/20">
                    <XCircle className="h-3 w-3 mr-1" /> Inactive
                  </span>
                )}
                {user.email_verified_at && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 ring-1 ring-blue-600/20">
                    Email Verified
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{user.email}</span>
                {user.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{user.phone}</span>}
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />Joined {formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Stat pills */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-gray-50 p-3 text-center ring-1 ring-gray-100">
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{orders?.total ?? 0}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center ring-1 ring-gray-100">
              <p className="text-xs text-gray-500">Wishlist</p>
              <p className="text-xl font-bold text-rose-600">{wishlist?.total ?? 0}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center ring-1 ring-gray-100">
              <p className="text-xs text-gray-500">Abandoned Cart</p>
              <p className="text-xl font-bold text-amber-600">{abandonedCart?.total ?? 0}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center ring-1 ring-gray-100">
              <p className="text-xs text-gray-500">Addresses</p>
              <p className="text-xl font-bold text-gray-900">{user.addresses?.length ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-2xl bg-white p-1.5 shadow ring-1 ring-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 overflow-hidden">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="divide-y divide-gray-100">
              <Section title="Contact Information" icon={<Mail className="h-4 w-4" />}>
                <Grid>
                  <Field label="Email" value={user.email} />
                  <Field label="Phone" value={user.phone || '—'} />
                </Grid>
              </Section>
              <Section title="Account Information" icon={<Shield className="h-4 w-4" />}>
                <Grid>
                  <Field label="User ID" value={`#${user.id}`} />
                  <Field label="User Type" value={<span className="capitalize">{user.user_type}</span>} />
                  <Field label="Status" value={user.status ? 'Active' : 'Inactive'} />
                  <Field label="Email Verification" value={user.email_verified_at ? 'Verified' : 'Not Verified'} />
                </Grid>
              </Section>
              <Section title="Timestamps" icon={<Calendar className="h-4 w-4" />}>
                <Grid>
                  <Field label="Created At" value={formatDateTime(user.created_at)} />
                  <Field label="Last Updated" value={formatDateTime(user.updated_at)} />
                  {user.email_verified_at && (
                    <Field label="Email Verified At" value={formatDateTime(user.email_verified_at)} />
                  )}
                </Grid>
              </Section>
              {user.addresses?.length > 0 && (
                <Section title="Saved Addresses" icon={<Shield className="h-4 w-4" />}>
                  <div className="space-y-2">
                    {user.addresses.map((addr: any) => (
                      <div key={addr.id} className="rounded-lg bg-gray-50 p-3 text-sm ring-1 ring-gray-200">
                        <p className="font-medium text-gray-900">{addr.label ?? 'Address'} {addr.is_default && <span className="ml-1 text-xs text-[#FF6F00]">(Default)</span>}</p>
                        <p className="text-gray-600">{[addr.address_line1, addr.address_line2, addr.city, addr.state, addr.country].filter(Boolean).join(', ')}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <>
              {!orders?.data?.length ? (
                <EmptyState icon={<Package className="h-10 w-10 text-gray-400" />} message="No orders yet" />
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {orders.data.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between gap-4 p-5">
                        <div>
                          <p className="font-semibold text-gray-900">#{order.order_number}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {getOrderStatusBadge(order.status)}
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            order.payment_status === 'paid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : order.payment_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-600'
                          } capitalize`}>
                            {order.payment_status}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 ml-auto">
                          ${parseFloat(order.total_amount ?? 0).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  {orders.last_page > 1 && (
                    <Pagination
                      currentPage={orders.current_page}
                      lastPage={orders.last_page}
                      total={orders.total}
                      perPage={orders.per_page}
                      from={orders.from}
                      to={orders.to}
                      onPageChange={(p) => setOrdersPage(p)}
                    />
                  )}
                </>
              )}
            </>
          )}

          {/* WISHLIST */}
          {activeTab === 'wishlist' && (
            <>
              {!wishlist?.data?.length ? (
                <EmptyState icon={<Heart className="h-10 w-10 text-gray-400" />} message="No wishlist items" />
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {wishlist.data.map((item: any) => {
                      const product = item.product;
                      const image   = product?.images?.find((img: any) => img.is_primary) ?? product?.images?.[0];
                      const imgSrc  = resolveImageUrl(image?.full_url);
                      return (
                        <div key={item.id} className="flex items-center gap-4 p-5">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={product?.name}
                              className="h-14 w-14 rounded-xl object-cover flex-shrink-0 ring-1 ring-gray-200"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <ShoppingBag className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{product?.name ?? '—'}</p>
                            <p className="text-xs text-gray-500">{product?.sku ?? ''}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Added {formatDate(item.created_at)}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-gray-900">${parseFloat(product?.price ?? 0).toFixed(2)}</p>
                            <span className={`text-xs font-medium ${product?.status === 'active' ? 'text-emerald-600' : 'text-gray-400'}`}>
                              {product?.status ?? '—'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {wishlist.last_page > 1 && (
                    <Pagination
                      currentPage={wishlist.current_page}
                      lastPage={wishlist.last_page}
                      total={wishlist.total}
                      perPage={wishlist.per_page}
                      from={wishlist.from}
                      to={wishlist.to}
                      onPageChange={(p) => setWishlistPage(p)}
                    />
                  )}
                </>
              )}
            </>
          )}

          {/* ABANDONED CART */}
          {activeTab === 'cart' && (
            <>
              {!abandonedCart?.data?.length ? (
                <EmptyState icon={<ShoppingCart className="h-10 w-10 text-gray-400" />} message="No abandoned cart items" />
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {abandonedCart.data.map((item: any) => {
                      const product = item.product;
                      const image   = product?.images?.find((img: any) => img.is_primary) ?? product?.images?.[0];
                      const imgSrc  = resolveImageUrl(image?.full_url);
                      return (
                        <div key={item.id} className="flex items-center gap-4 p-5">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={product?.name}
                              className="h-14 w-14 rounded-xl object-cover flex-shrink-0 ring-1 ring-gray-200"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <ShoppingCart className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{product?.name ?? '—'}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {item.event_at ? formatDate(item.event_at) : ''}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-gray-900">${parseFloat(item.price ?? 0).toFixed(2)}</p>
                            <p className="text-xs text-gray-400">per unit</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {abandonedCart.last_page > 1 && (
                    <Pagination
                      currentPage={abandonedCart.current_page}
                      lastPage={abandonedCart.last_page}
                      total={abandonedCart.total}
                      perPage={abandonedCart.per_page}
                      from={abandonedCart.from}
                      to={abandonedCart.to}
                      onPageChange={(p) => setCartPage(p)}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <UserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSubmit={async (data) => {
          try {
            await updateMutation.mutateAsync({ id: userId, data });
            toast.success('User updated successfully');
            setIsEditModalOpen(false);
          } catch {
            toast.error('Failed to update user');
          }
        }}
      />
    </div>
  );
}

/* Small helper components */
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="p-6 space-y-3">
      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        {icon}
        {title}
      </h4>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
      {icon}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
