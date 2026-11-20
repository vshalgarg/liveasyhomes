"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { CONTACT_LIMITS, submitContact } from "@/lib/api/contact";
import { ApiError } from "@/lib/api/client";

const initialState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const inputBase =
  "w-full min-h-[48px] rounded-xl border border-[#E0D6CC] bg-white px-4 py-3 text-[#2B2118] placeholder:text-gray-400 outline-none transition focus:border-[#B08B6D] focus:ring-2 focus:ring-[#B08B6D]/20";

const labelClass = "block text-sm font-medium text-[#2B2118] mb-2";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

const FIELD_MAX = {
  name: CONTACT_LIMITS.NAME_MAX,
  email: CONTACT_LIMITS.EMAIL_MAX,
  phone: CONTACT_LIMITS.PHONE_MAX,
  message: CONTACT_LIMITS.MESSAGE_MAX,
};

function CharCount({ value, max, id }) {
  const count = value.length;
  const nearLimit = count >= max;
  return (
    <p
      id={id}
      className={`mt-1.5 text-xs tabular-nums ${
        nearLimit ? "text-[#8A6A55]" : "text-gray-400"
      }`}
      aria-live="polite"
    >
      {count}/{max}
    </p>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState(initialState);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const max = FIELD_MAX[name];
    const nextValue = max != null ? value.slice(0, max) : value;
    setValues((prev) => ({ ...prev, [name]: nextValue }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const next = {};
    const name = values.name.trim();
    const email = values.email.trim();
    const phone = values.phone.trim();
    const message = values.message.trim();

    if (!name) next.name = "Please enter your name.";
    else if (name.length > CONTACT_LIMITS.NAME_MAX) {
      next.name = `Name must be ${CONTACT_LIMITS.NAME_MAX} characters or fewer.`;
    }

    if (!email) next.email = "Please enter your email.";
    else if (email.length > CONTACT_LIMITS.EMAIL_MAX) {
      next.email = `Email must be ${CONTACT_LIMITS.EMAIL_MAX} characters or fewer.`;
    } else if (!EMAIL_RE.test(email)) {
      next.email = "Please enter a valid email address.";
    }

    if (!phone) next.phone = "Please enter your phone number.";
    else if (
      phone.length < CONTACT_LIMITS.PHONE_MIN ||
      phone.length > CONTACT_LIMITS.PHONE_MAX
    ) {
      next.phone = `Phone must be ${CONTACT_LIMITS.PHONE_MIN}–${CONTACT_LIMITS.PHONE_MAX} characters.`;
    } else if (!PHONE_RE.test(phone)) {
      next.phone = "Use digits, spaces, +, -, or parentheses only.";
    }

    if (message.length > CONTACT_LIMITS.MESSAGE_MAX) {
      next.message = `Message must be ${CONTACT_LIMITS.MESSAGE_MAX} characters or fewer.`;
    }

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus("submitting");
    setFormError("");
    try {
      await submitContact({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
      });
      setStatus("success");
      setValues(initialState);
      setErrors({});
    } catch (err) {
      setStatus("idle");
      if (err instanceof ApiError && err.fields) {
        setErrors(err.fields);
      }
      setFormError(
        err?.message || "Could not send your message. Please try again."
      );
    }
  };

  return (
    <section
      className="relative h-full rounded-3xl bg-white p-8 sm:p-10 shadow-xl ring-1 ring-[#EFE7DF]"
      aria-labelledby="contact-form-heading"
    >
      <span className="uppercase text-xs tracking-[0.25em] text-[#B08B6D] font-semibold">
        Send a Message
      </span>

      <h2
        id="contact-form-heading"
        className="mt-3 text-2xl sm:text-3xl font-serif text-[#2B2118] leading-snug"
      >
        Send Us a Message
      </h2>

      <p className="mt-3 text-gray-600 leading-relaxed">
        Fill out the form below and our team will get back to you within 24
        hours.
      </p>

      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-8 flex flex-col items-center justify-center text-center rounded-2xl bg-[#F2EFEA] border border-[#E0D6CC] p-8"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B08B6D]/15">
            <CheckCircle2
              className="h-8 w-8 text-[#8A6A55]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </span>
          <h3 className="mt-5 text-xl font-serif text-[#2B2118]">
            Thank you for reaching out!
          </h3>
          <p className="mt-2 text-gray-600 max-w-sm">
            We&apos;ve received your message and will be in touch shortly.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#D7CEC7] px-6 py-2.5 text-sm font-medium text-[#2B2118] hover:bg-[#F8F5F1] transition"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 space-y-5"
          aria-label="Contact form"
        >
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Your name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={CONTACT_LIMITS.NAME_MAX}
              value={values.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name
                  ? "contact-name-error contact-name-count"
                  : "contact-name-count"
              }
              className={inputBase}
              placeholder="Jane Doe"
            />
            <div className="flex items-start justify-between gap-3">
              {errors.name ? (
                <p
                  id="contact-name-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {errors.name}
                </p>
              ) : (
                <span />
              )}
              <CharCount
                id="contact-name-count"
                value={values.name}
                max={CONTACT_LIMITS.NAME_MAX}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Your email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={CONTACT_LIMITS.EMAIL_MAX}
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email
                  ? "contact-email-error contact-email-count"
                  : "contact-email-count"
              }
              className={inputBase}
              placeholder="you@example.com"
            />
            <div className="flex items-start justify-between gap-3">
              {errors.email ? (
                <p
                  id="contact-email-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {errors.email}
                </p>
              ) : (
                <span />
              )}
              <CharCount
                id="contact-email-count"
                value={values.email}
                max={CONTACT_LIMITS.EMAIL_MAX}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              Your phone
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={CONTACT_LIMITS.PHONE_MAX}
              value={values.phone}
              onChange={handleChange}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={
                errors.phone
                  ? "contact-phone-error contact-phone-count"
                  : "contact-phone-count"
              }
              className={inputBase}
              placeholder="+91 98114 46782"
            />
            <div className="flex items-start justify-between gap-3">
              {errors.phone ? (
                <p
                  id="contact-phone-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {errors.phone}
                </p>
              ) : (
                <span />
              )}
              <CharCount
                id="contact-phone-count"
                value={values.phone}
                max={CONTACT_LIMITS.PHONE_MAX}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className={labelClass}>
              Your message{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              maxLength={CONTACT_LIMITS.MESSAGE_MAX}
              value={values.message}
              onChange={handleChange}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={
                errors.message
                  ? "contact-message-error contact-message-count"
                  : "contact-message-count"
              }
              className={`${inputBase} min-h-[140px] resize-y py-3`}
              placeholder="Tell us a bit about what you're looking for…"
            />
            <div className="flex items-start justify-between gap-3">
              {errors.message ? (
                <p
                  id="contact-message-error"
                  className="mt-1.5 text-xs text-red-600"
                >
                  {errors.message}
                </p>
              ) : (
                <span />
              )}
              <CharCount
                id="contact-message-count"
                value={values.message}
                max={CONTACT_LIMITS.MESSAGE_MAX}
              />
            </div>
          </div>

          {formError && (
            <p className="text-sm text-red-600" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="group inline-flex w-full min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#2B1D13] px-6 py-3 text-white font-medium transition-all duration-300 hover:bg-[#3a2a1e] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {status === "submitting" ? (
              <>
                <Loader2
                  className="h-5 w-5 animate-spin"
                  aria-hidden="true"
                />
                Sending…
              </>
            ) : (
              <>
                Send Message
                <Send
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By submitting, you agree to be contacted by our team. We respect
            your privacy.
          </p>
        </form>
      )}
    </section>
  );
}
