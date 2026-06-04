"use client";

import dynamic from "next/dynamic";
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

export default function ListingMap({ properties }) {
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
                All {properties.length} homes across Bangalore — tap a pin to
                see details and jump to the listing.
              </p>
            </div>
          </header>
        </AnimateIn>

        <div className="relative h-[360px] sm:h-[420px] md:h-[480px] rounded-[24px] overflow-hidden border border-[#E8E0D8] shadow-[0_12px_40px_rgba(43,33,24,0.08)]">
          <ListingMapView properties={properties} />
        </div>

      </div>
    </section>
  );
}
