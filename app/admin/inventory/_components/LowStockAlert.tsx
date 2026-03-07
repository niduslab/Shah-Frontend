'use client';

import { AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';

interface LowStockAlertProps {
  products: any[];
  onClose: () => void;
}

export default function LowStockAlert({ products, onClose }: LowStockAlertProps) {
  if (products.length === 0) return null;

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 p-5 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500 flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Low Stock Alert
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              {products.length} {products.length === 1 ? 'product is' : 'products are'} running low on stock
            </p>
            <div className="space-y-2">
              {products.slice(0, 5).map((product: any) => (
                <div key={product.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-sm">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{product.name}</span>
                    <span className="text-gray-500 ml-2">({product.sku})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-red-600 font-semibold">
                      {product.quantity} left
                    </span>
                    <span className="text-xs text-gray-500">
                      Threshold: {product.low_stock_threshold}
                    </span>
                  </div>
                </div>
              ))}
              {products.length > 5 && (
                <p className="text-sm text-gray-600 pl-3">
                  And {products.length - 5} more...
                </p>
              )}
            </div>
            <Link
              href="/admin/inventory?stock_status=low"
              className="mt-3 inline-flex items-center text-sm font-medium text-[#FF6F00] hover:text-[#E65100] transition-colors"
            >
              View all low stock products →
            </Link>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 transition-all hover:bg-white hover:text-gray-600 flex-shrink-0"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
