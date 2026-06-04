"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const AUTO_PLAY_MS = 4000;

export default function PropertyImageCarousel({ images, alt, priority = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (index) => {
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    if (images.length <= 1 || isPaused) return undefined;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [images.length, isPaused]);

  if (!images?.length) return null;

  return (
    <div
      className="relative h-[220px] sm:h-[260px] overflow-hidden bg-[#EDE6DF]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label={`${alt} photo gallery`}
    >
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} — photo ${index + 1} of ${images.length}`}
          fill
          priority={priority && index === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          draggable={false}
        />
      ))}

      {images.length > 1 && (
        <>
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10"
            aria-hidden="true"
          >
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goTo(index);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Show photo ${index + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-3 right-3 z-10 rounded-full bg-black/35 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white">
            {activeIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
