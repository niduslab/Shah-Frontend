'use client';

import { X, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roleName: string;
  usersCount: number;
  isLoading?: boolean;
}

export default function DeleteRoleModal({ isOpen, onClose, onConfirm, roleName, usersCount, isLoading }: DeleteRoleModalProps) {
  if (!isOpen) return null;

  const blocked = usersCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Delete Role</h2>
              <p className="text-sm text-gray-500">Permanently remove this role</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {blocked ? (
            <div className="rounded-lg bg-amber-50 p-4 border border-amber-100">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-900 mb-1">Role in use</h3>
                  <p className="text-sm text-amber-800">
                    {usersCount} user{usersCount !== 1 ? 's are' : ' is'} currently assigned the &quot;{roleName}&quot; role. Reassign them to a different role before deleting it.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{roleName}</span>? This action cannot be undone.
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          {!blocked && (
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-500/30 transition-all hover:shadow-xl hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Deleting...' : 'Delete Role'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
