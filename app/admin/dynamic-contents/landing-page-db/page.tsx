"use client";

import { useState } from "react";
import { Save, Plus, Edit2, Trash2, Eye, GripVertical } from "lucide-react";
import { usePageContentByKey, useCreatePageContent, useUpdatePageContent, useDeletePageContent, useUpdateSortOrder } from "@/lib/hooks/admin/usePageContent";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ContentEditor from "../_components/ContentEditor";

export default function LandingPageDBManagement() {
  const queryClient = useQueryClient();
  const [editingSection, setEditingSection] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch landing page content
  const { data: pageData, isLoading } = usePageContentByKey("home");
  const sections = pageData?.data || [];

  // Mutations
  const createMutation = useCreatePageContent({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-contents', 'page', 'home'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-contents', 'page', 'home'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-contents', 'page', 'home'] });
      toast.success("Section deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete section");
    },
  });

  const handleCreateSection = () => {
    setEditingSection({
      page_key: "home",
      page_type: "landing",
      section_name: "",
      title: "",
      sort_order: sections.length + 1,
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Landing Page Content (Database)</h1>
            <p className="mt-2 text-gray-600">Manage landing page sections stored in database</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              <Eye className="h-4 w-4" />
              Preview Live
            </a>
            <button
              onClick={handleCreateSection}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-2 text-sm font-medium text-white hover:from-orange-500 hover:to-orange-600"
            >
              <Plus className="h-4 w-4" />
              Add Section
            </button>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-4">
          {sections
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((section: any) => (
              <div key={section.id} className="rounded-xl bg-white p-4 sm:p-6 shadow-lg">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <GripVertical className="hidden sm:block h-5 w-5 text-gray-400 cursor-move" />
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 break-words">{section.title}</h3>
                      <p className="text-sm text-gray-500 break-words">
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
                      className="flex flex-1 lg:flex-none items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="flex flex-1 lg:flex-none items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
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
              <p className="text-gray-500">No sections found. Create your first section!</p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {isModalOpen && editingSection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-4 sm:p-6 lg:p-8 shadow-2xl">
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
                      placeholder="hero, pre-order, categories, etc."
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

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
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
                    className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-2 text-sm font-medium text-white hover:from-orange-500 hover:to-orange-600 disabled:opacity-50"
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
