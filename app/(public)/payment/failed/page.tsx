'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    // Get error message from query params
    const message = searchParams.get('message') || searchParams.get('error');
    if (message) {
      setErrorMessage(message);
    }

    const order = searchParams.get('order') || searchParams.get('order_number');
    if (order) {
      setOrderNumber(order);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        
        <p className="text-gray-600 mb-4">
          Unfortunately, your payment could not be processed.
        </p>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        {orderNumber && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              Order Number: <span className="font-mono font-bold">#{orderNumber}</span>
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-white bg-[#0B3B2D] rounded-md hover:bg-[#0B3B2D]/90 font-medium"
          >
            Try Again
          </button>
          
          <Link
            href="/cart"
            className="w-full inline-flex items-center justify-center px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@shahsports.com" className="text-[#0B3B2D] hover:underline">
              support@shahsports.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#0B3B2D] animate-spin" />
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
