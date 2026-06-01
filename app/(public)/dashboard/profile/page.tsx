'use client';

import React, { useState } from 'react';
import { useProfile, useUpdateProfile, useChangePassword } from '@/lib/hooks/user/useDashboard';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Save, 
  X,
  Camera,
  Shield,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  weight: string;
  height: string;
}

interface PasswordFormData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    weight: '',
    height: '',
  });
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const { user } = useAuth();
  const { data: profileData, isLoading, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const profile = (profileData as any)?.data || user;

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || '',
        weight: profile.weight != null ? String(profile.weight) : '',
        height: profile.height != null ? String(profile.height) : '',
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || '',
        weight: profile.weight != null ? String(profile.weight) : '',
        height: profile.height != null ? String(profile.height) : '',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfileMutation.mutateAsync(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync(passwordData);
      setShowPasswordModal(false);
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <X className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-red-800 font-medium">Error loading profile</h3>
            <p className="text-red-600 text-sm mt-1">
              Unable to load your profile. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your personal information and account settings
          </p>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-4 py-2 bg-[#00072D] text-white text-sm font-medium rounded-md hover:bg-[#00072D]/90 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSave}>
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-2 bg-[#00072D] text-white rounded-full hover:bg-[#00072D]/90 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile?.name || `${formData.first_name} ${formData.last_name}`.trim() || 'User'}
                </h2>
                <p className="text-gray-600">{profile?.email}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{profile?.first_name || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{profile?.last_name || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{profile?.email}</span>
                  <span className="ml-2 text-xs text-gray-500">(Cannot be changed)</span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{profile?.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {profile?.date_of_birth 
                        ? new Date(profile.date_of_birth).toLocaleDateString()
                        : 'Not provided'
                      }
                    </span>
                  </div>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                {isEditing ? (
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                ) : (
                  <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900 capitalize">
                      {profile?.gender?.replace('_', ' ') || 'Not provided'}
                    </span>
                  </div>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="999.99"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g. 70.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    <span className="text-gray-900">
                      {profile?.weight != null ? `${profile.weight} kg` : 'Not provided'}
                    </span>
                  </div>
                )}
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="999.99"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="e.g. 175"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    <span className="text-gray-900">
                      {profile?.height != null ? `${profile.height} cm` : 'Not provided'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#00072D] rounded-md hover:bg-[#00072D]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 text-[#00072D] mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Password</h4>
              <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
            </div>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="text-sm text-[#00072D] hover:text-[#00072D]/80 font-medium"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <Lock className="w-6 h-6 text-[#00072D] mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.password_confirmation}
                    onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#00072D] rounded-md hover:bg-[#00072D]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}