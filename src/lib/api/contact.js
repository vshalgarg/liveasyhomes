import { ApiError, apiFetch } from "./client";

const NAME_MAX = 80;
const EMAIL_MAX = 160;
const PHONE_MIN = 7;
const PHONE_MAX = 20;
const MESSAGE_MAX = 2000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

/**
 * POST /api/contact
 * Body: { name, email, phone, message? }
 * Success: 201 { success, message, id }
 */
export async function submitContact(payload) {
  const name = String(payload?.name || "").trim();
  const email = String(payload?.email || "").trim().toLowerCase();
  const phone = String(payload?.phone || "").trim();
  const message = String(payload?.message || "").trim();

  const fields = {};
  if (!name) fields.name = "Please enter your name.";
  else if (name.length > NAME_MAX) {
    fields.name = `Name must be ${NAME_MAX} characters or fewer.`;
  }

  if (!email) fields.email = "Please enter your email.";
  else if (email.length > EMAIL_MAX) {
    fields.email = `Email must be ${EMAIL_MAX} characters or fewer.`;
  } else if (!EMAIL_RE.test(email)) {
    fields.email = "Please enter a valid email address.";
  }

  if (!phone) fields.phone = "Please enter your phone number.";
  else if (phone.length < PHONE_MIN || phone.length > PHONE_MAX) {
    fields.phone = `Phone must be ${PHONE_MIN}–${PHONE_MAX} characters.`;
  } else if (!PHONE_RE.test(phone)) {
    fields.phone = "Use digits, spaces, +, -, or parentheses only.";
  }

  if (message.length > MESSAGE_MAX) {
    fields.message = `Message must be ${MESSAGE_MAX} characters or fewer.`;
  }

  if (Object.keys(fields).length > 0) {
    throw new ApiError("Please check the highlighted fields.", {
      status: 400,
      fields,
    });
  }

  try {
    return await apiFetch("/api/contact", {
      method: "POST",
      body: { name, email, phone, message },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ApiError(
        error?.data?.error ||
          error?.data?.message ||
          error.message ||
          "Could not send your message. Please try again.",
        {
          status: error.status,
          fields: error.fields || error?.data?.fields || null,
          data: error.data,
        }
      );
    }
    throw error;
  }
}

export const CONTACT_LIMITS = {
  NAME_MAX,
  EMAIL_MAX,
  PHONE_MIN,
  PHONE_MAX,
  MESSAGE_MAX,
};
