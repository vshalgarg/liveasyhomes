"use client";

import { useEffect } from "react";
import { MapPin, Sparkles, X } from "lucide-react";

export default function ComingSoonModal({ city, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="coming-soon-backdrop absolute inset-0 bg-[#2B2118]/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="coming-soon-title"
        className="coming-soon-dialog relative w-full max-w-md overflow-hidden rounded-[28px] bg-[#FAF8F5] shadow-2xl ring-1 ring-[#EFE7DF]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-[#EFE7DF]/80 blur-2xl" />
        <div className="absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-[#E8DFD6]/70 blur-2xl" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#2B2118] hover:bg-white transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative px-7 pt-10 pb-8 text-center">
          <div className="coming-soon-icon mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EFE7DF] text-[#8A6A55] shadow-inner">
            <MapPin className="h-8 w-8" strokeWidth={1.75} aria-hidden="true" />
          </div>

          <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B08B6D] ring-1 ring-[#E8DFD6]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {city || "Your city"}
          </p>

          <h2
            id="coming-soon-title"
            className="mt-4 text-2xl sm:text-3xl font-serif text-[#2B2118] leading-snug"
          >
            We are coming to your city soon!!
          </h2>

          <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
            LiveEasy Homes is expanding. Stay tuned — peaceful, managed homes
            are on the way to {city || "your city"}.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-7 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#2B1D13] px-6 text-sm font-medium text-white hover:bg-[#3a2a1e] transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
