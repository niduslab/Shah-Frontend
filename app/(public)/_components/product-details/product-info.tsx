"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Star, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Box, 
  ChevronLeft, 
  ChevronRight,
  Play
} from "lucide-react";

import { ProductAccordions } from "./product-accordions";

const IMAGES = [
  "/images/product-details/product-image (1).png",
  // "/images/product-details/product-image (2).png",
  "/images/product-details/product-image (3).png",
  "/images/product-details/product-image (4).png",
  "/images/product-details/product-image (5).png",
  "/images/product-details/product-image (6).png",
  "/images/product-details/product-image (7).png",
  "/images/product-details/product-image (8).png",
];

export function ProductInfo() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="w-full bg-white py-8">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span className="hover:text-primary cursor-pointer">Home</span>
          <span>/</span>
          <span className="hover:text-primary cursor-pointer">Cardio Home Appliances</span>
          <span>/</span>
          <span className="hover:text-primary cursor-pointer">Treadmill</span>
          <span>/</span>
          <span className="text-black font-medium">NordicTrack Commercial 1750 Treadmill</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column - Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="hidden flex-col gap-4 md:flex">
              {IMAGES.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 overflow-hidden rounded-xs border transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {index === IMAGES.length - 1 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="h-6 w-6 fill-white text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative h-[700px] w-full flex-1 overflow-hidden rounded-xs bg-gray-50">
              <Image
                src={IMAGES[selectedImage]}
                alt="Product Main Image"
                fill
                className="object-contain p-8"
              />
              
              <button 
                onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : IMAGES.length - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button 
                onClick={() => setSelectedImage(prev => prev < IMAGES.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="flex flex-col">
            <span className="mb-2 text-sm font-semibold text-red-500">NordicTrack</span>
            <h1 className="mb-4 text-4xl font-semibold leading-tight text-black">
              NordicTrack Commercial 1750 Treadmill
            </h1>

            {/* Rating */}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex text-[#8CB43F]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-4">
                (39 Reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6 flex items-center gap-3">
              <span className="text-3xl font-bold text-black">$1,999.99</span>
              <span className="text-xl text-gray-400 line-through">$2,499.99</span>
              <span className="rounded bg-red-500 px-2 py-1 text-sm font-bold text-white">
                -25% off
              </span>
            </div>

            {/* Stock Status */}
            <div className="mb-8 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="font-medium text-green-500">Available in stock (13)</span>
            </div>

            {/* Actions */}
            <div className="mb-8 flex flex-wrap gap-4">
              {/* Quantity */}
              <div className="flex h-12 items-center rounded-xs border border-gray-200">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="flex h-full w-12 items-center justify-center text-gray-500 hover:text-black"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="flex h-full w-12 items-center justify-center text-gray-500 hover:text-black"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xs bg-primary px-8 font-bold text-black transition-colors hover:bg-primary/90">
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </button>

              {/* Buy Now */}
              <button className="flex h-12 flex-1 items-center justify-center rounded-xs border border-black px-8 font-bold text-black transition-colors hover:bg-gray-50">
                Buy Now
              </button>
            </div>

            {/* Pickup Info */}
            <div className="mb-8 rounded-xs bg-gray-50 p-4">
              <div className="flex gap-3">
                <Box className="h-6 w-6 text-black" />
                <div>
                  <p className="font-semibold text-black">Pickup available at Dhaka Warehouse</p>
                  <p className="text-sm text-gray-500">Usually ready in 24 hours</p>
                </div>
              </div>
            </div>

            {/* Product Details & Specifications */}
            <ProductAccordions />
          </div>
        </div>
      </div>
    </div>
  );
}
