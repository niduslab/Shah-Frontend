"use client";

import { Bell, MessageSquare, Search, ChevronDown } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-gray-100 bg-white px-8">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search stock, order, etc"
          className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Message Icon */}
        <button className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700">
          <MessageSquare className="h-5 w-5" />
        </button>

        {/* Notification */}
        <button className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 transition-all hover:border-gray-300 hover:shadow-sm cursor-pointer">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-orange-500">
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
              MG
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900">Marcus George</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
