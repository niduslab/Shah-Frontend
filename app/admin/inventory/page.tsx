'use client';

import { useState } from 'react';
import { Package, Search, AlertTriangle, TrendingDown, TrendingUp, Filter, History, Edit2, ChevronDown, ChevronRight } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import { 
  useInventory,
  useLowStockProducts,
  useAdjustStock,
  useBulkStockAdjustment
} from '@/lib/hooks/admin/useInventory';
import { useAdminCategories } from '@/lib/hooks/admin/useAdminCategories';
import { getImageUrl, getPlaceholderImage } from '@/lib/utils/image';
import StockAdjustmentModal from './_components/StockAdjustmentModal';
import BulkAdjustmentModal from './_components/BulkAdjustmentModal';
import InventoryLogsModal from './_components/InventoryLogsModal';
import LowStockAlert from './_components/LowStockAlert';

interface InventoryVariation {
  id: number;
  sku: string;
  quantity: number;
  attributes: Record<string, string>;
}

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  low_stock_threshold: number;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  category?: {
    id: number;
    name: string;
  };
  images?: Array<{
    image_path: string;
    full_url: string;
    is_primary: boolean;
  }>;
  variations?: InventoryVariation[];
}

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'in'>('all');
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('name');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [showLowStockAlert, setShowLowStockAlert] = useState(true);
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());

  const toggleExpand = (productId: number) => {
    setExpandedProducts(prev => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  };

  const filters = {
    search: searchQuery || undefined,
    category_id: categoryFilter || undefined,
    stock_status: stockFilter === 'all' ? undefined : stockFilter,
    sort_by: sortBy,
    per_page: 20,
    page: currentPage,
  };

  const { data: inventoryData, isLoading } = useInventory(filters);
  const { data: lowStockData } = useLowStockProducts();
  const { data: categoriesData } = useAdminCategories({ per_page: 100 });
  const adjustMutation = useAdjustStock();

  const inventory = (inventoryData as any)?.data?.data || [];
  const paginationData = (inventoryData as any)?.data;
  const lowStockProducts = (lowStockData as any)?.data || [];
  const categories = (categoriesData as any)?.data?.data || [];

  const handleAdjustStock = (product: InventoryItem) => {
    setSelectedProduct(product);
    setIsAdjustModalOpen(true);
  };

  const handleViewLogs = (product: InventoryItem) => {
    setSelectedProduct(product);
    setIsLogsModalOpen(true);
  };

  const getStockStatusBadge = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 ring-1 ring-red-600/20">
          <AlertTriangle className="h-3 w-3" />
          Out of Stock
        </span>
      );
    }
    if (item.quantity <= item.low_stock_threshold) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 ring-1 ring-yellow-600/20">
          <TrendingDown className="h-3 w-3" />
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20">
        <TrendingUp className="h-3 w-3" />
        In Stock
      </span>
    );
  };

  const getVariationStockBadge = (variation: InventoryVariation, threshold: number) => {
    if (variation.quantity === 0) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 ring-1 ring-red-600/20">
          <AlertTriangle className="h-3 w-3" />
          Out of Stock
        </span>
      );
    }
    if (variation.quantity <= threshold) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 ring-1 ring-yellow-600/20">
          <TrendingDown className="h-3 w-3" />
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20">
        <TrendingUp className="h-3 w-3" />
        In Stock
      </span>
    );
  };

  const getPrimaryImage = (item: InventoryItem) => {
    if (!item.images || item.images.length === 0) return null;
    const primary = item.images.find(img => img.is_primary) ?? item.images[0];
    return primary.full_url || primary.image_path;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-sm text-gray-600">Track and manage product stock levels</p>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {showLowStockAlert && lowStockProducts.length > 0 && (
          <LowStockAlert
            products={lowStockProducts}
            onClose={() => setShowLowStockAlert(false)}
          />
        )}

        {/* Filters Bar */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
          <div className="flex flex-col gap-4">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>
              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2"
              >
                <Edit2 className="h-5 w-5" />
                Bulk Adjustment
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {/* Stock Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="w-full sm:w-auto rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                >
                  <option value="all">All Stock</option>
                  <option value="in">In Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter || ''}
                onChange={(e) => setCategoryFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full sm:w-auto rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="">All Categories</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="name">Sort by Name</option>
                <option value="quantity">Sort by Quantity</option>
                <option value="sku">Sort by SKU</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 overflow-hidden">
          {!inventory || inventory.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inventory.map((item: InventoryItem) => {
                    const hasVariations = item.variations && item.variations.length > 0;
                    const isExpanded = expandedProducts.has(item.id);

                    return (
                      <>
                        {/* Main product row */}
                        <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-orange-50/30' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {/* Expand toggle */}
                              {hasVariations ? (
                                <button
                                  onClick={() => toggleExpand(item.id)}
                                  className="rounded p-0.5 text-gray-400 hover:text-[#FF6F00] transition-colors flex-shrink-0"
                                  title={isExpanded ? 'Collapse variants' : 'Expand variants'}
                                >
                                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                              ) : (
                                <div className="w-5 flex-shrink-0" />
                              )}
                              <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                {getPrimaryImage(item) ? (
                                  <img
                                    src={getImageUrl(getPrimaryImage(item)!)}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = getPlaceholderImage(); }}
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                {hasVariations && (
                                  <button
                                    onClick={() => toggleExpand(item.id)}
                                    className="text-xs text-[#FF6F00] hover:underline"
                                  >
                                    {item.variations!.length} variant{item.variations!.length !== 1 ? 's' : ''} — click to {isExpanded ? 'collapse' : 'expand'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm text-gray-600">{item.sku}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{item.category?.name || '-'}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {hasVariations ? (
                              <div className="flex flex-col items-center">
                                <span className="text-lg font-semibold text-gray-900">
                                  {item.variations!.reduce((sum, v) => sum + v.quantity, 0)}
                                </span>
                                <span className="text-xs text-gray-400">total across variants</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <span className="text-lg font-semibold text-gray-900">{item.quantity}</span>
                                <span className="text-xs text-gray-500">Threshold: {item.low_stock_threshold}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {hasVariations ? (
                              <span className="text-xs text-gray-400 italic">see variants</span>
                            ) : (
                              getStockStatusBadge(item)
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleAdjustStock(item)}
                                className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
                                title="Adjust stock"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleViewLogs(item)}
                                className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                title="View logs"
                              >
                                <History className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Variant sub-rows */}
                        {hasVariations && isExpanded && item.variations!.map((variation) => (
                          <tr key={`var-${variation.id}`} className="bg-gray-50/60 border-l-4 border-l-[#FF6F00]/30">
                            <td className="pl-16 pr-6 py-3">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#FF6F00]/50 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">
                                    {Object.entries(variation.attributes).map(([k, v]) => `${k}: ${v}`).join(' / ')}
                                  </p>
                                  <p className="text-xs text-gray-400 font-mono">{variation.sku}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <span className="font-mono text-xs text-gray-400">{variation.sku}</span>
                            </td>
                            <td className="px-6 py-3" />
                            <td className="px-6 py-3 text-center">
                              <div className="flex flex-col items-center">
                                <span className="text-base font-semibold text-gray-900">{variation.quantity}</span>
                                <span className="text-xs text-gray-500">Threshold: {item.low_stock_threshold}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              {getVariationStockBadge(variation, item.low_stock_threshold)}
                            </td>
                            <td className="px-6 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedProduct({ ...item, _selectedVariationId: variation.id } as any);
                                    setIsAdjustModalOpen(true);
                                  }}
                                  className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
                                  title={`Adjust stock for this variant`}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {paginationData && paginationData.last_page > 1 && (
            <Pagination
              currentPage={paginationData.current_page}
              lastPage={paginationData.last_page}
              total={paginationData.total}
              perPage={paginationData.per_page}
              from={paginationData.from}
              to={paginationData.to}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>

        {/* Modals */}
        {selectedProduct && (
          <>
            <StockAdjustmentModal
              isOpen={isAdjustModalOpen}
              onClose={() => {
                setIsAdjustModalOpen(false);
                setSelectedProduct(null);
              }}
              product={selectedProduct}
              onSubmit={async (data) => {
                try {
                  await adjustMutation.mutateAsync({ productId: selectedProduct.id, data });
                  toast.success('Stock adjusted successfully', {
                    description: `Stock for "${selectedProduct.name}" has been updated.`
                  });
                  setIsAdjustModalOpen(false);
                  setSelectedProduct(null);
                } catch (error) {
                  toast.error('Failed to adjust stock', {
                    description: 'Please try again or contact support if the problem persists.'
                  });
                }
              }}
            />

            <InventoryLogsModal
              isOpen={isLogsModalOpen}
              onClose={() => {
                setIsLogsModalOpen(false);
                setSelectedProduct(null);
              }}
              productId={selectedProduct.id}
              productName={selectedProduct.name}
            />
          </>
        )}

        <BulkAdjustmentModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
        />
      </div>
    </div>
  );
}
