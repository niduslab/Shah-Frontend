'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Save, Trash2, Edit2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  useAdminPage,
  usePageSections,
  useUpdatePage,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useReorderSections
} from '@/lib/hooks/admin/useDynamicPages';
import SectionEditor from '@/app/admin/page-templates/_components/SectionEditor';

export default function PageSectionsEditor() {
  const router = useRouter();
  const params = useParams();
  const pageId = parseInt(params?.id as string);

  const [editingSection, setEditingSection] = useState<any>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [sections, setSections] = useState<any[]>([]);

  const { data: pageData, isLoading: pageLoading } = useAdminPage(pageId);
  const { data: sectionsData, isLoading: sectionsLoading } = usePageSections(pageId);
  const updatePageMutation = useUpdatePage();
  const createSectionMutation = useCreateSection();
  const updateSectionMutation = useUpdateSection();
  const deleteSectionMutation = useDeleteSection();

  // Initialize page data
  useEffect(() => {
    if (pageData) {
      const page = (pageData as any).data || pageData;
      setPageTitle(page.title || '');
      setPageSlug(page.slug || '');
    }
  }, [pageData]);

  // Initialize sections data
  useEffect(() => {
    if (sectionsData) {
      const sectionsList = Array.isArray(sectionsData) 
        ? sectionsData 
        : (sectionsData as any).data || [];
      setSections(sectionsList);
    }
  }, [sectionsData]);

  const handleUpdatePageInfo = async () => {
    if (!pageTitle || !pageSlug) {
      toast.error('Please fill in page title and slug');
      return;
    }

    try {
      await updatePageMutation.mutateAsync({
        id: pageId,
        data: { title: pageTitle, slug: pageSlug }
      });
      toast.success('Page info updated');
    } catch (error) {
      toast.error('Failed to update page info');
    }
  };

  const handleUpdateSection = async (sectionId: number, content: any, settings: any) => {
    try {
      await updateSectionMutation.mutateAsync({
        pageId,
        sectionId,
        data: { content, settings }
      });
      toast.success('Section updated');
    } catch (error) {
      toast.error('Failed to update section');
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      await deleteSectionMutation.mutateAsync({ pageId, sectionId });
      toast.success('Section deleted');
      if (editingSection?.id === sectionId) {
        setEditingSection(null);
      }
    } catch (error) {
      toast.error('Failed to delete section');
    }
  };

  const handleToggleSection = async (section: any) => {
    try {
      await updateSectionMutation.mutateAsync({
        pageId,
        sectionId: section.id,
        data: { is_active: !section.is_active }
      });
      toast.success(`Section ${section.is_active ? 'deactivated' : 'activated'}`);
    } catch (error) {
      toast.error('Failed to toggle section');
    }
  };

  if (pageLoading || sectionsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-[1800px] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/pages')}
                className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Pages
              </button>
              <div className="h-8 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{pageTitle || 'Edit Page'}</h1>
                <p className="text-sm text-gray-600">{sections.length} sections</p>
              </div>
            </div>

            <button
              onClick={handleUpdatePageInfo}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1800px] p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Sections List */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Page Sections</h2>
                <button
                  onClick={() => router.push(`/admin/page-templates/${(pageData as any)?.data?.type || 'landing'}`)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/30"
                >
                  <Plus className="h-4 w-4" />
                  Add Section
                </button>
              </div>

              {sections.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No sections yet</h3>
                  <p className="text-gray-600 mb-6">Add sections to build your page</p>
                  <button
                    onClick={() => router.push(`/admin/page-templates/${(pageData as any)?.data?.type || 'landing'}`)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-orange-500/30"
                  >
                    <Plus className="h-5 w-5" />
                    Add First Section
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`group relative rounded-xl border-2 p-4 transition-all cursor-pointer ${
                        editingSection?.id === section.id
                          ? 'border-[#FF6F00] bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => setEditingSection(section)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Drag Handle */}
                        <div className="mt-1 text-gray-400 cursor-grab active:cursor-grabbing">
                          <GripVertical className="h-5 w-5" />
                        </div>

                        {/* Section Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-600">
                              {index + 1}
                            </span>
                            <h3 className="font-bold text-gray-900 text-sm truncate">
                              {section.title || section.section_type}
                            </h3>
                            {section.is_active ? (
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{section.section_type}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSection(section);
                            }}
                            className={`rounded-lg p-2 transition-all ${
                              section.is_active
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-gray-400 hover:bg-gray-50'
                            }`}
                            title={section.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {section.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSection(section);
                            }}
                            className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50"
                            title="Edit section"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSection(section.id);
                            }}
                            className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                            title="Delete section"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Active Indicator */}
                      {editingSection?.id === section.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6F00] rounded-l-xl" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Section Editor */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SectionEditor
                section={editingSection ? {
                  ...editingSection,
                  instanceId: editingSection.id,
                  name: editingSection.title || editingSection.section_type,
                  id: editingSection.section_type
                } : null}
                pageTitle={pageTitle}
                pageSlug={pageSlug}
                onUpdatePageTitle={setPageTitle}
                onUpdatePageSlug={setPageSlug}
                onUpdateSection={(instanceId, content, settings) => {
                  if (editingSection) {
                    handleUpdateSection(editingSection.id, content, settings);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
