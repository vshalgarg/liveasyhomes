import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

const RECAPTCHA_CONTAINER_ID = "visit-recaptcha";

let sharedVerifier = null;

function mapFirebaseAuthError(error) {
  const code = error?.code || "";
  const message = String(error?.message || "");

  if (/already been rendered/i.test(message)) {
    return "Security check got stuck. Close the form and try again.";
  }

  switch (code) {
    case "auth/invalid-phone-number":
      return "Please enter a valid phone number.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";
    case "auth/captcha-check-failed":
    case "auth/invalid-app-credential":
      return "Security check failed. Refresh the page and try again.";
    case "auth/code-expired":
      return "OTP has expired. Please request a new code.";
    case "auth/invalid-verification-code":
      return "Incorrect OTP. Please try again.";
    case "auth/session-expired":
      return "Session expired. Please request a new OTP.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded. Please try again later.";
    case "auth/operation-not-allowed":
      if (/region/i.test(message)) {
        return "SMS is not enabled for this country yet. In Firebase Console → Authentication → Settings → SMS region policy, allow India (IN), then try again.";
      }
      return "Phone sign-in is disabled. Enable the Phone provider in Firebase Authentication.";
    default:
      return message || "Unable to verify phone number. Please try again.";
  }
}

/** Replace the mount node so grecaptcha cannot reuse a stale render target. */
function resetRecaptchaContainer() {
  if (typeof document === "undefined") return null;

  const el = document.getElementById(RECAPTCHA_CONTAINER_ID);
  if (!el?.parentNode) return null;

  const fresh = document.createElement("div");
  fresh.id = RECAPTCHA_CONTAINER_ID;
  fresh.className = el.className;
  el.parentNode.replaceChild(fresh, el);
  return fresh;
}

export function clearRecaptchaVerifier() {
  if (sharedVerifier) {
    try {
      sharedVerifier.clear();
    } catch {
      // ignore cleanup errors
    }
    sharedVerifier = null;
  }

  resetRecaptchaContainer();
}

function createRecaptchaVerifier() {
  clearRecaptchaVerifier();

  const container = document.getElementById(RECAPTCHA_CONTAINER_ID);
  if (!container) {
    throw new Error("reCAPTCHA container is missing.");
  }

  const auth = getFirebaseAuth();
  // Pass the element (not the id string) and let signInWithPhoneNumber
  // drive verify() — avoid a separate render() that double-mounts.
  sharedVerifier = new RecaptchaVerifier(auth, container, {
    size: "invisible",
    callback: () => {},
    "expired-callback": () => {
      clearRecaptchaVerifier();
    },
  });

  return sharedVerifier;
}

/** Send Firebase phone OTP. Returns ConfirmationResult. */
export async function sendFirebasePhoneOtp(e164Phone) {
  try {
    const auth = getFirebaseAuth();
    const verifier = createRecaptchaVerifier();
    return await signInWithPhoneNumber(auth, e164Phone, verifier);
  } catch (error) {
    clearRecaptchaVerifier();
    throw new Error(mapFirebaseAuthError(error));
  }
}

/** Confirm OTP and return { user, idToken }. */
export async function confirmFirebasePhoneOtp(confirmationResult, otpCode) {
  if (!confirmationResult) {
    throw new Error("OTP session expired. Please request a new code.");
  }

  try {
    const credential = await confirmationResult.confirm(String(otpCode).trim());
    const user = credential.user;
    const idToken = await user.getIdToken(/* forceRefresh */ true);
    return { user, idToken };
  } catch (error) {
    throw new Error(mapFirebaseAuthError(error));
  }
}
