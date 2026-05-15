/**
 * Strip internal backend/Prisma fields from the user object before
 * storing in Zustand state or localStorage.
 * Only keeps fields needed for UI rendering.
 */
export function sanitizeUser(raw: any) {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    phone: raw.phone ?? null,
    avatar: raw.avatar ?? null,
    role: raw.role,
    permissions: raw.permissions ?? [],
    twoFactorEnabled: !!raw.twoFactorEnabled,
    gender: raw.gender ?? null,
    birthDate: raw.birthDate ?? null,
  };
}
