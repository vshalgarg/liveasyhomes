"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  Maximize2,
  MapPin,
  ShieldCheck,
  Calendar,
  Sofa,
  Wallet,
  Wrench,
  Wifi,
  Zap,
  Car,
  Dumbbell,
  Wind,
  Waves,
  Trees,
  Sparkles,
  Check,
  ExternalLink,
} from "lucide-react";
import ListingDetailGallery from "./ListingDetailGallery";
import VisitBookingModal from "./VisitBookingModal";
import SinglePropertyMap from "./SinglePropertyMap";
import ListingPropertyCard from "./ListingPropertyCard";
import ExpandableTextSection from "./ExpandableTextSection";

function ItemGroup({ id, title, items }) {
  const filled = (items || []).map((item) => String(item).trim()).filter(Boolean);
  if (!filled.length) return null;

  return (
    <section className="mt-12" aria-labelledby={id}>
      <h2 id={id} className="text-xl sm:text-2xl font-serif text-[#2B2118]">
        {title}
      </h2>
      <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0 m-0">
        {filled.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-3 rounded-2xl bg-white/60 border border-[#EDE6DF] px-4 py-3.5 text-sm sm:text-base text-[#2B2118]"
          >
            <Check className="h-5 w-5 shrink-0 text-[#B08B6D] mt-0.5" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

const tagStyles = {
  Featured: "bg-[#2B2118] text-white",
  New: "bg-[#B08B6D] text-white",
  Verified: "bg-[#EFE7DF] text-[#8A6A55]",
};

const amenityIcons = {
  wifi: Wifi,
  power: Zap,
  security: ShieldCheck,
  housekeeping: Sparkles,
  parking: Car,
  ac: Wind,
  gym: Dumbbell,
  pool: Waves,
  garden: Trees,
};

function AmenityIcon({ amenityKey }) {
  const Icon = amenityIcons[amenityKey] ?? Check;
  return <Icon className="h-5 w-5 text-[#8A6A55]" aria-hidden="true" />;
}

function BookingCard({ property, onVisitClick, className = "" }) {
  return (
    <div
      className={`rounded-[24px] border border-[#E8E0D8] bg-white/90 backdrop-blur-sm p-6 shadow-[0_12px_40px_rgba(43,33,24,0.06)] ${className}`}
    >
      <p className="text-sm text-gray-500">Monthly rent</p>
      <p className="text-3xl font-semibold text-[#8A6A55] mt-1">
        ₹{property.price}
        <span className="text-base font-normal text-gray-500">/mo</span>
      </p>

      <dl className="mt-6 space-y-3 text-sm border-t border-[#EDE6DF] pt-6">
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Deposit</dt>
          <dd className="text-[#2B2118] font-medium text-right m-0">
            {property.deposit}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Maintenance</dt>
          <dd className="text-[#2B2118] font-medium text-right m-0">
            {property.maintenance}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500">Available</dt>
          <dd className="text-[#2B2118] font-medium text-right m-0">
            {property.availableFrom}
          </dd>
        </div>
        {property.onboardingCharge != null && (
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Onboarding</dt>
            <dd className="text-[#2B2118] font-medium text-right m-0">
              ₹{Number(property.onboardingCharge).toLocaleString("en-IN")}
            </dd>
          </div>
        )}
      </dl>

      <button
        type="button"
        onClick={onVisitClick}
        className="mt-6 w-full min-h-[52px] rounded-full bg-[#8B7361] hover:bg-[#7a6656] active:scale-[0.98] text-[#F9F7F4] font-medium text-base transition-all duration-300"
        aria-haspopup="dialog"
      >
        Visit for Free
      </button>

      <p className="mt-4 text-center text-xs text-gray-500 leading-relaxed">
        Book a complimentary visit with OTP verification. No brokerage fees.
      </p>
    </div>
  );
}

export default function ListingDetailPage({ property, similarProperties = [] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const alt = `${property.title} rental in ${property.location}`;
  const images = property.images?.length ? property.images : [];
  const tagClass = tagStyles[property.tag] ?? tagStyles.Verified;

  const stats = [
    {
      icon: BedDouble,
      label: property.floorPlan || `${property.beds} Bedrooms`,
    },
    { icon: Bath, label: `${property.baths} Bathrooms` },
    { icon: Maximize2, label: `${property.area} sqft` },
    { icon: Sofa, label: property.furnished },
  ];

  const quickFacts = [
    { icon: Calendar, label: "Availability", value: property.availableFrom },
    { icon: Wallet, label: "Deposit", value: property.deposit },
    { icon: Wrench, label: "Maintenance", value: property.maintenance },
    ...(property.onboardingCharge != null
      ? [
          {
            icon: Wallet,
            label: "Onboarding",
            value: `₹${Number(property.onboardingCharge).toLocaleString("en-IN")}`,
          },
        ]
      : []),
    { icon: ShieldCheck, label: "Management", value: "LiveEasy managed" },
  ];

  return (
    <>
      <article className="bg-[#F8F5F1] pb-28 lg:pb-16">
        <div className="container mx-auto px-4 lg:px-8 pt-6 md:pt-10">
          <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500 list-none p-0 m-0">
              <li>
                <Link href="/home" className="hover:text-[#8A6A55] transition">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/listings"
                  className="hover:text-[#8A6A55] transition"
                >
                  Properties
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li
                className="text-[#2B2118] font-medium truncate max-w-[200px] sm:max-w-none"
                aria-current="page"
              >
                {property.title}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-10">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                {property.tag && (
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${tagClass}`}
                  >
                    {property.tag}
                  </span>
                )}
                <span className="text-sm text-gray-500">{property.propertyType}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-serif text-[#2B2118] mt-4 leading-[1.15]">
                {property.title}
              </h1>

              <p className="mt-3 flex items-start gap-2 text-gray-600 text-base sm:text-lg">
                <MapPin
                  className="h-5 w-5 shrink-0 text-[#B08B6D] mt-0.5"
                  aria-hidden="true"
                />
                {property.location}
              </p>

              <div className="mt-6 max-w-2xl">
                <ListingDetailGallery images={images} alt={alt} />
              </div>

              <ul className="mt-8 flex flex-wrap gap-3 list-none p-0 m-0">
                {stats.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-[#E8E0D8] px-4 py-2.5 text-sm text-[#2B2118]"
                  >
                    <Icon className="h-4 w-4 text-[#8A6A55]" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>

              <ExpandableTextSection
                id="about-heading"
                title="About this home"
                value={property.description}
              />

              <section className="mt-12" aria-labelledby="highlights-heading">
                <h2
                  id="highlights-heading"
                  className="text-xl sm:text-2xl font-serif text-[#2B2118]"
                >
                  Highlights
                </h2>
                <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0 m-0">
                  {property.highlights?.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-2xl bg-white/60 border border-[#EDE6DF] px-4 py-3.5 text-sm sm:text-base text-[#2B2118]"
                    >
                      <Check
                        className="h-5 w-5 shrink-0 text-[#B08B6D] mt-0.5"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-12" aria-labelledby="amenities-heading">
                <h2
                  id="amenities-heading"
                  className="text-xl sm:text-2xl font-serif text-[#2B2118]"
                >
                  Amenities
                </h2>
                <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none p-0 m-0">
                  {property.amenities?.map((amenity) => (
                    <li
                      key={amenity.key}
                      className="flex items-center gap-3 rounded-2xl bg-[#FAF8F5] border border-[#EDE6DF] px-4 py-4 text-sm text-[#2B2118]"
                    >
                      <AmenityIcon amenityKey={amenity.key} />
                      {amenity.label}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-12" aria-labelledby="facts-heading">
                <h2
                  id="facts-heading"
                  className="text-xl sm:text-2xl font-serif text-[#2B2118]"
                >
                  Rental details
                </h2>
                <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickFacts.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="rounded-2xl bg-white/70 border border-[#EDE6DF] p-4 sm:p-5"
                    >
                      <dt className="flex items-center gap-2 text-sm text-gray-500">
                        <Icon className="h-4 w-4 text-[#B08B6D]" aria-hidden="true" />
                        {label}
                      </dt>
                      <dd className="mt-2 text-[#2B2118] font-medium m-0">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <ItemGroup
                id="rent-excludes-heading"
                title="Rent excludes"
                items={property.rentExcludes}
              />
              <ItemGroup
                id="liveasy-manages-heading"
                title="LivEasy Homes Manages"
                items={property.liveasyManages}
              />
              <ItemGroup
                id="owner-responsibilities-heading"
                title="Owner is directly responsible for"
                items={property.ownerResponsibilities}
              />
              <ExpandableTextSection
                id="terms-heading"
                title="Terms & Conditions"
                value={property.termsAndConditions}
              />

              <section className="mt-12" aria-labelledby="location-heading">
                <h2
                  id="location-heading"
                  className="text-xl sm:text-2xl font-serif text-[#2B2118]"
                >
                  Location
                </h2>
                <p className="mt-2 text-gray-600">{property.location}</p>
                {property.lat != null && property.lng != null && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#8A6A55] hover:text-[#2B2118] transition-colors"
                  >
                    Get Directions
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                <div className="mt-5">
                  <SinglePropertyMap property={property} />
                </div>
              </section>
            </div>

            <aside className="hidden lg:block">
              <BookingCard
                property={property}
                onVisitClick={() => setModalOpen(true)}
                className="sticky top-24"
              />
            </aside>
          </div>

          {similarProperties.length > 0 && (
            <section
              className="mt-16 md:mt-24 pt-12 border-t border-[#E8E0D8]"
              aria-labelledby="similar-heading"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#B08B6D] font-medium">
                You may also like
              </p>
              <h2
                id="similar-heading"
                className="text-2xl sm:text-3xl font-serif text-[#2B2118] mt-3"
              >
                Similar homes
              </h2>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {similarProperties.map((p) => (
                  <ListingPropertyCard key={p.id} property={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#E8E0D8] bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(43,33,24,0.08)]"
        role="region"
        aria-label="Book a visit"
      >
        <div className="flex items-center gap-4 max-w-lg mx-auto">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">From</p>
            <p className="text-lg font-semibold text-[#8A6A55] truncate">
              ₹{property.price}
              <span className="text-sm font-normal text-gray-500">/mo</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="shrink-0 min-h-[48px] px-6 rounded-full bg-[#8B7361] hover:bg-[#7a6656] text-[#F9F7F4] font-medium text-sm sm:text-base transition"
            aria-haspopup="dialog"
          >
            Visit for Free
          </button>
        </div>
      </div>

      <VisitBookingModal
        property={property}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
