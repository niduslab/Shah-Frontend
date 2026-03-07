'use client';

import { useState } from 'react';
import { X, Star, User, Package, Calendar, ThumbsUp, MessageSquare, Send } from 'lucide-react';
import { useRespondToReview } from '@/lib/hooks/admin/useAdminReviews';
import { toast } from 'sonner';

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  order_item_id: number;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_response?: string;
  rejection_reason?: string;
  images?: string[];
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  product: {
    id: number;
    name: string;
    slug: string;
    image?: string;
  };
}

interface ReviewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review;
}

export default function ReviewDetailsModal({ isOpen, onClose, review }: ReviewDetailsModalProps) {
  const [response, setResponse] = useState(review.admin_response || '');
  const respondMutation = useRespondToReview();

  if (!isOpen) return null;

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      toast.error('Please enter a response');
      return;
    }

    try {
      await respondMutation.mutateAsync({ id: review.id, response });
      toast.success('Response submitted successfully');
      setResponse('');
      onClose();
    } catch (error) {
      toast.error('Failed to submit response');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20">Approved</span>;
      case 'pending':
        return <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-amber-100 text-amber-700 ring-1 ring-amber-600/20">Pending</span>;
      case 'rejected':
        return <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-red-100 text-red-700 ring-1 ring-red-600/20">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Review Details</h2>
              <p className="text-sm text-gray-500">Review #{review.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {renderStars(review.rating)}
              <span className="text-lg font-semibold text-gray-900">{review.rating}.0</span>
            </div>
            {getStatusBadge(review.status)}
          </div>

          {/* Review Title and Content */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{review.title}</h3>
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Review Images</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg ring-1 ring-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="rounded-xl bg-gray-50 p-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-900">
                  {review.user.first_name} {review.user.last_name}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{review.user.email}</p>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="rounded-xl bg-gray-50 p-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Product Information
            </h4>
            <div className="flex items-center gap-3">
              {review.product.image && (
                <img
                  src={review.product.image}
                  alt={review.product.name}
                  className="h-16 w-16 rounded-lg object-cover ring-1 ring-gray-200"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{review.product.name}</p>
                <p className="text-sm text-gray-500">Product ID: {review.product_id}</p>
              </div>
            </div>
          </div>

          {/* Review Metadata */}
          <div className="rounded-xl bg-gray-50 p-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Review Metadata
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Submitted</p>
                <p className="font-medium text-gray-900">{formatDate(review.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-medium text-gray-900">{formatDate(review.updated_at)}</p>
              </div>
              <div>
                <p className="text-gray-500">Order Item ID</p>
                <p className="font-medium text-gray-900">{review.order_item_id}</p>
              </div>
              <div>
                <p className="text-gray-500 flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  Helpful Count
                </p>
                <p className="font-medium text-gray-900">{review.helpful_count}</p>
              </div>
            </div>
          </div>

          {/* Existing Admin Response */}
          {review.admin_response && (
            <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Current Admin Response</h4>
              <p className="text-sm text-blue-800">{review.admin_response}</p>
            </div>
          )}

          {/* Rejection Reason */}
          {review.rejection_reason && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-100">
              <h4 className="text-sm font-semibold text-red-900 mb-2">Rejection Reason</h4>
              <p className="text-sm text-red-800">{review.rejection_reason}</p>
            </div>
          )}

          {/* Admin Response Form */}
          {review.status === 'approved' && (
            <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {review.admin_response ? 'Update Admin Response' : 'Add Admin Response'}
              </h4>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write your response to this review..."
                rows={4}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
              <button
                onClick={handleSubmitResponse}
                disabled={respondMutation.isPending || !response.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                {respondMutation.isPending ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-all hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
