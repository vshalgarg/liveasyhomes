"use client";

import { useState } from "react";
import Image from "next/image";

/** Skip Next image optimizer for API / R2 / local uploads (avoids noisy 404/500 proxy errors). */
function needsUnoptimized(src) {
  if (typeof src !== "string") return true;
  if (src.startsWith("data:") || src.startsWith("blob:")) return true;
  if (src.includes("localhost:8080") || src.includes("127.0.0.1:8080")) {
    return true;
  }
  if (src.includes(".r2.dev") || src.includes("/uploads/")) return true;
  return false;
}

/** next/image wrapper for listing photos with broken-url fallback */
export default function PropertyPhoto({ src, alt = "", className = "", ...props }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[#EDE6DF] text-sm text-[#8A6A55] ${className}`}
        style={
          props.fill
            ? { position: "absolute", inset: 0 }
            : { width: props.width, height: props.height }
        }
        role="img"
        aria-label={alt || "Photo unavailable"}
      >
        Photo unavailable
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      unoptimized={needsUnoptimized(src)}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
