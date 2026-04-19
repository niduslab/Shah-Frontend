"use client";

import { useState, useEffect } from "react";
import { Users, Loader2, ArrowLeft, Monitor, Smartphone, Tablet, X, Globe, Clock, Eye, Calendar, User as UserIcon } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/axios";
import { toast } from "sonner";

interface Visitor {
  id: number;
  session_id: string;
  user_id: number | null;
  ip_address?: string;
  user_agent?: string;
  device_type: string;
  browser?: string;
  platform?: string;
  country?: string | null;
  city?: string | null;
  referrer?: string;
  landing_page?: string;
  page_views: number;
  duration_seconds: number;
  first_visit_at: string;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    user_type: string;
    full_name: string;
  } | null;
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchVisitors();
  }, [page]);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/api/admin/analytics/visitors", {
        params: { page, limit: 20 },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        // Handle Laravel pagination format
        const data = response.data.data;
        
        // Laravel returns paginated data with nested 'data' array
        if (data && data.data && Array.isArray(data.data)) {
          setVisitors(data.data);
          setTotalPages(data.last_page || 1);
        } else if (Array.isArray(data)) {
          // Fallback for flat array
          setVisitors(data);
          setTotalPages(1);
        } else {
          setVisitors([]);
          setTotalPages(1);
        }
      } else {
        setVisitors([]);
        toast.error(response.data.message || "Failed to load visitors data");
      }
    } catch (error: any) {
      console.error("Error fetching visitors:", error);
      setVisitors([]);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to load visitors data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === 0) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const isReturningVisitor = (visitor: Visitor) => {
    return visitor.user_id !== null;
  };

  const handleViewDetails = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVisitor(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/analytics"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-3">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Visitor Sessions</h1>
            <p className="text-sm text-gray-500">Detailed visitor session information</p>
          </div>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="rounded-lg bg-white shadow-sm">
        {visitors.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Users className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Visitor Data</h3>
            <p className="mt-2 text-sm text-gray-500">
              No visitor sessions found. Start tracking by visiting your store pages.
            </p>
            <button
              onClick={fetchVisitors}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary/90"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Session
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Device
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Pages
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {visitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {visitor.session_id?.substring(0, 12)}...
                        </div>
                        <div className="text-xs text-gray-500">{visitor.ip_address}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(visitor.device_type)}
                          <div>
                            <div className="text-sm capitalize text-gray-900">{visitor.device_type}</div>
                            <div className="text-xs text-gray-500">{visitor.browser}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">{visitor.city || "Unknown"}</div>
                        <div className="text-xs text-gray-500">{visitor.country || "Unknown"}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {visitor.page_views}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {formatDuration(visitor.duration_seconds)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            isReturningVisitor(visitor)
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {isReturningVisitor(visitor) ? "Authenticated" : "Guest"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(visitor.first_visit_at).toLocaleString()}
                        </div>
                        {visitor.user && (
                          <div className="text-xs text-gray-500">{visitor.user.full_name}</div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button
                          onClick={() => handleViewDetails(visitor)}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Visitor Details Modal */}
      {showModal && selectedVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Visitor Session Details</h2>
                  <p className="text-sm text-gray-500">Session ID: {selectedVisitor.session_id}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* User Information */}
              {selectedVisitor.user ? (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Authenticated User</h3>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs text-green-700">Full Name</p>
                      <p className="font-medium text-green-900">{selectedVisitor.user.full_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700">Email</p>
                      <p className="font-medium text-green-900">{selectedVisitor.user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700">Phone</p>
                      <p className="font-medium text-green-900">{selectedVisitor.user.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700">User Type</p>
                      <p className="font-medium capitalize text-green-900">{selectedVisitor.user.user_type}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Guest Visitor</h3>
                  </div>
                  <p className="mt-1 text-sm text-blue-700">This session is from an unauthenticated visitor</p>
                </div>
              )}

              {/* Session Overview */}
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Session Overview</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Page Views</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{selectedVisitor.page_views}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">Duration</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {formatDuration(selectedVisitor.duration_seconds)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Device & Browser Information */}
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Device & Browser</h3>
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500">Device Type</p>
                      <div className="mt-1 flex items-center gap-2">
                        {getDeviceIcon(selectedVisitor.device_type)}
                        <p className="font-medium capitalize text-gray-900">{selectedVisitor.device_type}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Browser</p>
                      <p className="mt-1 font-medium text-gray-900">{selectedVisitor.browser || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Platform</p>
                      <p className="mt-1 font-medium text-gray-900">{selectedVisitor.platform || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-500">User Agent</p>
                    <p className="mt-1 text-sm text-gray-700">{selectedVisitor.user_agent}</p>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Location</h3>
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="h-4 w-4" />
                        <p className="text-xs text-gray-500">IP Address</p>
                      </div>
                      <p className="mt-1 font-medium text-gray-900">{selectedVisitor.ip_address || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">City</p>
                      <p className="mt-1 font-medium text-gray-900">{selectedVisitor.city || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Country</p>
                      <p className="mt-1 font-medium text-gray-900">{selectedVisitor.country || "Unknown"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traffic Source */}
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Traffic Source</h3>
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs text-gray-500">Landing Page</p>
                      <p className="mt-1 break-all text-sm font-medium text-gray-900">
                        {selectedVisitor.landing_page || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Referrer</p>
                      <p className="mt-1 break-all text-sm font-medium text-gray-900">
                        {selectedVisitor.referrer || "Direct"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Timeline</h3>
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">First Visit</p>
                        <p className="font-medium text-gray-900">
                          {new Date(selectedVisitor.first_visit_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Last Activity</p>
                        <p className="font-medium text-gray-900">
                          {new Date(selectedVisitor.last_activity_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Session Created</p>
                        <p className="font-medium text-gray-900">
                          {new Date(selectedVisitor.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                onClick={closeModal}
                className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-black hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
