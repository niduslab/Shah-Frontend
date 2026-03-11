'use client';

import { useState } from 'react';
import { useMyReviews, useSubmitReview } from '@/lib/hooks/user/useUserReviews';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, 
  MessageSquare, 
  Calendar,
  Package,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPrimaryImageUrl } from '@/lib/utils/image';

export default function ReviewsPage() {
  const { data: reviewsData, isLoading, error } = useMyReviews();
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Handle API response
  let reviews: any[] = [];
  if (reviewsData) {
    const data = reviewsData as any;
    if (data.success && data.data) {
      reviews = Array.isArray(data.data) ? data.data : [];
    } else if (Array.isArray(data)) {
      reviews = data;
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-4 h-4",
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <MessageSquare className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-red-800 font-medium">Error loading reviews</h3>
            <p className="text-red-600 text-sm mt-1">
              Unable to load your reviews. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-600 mt-1">
            Manage your product reviews and ratings
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{reviews.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {reviews.length > 0
                  ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Products Reviewed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {new Set(reviews.map(r => r.product_id)).size}
              </p>
            </div>
            <Package className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review: any) => {
            const productImage = review.product?.images 
              ? getPrimaryImageUrl(review.product.images)
              : '/placeholder-product.png';

            return (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Image & Info */}
                  <div className="flex gap-4 flex-shrink-0">
                    <Link 
                      href={review.product?.slug ? `/product/${review.product.slug}` : '#'}
                      className="flex-shrink-0"
                    >
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                        <Image
                          src={productImage}
                          alt={review.product?.name || 'Product'}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link 
                        href={review.product?.slug ? `/product/${review.product.slug}` : '#'}
                        className="hover:text-[#00072D]/80 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {review.product?.name || 'Product'}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {review.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    {review.title && (
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {review.title}
                      </h4>
                    )}
                    
                    {review.comment && (
                      <p className="text-gray-700 mb-3">
                        {review.comment}
                      </p>
                    )}

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.images.map((img: any, index: number) => (
                          <div key={index} className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                            <Image
                              src={typeof img === 'string' ? img : img.url}
                              alt={`Review image ${index + 1}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {review.status && (
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          review.status === 'approved' ? 'bg-green-100 text-green-800' :
                          review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        )}>
                          {review.status}
                        </span>
                      )}

                      {review.helpful_count > 0 && (
                        <span className="text-gray-600">
                          {review.helpful_count} found helpful
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 flex-shrink-0">
                    <button
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                      title="Edit review"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500 mb-6">
            You haven't written any product reviews yet. Purchase products and share your experience!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-4 py-2 bg-[#00072D] text-white text-sm font-medium rounded-md hover:bg-[#00072D]/90 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
