"use client";

import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, BarChart3, Percent, Link as LinkIcon, HelpCircle, FolderTree, Tag, Layers, Zap, Ticket, PackageCheck, Truck, MessageSquare, CreditCard, FileText, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: CreditCard, label: "POS", href: "/admin/pos" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: FolderTree, label: "Categories", href: "/admin/categories" },
  { icon: Tag, label: "Brands", href: "/admin/brands" },
  { icon: Layers, label: "Variations", href: "/admin/variations" },
  { icon: PackageCheck, label: "Inventory", href: "/admin/inventory" },
  { icon: Truck, label: "Shipping Rates", href: "/admin/shipping-rates" },
  { icon: Package, label: "Shipping Classes", href: "/admin/shipping-classes" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: MessageSquare, label: "Reviews", href: "/admin/reviews" },
  { icon: Zap, label: "Flash Deals", href: "/admin/flash-deals" },
  { icon: Ticket, label: "Coupons", href: "/admin/coupons" },
  { icon: Percent, label: "Promotions", href: "/admin/promotions" },
  { icon: BarChart3, label: "Reports", href: "/admin/reports" },
  { icon: FileText, label: "Dynamic Pages", href: "/admin/dynamic-pages" },
  { icon: Percent, label: "Discounts", href: "/admin/discounts" },
];

const bottomMenuItems = [
  { icon: LinkIcon, label: "Integrations", href: "/admin/integrations" },
  { icon: HelpCircle, label: "Help", href: "/admin/help" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-white shadow-sm">
      {/* Logo */}
      <div className="flex h-[72px] items-center px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-500">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="h-1.5 w-1.5 rounded-sm bg-white"></div>
              <div className="h-1.5 w-1.5 rounded-sm bg-white"></div>
              <div className="h-1.5 w-1.5 rounded-sm bg-white"></div>
              <div className="h-1.5 w-1.5 rounded-sm bg-white"></div>
            </div>
          </div>
          <span className="text-lg font-bold text-gray-900">Shah Sports</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="border-t border-gray-100 px-3 py-4 space-y-1">
        {bottomMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Upgrade Banner */}
      <div className="m-4 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 p-6 text-white">
        <h3 className="text-lg font-bold">Version 4.5</h3>
        <p className="mt-1 text-sm opacity-90">is Ready</p>
        <p className="mt-2 text-xs opacity-75">Your current version is 4.2.1</p>
        <button className="mt-4 w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-orange-500 transition-all hover:bg-gray-50">
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
