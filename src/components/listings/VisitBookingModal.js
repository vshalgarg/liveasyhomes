"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { submitVisitRequest } from "@/lib/api/visits";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  clearRecaptchaVerifier,
  confirmFirebasePhoneOtp,
  sendFirebasePhoneOtp,
} from "@/lib/firebasePhoneAuth";
import {
  digitsOnly,
  getCountryOptions,
  isValidEmail,
  maskPhone,
  toE164,
} from "@/lib/phone";

const STEPS = { DETAILS: "details", OTP: "otp", SUCCESS: "success" };
const RESEND_COOLDOWN_SEC = 30;
const OTP_LENGTH = 6;

const inputClass =
  "w-full min-h-[48px] rounded-xl border border-[#E0D6CC] bg-white px-4 text-[#2B2118] outline-none focus:border-[#8B7361] focus:ring-2 focus:ring-[#8B7361]/20";

export default function VisitBookingModal({ property, isOpen, onClose }) {
  const titleId = useId();
  const nameInputRef = useRef(null);
  const otpRefs = useRef([]);
  const confirmationRef = useRef(null);
  const sendingRef = useRef(false);
  const submittingRef = useRef(false);

  const [step, setStep] = useState(STEPS.DETAILS);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [verifiedPhone, setVerifiedPhone] = useState("");

  const resetForm = useCallback(() => {
    clearRecaptchaVerifier();
    confirmationRef.current = null;
    sendingRef.current = false;
    submittingRef.current = false;
    setStep(STEPS.DETAILS);
    setName("");
    setEmail("");
    setCountryCode("+91");
    setPhone("");
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setFieldErrors({});
    setError("");
    setLoading(false);
    setResendIn(0);
    setVerifiedPhone("");
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => nameInputRef.current?.focus(), 100);
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen) {
      clearRecaptchaVerifier();
      confirmationRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = window.setInterval(() => {
      setResendIn((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendIn]);

  if (!isOpen || !property) return null;

  function validateDetails() {
    const next = {};
    if (!name.trim() || name.trim().length < 2) {
      next.name = "Please enter your full name.";
    }
    if (!isValidEmail(email)) {
      next.email = "Please enter a valid email address.";
    }
    const e164 = toE164(countryCode, phone);
    if (!e164) {
      next.phone = "Please enter a valid phone number.";
    }
    setFieldErrors(next);
    return { ok: Object.keys(next).length === 0, e164 };
  }

  async function requestOtp({ isResend = false } = {}) {
    if (sendingRef.current) return;
    setError("");

    if (!isFirebaseConfigured()) {
      setError(
        "Phone verification is not configured yet. Please contact support."
      );
      return;
    }

    const { ok, e164 } = validateDetails();
    if (!ok) return;

    sendingRef.current = true;
    setLoading(true);
    try {
      const confirmation = await sendFirebasePhoneOtp(e164);
      confirmationRef.current = confirmation;
      setVerifiedPhone(e164);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setStep(STEPS.OTP);
      setResendIn(RESEND_COOLDOWN_SEC);
      if (!isResend) {
        window.setTimeout(() => otpRefs.current[0]?.focus(), 80);
      }
    } catch (err) {
      setError(err?.message || "Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
      sendingRef.current = false;
    }
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    await requestOtp({ isResend: false });
  }

  async function handleResend() {
    if (resendIn > 0 || loading) return;
    await requestOtp({ isResend: true });
  }

  function updateOtpDigit(index, raw) {
    const value = digitsOnly(raw).slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e) {
    e.preventDefault();
    const pasted = digitsOnly(e.clipboardData.getData("text")).slice(
      0,
      OTP_LENGTH
    );
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((digit, i) => {
      next[i] = digit;
    });
    setOtpDigits(next);
    const focusAt = Math.min(pasted.length, OTP_LENGTH - 1);
    otpRefs.current[focusAt]?.focus();
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (submittingRef.current) return;

    setError("");
    const otpCode = otpDigits.join("");
    if (otpCode.length !== OTP_LENGTH) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    const e164Phone = verifiedPhone || toE164(countryCode, phone);
    if (!e164Phone) {
      setError("Phone number is missing. Please go back and request a new OTP.");
      return;
    }
    if (!property?.id) {
      setError("Property information is missing.");
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    try {
      // Firebase Phone Auth only — no /api/visits/otp/send or /verify
      const { idToken } = await confirmFirebasePhoneOtp(
        confirmationRef.current,
        otpCode
      );

      // Same E.164 that received the SMS; property.id is the public listing slug
      await submitVisitRequest(
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: e164Phone,
          propertyId: property.id,
        },
        idToken
      );

      clearRecaptchaVerifier();
      confirmationRef.current = null;
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err?.message || "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  }

  function goChangeNumber() {
    clearRecaptchaVerifier();
    confirmationRef.current = null;
    setStep(STEPS.DETAILS);
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    setResendIn(0);
  }

  const otpValue = otpDigits.join("");
  const countryOptions = getCountryOptions();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="presentation"
      onClick={handleClose}
    >
      <div
        className="absolute inset-0 bg-[#2B2118]/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full sm:max-w-md max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-[#FAF8F5] shadow-2xl pb-[env(safe-area-inset-bottom)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#EDE6DF] bg-[#FAF8F5] px-5 py-4 sm:px-6">
          <div className="min-w-0 pr-2">
            <p className="text-xs uppercase tracking-widest text-[#B08B6D]">
              Free property visit
            </p>
            <h2
              id={titleId}
              className="text-xl sm:text-2xl font-serif text-[#2B2118] mt-1 leading-snug"
            >
              {property.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1 truncate">
              {property.location}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFE7DF] text-[#2B2118] hover:bg-[#E0D6CC] transition min-h-[44px] min-w-[44px]"
            aria-label="Close booking form"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 py-6 sm:px-6">
          {/* Invisible Firebase reCAPTCHA mount point */}
          <div id="visit-recaptcha" className="hidden" />

          {step === STEPS.DETAILS && (
            <form onSubmit={handleSendOtp} className="space-y-5" noValidate>
              <p className="text-sm text-gray-600 leading-relaxed">
                Enter your details to schedule a free visit. We&apos;ll send a
                one-time OTP to verify your number.
              </p>

              <div>
                <label
                  htmlFor="visit-name"
                  className="block text-sm font-medium text-[#2B2118] mb-1.5"
                >
                  Full name
                </label>
                <input
                  ref={nameInputRef}
                  id="visit-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Your name"
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name && (
                  <p className="mt-1.5 text-xs text-red-600">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="visit-email"
                  className="block text-sm font-medium text-[#2B2118] mb-1.5"
                >
                  Email
                </label>
                <input
                  id="visit-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@email.com"
                  aria-invalid={Boolean(fieldErrors.email)}
                />
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="visit-phone"
                  className="block text-sm font-medium text-[#2B2118] mb-1.5"
                >
                  Mobile number
                </label>
                <div className="flex rounded-xl border border-[#E0D6CC] bg-white overflow-hidden focus-within:border-[#8B7361] focus-within:ring-2 focus-within:ring-[#8B7361]/20">
                  <label htmlFor="visit-country" className="sr-only">
                    Country code
                  </label>
                  <select
                    id="visit-country"
                    value={countryCode}
                    onChange={(e) => {
                      setCountryCode(e.target.value);
                      setPhone("");
                    }}
                    className="max-w-[7.5rem] shrink-0 border-r border-[#E0D6CC] bg-[#FAF8F5] px-2 text-sm text-[#2B2118] outline-none"
                  >
                    {countryOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="visit-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel-national"
                    inputMode="numeric"
                    maxLength={12}
                    value={phone}
                    onChange={(e) =>
                      setPhone(digitsOnly(e.target.value).slice(0, 12))
                    }
                    className="flex-1 min-h-[48px] px-4 text-[#2B2118] outline-none"
                    placeholder="Phone number"
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby="visit-phone-hint"
                  />
                </div>
                <p id="visit-phone-hint" className="text-xs text-gray-500 mt-1.5">
                  OTP will be sent to this number via SMS
                </p>
                {fieldErrors.phone && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] rounded-full bg-[#8B7361] hover:bg-[#7a6656] text-[#F9F7F4] font-medium transition disabled:opacity-60"
              >
                {loading ? "Sending OTP…" : "Send OTP"}
              </button>
            </form>
          )}

          {step === STEPS.OTP && (
            <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
              <p className="text-sm text-gray-600 leading-relaxed">
                Enter the 6-digit code sent to{" "}
                <strong className="text-[#2B2118]">
                  {maskPhone(verifiedPhone)}
                </strong>
                .
              </p>

              <div>
                <p className="block text-sm font-medium text-[#2B2118] mb-2">
                  Verification code
                </p>
                <div
                  className="flex justify-between gap-2"
                  onPaste={handleOtpPaste}
                >
                  {otpDigits.map((digit, index) => (
                    <input
                      // eslint-disable-next-line react/no-array-index-key
                      key={`otp-${index}`}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => updateOtpDigit(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="h-12 w-10 sm:h-14 sm:w-12 rounded-xl border border-[#E0D6CC] bg-white text-center text-xl font-semibold text-[#2B2118] outline-none focus:border-[#8B7361] focus:ring-2 focus:ring-[#8B7361]/20"
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || otpValue.length !== OTP_LENGTH}
                className="w-full min-h-[48px] rounded-full bg-[#8B7361] hover:bg-[#7a6656] text-[#F9F7F4] font-medium transition disabled:opacity-60"
              >
                {loading ? "Verifying…" : "Verify & book visit"}
              </button>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading || resendIn > 0}
                  className="flex-1 min-h-[44px] rounded-full border border-[#D7CEC7] text-sm font-medium text-[#2B2118] hover:bg-white transition disabled:opacity-50"
                >
                  {resendIn > 0 ? `Resend OTP in ${resendIn}s` : "Resend OTP"}
                </button>
                <button
                  type="button"
                  onClick={goChangeNumber}
                  disabled={loading}
                  className="flex-1 min-h-[44px] text-sm text-[#8A6A55] hover:text-[#2B2118]"
                >
                  Change phone number
                </button>
              </div>
            </form>
          )}

          {step === STEPS.SUCCESS && (
            <div className="text-center py-4">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EFE7DF] text-2xl"
                aria-hidden="true"
              >
                ✓
              </div>
              <h3 className="text-xl font-serif text-[#2B2118] mt-5">
                Visit scheduled!
              </h3>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-xs mx-auto">
                Thank you, {name.trim()}. Our team will contact you shortly to
                confirm your free visit to <strong>{property.title}</strong>.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-8 w-full min-h-[48px] rounded-full bg-[#8B7361] hover:bg-[#7a6656] text-[#F9F7F4] font-medium transition"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
