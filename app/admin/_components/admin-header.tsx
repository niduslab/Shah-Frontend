"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";

export function AdminHeader() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8">
      {/* Search */}
      <div className="relative w-96">
        <input
          type="text"
          placeholder="Search here"
          className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-4 pr-10 text-sm outline-none focus:border-[#0F9D58] focus:ring-1 focus:ring-[#0F9D58]"
        />
        <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="relative rounded-full p-2 hover:bg-gray-50">
          <Bell className="h-6 w-6 text-gray-500" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#0F9D58] ring-2 ring-white" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200">
            <Image
              src="/images/about-us/syed ghazanfar ali.png"
              alt="User"
              fill
              className="object-cover"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#0F9D58] ring-2 ring-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-900">WK Surid</p>
            <p className="text-xs text-gray-500">UI/UX Designer</p>
          </div>
        </div>
      </div>
    </header>
  );
}
