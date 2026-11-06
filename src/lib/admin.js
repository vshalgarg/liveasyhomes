/**
 * Only ADMIN may use the secure add-property page.
 * (Public registration cannot create ADMIN — use your seeded admin account.)
 * LANDLORD is intentionally excluded so random signups cannot list homes.
 */
export const PROPERTY_MANAGER_ROLES = ["ADMIN"];

export function canManageProperties(user) {
  if (!user?.role) return false;
  return PROPERTY_MANAGER_ROLES.includes(String(user.role).toUpperCase());
}
