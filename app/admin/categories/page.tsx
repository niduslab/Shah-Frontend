'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, Search, Filter } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';
import { 
  useAdminCategories, 
  useAdminCategoryTree,
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory 
} from '@/lib/hooks/admin/useAdminCategories';
import CategoryModal from './_components/CategoryModal';
import DeleteConfirmModal from './_components/DeleteConfirmModal';

interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number | null;
  is_active: boolean;
  sort_order: number;
  image?: string | null;
  meta_title?: string;
  meta_description?: string;
  children?: Category[];
}

export default function CategoriesPage() {
  const [view, setView] = useState<'list' | 'tree'>('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // Fetch more items to ensure we have enough parent categories
  // Since API returns all categories (parents + children), we need more items
  const { data: categoriesData, isLoading, error: categoriesError } = useAdminCategories({ page: currentPage, per_page: 50 });
  const { data: treeData, isLoading: isTreeLoading, error: treeError } = useAdminCategoryTree({ page: currentPage, per_page: 50 });
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // Response format: { success: true, data: { current_page: 1, data: [...], ... } }
  const allCategories = view === 'tree' 
    ? (treeData?.data?.data || [])
    : (categoriesData?.data?.data || []);
  
  // Filter to show only parent categories (parent_id is null) in tree view
  // Children are already nested in the 'children' property
  const parentCategories = view === 'tree'
    ? allCategories.filter((cat: Category) => cat.parent_id === null)
    : allCategories;
  
  // Client-side pagination for tree view (10 parents per page)
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const categories = view === 'tree' 
    ? parentCategories.slice(startIndex, endIndex)
    : parentCategories;
  
  // Calculate pagination data
  const totalParents = parentCategories.length;
  const totalPages = Math.ceil(totalParents / itemsPerPage);
  
  const paginationData = view === 'tree' 
    ? {
        current_page: currentPage,
        last_page: totalPages,
        total: totalParents,
        per_page: itemsPerPage,
        from: startIndex + 1,
        to: Math.min(endIndex, totalParents)
      }
    : categoriesData?.data;
  
  const loading = view === 'tree' ? isTreeLoading : isLoading;

  const toggleExpand = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedCategory) {
      try {
        await deleteMutation.mutateAsync(selectedCategory.id);
        toast.success('Category deleted successfully', {
          description: `"${selectedCategory.name}" has been removed from your categories.`
        });
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
      } catch (error) {
        toast.error('Failed to delete category', {
          description: 'Please try again or contact support if the problem persists.'
        });
      }
    }
  };

  const renderTreeItem = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id}>
        <div 
          className="group flex items-center justify-between p-4 transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
          style={{ paddingLeft: `${level * 2 + 1}rem` }}
        >
          <div className="flex flex-1 items-center gap-3">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(category.id)}
                className="rounded-lg p-1.5 transition-all hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-[#FF6F00]" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-[#FF6F00]" />
                )}
              </button>
            ) : (
              <div className="w-7" />
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  category.is_active 
                    ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20' 
                    : 'bg-gray-100 text-gray-600 ring-1 ring-gray-600/20'
                }`}>
                  {category.is_active ? 'Active' : 'Inactive'}
                </span>
                {hasChildren && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20">
                    {category.children!.length} {category.children!.length === 1 ? 'subcategory' : 'subcategories'}
                  </span>
                )}
              </div>
              {category.description && (
                <p className="mt-1 text-sm text-gray-500">{category.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => handleEdit(category)}
              className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
              title="Edit category"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(category)}
              className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              title="Delete category"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l-2 border-gray-200" style={{ marginLeft: `${level * 2 + 2}rem` }}>
            {category.children!.map(child => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading categories...</p>
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
              <Filter className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-sm text-gray-600">Manage your product categories and subcategories</p>
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
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                <button
                  onClick={() => {
                    setView('tree');
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    view === 'tree'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tree View
                </button>
                <button
                  onClick={() => {
                    setView('list');
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    view === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List View
                </button>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2"
              >
                <Plus className="h-5 w-5" />
                Add Category
              </button>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {!categories || !Array.isArray(categories) || categories.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <Filter className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No categories found</h3>
              <p className="mb-8 text-gray-500">Get started by creating your first category</p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
              >
                <Plus className="h-5 w-5" />
                Add Category
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.map((category: Category) => renderTreeItem(category))}
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
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          categories={categoriesData?.data?.data || []}
          onSubmit={async (data) => {
            try {
              if (selectedCategory) {
                await updateMutation.mutateAsync({ id: selectedCategory.id, data });
                toast.success('Category updated successfully', {
                  description: `"${data.name}" has been updated with your changes.`
                });
              } else {
                await createMutation.mutateAsync(data);
                toast.success('Category created successfully', {
                  description: `"${data.name}" has been added to your categories.`
                });
              }
              setIsModalOpen(false);
              setSelectedCategory(null);
            } catch (error) {
              toast.error(selectedCategory ? 'Failed to update category' : 'Failed to create category', {
                description: 'Please try again or contact support if the problem persists.'
              });
            }
          }}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedCategory(null);
          }}
          onConfirm={confirmDelete}
          categoryName={selectedCategory?.name || ''}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
