import Link from "next/link";
import { Package } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white px-4 py-16">
      <div className="text-center">
        <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-black">Product Not Found</h1>
        <p className="mb-8 text-lg text-gray-600">
          Sorry, the product you're looking for doesn't exist or has been removed.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="rounded-xs bg-primary px-8 py-3 font-semibold text-black transition-colors hover:bg-primary/90"
          >
            Browse All Products
          </Link>
          <Link
            href="/"
            className="rounded-xs border border-black px-8 py-3 font-semibold text-black transition-colors hover:bg-gray-50"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
