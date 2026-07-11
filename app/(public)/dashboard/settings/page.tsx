'use client';

import { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  Monitor,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationSettings {
  email_orders: boolean;
  email_promotions: boolean;
  email_reviews: boolean;
  email_newsletter: boolean;
  push_orders: boolean;
  push_promotions: boolean;
  push_reviews: boolean;
  sms_orders: boolean;
  sms_promotions: boolean;
}

interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'friends';
  show_purchase_history: boolean;
  show_wishlist: boolean;
  show_reviews: boolean;
  data_collection: boolean;
  marketing_emails: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('BDT');
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_orders: true,
    email_promotions: false,
    email_reviews: true,
    email_newsletter: false,
    push_orders: true,
    push_promotions: false,
    push_reviews: true,
    sms_orders: false,
    sms_promotions: false,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profile_visibility: 'private',
    show_purchase_history: false,
    show_wishlist: true,
    show_reviews: true,
    data_collection: true,
    marketing_emails: false,
  });

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'account', label: 'Account', icon: Smartphone },
  ];

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // Implementation would save settings to API
    console.log('Saving settings:', { notifications, privacy, theme, language, currency });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implementation would delete account
      console.log('Deleting account');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account preferences and privacy settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    activeTab === tab.id
                      ? "bg-[#00072D] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Mail className="w-5 h-5 text-gray-400 mr-2" />
                      <h3 className="text-md font-medium text-gray-900">Email Notifications</h3>
                    </div>
                    <div className="space-y-3 ml-7">
                      {[
                        { key: 'email_orders', label: 'Order updates and shipping notifications' },
                        { key: 'email_promotions', label: 'Promotional offers and discounts' },
                        { key: 'email_reviews', label: 'Review reminders and responses' },
                        { key: 'email_newsletter', label: 'Weekly newsletter and product updates' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[item.key as keyof NotificationSettings] as boolean}
                              onChange={(e) => handleNotificationChange(item.key as keyof NotificationSettings, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00072D]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Smartphone className="w-5 h-5 text-gray-400 mr-2" />
                      <h3 className="text-md font-medium text-gray-900">Push Notifications</h3>
                    </div>
                    <div className="space-y-3 ml-7">
                      {[
                        { key: 'push_orders', label: 'Order status updates' },
                        { key: 'push_promotions', label: 'Flash sales and limited offers' },
                        { key: 'push_reviews', label: 'Review requests and responses' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[item.key as keyof NotificationSettings] as boolean}
                              onChange={(e) => handleNotificationChange(item.key as keyof NotificationSettings, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00072D]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Smartphone className="w-5 h-5 text-gray-400 mr-2" />
                      <h3 className="text-md font-medium text-gray-900">SMS Notifications</h3>
                    </div>
                    <div className="space-y-3 ml-7">
                      {[
                        { key: 'sms_orders', label: 'Critical order updates only' },
                        { key: 'sms_promotions', label: 'Exclusive SMS-only deals' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[item.key as keyof NotificationSettings] as boolean}
                              onChange={(e) => handleNotificationChange(item.key as keyof NotificationSettings, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00072D]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h2>
                
                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Profile Visibility</h3>
                    <div className="space-y-2">
                      {[
                        { value: 'public', label: 'Public - Anyone can see your profile' },
                        { value: 'private', label: 'Private - Only you can see your profile' },
                        { value: 'friends', label: 'Friends - Only your connections can see' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="profile_visibility"
                            value={option.value}
                            checked={privacy.profile_visibility === option.value}
                            onChange={(e) => handlePrivacyChange('profile_visibility', e.target.value)}
                            className="h-4 w-4 text-[#00072D] focus:ring-[#00072D] border-gray-300"
                          />
                          <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Data Sharing */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Data Sharing</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'show_purchase_history', label: 'Show purchase history on profile' },
                        { key: 'show_wishlist', label: 'Make wishlist visible to others' },
                        { key: 'show_reviews', label: 'Display my product reviews publicly' },
                        { key: 'data_collection', label: 'Allow data collection for personalization' },
                        { key: 'marketing_emails', label: 'Share data with marketing partners' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacy[item.key as keyof PrivacySettings] as boolean}
                              onChange={(e) => handlePrivacyChange(item.key as keyof PrivacySettings, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00072D]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h2>
                
                <div className="space-y-6">
                  {/* Theme */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Theme</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Monitor },
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value as any)}
                            className={cn(
                              "flex flex-col items-center p-4 border-2 rounded-lg transition-colors",
                              theme === option.value
                                ? "border-[#00072D] bg-[#00072D]/5"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <Icon className="w-6 h-6 mb-2" />
                            <span className="text-sm font-medium">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Language</h3>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="it">Italiano</option>
                    </select>
                  </div>

                  {/* Currency */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Currency</h3>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00072D] focus:border-transparent"
                    >
                      <option value="BDT">BDT - Bangladeshi Taka</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Management</h2>
                
                <div className="space-y-6">
                  {/* Export Data */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Export Your Data</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Download a copy of all your account data including orders, reviews, and preferences.
                    </p>
                    <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#00072D] bg-white border border-[#00072D] rounded-md hover:bg-[#00072D] hover:text-white transition-colors">
                      Download Data
                    </button>
                  </div>

                  {/* Deactivate Account */}
                  <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Deactivate Account</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Temporarily deactivate your account. You can reactivate it anytime by logging in.
                    </p>
                    <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-200 transition-colors">
                      Deactivate Account
                    </button>
                  </div>

                  {/* Delete Account */}
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Delete Account</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-800 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="inline-flex items-center px-4 py-2 bg-[#00072D] text-white text-sm font-medium rounded-md hover:bg-[#00072D]/90 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}