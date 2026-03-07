'use client';

import { useState } from 'react';
import { Star, Search, MessageSquare, CheckCircle, XCircle, Trash2, Eye, Filter } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import { 
  useAdminReviews,
  useReviewStatistics,
  useApproveReview,
  useRejectReview,
  useDeleteReview
} from '@/lib/hooks/admin/useAdminReviews';
import ReviewDetailsModal from '@/app/admin/reviews/_components/ReviewDetailsModal';
import RejectReviewModal from '@/app/admin/reviews/_components/RejectReviewModal';
import DeleteConfirmModal from '@/app/admin/reviews/_components/DeleteConfirmModal';

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

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const filters = {
    page: currentPage,
    per_page: 15,
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };

  const { data: reviewsData, isLoading } = useAdminReviews(filters);
  const { data: statsData } = useReviewStatistics();
  const approveMutation = useApproveReview();
  const rejectMutation = useRejectReview();
  const deleteMutation = useDeleteReview();

  const reviews = (reviewsData as any)?.data?.data || [];
  const paginationData = (reviewsData as any)?.data;
  const stats = (statsData as any)?.data;

  const filteredReviews = reviews.filter((review: Review) => {
    const matchesSearch = 
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${review.user.first_name} ${review.user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = ratingFilter === null || review.rating === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  const handleViewDetails = (review: Review) => {
    setSelectedReview(review);
    setIsDetailsModalOpen(true);
  };

  const handleApprove = async (review: Review) => {
    try {
      await approveMutation.mutateAsync(review.id);
      toast.success('Review approved', {
        description: `Review by ${review.user.first_name} has been approved.`
      });
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const handleReject = (review: Review) => {
    setSelectedReview(review);
    setIsRejectModalOpen(true);
  };

  const handleDelete = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
  };

  const confirmReject = async (reason: string) => {
    if (selectedReview) {
      try {
        await rejectMutation.mutateAsync({ id: selectedReview.id, reason });
        toast.success('Review rejected');
        setIsRejectModalOpen(false);
        setSelectedReview(null);
      } catch (error) {
        toast.error('Failed to reject review');
      }
    }
  };

  const confirmDelete = async () => {
    if (selectedReview) {
      try {
        await deleteMutation.mutateAsync(selectedReview.id);
        toast.success('Review deleted');
        setIsDeleteModalOpen(false);
        setSelectedReview(null);
      } catch (error) {
        toast.error('Failed to delete review');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20">Approved</span>;
      case 'pending':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 ring-1 ring-amber-600/20">Pending</span>;
      case 'rejected':
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 ring-1 ring-red-600/20">Rejected</span>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
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
          <p className="text-sm font-medium text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>
              <p className="text-sm text-gray-600">Manage and moderate product reviews</p>
            </div>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_reviews || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending_reviews || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <Filter className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved_reviews || 0}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.average_rating ? Number(stats.average_rating).toFixed(1) : '0.0'}
                    <span className="text-sm text-gray-500 ml-1">/ 5.0</span>
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <Star className="h-6 w-6 text-amber-600 fill-amber-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews, products, or customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
                <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      statusFilter === 'all'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      statusFilter === 'pending'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setStatusFilter('approved')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      statusFilter === 'approved'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setStatusFilter('rejected')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      statusFilter === 'rejected'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Rejected
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Rating</label>
                <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                  <button
                    onClick={() => setRatingFilter(null)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      ratingFilter === null
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All
                  </button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setRatingFilter(rating)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        ratingFilter === rating
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {rating}★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {!filteredReviews || filteredReviews.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <MessageSquare className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {searchQuery ? 'No reviews found' : 'No reviews yet'}
              </h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search or filters' : 'Reviews will appear here once customers start reviewing products'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredReviews.map((review: Review) => (
                <div
                  key={review.id}
                  className="group p-6 transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
                >
                  <div className="flex gap-4">
                    {review.product.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={review.product.image}
                          alt={review.product.name}
                          className="h-16 w-16 rounded-lg object-cover ring-1 ring-gray-200"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {renderStars(review.rating)}
                            {getStatusBadge(review.status)}
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1">{review.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="font-medium text-gray-700">
                          {review.user.first_name} {review.user.last_name}
                        </span>
                        <span>•</span>
                        <span>{review.product.name}</span>
                        <span>•</span>
                        <span>{formatDate(review.created_at)}</span>
                        {review.helpful_count > 0 && (
                          <>
                            <span>•</span>
                            <span>{review.helpful_count} found helpful</span>
                          </>
                        )}
                      </div>

                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {review.images.slice(0, 4).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="h-12 w-12 rounded-lg object-cover ring-1 ring-gray-200"
                            />
                          ))}
                          {review.images.length > 4 && (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs font-medium text-gray-600">
                              +{review.images.length - 4}
                            </div>
                          )}
                        </div>
                      )}

                      {review.admin_response && (
                        <div className="mt-3 rounded-lg bg-blue-50 p-3 border border-blue-100">
                          <p className="text-xs font-medium text-blue-900 mb-1">Admin Response:</p>
                          <p className="text-sm text-blue-800">{review.admin_response}</p>
                        </div>
                      )}

                      {review.rejection_reason && (
                        <div className="mt-3 rounded-lg bg-red-50 p-3 border border-red-100">
                          <p className="text-xs font-medium text-red-900 mb-1">Rejection Reason:</p>
                          <p className="text-sm text-red-800">{review.rejection_reason}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleViewDetails(review)}
                        className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50"
                        title="View details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {review.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(review)}
                            className="rounded-lg p-2 text-emerald-600 transition-all hover:bg-emerald-50"
                            title="Approve"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleReject(review)}
                            className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                            title="Reject"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(review)}
                        className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-50"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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

        {selectedReview && (
          <>
            <ReviewDetailsModal
              isOpen={isDetailsModalOpen}
              onClose={() => {
                setIsDetailsModalOpen(false);
                setSelectedReview(null);
              }}
              review={selectedReview}
            />

            <RejectReviewModal
              isOpen={isRejectModalOpen}
              onClose={() => {
                setIsRejectModalOpen(false);
                setSelectedReview(null);
              }}
              onConfirm={confirmReject}
              isLoading={rejectMutation.isPending}
            />

            <DeleteConfirmModal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false);
                setSelectedReview(null);
              }}
              onConfirm={confirmDelete}
              isLoading={deleteMutation.isPending}
            />
          </>
        )}
      </div>
    </div>
  );
}
