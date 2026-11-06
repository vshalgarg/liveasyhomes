"use client";

import { useEffect, useId, useState } from "react";
import { Loader2, X } from "lucide-react";
import { ApiError } from "@/lib/api/client";

const inputBase =
  "w-full min-h-[48px] rounded-xl border border-[#E0D6CC] bg-white px-4 py-3 text-[#2B2118] placeholder:text-gray-400 outline-none transition focus:border-[#B08B6D] focus:ring-2 focus:ring-[#B08B6D]/20";

export default function AuthModal({
  isOpen,
  mode = "login",
  onModeChange,
  onClose,
  onLogin,
  onRegister,
}) {
  const titleId = useId();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setError("");
    setFieldErrors({});
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);
    try {
      if (mode === "login") {
        await onLogin({
          email: values.email.trim(),
          password: values.password,
        });
      } else {
        await onRegister({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          password: values.password,
        });
      }
      setValues({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.fields) setFieldErrors(err.fields);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#2B2118]/50 backdrop-blur-sm" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full sm:max-w-md max-h-[92dvh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-[#FAF8F5] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#EDE6DF] px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#B08B6D]">
              Account
            </p>
            <h2 id={titleId} className="mt-1 text-2xl font-serif text-[#2B2118]">
              {mode === "login" ? "Log in" : "Sign up"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFE7DF] text-[#2B2118]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-6 sm:px-6 space-y-4" noValidate>
          {mode === "register" && (
            <>
              <div>
                <label htmlFor="auth-name" className="block text-sm font-medium mb-1.5">
                  Full name
                </label>
                <input
                  id="auth-name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  className={inputBase}
                  required
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="auth-phone" className="block text-sm font-medium mb-1.5">
                  Phone
                </label>
                <input
                  id="auth-phone"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange}
                  className={inputBase}
                  placeholder="9876543210"
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              className={inputBase}
              required
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={values.password}
              onChange={handleChange}
              className={inputBase}
              required
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
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
            className="w-full min-h-[48px] rounded-full bg-[#2B1D13] text-white font-medium hover:bg-[#3a2a1e] transition disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait…
              </>
            ) : mode === "login" ? (
              "Log in"
            ) : (
              "Create account"
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  className="text-[#8A6A55] font-medium"
                  onClick={() => onModeChange("register")}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-[#8A6A55] font-medium"
                  onClick={() => onModeChange("login")}
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
