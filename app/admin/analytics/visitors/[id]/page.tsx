"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Loader2, 
  ArrowLeft, 
  Monitor, 
  Smartphone, 
  Tablet,
  Globe,
  Clock,
  Eye,
  MousePointer,
  Calendar,
  User,
  Mail,
  Phone
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api/axios";
import { toast } from "sonner";

interface VisitorDetail {
  id: number;
  session_id: string;
  user_id: number | null;
  ip_address: string;
  user_agent: string;
  device_type: string;
  browser: string;
  platform: string;
  country: string | null;
  city: string | null;
  referrer: string;
  landing_page: string;
  first_visit_at: string;
  last_activity_at: string;
  page_views: number;
  duration_seconds: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    user_type: string;
    full_name: string;
  } | null;
}

export default function VisitorDetailPage() {
  const params = useParams();
  const visitorId = params.id as string;
  
  const [visitor, setVisitor] = useState<VisitorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitorDetail();
  }, [visitorId]);

  const fetchVisitorDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get(`/api/admin/analytics/visitors/${visitorId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        setVisitor(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to load visitor details");
      }
    } catch (error: any) {
      console.error("Error fetching visitor details:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to load visitor details";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-5 w-5" />;
      case "tablet":
        return <Tablet className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === 0) return "0 seconds";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} seconds`;
    return `${mins} minutes ${secs} seconds`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Visitor Not Found</h2>
          <p className="mt-2 text-sm text-gray-500">
            The visitor session you're looking for doesn't exist.
          </p>
          <Link
            href="/admin/analytics/visitors"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Visitors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/analytics/visitors"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Visitors
        </Link>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-3">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Visitor Session Details</h1>
            <p className="text-sm text-gray-500">Session ID: {visitor.session_id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Overview */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Session Overview</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Page Views</p>
                  <p className="text-xl font-bold text-gray-900">{visitor.page_views}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-purple-100 p-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-xl font-bold text-gray-900">{formatDuration(visitor.duration_seconds)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">First Visit</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(visitor.first_visit_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Activity</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(visitor.last_activity_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Device & Browser Info */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Device & Browser</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  {getDeviceIcon(visitor.device_type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{visitor.device_type}</p>
                    <p className="text-xs text-gray-500">Device Type</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{visitor.browser}</p>
                    <p className="text-xs text-gray-500">Browser</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{visitor.platform}</p>
                    <p className="text-xs text-gray-500">Operating System</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Info */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Navigation</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Referrer</p>
                <p className="mt-1 text-sm text-gray-900 break-all">
                  {visitor.referrer || "Direct"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Landing Page</p>
                <p className="mt-1 text-sm text-gray-900 break-all">
                  {visitor.landing_page}
                </p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Technical Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">IP Address</span>
                <span className="text-sm font-medium text-gray-900">{visitor.ip_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Session ID</span>
                <span className="text-sm font-mono text-gray-900">{visitor.session_id}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">User Agent</p>
                <p className="text-xs font-mono text-gray-900 break-all bg-gray-50 p-2 rounded">
                  {visitor.user_agent}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          {visitor.user ? (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">User Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">{visitor.user.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{visitor.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Phone className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{visitor.user.phone}</p>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 capitalize">
                    {visitor.user.user_type}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Visitor Type</h2>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-3">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Guest Visitor</p>
                  <p className="text-xs text-gray-500">Not authenticated</p>
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Location</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="text-sm font-medium text-gray-900">{visitor.country || "Unknown"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MousePointer className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="text-sm font-medium text-gray-900">{visitor.city || "Unknown"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Status</h2>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                visitor.user_id
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {visitor.user_id ? "Authenticated User" : "Guest Visitor"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
