'use client';

import { useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Loader2, AlertCircle, X, FileDown } from 'lucide-react';
import { useImportStatus } from '@/lib/hooks/admin/useBulkImport';

interface ImportProgressCardProps {
  import: any;
  onCancel: () => void;
  onDownloadErrors: () => void;
  onRefresh: () => void;
}

export default function ImportProgressCard({ 
  import: importData, 
  onCancel, 
  onDownloadErrors,
  onRefresh 
}: ImportProgressCardProps) {
  const { data: statusData, refetch } = useImportStatus(importData.id);
  const currentImport = statusData?.data || importData;

  // Auto-refresh every 3 seconds if processing
  useEffect(() => {
    if (currentImport.status === 'processing' || currentImport.status === 'pending') {
      const interval = setInterval(() => {
        refetch();
        onRefresh();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentImport.status, refetch, onRefresh]);

  const getStatusIcon = () => {
    switch (currentImport.status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'processing':
        return <Loader2 className="h-6 w-6 animate-spin text-blue-600" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case 'cancelled':
        return <X className="h-6 w-6 text-gray-600" />;
      default:
        return <Clock className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (currentImport.status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'processing':
        return 'bg-blue-50 border-blue-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'cancelled':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (currentImport.status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return currentImport.status;
    }
  };

  const progressPercentage = currentImport.progress_percentage || 0;
  const canCancel = currentImport.status === 'pending' || currentImport.status === 'processing';
  const hasErrors = currentImport.failed_rows > 0;

  return (
    <div className={`rounded-2xl border-2 p-6 shadow-lg ${getStatusColor()}`}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-900">{currentImport.filename}</h3>
            <p className="text-sm text-gray-600">
              Status: <span className="font-medium">{getStatusText()}</span>
            </p>
          </div>
        </div>
        {canCancel && (
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-white hover:text-red-600"
            title="Cancel import"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Progress</span>
          <span className="font-semibold text-gray-900">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF6F00] to-[#E65100] transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg bg-white p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{currentImport.total_rows}</p>
          <p className="text-xs text-gray-600">Total</p>
        </div>
        <div className="rounded-lg bg-white p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{currentImport.processed_rows}</p>
          <p className="text-xs text-gray-600">Processed</p>
        </div>
        <div className="rounded-lg bg-white p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{currentImport.successful_rows}</p>
          <p className="text-xs text-gray-600">Success</p>
        </div>
        <div className="rounded-lg bg-white p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{currentImport.failed_rows}</p>
          <p className="text-xs text-gray-600">Failed</p>
        </div>
      </div>

      {/* Error Message */}
      {currentImport.error_message && (
        <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>{currentImport.error_message}</p>
          </div>
        </div>
      )}

      {/* Download Errors Button */}
      {hasErrors && currentImport.status === 'completed' && (
        <button
          onClick={onDownloadErrors}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <FileDown className="h-4 w-4" />
          Download Error Report ({currentImport.failed_rows} errors)
        </button>
      )}

      {/* Timestamps */}
      {currentImport.started_at && (
        <div className="mt-4 space-y-1 text-xs text-gray-600">
          <p>Started: {new Date(currentImport.started_at).toLocaleString()}</p>
          {currentImport.completed_at && (
            <p>Completed: {new Date(currentImport.completed_at).toLocaleString()}</p>
          )}
        </div>
      )}
    </div>
  );
}
