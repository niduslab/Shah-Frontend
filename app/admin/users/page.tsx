'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Search, Users, UserCheck, UserX, Eye, ToggleLeft, ToggleRight, Mail, Phone } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import {
  useAdminUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useToggleUserStatus
} from '@/lib/hooks/admin/useAdminUsers';
import UserModal from '@/app/admin/users/_components/UserModal';
import DeleteConfirmModal from '@/app/admin/users/_components/DeleteConfirmModal';
import { formatCurrency } from '@/lib/utils/currency';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_type: 'customer' | 'admin' | 'vendor';
  status: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  orders_count?: number;
  total_spent?: number;
}

export default function UsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'customer' | 'admin' | 'vendor'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filters = {
    page: currentPage,
    per_page: 15,
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
    ...(userTypeFilter !== 'all' && { user_type: userTypeFilter }),
    ...(statusFilter !== 'all' && { status: statusFilter === 'active' }),
  };

  const { data: usersData, isLoading, isFetching } = useAdminUsers(filters);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();

  const users = (usersData as any)?.data?.data || [];
  const paginationData = (usersData as any)?.data;
  const filteredUsers = users;

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleViewDetails = (user: User) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await toggleStatusMutation.mutateAsync(user.id);
      toast.success(`User ${user.status ? 'deactivated' : 'activated'}`, {
        description: `${user.first_name} ${user.last_name} has been ${user.status ? 'deactivated' : 'activated'}.`
      });
    } catch (error) {
      toast.error('Failed to toggle user status');
    }
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteMutation.mutateAsync(selectedUser.id);
        toast.success('User deleted successfully', {
          description: `${selectedUser.first_name} ${selectedUser.last_name} has been removed.`
        });
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20">Active</span>
    ) : (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-600/20">Inactive</span>
    );
  };

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'admin':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 ring-1 ring-purple-600/20">Admin</span>;
      case 'vendor':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 ring-1 ring-blue-600/20">Vendor</span>;
      case 'customer':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-teal-100 text-teal-700 ring-1 ring-teal-600/20">Customer</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading && !usersData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-sm text-gray-600">Manage customers, admins, and vendors</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{paginationData?.total || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-teal-600 mt-1">
                  {users.filter((u: User) => u.user_type === 'customer').length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
                <UserCheck className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {users.filter((u: User) => u.user_type === 'admin').length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">
                  {users.filter((u: User) => !u.status).length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                <UserX className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-10 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
              {isFetching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-[#FF6F00]" />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* User Type Filter */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">User Type</label>
                <div className="flex flex-wrap items-center gap-1 rounded-xl bg-gray-100 p-1">
                  <button
                    onClick={() => { setUserTypeFilter('all'); setCurrentPage(1); }}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      userTypeFilter === 'all'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => { setUserTypeFilter('customer'); setCurrentPage(1); }}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      userTypeFilter === 'customer'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Customers
                  </button>
                  <button
                    onClick={() => { setUserTypeFilter('admin'); setCurrentPage(1); }}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      userTypeFilter === 'admin'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Admins
                  </button>
                  <button
                    onClick={() => { setUserTypeFilter('vendor'); setCurrentPage(1); }}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      userTypeFilter === 'vendor'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Vendors
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
                <div className="flex flex-wrap items-center gap-1 rounded-xl bg-gray-100 p-1">
                  <button
                    onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      statusFilter === 'all'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => { setStatusFilter('active'); setCurrentPage(1); }}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      statusFilter === 'active'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => { setStatusFilter('inactive'); setCurrentPage(1); }}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      statusFilter === 'inactive'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
            >
              <Plus className="h-5 w-5" />
              Create User
            </button>
          </div>
        </div>

        {/* Users List */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {!filteredUsers || filteredUsers.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {searchQuery ? 'No users found' : 'No users yet'}
              </h3>
              <p className="mb-8 text-gray-500">
                {searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating your first user'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/30"
                >
                  <Plus className="h-5 w-5" />
                  Create User
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user: User) => (
                <div
                  key={user.id}
                  className="group p-6 transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white font-semibold">
                          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-gray-900 truncate">
                            {user.first_name} {user.last_name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            {getUserTypeBadge(user.user_type)}
                            {getStatusBadge(user.status)}
                            {user.email_verified_at && (
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 ring-1 ring-blue-600/20">
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Mail className="h-4 w-4 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-4 w-4 shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span>Joined {formatDate(user.created_at)}</span>
                        {user.orders_count !== undefined && (
                          <>
                            <span>•</span>
                            <span>{user.orders_count} orders</span>
                          </>
                        )}
                        {user.total_spent !== undefined && (
                          <>
                            <span>•</span>
                            <span>{formatCurrency(user.total_spent)} spent</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`rounded-lg p-2 transition-all ${
                          user.status
                            ? 'text-emerald-600 hover:bg-emerald-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={user.status ? 'Deactivate' : 'Activate'}
                        disabled={toggleStatusMutation.isPending}
                      >
                        {user.status ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50"
                        title="View details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50"
                        title="Edit user"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                        title="Delete user"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {paginationData && paginationData.total > 0 && (
            <Pagination
              currentPage={paginationData.current_page}
              lastPage={paginationData.last_page}
              total={paginationData.total}
              perPage={paginationData.per_page}
              from={paginationData.from}
              to={paginationData.to}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>

        {/* Modals */}
        <UserModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onSubmit={async (data) => {
            try {
              if (selectedUser) {
                await updateMutation.mutateAsync({ id: selectedUser.id, data });
                toast.success('User updated successfully');
              } else {
                await createMutation.mutateAsync(data);
                toast.success('User created successfully');
              }
              setIsModalOpen(false);
              setSelectedUser(null);
            } catch (error) {
              toast.error(selectedUser ? 'Failed to update user' : 'Failed to create user');
            }
          }}
        />

        {selectedUser && (
          <>
            <DeleteConfirmModal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
              }}
              onConfirm={confirmDelete}
              userName={`${selectedUser.first_name} ${selectedUser.last_name}`}
              isLoading={deleteMutation.isPending}
            />
          </>
        )}
      </div>
    </div>
  );
}
