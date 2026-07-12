'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, Layers, GripVertical, Eye, EyeOff, Code, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import { 
  useAdminPage,
  usePageSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useReorderSections
} from '@/lib/hooks/admin/useDynamicPages';
import SectionModal from '@/app/admin/dynamic-pages/[id]/sections/_components/SectionModal';
import DeleteConfirmModal from '@/app/admin/dynamic-pages/[id]/sections/_components/DeleteConfirmModal';
import ContentEditorModal from '@/app/admin/dynamic-pages/[id]/sections/_components/ContentEditorModal';

interface Section {
  id: number;
  page_id: number;
  section_type: string;
  title?: string;
  content: any;
  settings?: any;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function PageSectionsPage({ params: propsParams }: { params: { id: string } }) {
  const router = useRouter();
  const hookParams = useParams();
  
  // Try to get ID from both sources
  const paramId = hookParams?.id || propsParams?.id;
  
  // Debug logging
  console.log('Props params:', propsParams);
  console.log('Hook params:', hookParams);
  console.log('Final param ID:', paramId);
  
  const pageId = paramId ? parseInt(paramId as string) : NaN;
  const isValidId = !isNaN(pageId) && pageId > 0;
  
  console.log('Parsed pageId:', pageId);
  console.log('Is valid ID:', isValidId);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [draggedSection, setDraggedSection] = useState<Section | null>(null);

  const { data: pageData, isLoading: pageLoading } = useAdminPage(pageId);
  const { data: sectionsData, isLoading: sectionsLoading } = usePageSections(pageId);
  const createMutation = useCreateSection();
  const updateMutation = useUpdateSection();
  const deleteMutation = useDeleteSection();
  const reorderMutation = useReorderSections();

  // Handle both response formats: direct object/array or nested data
  const page = (pageData as any)?.data || pageData;
  const sections = Array.isArray(sectionsData) 
    ? sectionsData 
    : (sectionsData as any)?.data || [];

  // Show error screen if ID is invalid
  if (!isValidId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Invalid Page ID</h3>
          <p className="mb-4 text-gray-500">
            The page ID "{paramId || 'undefined'}" is invalid or missing.
          </p>
          <p className="mb-8 text-sm text-gray-400 font-mono">
            Debug: hookParams.id = {String(hookParams?.id)}, propsParams.id = {String(propsParams?.id)}, pageId = {pageId}
          </p>
          <button
            onClick={() => router.push('/admin/dynamic-pages')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Pages
          </button>
        </div>
      </div>
    );
  }

  const handleCreate = () => {
    setSelectedSection(null);
    setIsModalOpen(true);
  };

  const handleEdit = (section: Section) => {
    setSelectedSection(section);
    setIsModalOpen(true);
  };

  const handleEditContent = (section: Section) => {
    setSelectedSection(section);
    setIsContentModalOpen(true);
  };

  const handleDelete = (section: Section) => {
    setSelectedSection(section);
    setIsDeleteModalOpen(true);
  };

  const handleToggle = async (section: Section) => {
    try {
      await updateMutation.mutateAsync({ 
        pageId,
        sectionId: section.id,
        data: { is_active: !section.is_active } 
      });
      toast.success(`Section ${section.is_active ? 'deactivated' : 'activated'}`, {
        description: `"${section.title || section.section_type}" has been ${section.is_active ? 'deactivated' : 'activated'}.`
      });
    } catch (error) {
      toast.error('Failed to toggle section', {
        description: 'Please try again or contact support if the problem persists.'
      });
    }
  };

  const confirmDelete = async () => {
    if (selectedSection) {
      try {
        await deleteMutation.mutateAsync({ pageId, sectionId: selectedSection.id });
        toast.success('Section deleted successfully', {
          description: `"${selectedSection.title || selectedSection.section_type}" has been removed.`
        });
        setIsDeleteModalOpen(false);
        setSelectedSection(null);
      } catch (error) {
        toast.error('Failed to delete section', {
          description: 'Please try again or contact support if the problem persists.'
        });
      }
    }
  };

  const handleDragStart = (section: Section) => {
    setDraggedSection(section);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetSection: Section) => {
    if (!draggedSection || draggedSection.id === targetSection.id) return;

    const reorderedSections = [...sections];
    const draggedIndex = reorderedSections.findIndex(s => s.id === draggedSection.id);
    const targetIndex = reorderedSections.findIndex(s => s.id === targetSection.id);

    reorderedSections.splice(draggedIndex, 1);
    reorderedSections.splice(targetIndex, 0, draggedSection);

    const updates = reorderedSections.map((section, index) => ({
      id: section.id,
      sort_order: index + 1
    }));

    try {
      await reorderMutation.mutateAsync({ pageId, sections: updates });
      toast.success('Sections reordered successfully');
    } catch (error) {
      toast.error('Failed to reorder sections');
    }

    setDraggedSection(null);
  };

  const getSectionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hero_slider: 'Hero Slider',
      product_grid: 'Product Grid',
      brand_showcase: 'Brand Showcase',
      category_grid: 'Category Grid',
      banner: 'Banner',
      video_section: 'Video Section',
      text_content: 'Text Content',
      custom: 'Custom',
    };
    return labels[type] || type;
  };

  const getSectionTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      hero_slider: 'bg-purple-100 text-purple-700 ring-purple-600/20',
      product_grid: 'bg-blue-100 text-blue-700 ring-blue-600/20',
      brand_showcase: 'bg-indigo-100 text-indigo-700 ring-indigo-600/20',
      category_grid: 'bg-teal-100 text-teal-700 ring-teal-600/20',
      banner: 'bg-orange-100 text-orange-700 ring-orange-600/20',
      video_section: 'bg-pink-100 text-pink-700 ring-pink-600/20',
      text_content: 'bg-gray-100 text-gray-700 ring-gray-600/20',
      custom: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
    };
    const color = badges[type] || badges.custom;
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${color}`}>
        {getSectionTypeLabel(type)}
      </span>
    );
  };

  if (pageLoading || sectionsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/dynamic-pages')}
            className="mb-4 flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30 shrink-0">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{page?.title} - Sections</h1>
              <p className="text-sm text-gray-600">Manage page sections and content</p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {sections.length} {sections.length === 1 ? 'Section' : 'Sections'}
              </span>
            </div>
            <button
              onClick={handleCreate}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:ring-offset-2"
            >
              <Plus className="h-5 w-5" />
              Add Section
            </button>
          </div>
        </div>

        {/* Sections List */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          {!sections || sections.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <Layers className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No sections yet</h3>
              <p className="mb-8 text-gray-500">Get started by adding your first section</p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
              >
                <Plus className="h-5 w-5" />
                Add Section
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sections.map((section: Section) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => handleDragStart(section)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(section)}
                  className="group p-6 transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent cursor-move"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="hidden sm:block mt-1 text-gray-400 cursor-grab active:cursor-grabbing">
                      <GripVertical className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 break-words">
                          {section.title || getSectionTypeLabel(section.section_type)}
                        </h3>
                        {getSectionTypeBadge(section.section_type)}
                        {section.is_active ? (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 ring-1 ring-gray-600/20">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          Order: {section.sort_order}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggle(section)}
                        className={`rounded-lg p-2 transition-all focus:outline-none focus:ring-2 ${
                          section.is_active
                            ? 'text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500'
                            : 'text-gray-400 hover:bg-gray-50 focus:ring-gray-400'
                        }`}
                        title={section.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {section.is_active ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleEditContent(section)}
                        className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Edit content"
                      >
                        <Code className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(section)}
                        className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
                        title="Edit section"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(section)}
                        className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete section"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        <SectionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSection(null);
          }}
          section={selectedSection}
          pageId={pageId}
          onSubmit={async (data) => {
            try {
              if (selectedSection) {
                await updateMutation.mutateAsync({ pageId, sectionId: selectedSection.id, data });
                toast.success('Section updated successfully');
              } else {
                await createMutation.mutateAsync({ pageId, data });
                toast.success('Section created successfully');
              }
              setIsModalOpen(false);
              setSelectedSection(null);
            } catch (error) {
              toast.error(selectedSection ? 'Failed to update section' : 'Failed to create section');
            }
          }}
        />

        <ContentEditorModal
          isOpen={isContentModalOpen}
          onClose={() => {
            setIsContentModalOpen(false);
            setSelectedSection(null);
          }}
          section={selectedSection}
          pageId={pageId}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedSection(null);
          }}
          onConfirm={confirmDelete}
          sectionTitle={selectedSection?.title || selectedSection?.section_type || ''}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}
