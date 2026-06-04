"use client";

import Image from "next/image";
import { useCallback, useEffect, useId } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function GalleryLightbox({
  images,
  alt,
  activeIndex,
  isOpen,
  onClose,
  onNavigate,
}) {
  const titleId = useId();

  const goPrev = useCallback(() => {
    onNavigate((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((activeIndex + 1) % images.length);
  }, [activeIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, goPrev, goNext]);

  if (!isOpen || !images.length) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex flex-col bg-[#2B2118]/94 backdrop-blur-md p-4 sm:p-6 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-4 mb-3 shrink-0 rounded-2xl bg-[#8B7361] px-4 py-3 shadow-[0_4px_20px_rgba(43,33,24,0.15)]">
        <p
          id={titleId}
          className="text-sm sm:text-base font-medium text-[#F9F7F4] truncate pr-2"
        >
          {alt} — {activeIndex + 1} of {images.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full bg-[#2B1D13] text-[#F9F7F4] hover:bg-[#3a2a1e] transition"
          aria-label="Close enlarged view"
        >
          <X className="h-5 w-5 text-[#F9F7F4]" aria-hidden="true" />
        </button>
      </div>

      <div
        className="relative flex-1 flex items-center justify-center min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-0 sm:left-2 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/90 text-[#2B2118] shadow-lg hover:bg-white transition"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

        <div className="relative w-full max-w-5xl h-full max-h-[min(75vh,720px)] mx-10 sm:mx-14">
          <Image
            src={images[activeIndex]}
            alt={`${alt} — enlarged photo ${activeIndex + 1}`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 sm:right-2 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/90 text-[#2B2118] shadow-lg hover:bg-white transition"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="mt-4 flex justify-center gap-2 overflow-x-auto scrollbar-hide shrink-0 py-1"
          role="tablist"
          aria-label="Select photo"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`View photo ${index + 1}`}
              onClick={() => onNavigate(index)}
              className={`relative shrink-0 h-14 w-20 sm:h-16 sm:w-24 rounded-xl overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? "border-[#B08B6D] ring-2 ring-[#B08B6D]/40"
                  : "border-white/20 opacity-60 hover:opacity-90"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
