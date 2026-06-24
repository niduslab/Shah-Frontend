"use client";

import { useState, useEffect, Suspense } from "react";
import { Save, Plus, Edit2, Trash2, Eye, ArrowLeft, GripVertical } from "lucide-react";
import { usePageContents, useCreatePageContent, useUpdatePageContent, useDeletePageContent } from "@/lib/hooks/admin/usePageContent";
import { useBrands } from "@/lib/hooks/public/useBrands";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import ContentEditor from "../_components/ContentEditor";
import { useSearchParams } from "next/navigation";
import { getImageUrl, getPlaceholderImage } from "@/lib/utils/image";

function BrandPagesDBManagementContent() {
  const searchParams = useSearchParams();
  const brandIdFromUrl = searchParams.get('brand');
  
  const queryClient = useQueryClient();
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all brands
  const { data: brandsData, isLoading: brandsLoading } = useBrands();
  const brands = brandsData?.data || [];

  // Auto-select brand from URL parameter
  useEffect(() => {
    if (brandIdFromUrl && brands.length > 0 && !selectedBrand) {
      const brand = brands.find((b: any) => b.id === parseInt(brandIdFromUrl));
      if (brand) {
        setSelectedBrand(brand);
      }
    }
  }, [brandIdFromUrl, brands, selectedBrand]);

  // Fetch brand page content
  const { data: pageData, isLoading: contentLoading } = usePageContents(
    selectedBrand ? { page_key: selectedBrand.slug, page_type: "brand" } : undefined,
    { enabled: !!selectedBrand }
  );
  const sections = pageData?.data || [];

  // Mutations
  const createMutation = useCreatePageContent({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-contents'] });
      toast.success("Section created successfully!");
      setIsModalOpen(false);
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create section");
    },
  });

  const updateMutation = useUpdatePageContent({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-contents'] });
      toast.success("Section updated successfully!");
      setIsModalOpen(false);
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update section");
    },
  });

  const deleteMutation = useDeletePageContent({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-contents'] });
      toast.success("Section deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete section");
    },
  });

  const handleCreateSection = () => {
    if (!selectedBrand) return;

    setEditingSection({
      page_key: selectedBrand.slug,
      page_type: "brand",
      section_name: "",
      title: "",
      sort_order: sections.length + 1,
      brand_id: selectedBrand.id,
      content: {},
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleEditSection = (section: any) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleSaveSection = () => {
    if (!editingSection) return;

    if (editingSection.id) {
      updateMutation.mutate(editingSection);
    } else {
      createMutation.mutate(editingSection);
    }
  };

  const handleDeleteSection = (id: number) => {
    if (confirm("Are you sure you want to delete this section?")) {
      deleteMutation.mutate(id);
    }
  };

  // Brand List View
  if (!selectedBrand) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Brand Pages Management (Database)</h1>
            <p className="mt-2 text-gray-600">Select a brand to manage its page content</p>
          </div>

          {brandsLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-lg">Loading brands...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {brands.map((brand: any) => (
                <div
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand)}
                  className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
                >
                  {brand.logo && (
                    <div className="relative h-48 w-full bg-gray-100">
                      <Image
                        src={getImageUrl(brand.logo)}
                        alt={brand.name}
                        fill
                        className="object-contain p-8 transition-transform group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getPlaceholderImage();
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{brand.name}</h3>
                    <p className="mt-2 text-sm text-gray-500">Slug: {brand.slug}</p>
                    {brand.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">{brand.description}</p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-orange-500">
                      Manage Content
                      <Edit2 className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}

              {brands.length === 0 && (
                <div className="col-span-full rounded-xl bg-white p-12 text-center shadow-lg">
                  <p className="text-gray-500">No brands found. Create brands first!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Brand Content Management View
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => setSelectedBrand(null)}
              className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Brands
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedBrand.name} - Page Content</h1>
            <p className="mt-2 text-gray-600">Manage sections for {selectedBrand.name} brand page</p>
          </div>
          <div className="flex gap-3">
            <a
              href={`/brand/${selectedBrand.slug}`}
              target="_blank"
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              <Eye className="h-4 w-4" />
              Preview Live
            </a>
            <button
              onClick={handleCreateSection}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-2 text-sm font-medium text-white hover:from-orange-500 hover:to-orange-600"
            >
              <Plus className="h-4 w-4" />
              Add Section
            </button>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-4">
          {contentLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-lg">Loading sections...</div>
            </div>
          ) : (
            <>
              {sections
                .sort((a: any, b: any) => a.sort_order - b.sort_order)
                .map((section: any) => (
                  <div key={section.id} className="rounded-xl bg-white p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-500">
                            Section: {section.section_name} | Order: {section.sort_order}
                          </p>
                        </div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={section.is_active}
                            onChange={(e) => {
                              updateMutation.mutate({
                                id: section.id,
                                is_active: e.target.checked,
                              });
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSection(section)}
                          className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="mt-4 rounded-lg bg-gray-50 p-4">
                      <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                        {JSON.stringify(section.content, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}

              {sections.length === 0 && (
                <div className="rounded-xl bg-white p-12 text-center shadow-lg">
                  <p className="text-gray-500">No sections found. Create your first section for this brand!</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Edit Modal */}
        {isModalOpen && editingSection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-8 shadow-2xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                {editingSection.id ? "Edit Section" : "Create Section"}
              </h2>

              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Section Name (Unique Identifier)
                    </label>
                    <input
                      type="text"
                      value={editingSection.section_name}
                      onChange={(e) =>
                        setEditingSection({ ...editingSection, section_name: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="hero, categories, behind-the-work, etc."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingSection.title}
                      onChange={(e) =>
                        setEditingSection({ ...editingSection, title: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Section Title"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={editingSection.sort_order}
                      onChange={(e) =>
                        setEditingSection({ ...editingSection, sort_order: parseInt(e.target.value) })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingSection.is_active}
                      onChange={(e) =>
                        setEditingSection({ ...editingSection, is_active: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <label className="text-sm font-medium text-gray-700">Active</label>
                  </div>
                </div>

                <ContentEditor
                  content={editingSection.content}
                  onChange={(newContent) => setEditingSection({ ...editingSection, content: newContent })}
                  sectionType={editingSection.section_name}
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingSection(null);
                    }}
                    className="rounded-lg bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSection}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-2 text-sm font-medium text-white hover:from-orange-500 hover:to-orange-600 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrandPagesDBManagement() {
  return (
    <Suspense fallback={null}>
      <BrandPagesDBManagementContent />
    </Suspense>
  );
}
