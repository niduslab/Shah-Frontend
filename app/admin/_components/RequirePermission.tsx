'use client';

import { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { usePermission } from '@/lib/hooks/usePermission';

interface RequirePermissionProps {
  permission: string;
  children: ReactNode;
}

/** Blocks a whole admin page behind a `module.view` permission check. */
export function RequirePermission({ permission, children }: RequirePermissionProps) {
  const { can } = usePermission();

  if (!can(permission)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <ShieldAlert className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">No access</h2>
        <p className="max-w-sm text-sm text-gray-500">
          Your role doesn&apos;t have permission to view this page. Contact an administrator if you believe this is a mistake.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
