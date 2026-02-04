"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ChevronDown, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  Plus, 
  Trash2, 
  Pencil, 
  CreditCard, 
  DollarSign, 
  Globe, 
  Check 
} from "lucide-react";
import { useState } from "react";

// Mock Data for Order Summary (Same as Cart)
const ORDER_ITEMS = [
  {
    id: 1,
    name: "Adidas Wheel Roller ADAC-11404BK-NL",
    image: "/images/landing/new-arrival/d6d857a1c8f1272b3e4a3e6e66b8975e36f83230.png",
    price: 1999.00,
    originalPrice: 1999.00,
    discountBadge: "-25% off",
    quantity: 1,
  },
  {
    id: 2,
    name: "Wave Mirrored Electroplate Antifog Swimming Goggles",
    image: "/images/landing/new-arrival/3c81b2d5cfd837c1a87f80ecd4654d112931d943.png",
    price: 15.99,
    quantity: 1,
  },
  {
    id: 3,
    name: "Shah Muscle Chargers Boxing Gloves",
    image: "/images/landing/new-arrival/d28b697c5ffd69551d236e0311c369e1daa2111e.png",
    price: 21.99,
    quantity: 1,
  },
];

const SAVED_ADDRESSES = [
  {
    id: 1,
    name: "Tracy Craig",
    email: "jamie_robertson@icloud.com",
    phone: "+1567673241662",
    address: "262 Swansea Mall Dr, Swansea",
  },
  {
    id: 2,
    name: "Tracy Craig",
    email: "jamie_robertson@icloud.com",
    phone: "+1567673241662",
    address: "262 Swansea Mall Dr, Swansea",
  },
  {
    id: 3,
    name: "Tracy Craig",
    email: "jamie_robertson@icloud.com",
    phone: "+1567673241662",
    address: "262 Swansea Mall Dr, Swansea",
  },
];

