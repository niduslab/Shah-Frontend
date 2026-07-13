"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Product page failed to load:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white px-4 py-16">
      <div className="text-center">
        <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <RefreshCw className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-black">
          Couldn&apos;t Load This Product
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Something went wrong on our end &mdash; the product is still there.
          Please try again.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-xs bg-primary px-8 py-3 font-semibold text-black transition-colors hover:bg-primary/90"
          >
            Try Again
          </button>
          <Link
            href="/shop"
            className="rounded-xs border border-black px-8 py-3 font-semibold text-black transition-colors hover:bg-gray-50"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
