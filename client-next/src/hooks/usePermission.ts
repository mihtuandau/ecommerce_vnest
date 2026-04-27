import { useAuthStore } from "@/store/useAuthStore";

/**
 * Returns permission helpers based on the current user's permissions array.
 * Works entirely from the Zustand store — no extra API calls.
 */
export function usePermission() {
  const { user, isLoading } = useAuthStore();
  const permissions: string[] = (user as any)?.permissions ?? [];

  /** Check if user has a specific permission, e.g. "dashboard.view" */
  function can(permission: string): boolean {
    if (isLoading) return false;
    return permissions.includes(permission);
  }

  /** Check if user has ANY of the given permissions */
  function canAny(...perms: string[]): boolean {
    if (isLoading) return false;
    return perms.some((p) => permissions.includes(p));
  }

  /** Check if user has ALL of the given permissions */
  function canAll(...perms: string[]): boolean {
    if (isLoading) return false;
    return perms.every((p) => permissions.includes(p));
  }

  return { can, canAny, canAll, permissions, isLoading };
}
