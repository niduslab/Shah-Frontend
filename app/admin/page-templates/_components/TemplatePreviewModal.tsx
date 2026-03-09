'use client';

import { X, Copy, Code, FileJson } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
}

export default function TemplatePreviewModal({ isOpen, onClose, template }: TemplatePreviewModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'preview' | 'schema' | 'example'>('preview');

  if (!isOpen || !template) return null;

  const handleUseTemplate = () => {
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    router.push('/admin/dynamic-pages?action=create&template=' + template.id);
    toast.success('Template selected', {
      description: 'Create a new page to use this template'
    });
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{template.name}</h2>
              <p className="mt-1 text-sm text-gray-600">{template.description}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('preview')}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'border-[#FF6F00] text-[#FF6F00]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab('schema')}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'schema'
                    ? 'border-[#FF6F00] text-[#FF6F00]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="inline h-4 w-4 mr-1" />
                Schema
              </button>
              <button
                onClick={() => setActiveTab('example')}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'example'
                    ? 'border-[#FF6F00] text-[#FF6F00]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileJson className="inline h-4 w-4 mr-1" />
                Example
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            {activeTab === 'preview' && (
              <div className="space-y-6">
                {/* Template Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Category</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">{template.category}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Page Types</p>
                    <div className="flex flex-wrap gap-1">
                      {template.page_types?.map((type: string) => (
                        <span
                          key={type}
                          className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                        >
                          {type.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visual Preview */}
                {template.preview_image ? (
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <img
                      src={template.preview_image}
                      alt={template.name}
                      className="w-full"
                    />
                  </div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                    <p className="text-gray-500">No preview image available</p>
                  </div>
                )}

                {/* Features */}
                {template.features && template.features.length > 0 && (
                  <div>
                    <h3 className="mb-3 font-bold text-gray-900">Features</h3>
                    <ul className="space-y-2">
                      {template.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                            ✓
                          </span>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'schema' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Template Schema</h3>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(template.schema, null, 2))}
                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                </div>

                {/* Content Schema */}
                {template.schema?.content && (
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-gray-700">Content Fields</h4>
                    <div className="rounded-lg bg-gray-900 p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-100">
                        {JSON.stringify(template.schema.content, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Settings Schema */}
                {template.schema?.settings && (
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-gray-700">Settings Fields</h4>
                    <div className="rounded-lg bg-gray-900 p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-100">
                        {JSON.stringify(template.schema.settings, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'example' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Example Data</h3>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(template.example, null, 2))}
                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                </div>

                {template.example ? (
                  <div className="rounded-lg bg-gray-900 p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100">
                      {JSON.stringify(template.example, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                    <p className="text-gray-500">No example data available</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={handleUseTemplate}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
            >
              <Copy className="h-4 w-4" />
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
