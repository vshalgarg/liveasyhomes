export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(message, { status = 500, fields = null, data = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
    this.data = data;
  }
}

async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

/** App JWT calls go through same-origin proxy (httpOnly cookie → Bearer). */
function resolveUrl(path, useCookieProxy) {
  if (!useCookieProxy) return `${API_BASE_URL}${path}`;
  const stripped = path.startsWith("/api/")
    ? path.slice(4)
    : path.startsWith("/")
      ? path
      : `/${path}`;
  return `/api/proxy${stripped}`;
}

/**
 * Shared fetch helper.
 * - Public requests hit the Spring API directly.
 * - auth: true (without custom Authorization) uses the Next.js cookie proxy.
 * - Custom Authorization (e.g. Firebase ID token) is sent directly to the API.
 */
export async function apiFetch(
  path,
  { method = "GET", body, formData, auth = false, headers = {} } = {}
) {
  const finalHeaders = { ...headers };
  const hasCustomAuth = Boolean(finalHeaders.Authorization);
  const useCookieProxy = auth && !hasCustomAuth;
  let payload;

  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(resolveUrl(path, useCookieProxy), {
      method,
      headers: finalHeaders,
      body: payload,
      cache: "no-store",
      credentials: useCookieProxy ? "same-origin" : "omit",
    });
  } catch {
    throw new ApiError(
      useCookieProxy
        ? "Cannot reach the app API proxy. Is Next.js running?"
        : "Cannot reach the API. Is the Java server running on port 8080?",
      { status: 0 }
    );
  }

  const data = await parseBody(res);

  if (!res.ok) {
    throw new ApiError(
      data?.error || data?.message || `Request failed (${res.status})`,
      {
        status: res.status,
        fields: data?.fields || null,
        data,
      }
    );
  }

  return data;
}

export function normalizeProperty(property) {
  if (!property) return null;
  const images =
    property.images?.length > 0
      ? property.images
      : (property.photos || []).map((photo) => photo.url).filter(Boolean);

  return {
    ...property,
    images,
    image: property.image || images[0] || null,
    isActive: property.isActive ?? property.active ?? true,
  };
}
