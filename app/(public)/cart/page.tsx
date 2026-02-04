"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "../_components/shared/product-card";

// Data for "You May Also Like" - Reusing New Arrival Products logic
const RELATED_PRODUCTS = [
  {
    id: 1,
    name: "XPD Woven J-20",
    image: "/images/landing/new-arrival/d28b697c5ffd69551d236e0311c369e1daa2111e.png", // Using available images
    price: 29.99,
    originalPrice: 34.99,
    rating: 5,
    reviews: 12,
    badge: { text: "-15% off", className: "bg-red-500" },
  },
  {
    id: 2,
    name: "Wave Men's Sport Swimming Boxer",
    image: "/images/landing/new-arrival/3c81b2d5cfd837c1a87f80ecd4654d112931d943.png",
    price: 16.00,
    originalPrice: 19.00,
    rating: 5,
    reviews: 39,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 3,
    name: "IREST LEG MASSAGER C 30A",
    image: "/images/landing/new-arrival/48ea1efb27d9c62811e189727ecd54692bf0e529.png",
    price: 599.00,
    originalPrice: 799.00,
    rating: 5,
    reviews: 39,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
  {
    id: 4,
    name: "Xterra Adjustable Dumbbell 50kg Set",
    image: "/images/landing/new-arrival/d6d857a1c8f1272b3e4a3e6e66b8975e36f83230.png",
    price: 438.00,
    originalPrice: 473.00,
    rating: 5,
    reviews: 39,
    badge: { text: "-25% off", className: "bg-red-500" },
  },
];

const INITIAL_CART_ITEMS = [
  {
    id: 1,
    name: "Adidas Wheel Roller ADAC-11404BK-NL",
    image: "/images/landing/new-arrival/d6d857a1c8f1272b3e4a3e6e66b8975e36f83230.png", // Placeholder
    price: 1999.00,
    originalPrice: 1999.00,
    discountBadge: "-25% off",
    quantity: 1,
  },
  {
    id: 2,
    name: "Wave Mirrored Electroplate Antifog Swimming Goggles",
    image: "/images/landing/new-arrival/3c81b2d5cfd837c1a87f80ecd4654d112931d943.png", // Placeholder
    price: 15.99,
    quantity: 1,
  },
  {
    id: 3,
    name: "Shah Muscle Chargers Boxing Gloves",
    image: "/images/landing/new-arrival/d28b697c5ffd69551d236e0311c369e1daa2111e.png", // Placeholder
    price: 21.99,
    quantity: 1,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

  const updateQuantity = (id: number, change: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const promoDiscount = 0; // Hardcoded for now
  const totalPrice = subTotal - promoDiscount;

  return (
    <div className="w-full bg-white pb-20 pt-8">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-black">Add to cart</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">Checkout</span>
        </div>

        <h1 className="mb-8 text-2xl font-bold text-black">My Shopping Cart ({totalItems} items)</h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Cart Items List */}
          <div className="flex-1 rounded-sm border border-gray-100 bg-white">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-6 border-b border-gray-100 p-6 last:border-0 sm:flex-row sm:items-center">
                {/* Image */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-50 p-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <h3 className="mb-2 font-medium text-black">{item.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-black">${item.price.toFixed(2)}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                      )}
                      {item.discountBadge && (
                        <span className="bg-red-500 px-2 py-0.5 text-xs font-bold text-white rounded-sm">
                          {item.discountBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between gap-6 sm:justify-end">
                    <div className="flex items-center rounded-sm border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-gray-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex h-10 w-10 items-center justify-center text-sm font-medium text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="underline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="h-fit w-full lg:w-[400px]">
            <div className="rounded-sm bg-[#FAFAFA] p-6">
              <h2 className="mb-6 text-xl font-bold text-black">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-8">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-black"
                  />
                  <button className="rounded-sm bg-primary px-4 py-2.5 text-sm font-bold text-black hover:bg-primary/90">
                    Apply Coupon
                  </button>
                </div>
              </div>

              {/* Summary Details */}
              <div className="mb-6 space-y-4 border-b border-gray-200 pb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-medium text-black">{totalItems < 10 ? `0${totalItems}` : totalItems}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Sub Total</span>
                  <span className="font-medium text-black">${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Promo Discount</span>
                  <span className="font-medium text-black">${promoDiscount.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Price */}
              <div className="mb-8 flex justify-between text-base font-bold text-black">
                <span>Total Price</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full rounded-sm bg-primary py-3.5 text-sm font-bold text-black transition-colors hover:bg-primary/90">
                  Proceed to Checkout
                </button>
                <Link href="/shop" className="block">
                  <button className="w-full rounded-sm border border-black bg-transparent py-3.5 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        <div className="mt-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-black">You May Also Like</h2>
            <Link 
              href="/shop?sort=discount"
              className="flex items-center gap-1 text-sm font-bold text-black hover:text-primary"
            >
              View Discount Products <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RELATED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
