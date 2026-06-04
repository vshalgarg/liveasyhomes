"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimateIn({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 650,
  once = true,
  threshold = 0.12,
  immediate = false,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setVisible(true);
      return undefined;
    }

    if (immediate) {
      const timer = window.setTimeout(() => setVisible(true), delay);
      return () => window.clearTimeout(timer);
    }

    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setVisible(true), delay);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -48px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, immediate, once, threshold]);

  return (
    <div
      ref={ref}
      data-animation={animation}
      className={`animate-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{
        "--animate-delay": `${delay}ms`,
        "--animate-duration": `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
