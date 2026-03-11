'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    // Get order number from query params
    const order = searchParams.get('order_number') || searchParams.get('orderNumber');
    
    if (order) {
      setOrderNumber(order);
      // Clear cart after successful payment
      clearCart();
      setIsProcessing(false);
      
      // Redirect to invoice page after 2 seconds
      setTimeout(() => {
        router.push(`/invoice/${order}`);
      }, 2000);
    } else {
      // If no order number, redirect to home after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
      setIsProcessing(false);
    }
  }, [searchParams, clearCart, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {isProcessing ? (
          <>
            <Loader2 className="w-16 h-16 text-[#0B3B2D] mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your payment has been processed successfully.
            </p>
            {orderNumber && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800">
                  Order Number: <span className="font-mono font-bold">#{orderNumber}</span>
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Redirecting to your invoice...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#0B3B2D] animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
