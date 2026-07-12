'use client';

import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminHeader } from "./_components/admin-header";
import { SidebarProvider } from "./_components/sidebar-context";
import { AuthGuard } from "@/lib/components/AuthGuard";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAdminLogin = pathname === '/admin/login';

  if (isAdminLogin) {
    return <>{children}</>;
  }

  return (
    <AuthGuard 
      requireAdmin 
      redirectTo={`/admin/login?redirect=${encodeURIComponent(pathname)}`}
    >
      <SidebarProvider>
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
          <AdminSidebar />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}

