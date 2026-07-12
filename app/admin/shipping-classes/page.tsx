'use client';

import { useState } from 'react';
import { useShippingClasses, useDeleteShippingClass } from '@/lib/hooks/admin/useShipping';
import { Pencil, Trash2, Plus, Package } from 'lucide-react';
import ShippingClassModal from './_components/ShippingClassModal';
import DeleteConfirmModal from './_components/DeleteConfirmModal';

export default function ShippingClassesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);

  const { data, isLoading } = useShippingClasses();
  const deleteClass = useDeleteShippingClass();

  const classes = (data as any)?.data || [];

  const handleEdit = (cls: any) => {
    setSelectedClass(cls);
    setIsModalOpen(true);
  };

  const handleDelete = (cls: any) => {
    setSelectedClass(cls);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedClass) {
      await deleteClass.mutateAsync(selectedClass.id);
      setIsDeleteModalOpen(false);
      setSelectedClass(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipping Classes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize products into shipping classes for better rate management
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Shipping Class
        </button>
      </div>

      {/* Table */}
      <div className="rounded-sm border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Products
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">No shipping classes found</p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 text-sm font-medium text-black hover:underline"
                      >
                        Create your first shipping class
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                classes.map((cls: any) => (
                  <tr key={cls.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {cls.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {cls.slug}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {cls.description || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 ring-1 ring-blue-600/20">
                        {cls.products_count} {cls.products_count === 1 ? 'product' : 'products'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cls)}
                          className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cls)}
                          disabled={cls.products_count > 0}
                          className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          title={cls.products_count > 0 ? 'Cannot delete class with products' : 'Delete'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-sm border border-blue-200 bg-blue-50 p-4">
        <h3 className="text-sm font-medium text-blue-900">About Shipping Classes</h3>
        <p className="mt-1 text-sm text-blue-700">
          Shipping classes help you group products with similar shipping characteristics. 
          For example, you can create classes like "Heavy Equipment", "Fragile Items", or "Oversized Products" 
          and assign different shipping rates to each class.
        </p>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ShippingClassModal
          shippingClass={selectedClass}
          onClose={handleModalClose}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          title="Delete Shipping Class"
          message={`Are you sure you want to delete "${selectedClass?.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedClass(null);
          }}
          isLoading={deleteClass.isPending}
        />
      )}
    </div>
  );
}
