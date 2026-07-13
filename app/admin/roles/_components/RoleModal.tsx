'use client';

import { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { AdminRole } from '@/lib/hooks/admin/useAdminRoles';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: AdminRole | null;
  permissionsByModule: Record<string, string[]>;
  onSubmit: (data: { name: string; permissions: string[] }) => void;
  isLoading?: boolean;
}

function formatModuleLabel(module: string): string {
  return module
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatActionLabel(permission: string): string {
  const action = permission.split('.')[1] ?? permission;
  return action.charAt(0).toUpperCase() + action.slice(1);
}

export default function RoleModal({ isOpen, onClose, role, permissionsByModule, onSubmit, isLoading }: RoleModalProps) {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (role) {
      setName(role.name);
      setSelected(new Set(role.permissions));
    } else {
      setName('');
      setSelected(new Set());
    }
    setErrors({});
  }, [role, isOpen]);

  if (!isOpen) return null;

  const togglePermission = (permission: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(permission)) {
        next.delete(permission);
      } else {
        next.add(permission);
      }
      return next;
    });
  };

  const toggleModule = (modulePermissions: string[]) => {
    const allSelected = modulePermissions.every((p) => selected.has(p));
    setSelected((prev) => {
      const next = new Set(prev);
      modulePermissions.forEach((p) => (allSelected ? next.delete(p) : next.add(p)));
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Role name is required' });
      return;
    }
    onSubmit({ name: name.trim(), permissions: Array.from(selected) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{role ? 'Edit Role' : 'Create New Role'}</h2>
              <p className="text-sm text-gray-500">
                {role ? 'Update role name and permissions' : 'Define a new role and its permissions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-xl border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20`}
              placeholder="e.g. Warehouse Supervisor"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
            <div className="space-y-3 max-h-[45vh] overflow-y-auto rounded-xl border border-gray-200 p-4">
              {Object.entries(permissionsByModule).map(([module, permissions]) => {
                const allSelected = permissions.every((p) => selected.has(p));
                return (
                  <div key={module} className="rounded-lg border border-gray-100 p-3">
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => toggleModule(permissions)}
                        className="h-4 w-4 rounded border-gray-300 text-[#FF6F00] focus:ring-[#FF6F00]"
                      />
                      <span className="text-sm font-semibold text-gray-900">{formatModuleLabel(module)}</span>
                    </label>
                    <div className="ml-6 flex flex-wrap gap-3">
                      {permissions.map((permission) => (
                        <label key={permission} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selected.has(permission)}
                            onChange={() => togglePermission(permission)}
                            className="h-3.5 w-3.5 rounded border-gray-300 text-[#FF6F00] focus:ring-[#FF6F00]"
                          />
                          <span className="text-xs text-gray-600">{formatActionLabel(permission)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </form>

        <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
          </button>
        </div>
      </div>
    </div>
  );
}
