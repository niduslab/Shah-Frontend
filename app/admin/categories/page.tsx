'use client';

import { useState, useEffect, useMemo } from 'react';
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
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);
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

  // Helper function to build nested tree structure from flat list
  const buildCategoryTree = (categories: Category[]): Category[] => {
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    // First pass: create a map of all categories with empty children arrays
    categories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: build the tree structure
    categories.forEach(cat => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parent_id === null || cat.parent_id === undefined) {
        rootCategories.push(category);
      } else {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(category);
        }
      }
    });

    return rootCategories;
  };

  const rawFlat: Category[] = view === 'tree'
    ? (treeData?.data?.data || [])
    : (categoriesData?.data?.data || []);

  // Recursively filter tree: keep node if it or any descendant matches query.
  // Returns filtered node with only matching subtree, or null if no match.
  const filterTree = (node: Category, q: string): Category | null => {
    const selfMatch =
      node.name.toLowerCase().includes(q) ||
      (node.description?.toLowerCase().includes(q) ?? false);

    const filteredChildren = (node.children ?? [])
      .map((child) => filterTree(child, q))
      .filter((c): c is Category => c !== null);

    if (selfMatch || filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }
    return null;
  };

  const { allCategories, autoExpanded } = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return { allCategories: rawFlat, autoExpanded: new Set<number>() };
    }

    const q = debouncedSearch.toLowerCase();

    if (view === 'list') {
      // Flat list: simple name/description match
      return {
        allCategories: rawFlat.filter((c: Category) =>
          c.name.toLowerCase().includes(q) ||
          (c.description?.toLowerCase().includes(q) ?? false)
        ),
        autoExpanded: new Set<number>(),
      };
    }

    // Tree view: build tree first, then filter recursively
    const tree = buildCategoryTree(rawFlat);
    const matched: Category[] = [];
    const expanded = new Set<number>();

    tree.forEach((root) => {
      const result = filterTree(root, q);
      if (result) {
        matched.push(result);
        // Auto-expand every node that has matched children
        const collectExpanded = (node: Category) => {
          if (node.children && node.children.length > 0) {
            expanded.add(node.id);
            node.children.forEach(collectExpanded);
          }
        };
        collectExpanded(result);
      }
    });

    return { allCategories: matched, autoExpanded: expanded };
  }, [view, rawFlat, debouncedSearch]);

  // Merge auto-expanded IDs (from search) with manually toggled ones
  const effectiveExpanded = useMemo(() => {
    if (!debouncedSearch.trim()) return expandedCategories;
    return new Set([...expandedCategories, ...autoExpanded]);
  }, [expandedCategories, autoExpanded, debouncedSearch]);

  // Build proper tree structure for tree view
  const parentCategories = view === 'tree'
    ? (debouncedSearch.trim() ? allCategories : buildCategoryTree(rawFlat))
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

  const highlight = (text: string) => {
    if (!debouncedSearch.trim()) return text;
    const q = debouncedSearch.trim();
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-200 text-gray-900 rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  const renderTreeItem = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = effectiveExpanded.has(category.id);

    return (
      <div key={category.id}>
        <div
          className="group flex flex-col gap-3 p-4 transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent sm:flex-row sm:items-center sm:justify-between"
          style={{ paddingLeft: `${level * 2 + 1}rem` }}
        >
          <div className="flex flex-1 items-center gap-3 min-w-0">
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
              <div className="w-7 flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-semibold text-gray-900">{highlight(category.name)}</h3>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-600/20">
                  ID: {category.id}
                </span>
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

          <div className="flex items-center gap-1.5 self-end opacity-100 transition-opacity sm:self-auto sm:opacity-0 sm:group-hover:opacity-100">
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
          <div>
            {category.children!.map(child => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading && !categoriesData && !treeData) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
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
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-11 pr-10 text-sm transition-all focus:border-[#FF6F00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              />
              {searchQuery !== debouncedSearch && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-[#FF6F00]" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {/* View Toggle */}
              <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                <button
                  onClick={() => {
                    setView('tree');
                    setCurrentPage(1);
                  }}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all sm:flex-none ${
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
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all sm:flex-none ${
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
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2"
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
