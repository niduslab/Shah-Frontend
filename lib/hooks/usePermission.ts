import { useAuth } from '@/lib/context/AuthContext';

export function usePermission() {
  const { user } = useAuth();

  const can = (permission: string): boolean => {
    if (!user) return false;
    // Admin role holds every permission; treat it as an unconditional pass
    // in case new modules are added before the seeder catches up.
    if (user.role_names?.includes('Admin')) return true;
    // Fallback: if role/permission data hasn't loaded (or a role hasn't been
    // assigned yet) but the account is an admin-type user, don't lock them
    // out of the panel entirely — fail open to full access for admins only.
    if (user.user_type === 'admin' && !user.role_names?.length) return true;
    return !!user.permission_names?.includes(permission);
  };

  return { can, permissions: user?.permission_names ?? [], roles: user?.role_names ?? [] };
}
