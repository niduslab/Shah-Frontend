import { X, Mail, Phone, MapPin, Calendar, MessageSquare } from 'lucide-react';

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

interface MessageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ContactMessage;
}

export default function MessageDetailsModal({ isOpen, onClose, message }: MessageDetailsModalProps) {
  if (!isOpen) return null;

  const fullName = [message.first_name, message.last_name].filter(Boolean).join(' ');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-gray-900">Message Details</h2>
            <p className="text-sm text-gray-500 mt-1">Submission ID: #{message.id}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white font-bold text-lg flex-shrink-0">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
              <p className="text-lg font-semibold text-gray-900">{fullName}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                <label className="text-xs font-medium text-gray-500">Email Address</label>
              </div>
              <a
                href={`mailto:${message.email}`}
                className="text-sm font-medium text-emerald-600 hover:underline break-words"
              >
                {message.email}
              </a>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5 text-purple-600" />
                <label className="text-xs font-medium text-gray-500">Phone Number</label>
              </div>
              {message.phone ? (
                <a
                  href={`tel:${message.phone}`}
                  className="text-sm font-medium text-purple-600 hover:underline"
                >
                  {message.phone}
                </a>
              ) : (
                <p className="text-sm text-gray-400 italic">Not provided</p>
              )}
            </div>
          </div>

          {message.address && (
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <label className="text-xs font-medium text-gray-500">Address</label>
              </div>
              <p className="text-sm font-medium text-gray-900 break-words">{message.address}</p>
            </div>
          )}

          {/* Message */}
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              <label className="text-xs font-medium text-gray-500">Message</label>
            </div>
            <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">{message.message}</p>
          </div>

          {/* Submitted At */}
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <label className="text-xs font-medium text-gray-500">Submitted At</label>
            </div>
            <p className="text-sm font-medium text-gray-900">{formatDate(message.created_at)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-gray-200 p-6 sm:flex-row sm:justify-end sm:gap-3">
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
