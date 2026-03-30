"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Star, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Box, 
  ChevronLeft, 
  ChevronRight,
  Heart
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { getPrimaryImageUrl, getAllImageUrls, getPlaceholderImage } from "@/lib/utils/image";
import { ProductAccordions } from "./product-accordions";

interface ProductInfoProps {
  product: any;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, isInCart } = useCart();
  
  const allImages = getAllImageUrls(product.images);
  const images = allImages.length > 0 ? allImages : [getPlaceholderImage(product.name)];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Initialize with default variation or first variation
  useEffect(() => {
    if (product.variations && product.variations.length > 0) {
      const defaultVar = product.variations.find((v: any) => v.is_default) || product.variations[0];
      setSelectedVariation(defaultVar);
    }
  }, [product.variations]);

  // Get current price and stock based on selected variation or main product
  const currentPrice = selectedVariation 
    ? parseFloat(selectedVariation.price) 
    : parseFloat(product.price);
  
  const currentStock = selectedVariation 
    ? selectedVariation.quantity 
    : product.quantity;
  
  const currentSku = selectedVariation 
    ? selectedVariation.sku 
    : product.sku;

  const comparePrice = product.compare_price ? parseFloat(product.compare_price) : null;
  const discount = comparePrice ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100) : 0;
  const inStock = currentStock > 0;
  
  // Check if preorder is active
  const isPreorderActive = product.is_preorder && 
    product.preorder_release_date && 
    new Date(product.preorder_release_date) > new Date();

  // Group variations by attribute type (e.g., size, color)
  const variationAttributes: Record<string, Set<string>> = {};
  if (product.variations && product.variations.length > 0) {
    product.variations.forEach((variation: any) => {
      Object.entries(variation.attributes || {}).forEach(([key, value]) => {
        if (!variationAttributes[key]) {
          variationAttributes[key] = new Set();
        }
        variationAttributes[key].add(value as string);
      });
    });
  }

  // Handle variation selection
  const handleVariationChange = (attributeKey: string, attributeValue: string) => {
    if (!product.variations) return;

    // Find variation that matches the selected attribute
    const matchingVariation = product.variations.find((v: any) => 
      v.attributes && v.attributes[attributeKey] === attributeValue
    );

    if (matchingVariation) {
      setSelectedVariation(matchingVariation);
      // Reset quantity if it exceeds new stock
      if (quantity > matchingVariation.quantity) {
        setQuantity(1);
      }
    }
  };

  // Check if a specific variation option is selected
  const isVariationSelected = (attributeKey: string, attributeValue: string) => {
    return selectedVariation?.attributes?.[attributeKey] === attributeValue;
  };

  // Check if a variation option is out of stock
  const isVariationOutOfStock = (attributeKey: string, attributeValue: string) => {
    const variation = product.variations?.find((v: any) => 
      v.attributes && v.attributes[attributeKey] === attributeValue
    );
    return variation ? variation.quantity <= 0 : false;
  };

  // Handle add to cart
  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    const cartItem = {
      product_id: product.id,
      variation_id: selectedVariation?.id || null,
      quantity: quantity,
      product: product,
      variation: selectedVariation,
    };

    addToCart(cartItem, window.location.pathname);
    
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  // Handle buy now
  const handleBuyNow = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    const cartItem = {
      product_id: product.id,
      variation_id: selectedVariation?.id || null,
      quantity: quantity,
      product: product,
      variation: selectedVariation,
    };

    addToCart(cartItem);
    
    setTimeout(() => {
      setIsAddingToCart(false);
      // For preorder, go directly to checkout
      router.push(isPreorderActive ? '/checkout' : '/cart');
    }, 300);
  };

  const itemInCart = isInCart(product.id, selectedVariation?.id || null);

  return (
    <div className="w-full bg-white py-8">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary cursor-pointer">
            Home
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/shop?category_id=${product.category.id}`} className="hover:text-primary cursor-pointer">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-black font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column - Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="hidden flex-col gap-4 md:flex">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 overflow-hidden rounded-xs border transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage(product.name);
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative h-[700px] w-full flex-1 overflow-hidden rounded-xs bg-gray-50">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-contain p-8"
                onError={(e) => {
                  e.currentTarget.src = getPlaceholderImage(product.name);
                }}
              />
              
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  
                  <button 
                    onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Wishlist Button */}
              <button 
                className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-md transition-colors hover:text-red-500"
                aria-label="Add to wishlist"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="flex flex-col">
            {product.brand && (
              <span className="mb-2 text-sm font-semibold text-red-500">{product.brand.name}</span>
            )}
            <h1 className="mb-4 text-4xl font-semibold leading-tight text-black">
              {product.name}
            </h1>

            {/* SKU */}
            {currentSku && (
              <p className="mb-4 text-sm text-gray-500">
                SKU: <span className="font-mono">{currentSku}</span>
              </p>
            )}

            {/* Rating */}
            {product.review_count > 0 && (
              <div className="mb-6 flex items-center gap-2">
                <div className="flex text-[#8CB43F]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.round(product.average_rating) ? "fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-4">
                  ({product.review_count} {product.review_count === 1 ? 'Review' : 'Reviews'})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6 flex items-center gap-3">
              <span className="text-3xl font-bold text-black">${currentPrice.toFixed(2)}</span>
              {/* Hide original price if preorder is active */}
              {!isPreorderActive && comparePrice && comparePrice > currentPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">${comparePrice.toFixed(2)}</span>
                  <span className="rounded bg-red-500 px-2 py-1 text-sm font-bold text-white">
                    -{discount}% off
                  </span>
                </>
              )}
              {isPreorderActive && (
                <span className="rounded bg-blue-600 px-3 py-1 text-sm font-bold text-white">
                  Pre-Order
                </span>
              )}
            </div>

            {/* Stock Status / Preorder Info */}
            {isPreorderActive ? (
              <div className="mb-8 rounded-lg bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-blue-900">Pre-Order Available</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Expected release: {new Date(product.preorder_release_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    {product.preorder_limit && (
                      <p className="text-sm text-blue-700 mt-1">
                        Limited to {product.preorder_limit} units
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-8 flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`font-medium ${inStock ? 'text-green-500' : 'text-red-500'}`}>
                  {inStock ? `Available in stock (${currentStock})` : 'Out of stock'}
                </span>
              </div>
            )}

            {/* Short Description */}
            {product.short_description && (
              <p className="mb-6 text-gray-600 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Variations */}
            {Object.keys(variationAttributes).length > 0 && (
              <div className="mb-8 space-y-4">
                {Object.entries(variationAttributes).map(([attributeKey, values]) => {
                  const isColorAttribute = attributeKey.toLowerCase() === 'color';
                  
                  return (
                    <div key={attributeKey}>
                      <label className="mb-2 block text-sm font-semibold text-black capitalize">
                        {attributeKey}:
                        {selectedVariation?.attributes?.[attributeKey] && (
                          <span className="ml-2 font-normal text-gray-600">
                            {selectedVariation.attributes[attributeKey]}
                          </span>
                        )}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(values).map((value) => {
                          const isSelected = isVariationSelected(attributeKey, value);
                          const isOutOfStock = isVariationOutOfStock(attributeKey, value);
                          const isHexColor = /^#[0-9A-F]{6}$/i.test(value);
                          
                          // Render color swatch for hex colors
                          if (isColorAttribute && isHexColor) {
                            return (
                              <button
                                key={value}
                                onClick={() => !isOutOfStock && handleVariationChange(attributeKey, value)}
                                disabled={isOutOfStock}
                                className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                                  isSelected
                                    ? 'border-black scale-110'
                                    : isOutOfStock
                                    ? 'border-gray-200 cursor-not-allowed opacity-50'
                                    : 'border-gray-300 hover:border-black hover:scale-105'
                                }`}
                                title={value}
                                aria-label={`Color ${value}`}
                              >
                                <span 
                                  className="absolute inset-1 rounded-full"
                                  style={{ backgroundColor: value }}
                                />
                                {isOutOfStock && (
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <span className="h-px w-full rotate-45 bg-gray-400" />
                                  </span>
                                )}
                              </button>
                            );
                          }
                          
                          // Render regular button for non-color attributes
                          return (
                            <button
                              key={value}
                              onClick={() => !isOutOfStock && handleVariationChange(attributeKey, value)}
                              disabled={isOutOfStock}
                              className={`min-w-[60px] rounded-xs border px-4 py-2 text-sm font-medium transition-colors ${
                                isSelected
                                  ? 'border-black bg-black text-white'
                                  : isOutOfStock
                                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                  : 'border-gray-300 bg-white text-black hover:border-black'
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions */}
            {(inStock || isPreorderActive) && (
              <div className="mb-8 flex flex-wrap gap-4">
                {/* Quantity */}
                <div className="flex h-12 items-center rounded-xs border border-gray-200">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="flex h-full w-12 items-center justify-center text-gray-500 hover:text-black"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(isPreorderActive ? (product.preorder_limit || 999) : currentStock, q + 1))}
                    className="flex h-full w-12 items-center justify-center text-gray-500 hover:text-black"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {isPreorderActive ? (
                  /* Pre-Order Now Button - Goes directly to checkout */
                  <button 
                    onClick={(e) => handleBuyNow(e)}
                    type="button"
                    disabled={isAddingToCart}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xs bg-blue-600 px-8 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {isAddingToCart ? 'Processing...' : 'Pre-Order Now'}
                  </button>
                ) : (
                  <>
                    {/* Add to Cart */}
                    <button 
                      onClick={(e) => handleAddToCart(e)}
                      type="button"
                      disabled={isAddingToCart}
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xs bg-primary px-8 font-bold text-black transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      {isAddingToCart ? 'Adding...' : (itemInCart ? 'Update Cart' : 'Add to Cart')}
                    </button>

                    {/* Buy Now */}
                    <button 
                      onClick={(e) => handleBuyNow(e)}
                      type="button"
                      disabled={isAddingToCart}
                      className="flex h-12 flex-1 items-center justify-center rounded-xs border border-black px-8 font-bold text-black transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingToCart ? 'Processing...' : 'Buy Now'}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Pickup Info */}
            {product.requires_shipping && (
              <div className="mb-8 rounded-xs bg-gray-50 p-4">
                <div className="flex gap-3">
                  <Box className="h-6 w-6 text-black" />
                  <div>
                    <p className="font-semibold text-black">Pickup available at Dhaka Warehouse</p>
                    <p className="text-sm text-gray-500">Usually ready in 24 hours</p>
                  </div>
                </div>
              </div>
            )}

            {/* Product Details & Specifications */}
            <ProductAccordions product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
