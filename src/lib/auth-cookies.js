import { cookies } from "next/headers";

export const AUTH_TOKEN_COOKIE = "liveasy_auth_token";
export const AUTH_USER_COOKIE = "liveasy_auth_user";

const ONE_DAY_SECONDS = 60 * 60 * 24;

export function authCookieOptions(maxAge = ONE_DAY_SECONDS) {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

export async function setAuthCookies({ token, user, expiresIn }) {
  const jar = await cookies();
  const maxAge =
    typeof expiresIn === "number" && expiresIn > 0
      ? Math.min(expiresIn, ONE_DAY_SECONDS * 7)
      : ONE_DAY_SECONDS;

  jar.set(AUTH_TOKEN_COOKIE, token, authCookieOptions(maxAge));
  jar.set(
    AUTH_USER_COOKIE,
    JSON.stringify({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      role: user?.role,
    }),
    authCookieOptions(maxAge)
  );
}

export async function clearAuthCookies() {
  const jar = await cookies();
  jar.delete(AUTH_TOKEN_COOKIE);
  jar.delete(AUTH_USER_COOKIE);
}

export async function readAuthCookies() {
  const jar = await cookies();
  const token = jar.get(AUTH_TOKEN_COOKIE)?.value || null;
  const rawUser = jar.get(AUTH_USER_COOKIE)?.value || null;
  let user = null;
  if (rawUser) {
    try {
      user = JSON.parse(rawUser);
    } catch {
      user = null;
    }
  }
  return { token, user };
}