export default function CheckoutPage() {
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card', 'cod', 'ssl'
  const [saveInfo, setSaveInfo] = useState(false);

  // Calculations
  const subTotal = ORDER_ITEMS.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = ORDER_ITEMS.reduce((acc, item) => acc + item.quantity, 0);
  const discount = 0;
  const totalPrice = subTotal - discount;

  // Toggle View Logic
  const hasAddresses = SAVED_ADDRESSES.length > 0;
  // If we have addresses and user hasn't clicked "Add", show list. Otherwise form.
  const isFormView = showAddAddress || !hasAddresses;

  return (
    <div className="w-full bg-white pb-20 pt-8">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/cart" className="hover:text-black">Add to cart</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">Checkout</span>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            
            {/* 1. Shipping Address Section */}
            <div className="rounded-sm border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">
                  Select a Shipping Address ({isFormView ? "0/5" : "3/5"})
                </h2>
                <button 
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-bold text-black hover:bg-primary/90"
                >
                  {showAddAddress ? "Cancel" : "Add Address"} <Plus className="h-4 w-4" />
                </button>
              </div>

              {isFormView ? (
                // FORM VIEW (Image 1)
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="rounded-sm bg-gray-50 p-6">
                    <h3 className="mb-4 font-medium text-black">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-sm text-gray-600">Full Name <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="Full Name" className="w-full rounded-sm border border-gray-200 bg-white px-4 py-2.5 outline-none focus:border-black" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-gray-600">Phone Number <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="Phone Number" className="w-full rounded-sm border border-gray-200 bg-white px-4 py-2.5 outline-none focus:border-black" />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address Inputs */}
                  <div className="rounded-sm bg-gray-50 p-6">
                    <h3 className="mb-4 font-medium text-black">Shipping Address</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-sm text-gray-600">Street, House, Apartment <span className="text-red-500">*</span></label>
                        <input type="text" placeholder="Enter Street Address, House No, Apartment No" className="w-full rounded-sm border border-gray-200 bg-white px-4 py-2.5 outline-none focus:border-black" />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="space-y-1">
                          <label className="text-sm text-gray-600">City <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <select className="w-full appearance-none rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-gray-500 outline-none focus:border-black">
                              <option>Select City</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm text-gray-600">District <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <select className="w-full appearance-none rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-gray-500 outline-none focus:border-black">
                              <option>Select District</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm text-gray-600">Zip-code</label>
                          <input type="text" placeholder="Enter Zip code" className="w-full rounded-sm border border-gray-200 bg-white px-4 py-2.5 outline-none focus:border-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // LIST VIEW (Image 2)
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {SAVED_ADDRESSES.map((addr) => (
                    <div key={addr.id} className="rounded-sm border border-gray-200 p-4 transition-colors hover:border-black">
                      <div className="mb-4 space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4" />
                          <span className="font-medium text-black">{addr.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4" />
                          <span>{addr.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4" />
                          <span>{addr.phone}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>{addr.address}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-xs bg-red-50 py-2 text-xs font-medium text-red-500 hover:bg-red-100">
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-xs bg-gray-100 py-2 text-xs font-medium text-black hover:bg-gray-200">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Payment Method Section */}
            <div className="rounded-sm border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">Select a Payment Method</h2>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-3">
                {/* Credit / Debit Card */}
                <label className={`flex cursor-pointer items-center justify-between rounded-sm border p-4 transition-colors ${paymentMethod === 'card' ? 'border-gray-300 bg-gray-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="payment" 
                        className="peer h-4 w-4 appearance-none rounded-full border border-gray-400 checked:border-black checked:bg-black"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                      <div className="pointer-events-none absolute h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <CreditCard className="h-4 w-4" />
                      Credit / Debit Card
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Mock Card Logos */}
                    <div className="h-4 w-6 rounded bg-red-500/20"></div>
                    <div className="h-4 w-6 rounded bg-blue-500/20"></div>
                    <div className="h-4 w-6 rounded bg-orange-500/20"></div>
                  </div>
                </label>

                {/* Cash On Delivery */}
                <label className={`flex cursor-pointer items-center justify-between rounded-sm border p-4 transition-colors ${paymentMethod === 'cod' ? 'border-gray-300 bg-gray-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="payment" 
                        className="peer h-4 w-4 appearance-none rounded-full border border-gray-400 checked:border-black checked:bg-black"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <div className="pointer-events-none absolute h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <DollarSign className="h-4 w-4" />
                      Cash On Delivery
                    </div>
                  </div>
                </label>

                {/* SSL Commerce */}
                <label className={`flex cursor-pointer items-center justify-between rounded-sm border p-4 transition-colors ${paymentMethod === 'ssl' ? 'border-gray-300 bg-gray-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="payment" 
                        className="peer h-4 w-4 appearance-none rounded-full border border-gray-400 checked:border-black checked:bg-black"
                        checked={paymentMethod === 'ssl'}
                        onChange={() => setPaymentMethod('ssl')}
                      />
                      <div className="pointer-events-none absolute h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Globe className="h-4 w-4" />
                      SSL Commerce
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. Secure Card Details (Only if Card selected) */}
            {paymentMethod === 'card' && (
              <div className="rounded-sm bg-gray-50 p-6">
                <h3 className="mb-6 text-lg font-medium text-black">Secure Card Details</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Name on Card</label>
                    <input type="text" placeholder="Jon Doe" className="w-full rounded-sm border border-gray-200 bg-white px-4 py-2.5 outline-none focus:border-black" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Card Number</label>
                    <input type="text" placeholder="435 298 771 563" className="w-full rounded-sm border border-gray-200 bg-white px-4 py-2.5 outline-none focus:border-black" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600">Expiry Date <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select className="w-full appearance-none rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-gray-500 outline-none focus:border-black">
                          <option>MM/YY</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600">Card Verification Code (CVC) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select className="w-full appearance-none rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-gray-500 outline-none focus:border-black">
                          <option>123</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Info Checkbox */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSaveInfo(!saveInfo)}
                className={`flex h-5 w-5 items-center justify-center rounded-sm border ${saveInfo ? 'bg-black border-black text-white' : 'bg-white border-gray-300'}`}
              >
                {saveInfo && <Check className="h-3.5 w-3.5" />}
              </button>
              <span className="text-sm text-gray-600">Save my information for faster checkout next time</span>
            </div>
          </div>

          {/* Right Sidebar - Order Summary */}
          <div className="h-fit w-full lg:w-[400px]">
            <div className="rounded-sm bg-[#FAFAFA] p-6">
              <h2 className="mb-6 text-xl font-bold text-black">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-8">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="w-full rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                  />
                  <button className="rounded-sm bg-primary px-4 py-2.5 text-sm font-bold text-black hover:bg-primary/90">
                    Apply Coupon
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="mb-6 space-y-4 border-b border-gray-200 pb-6">
                {ORDER_ITEMS.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-white p-2">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="line-clamp-2 text-sm font-medium text-black">{item.name}</h4>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-bold text-black">${item.price.toFixed(2)}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                        )}
                        {item.discountBadge && (
                          <span className="bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-sm">
                            {item.discountBadge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                  <span>Discount</span>
                  <span className="font-medium text-black">${discount.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Price */}
              <div className="mb-8 flex justify-between text-base font-bold text-black">
                <span>Total Price</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              {/* Actions */}
              <button className="w-full rounded-sm bg-primary py-3.5 text-sm font-bold text-black transition-colors hover:bg-primary/90">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
