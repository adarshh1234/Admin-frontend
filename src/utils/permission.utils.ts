import { ALL_MODULES } from '../data/modulesData';
import type { AuthUser } from '../services/auth.service';

/**
 * Baseline modules granted to legacy staff accounts that do not have
 * explicit module access configured yet.
 * 1: Dashboard, 2: Profile, 3: Calendar, 4: Reports, 5: Settings
 */
export const DEFAULT_STAFF_MODULE_IDS: number[] = [1, 2, 3, 4, 5];

/**
 * Returns the effective list of permitted module IDs for a given user.
 */
export function getEffectiveAllowedModules(
  user: { role?: string; allowedModules?: number[] } | null | undefined,
  isSuperAdmin?: boolean,
  isAdmin?: boolean,
): number[] {
  if (!user) return [];

  const role = user.role;
  const isSuper = isSuperAdmin || role === 'Super Admin' || role === 'SUPER_ADMIN';
  const isAdm = isAdmin || role === 'Admin' || role === 'ADMIN';

  if (isSuper || isAdm) {
    return ALL_MODULES.map((m) => m.id);
  }

  // Explicitly configured module permissions for Staff
  if (Array.isArray(user.allowedModules)) {
    return user.allowedModules;
  }

  // Safe fallback for legacy staff accounts without explicit permissions
  return DEFAULT_STAFF_MODULE_IDS;
}

/**
 * Checks if a specific module is accessible by the user.
 */
export function isModuleAccessible(
  moduleId: number,
  user: AuthUser | null | undefined,
  isSuperAdmin?: boolean,
  isAdmin?: boolean,
): boolean {
  if (!user) return false;

  const role = user.role;
  const isSuper = isSuperAdmin || role === 'Super Admin' || role === 'SUPER_ADMIN';
  const isAdm = isAdmin || role === 'Admin' || role === 'ADMIN';

  if (isSuper || isAdm) return true;

  const effectiveModules = getEffectiveAllowedModules(user, isSuperAdmin, isAdmin);

  // Sub-modules mapping to parent module (e.g., CMS submodules 55, 56, 57, 58)
  if ([55, 56, 57, 58].includes(moduleId)) {
    if (effectiveModules.includes(7) || effectiveModules.includes(moduleId)) {
      return true;
    }
  }

  return effectiveModules.includes(moduleId);
}
