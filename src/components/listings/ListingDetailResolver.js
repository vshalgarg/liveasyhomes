"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProperty, listProperties } from "@/lib/api/properties";
import ListingDetailPage from "./ListingDetailPage";

export default function ListingDetailResolver({
  id,
  initialProperty = null,
}) {
  const [property, setProperty] = useState(initialProperty);
  const [similar, setSimilar] = useState([]);
  const [ready, setReady] = useState(Boolean(initialProperty));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const found = initialProperty || (await getProperty(id));
        if (cancelled) return;
        setProperty(found);

        const page = await listProperties({ size: 12 });
        if (cancelled) return;
        setSimilar(
          (page.content || []).filter((p) => p.id !== id).slice(0, 3)
        );
      } catch {
        if (!cancelled) {
          setProperty(null);
          setSimilar([]);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // Intentionally key off id / initialProperty.id to avoid refetch loops from object identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, initialProperty?.id]);

  if (!ready) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#F8F5F1]">
        <p className="text-sm text-gray-500">Loading property…</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-[#F8F5F1] px-4 text-center">
        <h1 className="text-2xl font-serif text-[#2B2118]">
          Property not found
        </h1>
        <p className="mt-2 text-gray-600 max-w-md">
          This listing may have been removed or the link is incorrect.
        </p>
        <Link
          href="/listings"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-[#2B1D13] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#3a2a1e] transition"
        >
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <ListingDetailPage property={property} similarProperties={similar} />
  );
}
