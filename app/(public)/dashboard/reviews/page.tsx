'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMyReviews, useReviewableItems, useSubmitReview } from '@/lib/hooks/user/useUserReviews';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, 
  MessageSquare, 
  Calendar,
  Package,
  Plus,
  Loader2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPrimaryImageUrl } from '@/lib/utils/image';

export default function ReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: reviewsData, isLoading, error } = useMyReviews(currentPage);
  const { data: reviewableData, isLoading: reviewableLoading } = useReviewableItems();
  const submitReviewMutation = useSubmitReview();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle API response - Fix for paginated data structure
  let reviews: any[] = [];
  let paginationData: any = null;
  if (reviewsData) {
    const data = reviewsData as any;
    console.log('Reviews API Response:', data);
    
    if (data.success && data.data) {
      // Check if it's paginated data (has data.data property)
      if (data.data.data && Array.isArray(data.data.data)) {
        reviews = data.data.data;
        paginationData = {
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total,
          from: data.data.from,
          to: data.data.to,
        };
      } else if (Array.isArray(data.data)) {
        reviews = data.data;
      }
    } else if (Array.isArray(data)) {
      reviews = data;
    }
    
    console.log('Extracted reviews:', reviews);
    console.log('Pagination data:', paginationData);
  }

  // Handle reviewable items - Fix for paginated data structure
  let reviewableItems: any[] = [];
  if (reviewableData) {
    const data = reviewableData as any;
    console.log('Reviewable Items API Response:', data);
    
    if (data.success && data.data) {
      // Check if it's paginated data (has data.data property)
      if (data.data.data && Array.isArray(data.data.data)) {
        reviewableItems = data.data.data;
      } else if (Array.isArray(data.data)) {
        reviewableItems = data.data;
      }
    } else if (Array.isArray(data)) {
      reviewableItems = data;
    }
    
    console.log('Extracted reviewable items:', reviewableItems);
  }

  const handleOpenReviewForm = (item: any) => {
    setSelectedItem(item);
    setReviewForm({
      rating: 5,
      title: '',
      comment: '',
    });
    setShowReviewForm(true);
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
    setSelectedItem(null);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItem) return;

    try {
      await submitReviewMutation.mutateAsync({
        product_id: selectedItem.product_id,
        order_item_id: selectedItem.id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
      });
      handleCloseReviewForm();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-5 h-5",
              interactive && "cursor-pointer hover:scale-110 transition-transform",
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            )}
            onClick={() => interactive && onChange && onChange(i + 1)}
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
              <p className="text-sm text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{reviewableItems.length}</p>
            </div>
            <Package className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Reviewable Items */}
      {reviewableItems && reviewableItems.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg shadow-sm border border-orange-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Products Waiting for Your Review</h2>
              <p className="text-sm text-gray-600 mt-1">
                Share your experience with these delivered products
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewableItems.map((item: any) => {
              const productImage = item.product?.images 
                ? getPrimaryImageUrl(item.product.images)
                : '/placeholder-product.png';

              return (
                <div key={item.id} className="bg-white rounded-lg p-4 border border-orange-100 hover:border-orange-300 transition-colors">
                  <div className="flex gap-4">
                    <Link 
                      href={item.product?.slug ? `/product/${item.product.slug}` : '#'}
                      className="flex-shrink-0"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                        <Image
                          src={productImage}
                          alt={item.product_name || 'Product'}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link 
                        href={item.product?.slug ? `/product/${item.product.slug}` : '#'}
                        className="hover:text-[#00072D]/80 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900 line-clamp-2 mb-1">
                          {item.product_name || 'Product'}
                        </h4>
                      </Link>
                      <p className="text-sm text-gray-500 mb-3">
                        Order #{item.order?.order_number}
                      </p>
                      <button
                        onClick={() => handleOpenReviewForm(item)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-[#00072D] rounded-md hover:bg-[#00072D]/90 transition-colors"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Write Review
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Reviews</h2>
          {reviews.map((review: any) => {
            const productImage = review.product?.images 
              ? getPrimaryImageUrl(review.product.images)
              : '/placeholder-product.png';

            return (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row gap-6 justify-between">
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
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {paginationData && paginationData.last_page > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg mt-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(paginationData.last_page, prev + 1))}
                  disabled={currentPage === paginationData.last_page}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{paginationData.from}</span> to{' '}
                    <span className="font-medium">{paginationData.to}</span> of{' '}
                    <span className="font-medium">{paginationData.total}</span> reviews
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: paginationData.last_page }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          "relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20",
                          page === currentPage
                            ? "z-10 bg-[#00072D] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00072D]"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                        )}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(paginationData.last_page, prev + 1))}
                      disabled={currentPage === paginationData.last_page}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
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

      {/* Review Form Modal */}
      {mounted && showReviewForm && selectedItem && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
              onClick={handleCloseReviewForm}
              aria-hidden="true"
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-[10000]">
              <form onSubmit={handleSubmitReview}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Write a Review
                    </h3>
                    <button
                      type="button"
                      onClick={handleCloseReviewForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="flex gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={selectedItem.product?.images ? getPrimaryImageUrl(selectedItem.product.images) : '/placeholder-product.png'}
                        alt={selectedItem.product_name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">
                        {selectedItem.product_name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Order #{selectedItem.order?.order_number}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating *
                      </label>
                      {renderStars(reviewForm.rating, true, (rating) => setReviewForm({ ...reviewForm, rating }))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Review Title *
                      </label>
                      <input
                        type="text"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                        placeholder="Sum up your experience"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Review *
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Share your thoughts about this product"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={submitReviewMutation.isPending}
                    className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#00072D] text-base font-medium text-white hover:bg-[#00072D]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00072D] sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {submitReviewMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseReviewForm}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
