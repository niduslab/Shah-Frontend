'use client';

import { CheckCircle2, XCircle, Clock, Loader2, X, Eye, FileDown, Trash2 } from 'lucide-react';

interface ImportHistoryTableProps {
  imports: any[];
  isLoading: boolean;
  onViewDetails: (importId: number) => void;
  onDownloadErrors: (importId: number) => void;
  onCancel: (importId: number) => void;
  onDelete: (importId: number) => void;
}

export default function ImportHistoryTable({
  imports,
  isLoading,
  onViewDetails,
  onDownloadErrors,
  onCancel,
  onDelete
}: ImportHistoryTableProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-700 ring-green-600/20',
      failed: 'bg-red-100 text-red-700 ring-red-600/20',
      processing: 'bg-blue-100 text-blue-700 ring-blue-600/20',
      pending: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
      cancelled: 'bg-gray-100 text-gray-700 ring-gray-600/20',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Loading imports...</p>
      </div>
    );
  }

  if (!imports || imports.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">No imports yet</h3>
        <p className="text-sm text-gray-600">Upload a CSV file to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              File
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Progress
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Results
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
              Date
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {imports.map((importItem: any) => {
            const canCancel = importItem.status === 'pending' || importItem.status === 'processing';
            const canDelete = importItem.status !== 'processing';
            const hasErrors = importItem.failed_rows > 0;

            return (
              <tr key={importItem.id} className="group transition-colors hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{importItem.filename}</p>
                    <p className="text-xs text-gray-500">ID: {importItem.id}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getStatusBadge(importItem.status)}`}>
                    {getStatusIcon(importItem.status)}
                    {importItem.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-32">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-gray-600">{importItem.processed_rows}/{importItem.total_rows}</span>
                      <span className="font-medium text-gray-900">{(importItem.progress_percentage || 0).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF6F00] to-[#E65100] transition-all"
                        style={{ width: `${importItem.progress_percentage || 0}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-green-600">
                      ✓ {importItem.successful_rows}
                    </span>
                    {hasErrors && (
                      <span className="text-red-600">
                        ✗ {importItem.failed_rows}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-600">
                    {new Date(importItem.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(importItem.created_at).toLocaleTimeString()}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => onViewDetails(importItem.id)}
                      className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {hasErrors && importItem.status === 'completed' && (
                      <button
                        onClick={() => onDownloadErrors(importItem.id)}
                        className="rounded-lg p-2 text-orange-600 transition-colors hover:bg-orange-50"
                        title="Download errors"
                      >
                        <FileDown className="h-4 w-4" />
                      </button>
                    )}
                    {canCancel && (
                      <button
                        onClick={() => onCancel(importItem.id)}
                        className="rounded-lg p-2 text-yellow-600 transition-colors hover:bg-yellow-50"
                        title="Cancel import"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDelete(importItem.id)}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                        title="Delete import"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
