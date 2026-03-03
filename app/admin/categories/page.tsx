'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, Search, Filter } from 'lucide-react';
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
  children?: Category[];
}

export default function CategoriesPage() {
  const [view, setView] = useState<'list' | 'tree'>('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const { data: categoriesData, isLoading } = useAdminCategories();
  const { data: treeData } = useAdminCategoryTree();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const categories = view === 'tree' ? treeData?.data : categoriesData?.data;

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
      await deleteMutation.mutateAsync(selectedCategory.id);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
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
                className="rounded-lg p-1.5 transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
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
              className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30">
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
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-4 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                <button
                  onClick={() => setView('tree')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    view === 'tree'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tree View
                </button>
                <button
                  onClick={() => setView('list')}
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
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="h-5 w-5" />
                Add Category
              </button>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {!categories || categories.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <Filter className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No categories found</h3>
              <p className="mb-8 text-gray-500">Get started by creating your first category</p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
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
        </div>

        {/* Modals */}
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          categories={categoriesData?.data || []}
          onSubmit={async (data) => {
            if (selectedCategory) {
              await updateMutation.mutateAsync({ id: selectedCategory.id, data });
            } else {
              await createMutation.mutateAsync(data);
            }
            setIsModalOpen(false);
            setSelectedCategory(null);
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
