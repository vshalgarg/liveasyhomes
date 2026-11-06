import { ApiError } from "./client";

async function parseJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function postAuth(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "same-origin",
    cache: "no-store",
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new ApiError(
      data?.error || data?.message || `Request failed (${res.status})`,
      { status: res.status, fields: data?.fields || null, data }
    );
  }
  return data;
}

/** Login via Next.js route — JWT stored in httpOnly cookie. */
export function loginUser(payload) {
  return postAuth("/api/auth/login", payload);
}

/** Register via Next.js route — ADMIN role is rejected server-side. */
export function registerUser(payload) {
  const role =
    payload?.role === "TENANT" || payload?.role === "LANDLORD"
      ? payload.role
      : "LANDLORD";
  return postAuth("/api/auth/register", { ...payload, role });
}

export async function logoutUser() {
  await postAuth("/api/auth/logout", {});
}

export async function fetchSession() {
  const res = await fetch("/api/auth/session", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });
  const data = await parseJson(res);
  if (!res.ok) {
    return { authenticated: false, user: null };
  }
  return data;
}
