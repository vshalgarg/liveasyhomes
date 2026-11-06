"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin } from "lucide-react";
import AnimateIn from "@/components/AnimateIn";

const ListingMapView = dynamic(() => import("./ListingMapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] md:h-[480px] w-full rounded-[24px] bg-[#EDE6DF] animate-pulse flex items-center justify-center text-sm text-gray-500">
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
      className="py-14 md:py-16 bg-[#FAF8F5]"
      aria-labelledby="map-view-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up">
          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-[#B08B6D] font-medium">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Map View
              </p>
              <h2
                id="map-view-heading"
                className="text-3xl md:text-4xl font-serif text-[#2B2118] mt-3"
              >
                Explore by location
              </h2>
              <p className="mt-3 text-gray-600 max-w-xl">
                {isEmpty
                  ? hasActiveFilters
                    ? "No homes match your current filters, so there’s nothing to pin on the map yet."
                    : "No homes are listed right now. Check back soon or clear filters if you applied any."
                  : `All ${count} home${count === 1 ? "" : "s"} across Delhi NCR — tap a pin to see details and jump to the listing.`}
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
          <div className="relative h-[360px] sm:h-[420px] md:h-[480px] rounded-[24px] overflow-hidden border border-[#E8E0D8] shadow-[0_12px_40px_rgba(43,33,24,0.08)]">
            <ListingMapView properties={properties} />
          </div>
        )}
      </div>
    </section>
  );
}
