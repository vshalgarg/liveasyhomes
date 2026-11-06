"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import RichText from "./RichText";
import { richTextToPlain } from "@/lib/richText";

const COLLAPSED_MAX_HEIGHT = 140;
const SHORT_PLAIN_LENGTH = 280;

export default function ExpandableTextSection({
  id,
  title,
  value,
  className = "",
}) {
  const contentId = useId();
  const measureRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const plain = richTextToPlain(value);

  useEffect(() => {
    if (!plain) {
      setNeedsToggle(false);
      return undefined;
    }

    const el = measureRef.current;
    if (!el) return undefined;

    const check = () => {
      const tallerThanClamp = el.scrollHeight > COLLAPSED_MAX_HEIGHT + 8;
      const longText = plain.length > SHORT_PLAIN_LENGTH;
      setNeedsToggle(tallerThanClamp || longText);
    };

    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, plain]);

  if (!plain) return null;

  const collapsed = needsToggle && !expanded;

  return (
    <section className={`mt-12 ${className}`} aria-labelledby={id}>
      <div className="rounded-[24px] border border-[#E8E0D8] bg-white/80 p-5 sm:p-6 shadow-[0_8px_24px_rgba(43,33,24,0.04)]">
        <h2 id={id} className="text-xl sm:text-2xl font-serif text-[#2B2118]">
          {title}
        </h2>

        <div className="relative mt-4">
          <div
            id={contentId}
            ref={measureRef}
            className={`overflow-hidden transition-[max-height] duration-300 ease-out ${
              collapsed ? "max-h-[140px]" : "max-h-none"
            }`}
          >
            <RichText
              value={value}
              className="text-gray-600 leading-relaxed text-base sm:text-lg"
            />
          </div>

          {collapsed && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent"
              aria-hidden="true"
            />
          )}
        </div>

        {needsToggle && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-[#8A6A55] hover:text-[#2B2118] transition-colors"
            aria-expanded={expanded}
            aria-controls={contentId}
          >
            {expanded ? (
              <>
                Show less
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              </>
            ) : (
              <>
                Show more
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
