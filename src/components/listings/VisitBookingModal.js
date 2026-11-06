"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { sendVisitOtp, verifyVisitOtp } from "@/lib/api/visits";
import { ApiError } from "@/lib/api/client";

const STEPS = { DETAILS: "details", OTP: "otp", SUCCESS: "success" };

export default function VisitBookingModal({ property, isOpen, onClose }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const nameInputRef = useRef(null);

  const [step, setStep] = useState(STEPS.DETAILS);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoOtp, setDemoOtp] = useState("");

  const resetForm = useCallback(() => {
    setStep(STEPS.DETAILS);
    setName("");
    setEmail("");
    setPhone("");
    setOtp("");
    setError("");
    setDemoOtp("");
    setLoading(false);
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

  if (!isOpen || !property) return null;

  async function sendOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await sendVisitOtp({
        name,
        email,
        phone,
        propertyId: property.id,
        propertyTitle: property.title,
      });

      if (data?.demoOtp) setDemoOtp(data.demoOtp);
      setStep(STEPS.OTP);
      setOtp("");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyVisitOtp({ phone, otp });
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="presentation"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-[#2B2118]/50 backdrop-blur-sm" aria-hidden="true" />

      <div
        ref={dialogRef}
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
            <p className="text-sm text-gray-500 mt-1 truncate">{property.location}</p>
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
          {step === STEPS.DETAILS && (
            <form onSubmit={sendOtp} className="space-y-5" noValidate>
              <p className="text-sm text-gray-600 leading-relaxed">
                Enter your details to schedule a free visit. We&apos;ll send a
                one-time OTP to verify your number.
              </p>

              <div>
                <label htmlFor="visit-name" className="block text-sm font-medium text-[#2B2118] mb-1.5">
                  Full name
                </label>
                <input
                  ref={nameInputRef}
                  id="visit-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-[#E0D6CC] bg-white px-4 text-[#2B2118] outline-none focus:border-[#8B7361] focus:ring-2 focus:ring-[#8B7361]/20"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="visit-email" className="block text-sm font-medium text-[#2B2118] mb-1.5">
                  Email
                </label>
                <input
                  id="visit-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-[#E0D6CC] bg-white px-4 text-[#2B2118] outline-none focus:border-[#8B7361] focus:ring-2 focus:ring-[#8B7361]/20"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label htmlFor="visit-phone" className="block text-sm font-medium text-[#2B2118] mb-1.5">
                  Mobile number
                </label>
                <div className="flex rounded-xl border border-[#E0D6CC] bg-white overflow-hidden focus-within:border-[#8B7361] focus-within:ring-2 focus-within:ring-[#8B7361]/20">
                  <span className="flex items-center px-3 text-sm text-gray-500 border-r border-[#E0D6CC] bg-[#FAF8F5]">
                    +91
                  </span>
                  <input
                    id="visit-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className="flex-1 min-h-[48px] px-4 text-[#2B2118] outline-none"
                    placeholder="10-digit number"
                    aria-describedby="visit-phone-hint"
                  />
                </div>
                <p id="visit-phone-hint" className="text-xs text-gray-500 mt-1.5">
                  OTP will be sent to this number
                </p>
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
            <form onSubmit={verifyOtp} className="space-y-5" noValidate>
              <p className="text-sm text-gray-600 leading-relaxed">
                Enter the 6-digit code sent to{" "}
                <strong className="text-[#2B2118]">+91 {phone}</strong>.
              </p>

              {demoOtp && (
                <p
                  className="text-xs rounded-xl bg-[#EFE7DF] text-[#8A6A55] px-3 py-2"
                  role="status"
                >
                  Dev mode OTP: <strong>{demoOtp}</strong>
                </p>
              )}

              <div>
                <label htmlFor="visit-otp" className="block text-sm font-medium text-[#2B2118] mb-1.5">
                  Verification code
                </label>
                <input
                  id="visit-otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full min-h-[52px] rounded-xl border border-[#E0D6CC] bg-white px-4 text-center text-2xl tracking-[0.4em] font-semibold text-[#2B2118] outline-none focus:border-[#8B7361] focus:ring-2 focus:ring-[#8B7361]/20"
                  placeholder="000000"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full min-h-[48px] rounded-full bg-[#8B7361] hover:bg-[#7a6656] text-[#F9F7F4] font-medium transition disabled:opacity-60"
              >
                {loading ? "Verifying…" : "Verify & book visit"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(STEPS.DETAILS);
                  setError("");
                  setOtp("");
                }}
                className="w-full text-sm text-[#8A6A55] hover:text-[#2B2118] min-h-[44px]"
              >
                Change phone number
              </button>
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
                Thank you, {name}. Our team will contact you shortly to confirm
                your free visit to <strong>{property.title}</strong>.
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
