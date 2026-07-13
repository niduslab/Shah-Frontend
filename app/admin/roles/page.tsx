'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, ShieldCheck, Users } from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminRoles,
  useAdminPermissions,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  AdminRole,
} from '@/lib/hooks/admin/useAdminRoles';
import { RequirePermission } from '@/app/admin/_components/RequirePermission';
import RoleModal from './_components/RoleModal';
import DeleteRoleModal from './_components/DeleteRoleModal';

function RolesPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);

  const { data: rolesData, isLoading } = useAdminRoles();
  const { data: permissionsData } = useAdminPermissions();
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const roles: AdminRole[] = rolesData?.data ?? [];
  const permissionsByModule: Record<string, string[]> = permissionsData?.data ?? {};

  const handleCreate = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role: AdminRole) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = (role: AdminRole) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: { name: string; permissions: string[] }) => {
    try {
      if (selectedRole) {
        await updateMutation.mutateAsync({ id: selectedRole.id, data });
        toast.success('Role updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Role created successfully');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save role');
    }
  };

  const confirmDelete = async () => {
    if (!selectedRole) return;
    try {
      await deleteMutation.mutateAsync(selectedRole.id);
      toast.success('Role deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete role');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
              <p className="text-sm text-gray-600">Define what each staff role can see and do</p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
          >
            <Plus className="h-5 w-5" />
            Add Role
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-2xl bg-white p-16 text-center shadow-lg ring-1 ring-gray-200">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {roles.map((role) => (
              <div key={role.id} className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <Users className="h-3.5 w-3.5" />
                      {role.users_count} user{role.users_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleEdit(role)}
                      className="rounded-lg p-2 text-[#FF6F00] transition-all hover:bg-orange-50"
                      title="Edit role"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(role)}
                      className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                      title="Delete role"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''} granted
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={selectedRole}
        permissionsByModule={permissionsByModule}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteRoleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        roleName={selectedRole?.name ?? ''}
        usersCount={selectedRole?.users_count ?? 0}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default function RolesPage() {
  return (
    <RequirePermission permission="users.view">
      <RolesPageContent />
    </RequirePermission>
  );
}
