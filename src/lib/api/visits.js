import { apiFetch } from "./client";

export function sendVisitOtp(payload) {
  return apiFetch("/api/visits/otp/send", {
    method: "POST",
    body: payload,
  });
}

export function verifyVisitOtp(payload) {
  return apiFetch("/api/visits/otp/verify", {
    method: "POST",
    body: payload,
  });
}
