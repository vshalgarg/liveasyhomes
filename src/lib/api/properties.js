import { apiFetch, normalizeProperty } from "./client";

function toQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function listProperties(params = {}) {
  const data = await apiFetch(`/api/properties${toQuery(params)}`);
  const content = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : [];

  return {
    ...data,
    content: content.map(normalizeProperty),
  };
}

export async function getProperty(id) {
  const data = await apiFetch(`/api/properties/${encodeURIComponent(id)}`);
  return normalizeProperty(data);
}

export function createProperty(payload) {
  return apiFetch("/api/properties", {
    method: "POST",
    body: payload,
    auth: true,
  }).then(normalizeProperty);
}

export function updateProperty(id, payload) {
  return apiFetch(`/api/properties/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: payload,
    auth: true,
  }).then(normalizeProperty);
}

export function deleteProperty(id) {
  return apiFetch(`/api/properties/${encodeURIComponent(id)}`, {
    method: "DELETE",
    auth: true,
  });
}

/** Multipart upload — field name expected by backend: `files` */
export async function uploadPropertyPhotos(id, files) {
  const formData = new FormData();
  const list = Array.from(files || []);
  list.forEach((file) => formData.append("files", file));

  const data = await apiFetch(
    `/api/properties/${encodeURIComponent(id)}/photos`,
    {
      method: "POST",
      formData,
      auth: true,
    }
  );
  return normalizeProperty(data);
}

export function deletePropertyPhoto(propertyId, photoId) {
  return apiFetch(
    `/api/properties/${encodeURIComponent(propertyId)}/photos/${encodeURIComponent(photoId)}`,
    {
      method: "DELETE",
      auth: true,
    }
  ).then(normalizeProperty);
}
