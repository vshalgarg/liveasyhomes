/**
 * Legacy localStorage helpers — cleared on boot.
 * Auth token now lives in httpOnly cookies set by /api/auth/*.
 */

const TOKEN_KEY = "liveasyhomes:auth-token";
const USER_KEY = "liveasyhomes:auth-user";

function isBrowser() {
  return typeof window !== "undefined";
}

/** Remove any pre-cookie JWT left in localStorage (XSS surface). */
export function clearLegacyAuthStorage() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

/** @deprecated Token is httpOnly — always null in the browser. */
export function getAuthToken() {
  return null;
}

/** @deprecated Prefer /api/auth/session — kept for migration no-ops. */
export function getAuthUser() {
  return null;
}

export function setAuthSession() {
  // no-op: cookies are set by Next.js auth routes
}

export function clearAuthSession() {
  clearLegacyAuthStorage();
}
