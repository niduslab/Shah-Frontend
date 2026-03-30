'use client';

import { useState } from 'react';
import { Search, Download, Eye, Trash2, Mail, Phone, User, Calendar, Globe } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import { useVisitorPopups, useDeleteVisitorPopup } from '@/lib/hooks/admin';
import VisitorDetailsModal from '@/app/admin/visitor-popups/_components/VisitorDetailsModal';
import DeleteConfirmModal from '@/app/admin/visitor-popups/_components/DeleteConfirmModal';

interface VisitorPopup {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  ip_address: string | null;
  user_agent: string | null;
  submitted_at: string;
}

export default function VisitorPopupsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactFilter, setContactFilter] = useState<'all' | 'email' | 'phone' | 'both'>('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorPopup | null>(null);

  const filters = {
    page: currentPage,
    per_page: 15,
    search: searchQuery || undefined,
    ...(contactFilter === 'email' && { has_email: true }),
    ...(contactFilter === 'phone' && { has_phone: true }),
    ...(contactFilter === 'both' && { has_email: true, has_phone: true }),
  };

  const { data: visitorsData, isLoading } = useVisitorPopups(filters);
  const deleteMutation = useDeleteVisitorPopup();

  const visitors = (visitorsData as any)?.data?.data || [];
  const paginationData = (visitorsData as any)?.data;
  const statistics = (visitorsData as any)?.statistics;

  const handleViewDetails = (visitor: VisitorPopup) => {
    setSelectedVisitor(visitor);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (visitor: VisitorPopup) => {
    setSelectedVisitor(visitor);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedVisitor) {
      try {
        await deleteMutation.mutateAsync(selectedVisitor.id);
        toast.success('Visitor submission deleted successfully');
        setIsDeleteModalOpen(false);
        setSelectedVisitor(null);
      } catch (error) {
        toast.error('Failed to delete visitor submission');
      }
    }
  };

  const handleExport = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/admin/visitor-popups/export`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visitor-popups-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Export completed successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading visitor submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Visitor Popup Submissions</h1>
              <p className="text-sm text-gray-600">View and manage visitor contact information</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.total_submissions || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">With Email</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{statistics.with_email || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <Mail className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">With Phone</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{statistics.with_phone || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{statistics.today || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                  <Calendar className="h-6 w-6 text-orange-600" />
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
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Contact Filter */}
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Contact Info</label>
                <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                  <button
                    onClick={() => setContactFilter('all')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      contactFilter === 'all'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setContactFilter('email')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      contactFilter === 'email'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    onClick={() => setContactFilter('phone')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      contactFilter === 'phone'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Phone
                  </button>
                  <button
                    onClick={() => setContactFilter('both')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      contactFilter === 'both'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Both
                  </button>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 mt-6"
              >
                <Download className="h-5 w-5" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Visitors List */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {!visitors || visitors.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {searchQuery ? 'No submissions found' : 'No submissions yet'}
              </h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search or filters' : 'Visitor submissions will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {visitors.map((visitor: VisitorPopup) => (
                <div
                  key={visitor.id}
                  className="group p-6 transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white font-semibold">
                          {visitor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">{visitor.name}</h3>
                          <p className="text-xs text-gray-500">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {formatDate(visitor.submitted_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                        {visitor.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-4 w-4 text-emerald-600" />
                            <span>{visitor.email}</span>
                          </div>
                        )}
                        {visitor.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-4 w-4 text-purple-600" />
                            <span>{visitor.phone}</span>
                          </div>
                        )}
                      </div>

                      {visitor.ip_address && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Globe className="h-3 w-3" />
                          <span>IP: {visitor.ip_address}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(visitor)}
                        className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50"
                        title="View details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(visitor)}
                        className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                        title="Delete submission"
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
        {selectedVisitor && (
          <>
            <VisitorDetailsModal
              isOpen={isDetailsModalOpen}
              onClose={() => {
                setIsDetailsModalOpen(false);
                setSelectedVisitor(null);
              }}
              visitor={selectedVisitor}
            />

            <DeleteConfirmModal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setSelectedVisitor(null);
              }}
              onConfirm={confirmDelete}
              visitorName={selectedVisitor.name}
              isLoading={deleteMutation.isPending}
            />
          </>
        )}
      </div>
    </div>
  );
}
