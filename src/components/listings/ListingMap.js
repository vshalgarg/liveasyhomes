"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin } from "lucide-react";
import AnimateIn from "@/components/AnimateIn";

const ListingMapView = dynamic(() => import("./ListingMapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] md:h-[440px] w-full rounded-2xl bg-[#EDE6DF] animate-pulse flex items-center justify-center text-sm text-gray-500">
      Loading map…
    </div>
  ),
});

export default function ListingMap({ properties, hasActiveFilters = false }) {
  const count = properties?.length || 0;
  const isEmpty = count === 0;

  return (
    <section
      id="map-view"
      className="pt-2 pb-6 md:pt-3 md:pb-8 bg-[#F8F5F1]"
      aria-labelledby="map-view-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up">
          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#B08B6D] font-medium">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                Map view
              </p>
              <h2
                id="map-view-heading"
                className="text-xl md:text-2xl font-serif text-[#2B2118] mt-1"
              >
                Explore by location
              </h2>
              <p className="mt-1 text-sm text-gray-600 max-w-xl">
                {isEmpty
                  ? hasActiveFilters
                    ? "No homes match your filters yet."
                    : "No homes listed right now — check back soon."
                  : `${count} home${count === 1 ? "" : "s"} — tap a pin for details.`}
              </p>
            </div>
          </header>
        </AnimateIn>

        {isEmpty ? (
          <div
            role="status"
            className="flex min-h-[280px] sm:min-h-[320px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#D7CEC7] bg-[#F7F3EE] px-6 py-12 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#B08B6D] shadow-sm">
              <MapPin className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="mt-5 text-lg font-serif text-[#2B2118]">
              No homes on the map
            </p>
            <p className="mt-2 max-w-md text-sm text-gray-600 leading-relaxed">
              {hasActiveFilters
                ? "Try another location, budget, or property type — or clear filters to see all available homes."
                : "When listings are published, their locations will appear here as map pins."}
            </p>
            {hasActiveFilters && (
              <Link
                href="/listings"
                className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#2B1D13] px-6 text-sm font-medium text-white hover:bg-[#3a2a1e] transition"
              >
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <div className="relative h-[300px] sm:h-[380px] md:h-[440px] rounded-2xl overflow-hidden border border-[#E8E0D8] shadow-[0_10px_32px_rgba(43,33,24,0.07)]">
            <ListingMapView properties={properties} />
          </div>
        )}
      </div>
    </section>
  );
}
