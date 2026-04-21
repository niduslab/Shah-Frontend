'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Tag, Image as ImageIcon } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import { 
  useAdminBrands,
  useCreateBrand, 
  useUpdateBrand, 
  useDeleteBrand 
} from '@/lib/hooks/admin/useAdminBrands';
import { getImageUrl, getPlaceholderImage } from '@/lib/utils/image';
import BrandModal from './_components/BrandModal';
import DeleteConfirmModal from './_components/DeleteConfirmModal';

interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  is_active: boolean;
  sort_order: number;
  products_count?: number;
}

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const { data: brandsData, isLoading } = useAdminBrands({ page: currentPage, per_page: 15 });
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();
  const deleteMutation = useDeleteBrand();

  const brands = (brandsData as any)?.data?.data || [];
  const paginationData = (brandsData as any)?.data;

  const filteredBrands = brands.filter((brand: Brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedBrand(null);
    setIsModalOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleDelete = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedBrand) {
      try {
        await deleteMutation.mutateAsync(selectedBrand.id);
        toast.success('Brand deleted successfully', {
          description: `"${selectedBrand.name}" has been removed from your brands.`
        });
        setIsDeleteModalOpen(false);
        setSelectedBrand(null);
      } catch (error) {
        toast.error('Failed to delete brand', {
          description: 'Please try again or contact support if the problem persists.'
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading brands...</p>
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
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
              <p className="text-sm text-gray-600">Manage your product brands and manufacturers</p>
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
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2"
            >
              <Plus className="h-5 w-5" />
              Add Brand
            </button>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {!filteredBrands || filteredBrands.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <Tag className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {searchQuery ? 'No brands found' : 'No brands yet'}
              </h3>
              <p className="mb-8 text-gray-500">
                {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first brand'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
                >
                  <Plus className="h-5 w-5" />
                  Add Brand
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredBrands.map((brand: Brand) => (
                <div
                  key={brand.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-xl hover:border-[#FF6F00]/30"
                >
                  {/* Brand Logo */}
                  <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                    {brand.logo ? (
                      <img
                        src={getImageUrl(brand.logo)}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getPlaceholderImage();
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <ImageIcon className="h-12 w-12" />
                        <span className="text-xs">No logo</span>
                      </div>
                    )}
                  </div>

                  {/* Brand Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{brand.name}</h3>
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-600/20">
                            ID: {brand.id}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                          {brand.slug}
                        </p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        brand.is_active 
                          ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20' 
                          : 'bg-gray-100 text-gray-600 ring-1 ring-gray-600/20'
                      }`}>
                        {brand.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {brand.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{brand.description}</p>
                    )}

                    {brand.products_count !== undefined && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Tag className="h-4 w-4" />
                        <span>{brand.products_count} {brand.products_count === 1 ? 'product' : 'products'}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#FF6F00] transition-all hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => window.location.href = `/admin/dynamic-contents/brand-pages-db/${brand.id}`}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Manage brand page content"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Page
                      </button>
                      <button
                        onClick={() => handleDelete(brand)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
        <BrandModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBrand(null);
          }}
          brand={selectedBrand}
          onSubmit={async (data) => {
            try {
              if (selectedBrand) {
                await updateMutation.mutateAsync({ id: selectedBrand.id, data });
                toast.success('Brand updated successfully', {
                  description: `"${data.name}" has been updated with your changes.`
                });
              } else {
                await createMutation.mutateAsync(data);
                toast.success('Brand created successfully', {
                  description: `"${data.name}" has been added to your brands.`
                });
              }
              setIsModalOpen(false);
              setSelectedBrand(null);
            } catch (error) {
              toast.error(selectedBrand ? 'Failed to update brand' : 'Failed to create brand', {
                description: 'Please try again or contact support if the problem persists.'
              });
            }
          }}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedBrand(null);
          }}
          onConfirm={confirmDelete}
          brandName={selectedBrand?.name || ''}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
