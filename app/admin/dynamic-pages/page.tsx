'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, FileText, Eye, EyeOff, Layers } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import { 
  useAdminPages,
  useCreatePage, 
  useUpdatePage, 
  useDeletePage
} from '@/lib/hooks/admin/useDynamicPages';
import PageModal from '@/app/admin/dynamic-pages/_components/PageModal';
import DeleteConfirmModal from '@/app/admin/dynamic-pages/_components/DeleteConfirmModal';
import { useRouter } from 'next/navigation';

interface Page {
  id: number;
  title: string;
  slug: string;
  type: 'landing' | 'brand' | 'flash_deal' | 'gallery' | 'custom';
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  sort_order: number;
  sections_count?: number;
  sections?: any[]; // Optional sections array
  created_at: string;
  updated_at: string;
}

export default function DynamicPagesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const params = { page: currentPage, per_page: 15, type: typeFilter !== 'all' ? typeFilter : undefined };
  const { data: pagesData, isLoading } = useAdminPages(params);
  const createMutation = useCreatePage();
  const updateMutation = useUpdatePage();
  const deleteMutation = useDeletePage();

  // Handle both response formats: direct array or paginated object
  const pages = Array.isArray(pagesData) 
    ? pagesData 
    : (pagesData as any)?.data?.data || (pagesData as any)?.data || [];
  const paginationData = Array.isArray(pagesData) ? null : (pagesData as any)?.data;

  // Debug: Log pages to check structure
  if (pages.length > 0 && !pages[0]?.id) {
    console.error('Pages missing ID field:', pages);
  }

  const filteredPages = pages.filter((page: Page) => {
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCreate = () => {
    setSelectedPage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (page: Page) => {
    setSelectedPage(page);
    setIsModalOpen(true);
  };

  const handleDelete = (page: Page) => {
    setSelectedPage(page);
    setIsDeleteModalOpen(true);
  };

  const handleManageSections = (page: Page) => {
    if (!page || !page.id || isNaN(page.id)) {
      toast.error('Invalid page', {
        description: 'Cannot manage sections for this page. Please try refreshing.'
      });
      return;
    }
    router.push(`/admin/dynamic-pages/${page.id}/sections`);
  };

  const handleToggle = async (page: Page) => {
    try {
      await updateMutation.mutateAsync({ 
        id: page.id, 
        data: { is_active: !page.is_active } 
      });
      toast.success(`Page ${page.is_active ? 'deactivated' : 'activated'}`, {
        description: `"${page.title}" has been ${page.is_active ? 'deactivated' : 'activated'}.`
      });
    } catch (error) {
      toast.error('Failed to toggle page', {
        description: 'Please try again or contact support if the problem persists.'
      });
    }
  };

  const confirmDelete = async () => {
    if (selectedPage) {
      try {
        await deleteMutation.mutateAsync(selectedPage.id);
        toast.success('Page deleted successfully', {
          description: `"${selectedPage.title}" has been removed.`
        });
        setIsDeleteModalOpen(false);
        setSelectedPage(null);
      } catch (error) {
        toast.error('Failed to delete page', {
          description: 'Please try again or contact support if the problem persists.'
        });
      }
    }
  };

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      landing: { color: 'bg-blue-100 text-blue-700 ring-blue-600/20', label: 'Landing' },
      brand: { color: 'bg-purple-100 text-purple-700 ring-purple-600/20', label: 'Brand' },
      flash_deal: { color: 'bg-orange-100 text-orange-700 ring-orange-600/20', label: 'Flash Deal' },
      gallery: { color: 'bg-teal-100 text-teal-700 ring-teal-600/20', label: 'Gallery' },
      custom: { color: 'bg-gray-100 text-gray-700 ring-gray-600/20', label: 'Custom' },
    };
    const badge = badges[type] || badges.custom;
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading pages...</p>
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
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dynamic Pages</h1>
              <p className="text-sm text-gray-600">Manage dynamic pages and their content</p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 overflow-x-auto">
                {['all', 'landing', 'brand', 'flash_deal', 'gallery', 'custom'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      typeFilter === type
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {type === 'all' ? 'All' : type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2"
            >
              <Plus className="h-5 w-5" />
              Create Page
            </button>
          </div>
        </div>

        {/* Pages List */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {!filteredPages || filteredPages.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {searchQuery ? 'No pages found' : 'No pages yet'}
              </h3>
              <p className="mb-8 text-gray-500">
                {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first dynamic page'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
                >
                  <Plus className="h-5 w-5" />
                  Create Page
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredPages.map((page: Page) => (
                <div
                  key={page.id}
                  className="group p-6 transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{page.title}</h3>
                        {getTypeBadge(page.type)}
                        {page.is_active ? (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-600/20">
                            Inactive
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3 font-mono">/{page.slug}</p>

                      {page.meta_description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{page.meta_description}</p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {(page.sections_count !== undefined || page.sections) && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            <Layers className="h-3 w-3" />
                            {page.sections_count ?? page.sections?.length ?? 0} {(page.sections_count ?? page.sections?.length ?? 0) === 1 ? 'Section' : 'Sections'}
                          </span>
                        )}
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          Order: {page.sort_order}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(page)}
                        className={`rounded-lg p-2 transition-all focus:outline-none focus:ring-2 ${
                          page.is_active
                            ? 'text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500'
                            : 'text-gray-400 hover:bg-gray-50 focus:ring-gray-400'
                        }`}
                        title={page.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {page.is_active ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleManageSections(page)}
                        className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Manage sections"
                      >
                        <Layers className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(page)}
                        className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
                        title="Edit page"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(page)}
                        className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete page"
                      >
                        <Trash2 className="h-5 w-5" />
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
        <PageModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPage(null);
          }}
          page={selectedPage}
          onSubmit={async (data) => {
            try {
              if (selectedPage) {
                await updateMutation.mutateAsync({ id: selectedPage.id, data });
                toast.success('Page updated successfully', {
                  description: `"${data.title}" has been updated.`
                });
              } else {
                await createMutation.mutateAsync(data);
                toast.success('Page created successfully', {
                  description: `"${data.title}" has been created.`
                });
              }
              setIsModalOpen(false);
              setSelectedPage(null);
            } catch (error) {
              toast.error(selectedPage ? 'Failed to update page' : 'Failed to create page', {
                description: 'Please try again or contact support if the problem persists.'
              });
            }
          }}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPage(null);
          }}
          onConfirm={confirmDelete}
          pageTitle={selectedPage?.title || ''}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
