"use client";

import {
  looksLikeHtml,
  plainTextToHtml,
  sanitizeRichText,
} from "@/lib/richText";

/** Renders a property description with formatting preserved. */
export default function RichText({ value, className = "" }) {
  if (!value) return null;

  const html = looksLikeHtml(value)
    ? sanitizeRichText(value)
    : plainTextToHtml(value);

  return (
    <div
      className={`rich-text prose-liveasy ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
