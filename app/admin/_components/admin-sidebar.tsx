"use client";

import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Wallet } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Pension Packages", href: "/admin/packages" },
  { icon: Users, label: "All Pension Members", href: "/admin/members" },
  { icon: Package, label: "Projects", href: "/admin/projects" },
  { icon: Users, label: "Board Members", href: "/admin/board" },
  { icon: Wallet, label: "Wallet Balance", href: "/admin/wallet" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-100 bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center px-6 border-b border-gray-100">
        <Image
          src="/Shah Sports.png"
          alt="Shah Sports"
          width={150}
          height={40}
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#0F9D58] text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-gray-100 p-4 space-y-1">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <Settings className="h-5 w-5 text-gray-400" />
          Settings
        </Link>
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900">
          <LogOut className="h-5 w-5 text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  );
}
