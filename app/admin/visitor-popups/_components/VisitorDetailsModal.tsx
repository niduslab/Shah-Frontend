import { X, Mail, Phone, Globe, Calendar, Monitor } from 'lucide-react';

interface VisitorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitor: {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    ip_address: string | null;
    user_agent: string | null;
    submitted_at: string;
  };
}

export default function VisitorDetailsModal({ isOpen, onClose, visitor }: VisitorDetailsModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Visitor Details</h2>
            <p className="text-sm text-gray-500 mt-1">Submission ID: #{visitor.id}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white font-bold text-lg flex-shrink-0">
              {visitor.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
              <p className="text-lg font-semibold text-gray-900">{visitor.name}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                <label className="text-xs font-medium text-gray-500">Email Address</label>
              </div>
              {visitor.email ? (
                <a
                  href={`mailto:${visitor.email}`}
                  className="text-sm font-medium text-emerald-600 hover:underline"
                >
                  {visitor.email}
                </a>
              ) : (
                <p className="text-sm text-gray-400 italic">Not provided</p>
              )}
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-purple-600" />
                <label className="text-xs font-medium text-gray-500">Phone Number</label>
              </div>
              {visitor.phone ? (
                <a
                  href={`tel:${visitor.phone}`}
                  className="text-sm font-medium text-purple-600 hover:underline"
                >
                  {visitor.phone}
                </a>
              ) : (
                <p className="text-sm text-gray-400 italic">Not provided</p>
              )}
            </div>
          </div>

          {/* Technical Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Technical Information</h3>
            
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <label className="text-xs font-medium text-gray-500">Submitted At</label>
              </div>
              <p className="text-sm font-medium text-gray-900">{formatDate(visitor.submitted_at)}</p>
            </div>

            {visitor.ip_address && (
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  <label className="text-xs font-medium text-gray-500">IP Address</label>
                </div>
                <p className="text-sm font-medium text-gray-900 font-mono">{visitor.ip_address}</p>
              </div>
            )}

            {visitor.user_agent && (
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="h-5 w-5 text-indigo-600" />
                  <label className="text-xs font-medium text-gray-500">User Agent</label>
                </div>
                <p className="text-xs text-gray-700 break-all">{visitor.user_agent}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="rounded-xl px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
