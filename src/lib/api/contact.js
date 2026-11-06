import { apiFetch } from "./client";

export function submitContact(payload) {
  return apiFetch("/api/contact", {
    method: "POST",
    body: payload,
  });
}
