'use client';

import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminHeader } from "./_components/admin-header";
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
      <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

