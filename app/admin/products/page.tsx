'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package, Image as ImageIcon, Upload, X } from 'lucide-react';
import Link from 'next/link';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import { 
  useAdminProducts,
  useAdminProduct,
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct 
} from '@/lib/hooks/admin/useAdminProducts';
import { getImageUrl, getPlaceholderImage, getPrimaryImageUrl } from '@/lib/utils/image';
import ProductModal from './_components/ProductModal';
import DeleteConfirmModal from './_components/DeleteConfirmModal';

interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  quantity: number;
  low_stock_threshold?: number;
  weight?: number;
  weight_unit?: string;
  is_featured: boolean;
  is_trending: boolean;
  status: string;
  category_id: number;
  brand_id: number;
  category?: { id: number; name: string };
  brand?: { id: number; name: string };
  images?: Array<{ id: number; image_path: string; is_primary: boolean }>;
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const filters = {
    page: currentPage,
    per_page: 15,
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  };

  const { data: productsData, isLoading, isFetching } = useAdminProducts(filters);
  const { data: productDetailData, isLoading: isLoadingDetail } = useAdminProduct(
    editingProductId!,
    { enabled: !!editingProductId } as any
  );
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const products = (productsData as any)?.data?.data || [];
  const paginationData = (productsData as any)?.data;

  const handleCreate = () => {
    setSelectedProduct(null);
    setEditingProductId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setIsModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      try {
        await deleteMutation.mutateAsync(selectedProduct.id);
        toast.success('Product deleted successfully', {
          description: `"${selectedProduct.name}" has been removed from your products.`
        });
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
      } catch (error) {
        toast.error('Failed to delete product', {
          description: 'Please try again or contact support if the problem persists.'
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
      inactive: 'bg-gray-100 text-gray-600 ring-gray-600/20',
      draft: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  if (isLoading && !productsData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-sm text-gray-600">Manage your product inventory</p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, SKU, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-10 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>

              {/* Bulk Import Button */}
              <Link href="/admin/products/bulk-import">
                <button className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400">
                  <Upload className="h-5 w-5" />
                  Bulk Import
                </button>
              </Link>

              {/* Create Button */}
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2"
              >
                <Plus className="h-5 w-5" />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {/* Result count + active search indicator */}
          {debouncedSearch && !isFetching && (
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3">
              <p className="text-sm text-gray-500">
                {products.length === 0
                  ? <>No results for <span className="font-medium text-gray-900">"{debouncedSearch}"</span></>
                  : <>{paginationData?.total ?? products.length} result{(paginationData?.total ?? products.length) !== 1 ? 's' : ''} for <span className="font-medium text-gray-900">"{debouncedSearch}"</span></>
                }
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-medium text-[#FF6F00] hover:underline"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Skeleton rows while fetching */}
          {isFetching ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    {['Product', 'SKU', 'Category', 'Brand', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                      <th key={h} className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600 ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-200" />
                          <div className="space-y-2">
                            <div className="h-3.5 w-36 rounded bg-gray-200" />
                            <div className="h-2.5 w-24 rounded bg-gray-100" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="h-3 w-20 rounded bg-gray-200" /></td>
                      <td className="px-6 py-4"><div className="h-3 w-24 rounded bg-gray-200" /></td>
                      <td className="px-6 py-4"><div className="h-3 w-20 rounded bg-gray-200" /></td>
                      <td className="px-6 py-4"><div className="h-3 w-16 rounded bg-gray-200" /></td>
                      <td className="px-6 py-4"><div className="h-3 w-8 rounded bg-gray-200" /></td>
                      <td className="px-6 py-4"><div className="h-5 w-16 rounded-full bg-gray-200" /></td>
                      <td className="px-6 py-4"><div className="flex justify-end gap-2"><div className="h-8 w-8 rounded-lg bg-gray-200" /><div className="h-8 w-8 rounded-lg bg-gray-200" /></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {debouncedSearch ? 'No products found' : 'No products yet'}
              </h3>
              <p className="mb-8 text-gray-500">
                {debouncedSearch ? `No results match "${debouncedSearch}"` : 'Get started by creating your first product'}
              </p>
              {!debouncedSearch && (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
                >
                  <Plus className="h-5 w-5" />
                  Add Product
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">SKU</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Brand</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product: Product) => {
                    const imageUrl = getPrimaryImageUrl(product.images);
                    return (
                      <tr key={product.id} className="group transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                onError={(e) => { e.currentTarget.src = getPlaceholderImage(product.name); }}
                              />
                              {product.images && product.images.length > 1 && (
                                <div className="absolute bottom-0 right-0 rounded-tl bg-black/60 px-1.5 py-0.5 text-xs text-white">
                                  +{product.images.length - 1}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{product.name}</p>
                              {product.short_description && (
                                <p className="text-xs text-gray-500 line-clamp-1">{product.short_description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-gray-600">{product.sku}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{product.category?.name || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{product.brand?.name || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">${Number(product.price).toFixed(2)}</p>
                            {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                              <p className="text-xs text-gray-400 line-through">${Number(product.compare_price).toFixed(2)}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${product.quantity <= (product.low_stock_threshold || 10) ? 'text-red-600' : 'text-gray-900'}`}>
                            {product.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${getStatusBadge(product.status)}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => handleEdit(product)}
                              className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
                              title="Edit product"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
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
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
            setEditingProductId(null);
          }}
          product={editingProductId ? (productDetailData as any)?.data : null}
          isLoading={isLoadingDetail}
          onSubmit={async (data) => {
            console.group('📤 Product API Call');
            console.log('Operation:', editingProductId ? 'UPDATE' : 'CREATE');
            if (editingProductId) {
              console.log('Product ID:', editingProductId);
            }
            console.log('Data being sent to API:', data);
            console.groupEnd();

            try {
              if (editingProductId) {
                console.log('🔄 Calling UPDATE mutation...');
                const result = await updateMutation.mutateAsync({ id: editingProductId, data });
                console.log('✅ Update successful:', result);
                toast.success('Product updated successfully', {
                  description: `"${data.name}" has been updated with your changes.`
                });
              } else {
                console.log('➕ Calling CREATE mutation...');
                const result = await createMutation.mutateAsync(data);
                console.log('✅ Create successful:', result);
                toast.success('Product created successfully', {
                  description: `"${data.name}" has been added to your products.`
                });
              }
              setIsModalOpen(false);
              setSelectedProduct(null);
              setEditingProductId(null);
            } catch (error) {
              console.group('❌ Product API Error');
              console.error('Error details:', error);
              console.log('Failed operation:', editingProductId ? 'UPDATE' : 'CREATE');
              console.log('Data that failed:', data);
              console.groupEnd();
              
              toast.error(editingProductId ? 'Failed to update product' : 'Failed to create product', {
                description: 'Please try again or contact support if the problem persists.'
              });
            }
          }}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
          }}
          onConfirm={confirmDelete}
          productName={selectedProduct?.name || ''}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
