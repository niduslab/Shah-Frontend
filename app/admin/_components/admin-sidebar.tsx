"use client";

import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, BarChart3, Percent, Link as LinkIcon, HelpCircle, FolderTree, Tag, Layers, Zap, Ticket, PackageCheck, Truck, MessageSquare, CreditCard, FileText, Bell, ChevronDown, ChevronRight, FileEdit, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSidebar } from "./sidebar-context";

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
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: BarChart3, label: "Reports", href: "/admin/reports" },
  // { icon: FileText, label: "Dynamic Pages", href: "/admin/dynamic-pages" },
  { icon: Percent, label: "Discounts", href: "/admin/discounts" },
];

const dynamicContentsMenu = {
  icon: FileEdit,
  label: "Dynamic Contents",
  subItems: [
    { label: "Landing Page", href: "/admin/dynamic-contents/landing-page" },
    // { label: "Brand Pages", href: "/admin/dynamic-contents/brand-pages" },
  ],
};

const bottomMenuItems = [
  { icon: LinkIcon, label: "Integrations", href: "/admin/integrations" },
  { icon: HelpCircle, label: "Help", href: "/admin/help" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

/** Logo + navigation links, shared by the desktop rail and the mobile drawer. */
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [isDynamicContentsOpen, setIsDynamicContentsOpen] = useState(false);

  return (
    <>
      {/* Logo */}
      <div className="flex h-[72px] flex-shrink-0 items-center justify-between px-6">
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
        {/* Close button (mobile drawer only) */}
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}

        {/* Dynamic Contents Menu */}
        <div>
          <button
            onClick={() => setIsDynamicContentsOpen(!isDynamicContentsOpen)}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
          >
            <dynamicContentsMenu.icon className="h-5 w-5 flex-shrink-0" />
            {dynamicContentsMenu.label}
            {isDynamicContentsOpen ? (
              <ChevronDown className="ml-auto h-4 w-4" />
            ) : (
              <ChevronRight className="ml-auto h-4 w-4" />
            )}
          </button>
          {isDynamicContentsOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {dynamicContentsMenu.subItems.map((subItem) => {
                const isActive = pathname === subItem.href;
                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {subItem.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export function AdminSidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Desktop rail: fixed width, always visible at lg and up */}
      <aside className="hidden h-screen w-64 flex-shrink-0 flex-col bg-white shadow-sm lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile drawer: overlay + sliding panel, below lg */}
      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      {/* Panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 max-w-[80vw] flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onNavigate={close} />
      </aside>
    </>
  );
}
