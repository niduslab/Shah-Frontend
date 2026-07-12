'use client';

import { useState, useCallback } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Trash2,
  FileDown,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { 
  useBulkImports, 
  useUploadImport, 
  useImportStatus,
  useDownloadTemplate,
  useDownloadErrors,
  useCancelImport,
  useDeleteImport
} from '@/lib/hooks/admin/useBulkImport';
import ImportProgressCard from '../_components/ImportProgressCard';
import ImportHistoryTable from '../_components/ImportHistoryTable';

export default function BulkImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeImportId, setActiveImportId] = useState<number | null>(null);

  const { data: importsData, isLoading: isLoadingImports, refetch: refetchImports } = useBulkImports();
  const uploadMutation = useUploadImport();
  const downloadTemplate = useDownloadTemplate();
  const downloadErrors = useDownloadErrors();
  const cancelMutation = useCancelImport();
  const deleteMutation = useDeleteImport();

  const imports = importsData?.data?.data || [];
  const activeImport = imports.find((imp: any) => imp.id === activeImportId);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file type
      if (!file.name.endsWith('.csv')) {
        toast.error('Invalid file type', {
          description: 'Please upload a CSV file'
        });
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Maximum file size is 10MB'
        });
        return;
      }

      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const result = await uploadMutation.mutateAsync(formData);
      const importId = result?.data?.import_id;

      toast.success('Import started successfully', {
        description: 'Your products are being processed in the background'
      });

      setSelectedFile(null);
      setActiveImportId(importId);
      refetchImports();
    } catch (error: any) {
      toast.error('Upload failed', {
        description: error?.response?.data?.message || 'Please try again'
      });
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate.mutateAsync();
      toast.success('Template downloaded', {
        description: 'Check your downloads folder'
      });
    } catch (error) {
      toast.error('Download failed', {
        description: 'Please try again'
      });
    }
  };

  const handleDownloadErrors = async (importId: number) => {
    try {
      await downloadErrors.mutateAsync(importId);
      toast.success('Error report downloaded', {
        description: 'Check your downloads folder'
      });
    } catch (error) {
      toast.error('Download failed', {
        description: 'Please try again'
      });
    }
  };

  const handleCancelImport = async (importId: number) => {
    try {
      await cancelMutation.mutateAsync(importId);
      toast.success('Import cancelled', {
        description: 'The import has been stopped'
      });
      refetchImports();
    } catch (error: any) {
      toast.error('Cancel failed', {
        description: error?.response?.data?.message || 'Please try again'
      });
    }
  };

  const handleDeleteImport = async (importId: number) => {
    try {
      await deleteMutation.mutateAsync(importId);
      toast.success('Import deleted', {
        description: 'The import record has been removed'
      });
      if (activeImportId === importId) {
        setActiveImportId(null);
      }
      refetchImports();
    } catch (error: any) {
      toast.error('Delete failed', {
        description: error?.response?.data?.message || 'Please try again'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#FF6F00]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bulk Product Import</h1>
              <p className="text-sm text-gray-600">Upload CSV files to import multiple products at once</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Upload & Instructions */}
          <div className="space-y-6 lg:col-span-2">
            {/* Upload Section */}
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Upload CSV File</h2>

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`relative w-full cursor-pointer rounded-xl border-2 border-dashed p-4 sm:p-8 text-center transition-all ${
                  isDragActive
                    ? 'border-[#FF6F00] bg-orange-50'
                    : selectedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-[#FF6F00] hover:bg-orange-50/50'
                }`}
              >
                <input {...getInputProps()} />
                
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="max-w-full">
                      <p className="font-semibold text-gray-900 break-words">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
                      </p>
                      <p className="text-sm text-gray-500">or click to browse</p>
                    </div>
                    <p className="text-xs text-gray-400">Maximum file size: 10MB</p>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              {selectedFile && (
                <button
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-6 py-3 font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploadMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    'Start Import'
                  )}
                </button>
              )}
            </div>

            {/* Active Import Progress */}
            {activeImport && (
              <ImportProgressCard
                import={activeImport}
                onCancel={() => handleCancelImport(activeImport.id)}
                onDownloadErrors={() => handleDownloadErrors(activeImport.id)}
                onRefresh={refetchImports}
              />
            )}

            {/* Import History */}
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Import History</h2>
                <button
                  onClick={() => refetchImports()}
                  className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 shrink-0"
                  title="Refresh"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>

              <ImportHistoryTable
                imports={imports}
                isLoading={isLoadingImports}
                onViewDetails={(importId) => setActiveImportId(importId)}
                onDownloadErrors={handleDownloadErrors}
                onCancel={handleCancelImport}
                onDelete={handleDeleteImport}
              />
            </div>
          </div>

          {/* Right Column - Instructions & Template */}
          <div className="space-y-6">
            {/* Download Template */}
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">CSV Template</h2>
              <p className="mb-4 text-sm text-gray-600">
                Download our template to ensure your CSV file has the correct format
              </p>
              <button
                onClick={handleDownloadTemplate}
                disabled={downloadTemplate.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#FF6F00] bg-white px-4 py-3 font-medium text-[#FF6F00] transition-all hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {downloadTemplate.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Download Template
                  </>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Instructions</h2>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FF6F00] text-xs font-bold text-white">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Download the template</p>
                    <p className="text-xs">Get the CSV template with all required columns</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FF6F00] text-xs font-bold text-white">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Fill in your data</p>
                    <p className="text-xs">Add your product information following the format</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FF6F00] text-xs font-bold text-white">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Upload your file</p>
                    <p className="text-xs">Drag & drop or click to upload your CSV</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FF6F00] text-xs font-bold text-white">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Track progress</p>
                    <p className="text-xs">Monitor the import status in real-time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="rounded-2xl bg-blue-50 p-6 ring-1 ring-blue-200">
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Requirements</h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>File must be in CSV format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Maximum file size: 10MB</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Required fields: name, category_id, price</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Use UTF-8 encoding</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Test with small batch first (10-50 rows)</span>
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div className="rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200">
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-amber-900">Best Practices</h3>
              </div>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Split large imports into batches of 500-1000 rows</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Verify category and brand IDs exist</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Use unique SKUs for each product</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Optimize images before adding URLs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
