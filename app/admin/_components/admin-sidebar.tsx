"use client";

import { LayoutDashboard, Package, ShoppingCart, Users, Settings, BarChart3, Percent, FolderTree, Tag, Layers, Zap, Ticket, PackageCheck, Truck, MessageSquare, CreditCard, FileEdit, X, ShieldCheck, Radio, Inbox } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { useSidebar } from "./sidebar-context";
import { usePermission } from "@/lib/hooks/usePermission";

/** Top-level items that don't belong to any category. */
const topLevelItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", module: "dashboard" },
  { icon: CreditCard, label: "POS", href: "/admin/pos", module: "pos" },
];

/** Grouped navigation: each category renders as a collapsible section. */
const menuGroups = [
  {
    id: "catalog",
    label: "Catalog",
    icon: Package,
    items: [
      { icon: ShoppingCart, label: "Orders", href: "/admin/orders", module: "orders" },
      { icon: Package, label: "Products", href: "/admin/products", module: "products" },
      { icon: FolderTree, label: "Categories", href: "/admin/categories", module: "categories" },
      { icon: Tag, label: "Brands", href: "/admin/brands", module: "brands" },
      { icon: Layers, label: "Variations", href: "/admin/variations", module: "variations" },
      { icon: PackageCheck, label: "Inventory", href: "/admin/inventory", module: "inventory" },
      { icon: Truck, label: "Shipping Rates", href: "/admin/shipping-rates", module: "shipping" },
      { icon: Package, label: "Shipping Classes", href: "/admin/shipping-classes", module: "shipping" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Percent,
    items: [
      { icon: Zap, label: "Flash Deals", href: "/admin/flash-deals", module: "flash_deals" },
      { icon: Ticket, label: "Coupons", href: "/admin/coupons", module: "coupons" },
      { icon: Percent, label: "Promotions", href: "/admin/promotions", module: "promotions" },
      { icon: Percent, label: "Discounts", href: "/admin/discounts", module: "promotions" },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    icon: BarChart3,
    items: [
      { icon: BarChart3, label: "Analytics", href: "/admin/analytics", module: "analytics" },
      { icon: Radio, label: "Pixel & Tags", href: "/admin/integrations", module: "analytics" },
      { icon: BarChart3, label: "Reports", href: "/admin/reports", module: "reports" },
    ],
  },
  {
    id: "content",
    label: "Content",
    icon: FileEdit,
    items: [
      { icon: FileEdit, label: "Landing Page", href: "/admin/dynamic-contents/landing-page", module: "content" },
      { icon: MessageSquare, label: "Reviews", href: "/admin/reviews", module: "reviews" },
      { icon: Inbox, label: "Contact Messages", href: "/admin/contact-messages", module: "contact_messages" },
    ],
  },
  {
    id: "access",
    label: "Users & Access",
    icon: Users,
    items: [
      { icon: Users, label: "Users", href: "/admin/users", module: "users" },
      { icon: ShieldCheck, label: "Roles & Permissions", href: "/admin/roles", module: "users" },
    ],
  },
];

const bottomMenuItems = [
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

/** Logo + navigation links, shared by the desktop rail and the mobile drawer. */
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { can } = usePermission();

  const visibleTopLevelItems = topLevelItems.filter((item) => can(`${item.module}.view`));

  const visibleGroups = useMemo(
    () =>
      menuGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => can(`${item.module}.view`)),
        }))
        .filter((group) => group.items.length > 0),
    [can]
  );

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
        {visibleTopLevelItems.map((item) => {
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

        {visibleGroups.length > 0 && <div className="my-2 border-t border-gray-100" />}

        {/* Grouped categories */}
        {visibleGroups.map((group) => (
          <div key={group.id}>
            <div className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <group.icon className="h-4 w-4 flex-shrink-0" />
              <span>{group.label}</span>
            </div>
            <div className="space-y-1 pb-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-lg py-2.5 pl-9 pr-4 text-sm font-medium transition-all",
                      isActive
                        ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom links */}
      <div className="flex-shrink-0 space-y-1 border-t border-gray-100 px-3 py-3">
        {bottomMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>
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
