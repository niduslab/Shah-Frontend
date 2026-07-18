'use client';

import { useState } from 'react';
import { Search, Eye, Trash2, Mail, Phone, Calendar, MessageSquare, Inbox } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import {
  useContactMessages,
  useContactMessageStatistics,
  useUpdateContactMessageStatus,
  useDeleteContactMessage,
} from '@/lib/hooks/admin';
import MessageDetailsModal from '@/app/admin/contact-messages/_components/MessageDetailsModal';
import DeleteConfirmModal from '@/app/admin/contact-messages/_components/DeleteConfirmModal';

interface ContactMessage {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

const statusStyles: Record<ContactMessage['status'], string> = {
  new: 'bg-orange-100 text-orange-700',
  read: 'bg-blue-100 text-blue-700',
  replied: 'bg-emerald-100 text-emerald-700',
};

export default function ContactMessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const filters = {
    page: currentPage,
    per_page: 15,
    search: searchQuery || undefined,
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };

  const { data: messagesData, isLoading } = useContactMessages(filters);
  const { data: statisticsData } = useContactMessageStatistics();
  const updateStatusMutation = useUpdateContactMessageStatus();
  const deleteMutation = useDeleteContactMessage();

  const messages = (messagesData as any)?.data?.data || [];
  const paginationData = (messagesData as any)?.data;
  const statistics = (statisticsData as any)?.data;

  const handleViewDetails = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDetailsModalOpen(true);
    if (message.status === 'new') {
      updateStatusMutation.mutate({ id: message.id, status: 'read' });
    }
  };

  const handleDelete = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedMessage) {
      try {
        await deleteMutation.mutateAsync(selectedMessage.id);
        toast.success('Contact message deleted successfully');
        setIsDeleteModalOpen(false);
        setSelectedMessage(null);
      } catch (error) {
        toast.error('Failed to delete contact message');
      }
    }
  };

  const handleMarkReplied = async (message: ContactMessage) => {
    try {
      await updateStatusMutation.mutateAsync({ id: message.id, status: 'replied' });
      toast.success('Marked as replied');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading contact messages...</p>
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
              <Inbox className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
              <p className="text-sm text-gray-600">View and manage messages submitted through the contact page</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.total_messages || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{statistics.new_messages || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                  <Inbox className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Replied</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{statistics.replied_messages || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <Mail className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last {statistics.days || 30} Days</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{statistics.recent_messages || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or message..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>

            {/* Status Filter */}
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
              <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 overflow-x-auto">
                {(['all', 'new', 'read', 'replied'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all whitespace-nowrap ${
                      statusFilter === status
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {!messages || messages.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <Inbox className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {searchQuery ? 'No messages found' : 'No messages yet'}
              </h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search or filters' : 'Contact form submissions will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {messages.map((message: ContactMessage) => {
                const fullName = [message.first_name, message.last_name].filter(Boolean).join(' ');
                return (
                  <div
                    key={message.id}
                    className="group p-6 transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white font-semibold">
                            {fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-gray-900 truncate">{fullName}</h3>
                              <span
                                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[message.status]}`}
                              >
                                {message.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              <Calendar className="inline h-3 w-3 mr-1" />
                              {formatDate(message.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span className="truncate">{message.email}</span>
                          </div>
                          {message.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-4 w-4 text-purple-600 shrink-0" />
                              <span>{message.phone}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-gray-500 line-clamp-2">{message.message}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-start">
                        {message.status !== 'replied' && (
                          <button
                            onClick={() => handleMarkReplied(message)}
                            className="rounded-lg p-2 text-emerald-600 transition-all hover:bg-emerald-50"
                            title="Mark as replied"
                            disabled={updateStatusMutation.isPending}
                          >
                            <Mail className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleViewDetails(message)}
                          className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50"
                          title="View details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(message)}
                          className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                          title="Delete message"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {paginationData && paginationData.last_page > 1 && (
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
        {selectedMessage && (
          <>
            <MessageDetailsModal
              isOpen={isDetailsModalOpen}
              onClose={() => {
                setIsDetailsModalOpen(false);
                setSelectedMessage(null);
              }}
              message={selectedMessage}
            />

            <DeleteConfirmModal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setSelectedMessage(null);
              }}
              onConfirm={confirmDelete}
              contactName={[selectedMessage.first_name, selectedMessage.last_name].filter(Boolean).join(' ')}
              isLoading={deleteMutation.isPending}
            />
          </>
        )}
      </div>
    </div>
  );
}
