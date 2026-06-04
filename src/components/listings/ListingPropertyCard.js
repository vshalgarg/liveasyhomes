"use client";

import { useState } from "react";
import Link from "next/link";
import PropertyImageCarousel from "./PropertyImageCarousel";
import VisitBookingModal from "./VisitBookingModal";

const tagStyles = {
  Featured: "bg-[#2B2118] text-white",
  New: "bg-[#B08B6D] text-white",
  Verified: "bg-[#EFE7DF] text-[#8A6A55]",
};

export default function ListingPropertyCard({ property, priority = false }) {
  const [modalOpen, setModalOpen] = useState(false);
  const alt = `${property.title} rental in ${property.location}`;
  const images = property.images?.length
    ? property.images
    : property.image
      ? [property.image]
      : [];
  const tagClass = tagStyles[property.tag] ?? tagStyles.Verified;

  return (
    <>
      <article
        id={property.id}
        className="group flex flex-col bg-white/90 backdrop-blur-sm rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(43,33,24,0.06)] hover-lift hover:shadow-[0_20px_50px_rgba(43,33,24,0.12)] border border-[#EDE6DF]/80 h-full transition-all duration-500 scroll-mt-28"
      >
        <Link
          href={`/listings/${property.id}`}
          className="block relative"
          aria-label={`View ${property.title} in ${property.location}`}
        >
          <PropertyImageCarousel
            images={images}
            alt={alt}
            priority={priority}
          />
          {property.tag && (
            <span
              className={`absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${tagClass}`}
            >
              {property.tag}
            </span>
          )}
        </Link>

        <div className="flex flex-col flex-1 p-5 sm:p-6">
          <p className="text-[#8A6A55] font-semibold text-lg sm:text-xl">
            ₹{property.price}
            <span className="text-sm font-normal text-gray-500">/mo</span>
          </p>

          <h3 className="text-lg sm:text-xl font-semibold mt-2">
            <Link
              href={`/listings/${property.id}`}
              className="text-[#2B2118] group-hover:text-[#8A6A55] transition-colors"
            >
              {property.title}
            </Link>
          </h3>

          <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
            {property.location}
          </p>

          <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-5 pt-5 border-t border-[#EDE6DF] text-sm text-gray-600 list-none m-0 p-0">
            <li>{property.beds} Beds</li>
            <li>{property.baths} Baths</li>
            <li>{property.area} sqft</li>
          </ul>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-5 w-full min-h-[48px] rounded-full bg-[#8B7361] hover:bg-[#7a6656] active:scale-[0.98] text-[#F9F7F4] font-medium text-sm sm:text-base transition-all duration-300"
            aria-haspopup="dialog"
            aria-label={`Book a free visit for ${property.title}`}
          >
            Visit for Free
          </button>
        </div>
      </article>

      <VisitBookingModal
        property={property}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
