'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-10 h-10 text-yellow-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
        
        <p className="text-gray-600 mb-6">
          You have cancelled the payment process. Your order has not been placed.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-white bg-[#0B3B2D] rounded-md hover:bg-[#0B3B2D]/90 font-medium"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Return to Checkout
          </button>
          
          <Link
            href="/cart"
            className="w-full inline-flex items-center justify-center px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>

          <Link
            href="/"
            className="block text-sm text-gray-600 hover:text-gray-900 mt-4"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Your cart items are still saved. You can complete your purchase anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
