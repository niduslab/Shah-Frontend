'use client';

import { useState, useMemo } from 'react';
import { 
  useWishlist, 
  useRemoveFromWishlist, 
  useClearWishlist 
} from '@/lib/hooks/user';
import { useCart } from '@/lib/context/CartContext';
import Link from 'next/link';
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  Eye, 
  X,
  Star,
  Grid,
  List,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPlaceholderImage } from '@/lib/utils/image';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 8;

export default function WishlistPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: wishlistData, isLoading, error } = useWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const clearWishlistMutation = useClearWishlist();
  const { addToCart } = useCart();

  const wishlistItems = wishlistData?.data || [];

  // Pagination calculations
  const totalItems = wishlistItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const showPagination = totalItems > ITEMS_PER_PAGE;

  // Get current page items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return wishlistItems.slice(startIndex, endIndex);
  }, [wishlistItems, currentPage]);

  // Reset to page 1 when items change
  const handleRemoveItem = async (id: number) => {
    try {
      await removeFromWishlistMutation.mutateAsync(id);
      // If current page becomes empty after deletion, go to previous page
      const newTotalItems = totalItems - 1;
      const newTotalPages = Math.ceil(newTotalItems / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error);
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await clearWishlistMutation.mutateAsync();
        setCurrentPage(1);
      } catch (error) {
        console.error('Failed to clear wishlist:', error);
      }
    }
  };

  const handleAddToCart = (product: any) => {
    // Convert API product format to cart item format
    const cartItem = {
      product_id: product.id,
      variation_id: null,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0]?.full_url || product.images?.[0]?.image_path || '',
        price: parseFloat(product.price),
        originalPrice: product.compare_price ? parseFloat(product.compare_price) : undefined,
      },
    };

    addToCart(cartItem);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of wishlist
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
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
          <X className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-red-800 font-medium">Error loading wishlist</h3>
            <p className="text-red-600 text-sm mt-1">
              Unable to load your wishlist. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>
        
        {wishlistItems.length > 0 && (
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === 'grid' 
                    ? "bg-white text-[#00072D] shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === 'list' 
                    ? "bg-white text-[#00072D] shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Clear Wishlist */}
            <button
              onClick={handleClearWishlist}
              disabled={clearWishlistMutation.isPending}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length > 0 ? (
        <>
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          )}>
            {paginatedItems.map((item: any) => {
            // Get image URL - handle both API format and direct URLs
            let imageUrl = getPlaceholderImage(item.product?.name || 'Product');
            if (item.product?.images && item.product.images.length > 0) {
              const firstImage = item.product.images[0];
              if (typeof firstImage === 'string') {
                // Direct URL
                imageUrl = firstImage;
              } else if (firstImage?.full_url) {
                // API format with full_url
                imageUrl = firstImage.full_url.startsWith('http') 
                  ? firstImage.full_url 
                  : `${process.env.NEXT_PUBLIC_API_URL}${firstImage.full_url}`;
              } else if (firstImage?.image_path) {
                // API format with image_path
                imageUrl = firstImage.image_path.startsWith('http') 
                  ? firstImage.image_path 
                  : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${firstImage.image_path}`;
              }
            } else if (item.product?.image) {
              // Fallback to product.image if available
              imageUrl = item.product.image;
            }

            // Check stock status
            const isInStock = item.product?.status === 'active' && item.product?.quantity > 0;

            return (
              <div key={item.id} className={cn(
                "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group",
                viewMode === 'list' && "flex"
              )}>
                {/* Product Image */}
                <div className={cn(
                  "relative bg-gray-50",
                  viewMode === 'grid' ? "aspect-square" : "w-32 h-32 flex-shrink-0"
                )}>
                  <img
                    src={imageUrl}
                    alt={item.product.name}
                    className="h-full w-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage(item.product?.name || 'Product');
                    }}
                  />
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={removeFromWishlistMutation.isPending}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>

              {/* Product Info */}
              <div className={cn(
                "p-4",
                viewMode === 'list' && "flex-1 flex flex-col justify-between"
              )}>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.product.name}
                  </h3>
                  
                  {item.product.brand && (
                    <p className="text-sm text-gray-500 mb-2">
                      by {item.product.brand.name}
                    </p>
                  )}

                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      ${item.product.price}
                    </span>
                    {item.product.compare_price && item.product.compare_price > item.product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.product.compare_price}
                      </span>
                    )}
                  </div>

                  {item.product.average_rating && (
                    <div className="flex items-center space-x-1 mb-3">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(item.product.average_rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({item.product.review_count} reviews)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mb-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      isInStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {isInStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {item.product.quantity <= item.product.low_stock_threshold && isInStock && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Low Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className={cn(
                  "flex gap-2",
                  viewMode === 'list' ? "flex-row" : "flex-col"
                )}>
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#00072D] bg-white border border-[#00072D] rounded-md hover:bg-[#00072D] hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Product
                  </Link>
                  
                  {isInStock && (
                    <button 
                      onClick={() => handleAddToCart(item.product)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#ffb81e] rounded-md hover:bg-[#e5a61b] transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
            );
          })}
          </div>

          {/* Pagination */}
          {showPagination && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors",
                      currentPage === page
                        ? "bg-[#00072D] text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">
            Save items you love to your wishlist and shop them later.
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