import { ApiError, apiFetch } from "./client";

/**
 * Submit a Firebase-verified visit request to the Spring API.
 *
 * POST /api/visits/request
 * Authorization: Bearer <Firebase ID token>
 * Body: { name, email, phone, propertyId }
 *
 * phone must be E.164 (e.g. +919876543210) matching the token phone_number claim.
 * propertyId is the public listing slug (property.id).
 * Do not send otp, isVerified, or Firebase secrets.
 */
export async function submitVisitRequest(payload, firebaseIdToken) {
  if (!firebaseIdToken) {
    throw new Error("Firebase ID token is required.");
  }

  const name = String(payload?.name || "").trim();
  const email = String(payload?.email || "").trim().toLowerCase();
  const phone = String(payload?.phone || "").trim();
  const propertyId = String(payload?.propertyId || "").trim();

  if (!name || !email || !phone || !propertyId) {
    throw new ApiError("Please complete all visit request details.", {
      status: 400,
    });
  }

  try {
    return await apiFetch("/api/visits/request", {
      method: "POST",
      body: { name, email, phone, propertyId },
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ApiError(mapVisitApiError(error), {
        status: error.status,
        fields: error.fields,
        data: error.data,
      });
    }
    throw error;
  }
}

function mapVisitApiError(error) {
  const apiMessage =
    error?.data?.error ||
    error?.data?.message ||
    error?.message ||
    "";

  switch (error.status) {
    case 400:
      return apiMessage || "Please check the visit details and try again.";
    case 401:
      return (
        apiMessage ||
        "Phone verification expired. Please request a new OTP and try again."
      );
    case 403:
      return (
        apiMessage ||
        "This phone number could not be authorized for the visit request."
      );
    case 404:
      return apiMessage || "This property listing was not found.";
    case 409:
      return (
        apiMessage ||
        "This number already has an open visit request for this home."
      );
    case 429:
      return (
        apiMessage ||
        "Too many visit requests. Please wait a moment and try again."
      );
    case 503:
      return (
        apiMessage ||
        "Visit booking is temporarily unavailable. Please try again later."
      );
    default:
      return apiMessage || "Could not submit the visit request. Please try again.";
  }
}
