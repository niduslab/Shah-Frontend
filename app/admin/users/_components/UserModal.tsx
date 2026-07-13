'use client';

import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Lock, Shield } from 'lucide-react';
import { useAdminRoles } from '@/lib/hooks/admin/useAdminRoles';

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  user_type: 'customer' | 'admin' | 'vendor';
  status?: boolean;
  role?: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any | null;
  onSubmit: (data: UserData) => void;
}

export default function UserModal({ isOpen, onClose, user, onSubmit }: UserModalProps) {
  const [formData, setFormData] = useState<UserData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    user_type: 'customer',
    status: true,
    role: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: rolesData } = useAdminRoles();
  const roles = rolesData?.data ?? [];

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        user_type: user.user_type || 'customer',
        status: user.status ?? true,
        role: user.role_names?.[0] || '',
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        user_type: 'customer',
        status: true,
        role: '',
      });
    }
    setErrors({});
  }, [user, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!user && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const submitData: any = { ...formData };
    if (user && !submitData.password) {
      delete submitData.password;
    }
    if (submitData.user_type !== 'admin' || !submitData.role) {
      submitData.role = null;
    }

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100]">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user ? 'Edit User' : 'Create New User'}
              </h2>
              <p className="text-sm text-gray-500">
                {user ? 'Update user information' : 'Add a new user to the system'}
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
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className={`w-full rounded-xl border ${
                  errors.first_name ? 'border-red-300' : 'border-gray-300'
                } bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20`}
                placeholder="John"
              />
              {errors.first_name && (
                <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className={`w-full rounded-xl border ${
                  errors.last_name ? 'border-red-300' : 'border-gray-300'
                } bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20`}
                placeholder="Doe"
              />
              {errors.last_name && (
                <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Mail className="inline h-4 w-4 mr-1" />
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full rounded-xl border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full rounded-xl border ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              } bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20`}
              placeholder="+1234567890"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Lock className="inline h-4 w-4 mr-1" />
              Password {!user && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full rounded-xl border ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              } bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20`}
              placeholder={user ? 'Leave blank to keep current password' : 'Enter password'}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
            {!errors.password && (
              <p className="mt-1 text-xs text-gray-500">
                {user ? 'Leave blank to keep current password' : 'Minimum 8 characters'}
              </p>
            )}
          </div>

          {/* User Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Shield className="inline h-4 w-4 mr-1" />
              User Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, user_type: 'customer' })}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                  formData.user_type === 'customer'
                    ? 'border-[#FF6F00] bg-orange-50 text-[#FF6F00]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, user_type: 'admin' })}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                  formData.user_type === 'admin'
                    ? 'border-[#FF6F00] bg-orange-50 text-[#FF6F00]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, user_type: 'vendor' })}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                  formData.user_type === 'vendor'
                    ? 'border-[#FF6F00] bg-orange-50 text-[#FF6F00]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                Vendor
              </button>
            </div>
          </div>

          {/* Role (admin accounts only) */}
          {formData.user_type === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Shield className="inline h-4 w-4 mr-1" />
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
              >
                <option value="">No role assigned</option>
                {roles.map((role: { id: number; name: string }) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Controls which admin menus and actions this user can access</p>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                className="h-5 w-5 rounded border-gray-300 text-[#FF6F00] focus:ring-[#FF6F00]"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Active Status</span>
                <p className="text-xs text-gray-500">User can log in and access the system</p>
              </div>
            </label>
          </div>
        </form>

        <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-all hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
          >
            {user ? 'Update User' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}
