"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { filterProperties } from "@/data/properties";
import { listProperties } from "@/lib/api/properties";
import ListingHero from "./listings/ListingHero";
import ListingFilters from "./listings/ListingFilters";
import ListingMap from "./listings/ListingMap";
import ListingSection from "./listings/ListingSection";
import ListingCTA from "./listings/ListingCTA";

const sectionMeta = [
  {
    id: "featured",
    eyebrow: "Editor's Picks",
    title: "Handpicked for you",
    description:
      "Our most loved homes — verified, beautifully furnished, and ready for a peaceful move-in.",
    bgClassName: "bg-white",
  },
  {
    id: "new",
    eyebrow: "Just Listed",
    title: "New arrivals",
    description:
      "Freshly added homes in prime neighbourhoods. Be the first to experience them.",
    bgClassName: "bg-[#FAF8F5]",
  },
];

export default function PropertyListing() {
  const searchParams = useSearchParams();
  const [catalog, setCatalog] = useState([]);
  const [ready, setReady] = useState(false);

  const filters = useMemo(
    () => ({
      location: searchParams.get("location") || "",
      propertyType:
        searchParams.get("propertyType") || searchParams.get("type") || "",
      budget: searchParams.get("budget") || "",
      moveIn: searchParams.get("moveIn") || "",
    }),
    [searchParams]
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const page = await listProperties({ size: 50 });
        if (!cancelled) setCatalog(page.content || []);
      } catch {
        if (!cancelled) setCatalog([]);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const allProperties = useMemo(
    () => filterProperties(filters, catalog),
    [filters, catalog]
  );
  const hasActiveFilters = Boolean(
    filters.location || filters.propertyType || filters.budget
  );

  return (
    <>
      <ListingHero totalCount={ready ? allProperties.length : null} />
      <ListingFilters initialFilters={filters} />
      <ListingMap
        properties={allProperties}
        hasActiveFilters={hasActiveFilters}
      />

      {!ready && (
        <p className="container mx-auto px-4 lg:px-8 py-10 text-sm text-gray-500">
          Loading properties…
        </p>
      )}

      {ready &&
        sectionMeta.map((section) => {
          const sectionProperties = hasActiveFilters
            ? allProperties.filter((p) => p.section === section.id)
            : catalog.filter(
                (p) => p.section === section.id && p.isActive !== false
              );

          return (
            <ListingSection
              key={section.id}
              id={section.id}
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
              properties={sectionProperties}
              bgClassName={section.bgClassName}
            />
          );
        })}

      <ListingCTA />
    </>
  );
}
