"use client";

import { useEffect, useState } from "react";
import { X, Star, ThumbsUp, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: number;
  user_id: number;
  product_id: number;
  order_id: number;
  rating: number;
  title: string;
  comment: string;
  helpful_count: number;
  status: string;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

interface ReviewsModalProps {
  product: any;
}

export function ReviewsModal({ product }: ReviewsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const handleOpen = (event: any) => {
      if (event.detail?.product) {
        setReviews(event.detail.product.approved_reviews || []);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
      }
    };

    window.addEventListener('openReviewsModal', handleOpen);

    return () => {
      window.removeEventListener('openReviewsModal', handleOpen);
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  if (!isOpen) return null;

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 
      : 0
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                <p className="text-sm text-gray-500 mt-1">{product.name}</p>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Rating Summary */}
            <div className="bg-gray-50 px-6 py-8 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Average Rating */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold text-gray-900 mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex text-[#ffb81e] mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "h-6 w-6",
                          i < Math.round(averageRating) ? "fill-current" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm font-medium text-gray-700">{rating}</span>
                        <Star className="h-4 w-4 text-[#ffb81e] fill-current" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#ffb81e] transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="px-6 py-6 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No reviews yet</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex text-[#ffb81e]">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={cn(
                                  "h-4 w-4",
                                  i < review.rating ? "fill-current" : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {review.rating}.0
                          </span>
                        </div>
                        {review.title && (
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {review.title}
                          </h3>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </span>
                    </div>

                    {/* Review Comment */}
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {review.comment}
                    </p>

                    {/* Admin Response */}
                    {review.admin_response && (
                      <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          Response from Shah Sports
                        </p>
                        <p className="text-sm text-blue-800">
                          {review.admin_response}
                        </p>
                      </div>
                    )}

                    {/* Helpful Count */}
                    {review.helpful_count > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <ThumbsUp className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {review.helpful_count} {review.helpful_count === 1 ? 'person' : 'people'} found this helpful
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
