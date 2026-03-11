'use client';

import { AuthGuard } from '@/lib/components/AuthGuard';
import { UserSidebar } from './_components/UserSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth>
      <div className="min-h-screen bg-gray-50 relative">
        <div className="flex justify-center">
          <div className="w-full max-w-6xl flex">
            <UserSidebar />
            <main className="flex-1">
              <div className="p-4 lg:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}