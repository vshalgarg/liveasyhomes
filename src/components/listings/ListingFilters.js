"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import AnimateIn from "@/components/AnimateIn";
import ComingSoonModal from "@/components/ComingSoonModal";
import {
  COMING_SOON_LOCATIONS,
  SEARCH_LOCATIONS,
  isComingSoonLocation,
} from "@/lib/searchLocations";

const fieldClass =
  "min-w-[200px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start";

export default function ListingFilters({ initialFilters = {} }) {
  const router = useRouter();
  const [location, setLocation] = useState(initialFilters.location || "");
  const [propertyType, setPropertyType] = useState(
    initialFilters.propertyType || ""
  );
  const [budget, setBudget] = useState(initialFilters.budget || "");
  const [beds, setBeds] = useState(initialFilters.beds || "");
  const [comingSoonCity, setComingSoonCity] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    if (isComingSoonLocation(value)) {
      setComingSoonCity(value);
      setModalOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComingSoonLocation(location)) {
      setComingSoonCity(location);
      setModalOpen(true);
      return;
    }

    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (propertyType) params.set("propertyType", propertyType);
    if (budget) params.set("budget", budget);
    if (beds) params.set("beds", beds);
    const qs = params.toString();
    router.push(qs ? `/listings?${qs}` : "/listings");
  };

  const closeModal = () => {
    setModalOpen(false);
    if (COMING_SOON_LOCATIONS.includes(location)) {
      setLocation("");
    }
  };

  return (
    <section
      id="search-filters"
      className="py-14 md:py-16 bg-white border-b border-[#EDE6DF]/80"
      aria-labelledby="filters-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up">
          <header className="mb-8 md:mb-10">
            <p className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-[#B08B6D] font-medium">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Search &amp; Filter
            </p>
            <h2
              id="filters-heading"
              className="text-3xl md:text-4xl font-serif text-[#2B2118] mt-3"
            >
              Find your perfect home
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl leading-relaxed">
              Refine by location, type, budget, and bedrooms — scroll the filters
              on mobile, then search.
            </p>
          </header>
        </AnimateIn>

        <AnimateIn animation="fade-up" delay={80}>
          <div className="rounded-[24px] border border-[#E8E0D8] bg-[#FAF8F5] shadow-[0_8px_30px_rgba(43,33,24,0.05)] overflow-hidden">
            <form
              role="search"
              onSubmit={handleSubmit}
              aria-label="Filter rental properties"
              className="p-5 sm:p-6 md:p-8"
            >
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0 snap-x snap-mandatory scroll-smooth [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D1CBC4]">
                <div className={fieldClass}>
                  <label
                    htmlFor="filter-location"
                    className="text-xs uppercase tracking-wider text-gray-500"
                  >
                    Location
                  </label>
                  <select
                    id="filter-location"
                    name="location"
                    value={location}
                    onChange={handleLocationChange}
                    className="w-full mt-2 min-h-[48px] px-3 rounded-xl bg-white border border-[#E0D6CC] outline-none text-[#2B2118] focus:border-[#B08B6D] transition"
                  >
                    <option value="">All locations</option>
                    {SEARCH_LOCATIONS.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={fieldClass}>
                  <label
                    htmlFor="filter-type"
                    className="text-xs uppercase tracking-wider text-gray-500"
                  >
                    Property Type
                  </label>
                  <select
                    id="filter-type"
                    name="propertyType"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full mt-2 min-h-[48px] px-3 rounded-xl bg-white border border-[#E0D6CC] outline-none text-[#2B2118] focus:border-[#B08B6D] transition"
                  >
                    <option value="">All Types</option>
                    <option value="Gated Apartment">Gated Apartment</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Independent Villa">Independent Villa</option>
                    <option value="Shared Service Apartment">
                      Shared Service Apartment
                    </option>
                    <option value="Builder Floor">Builder Floor</option>
                  </select>
                </div>

                <div className={fieldClass}>
                  <label
                    htmlFor="filter-budget"
                    className="text-xs uppercase tracking-wider text-gray-500"
                  >
                    Budget
                  </label>
                  <select
                    id="filter-budget"
                    name="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full mt-2 min-h-[48px] px-3 rounded-xl bg-white border border-[#E0D6CC] outline-none text-[#2B2118] focus:border-[#B08B6D] transition"
                  >
                    <option value="">Any Range</option>
                    <option value="0-30000">Under ₹30,000</option>
                    <option value="30000-50000">₹30,000 – ₹50,000</option>
                    <option value="50000-80000">₹50,000 – ₹80,000</option>
                    <option value="80000+">₹80,000+</option>
                  </select>
                </div>

                <div className={fieldClass}>
                  <label
                    htmlFor="filter-beds"
                    className="text-xs uppercase tracking-wider text-gray-500"
                  >
                    Bedrooms
                  </label>
                  <select
                    id="filter-beds"
                    name="beds"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className="w-full mt-2 min-h-[48px] px-3 rounded-xl bg-white border border-[#E0D6CC] outline-none text-[#2B2118] focus:border-[#B08B6D] transition"
                  >
                    <option value="">Any</option>
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3+ Beds</option>
                  </select>
                </div>

                <div
                  className={`${fieldClass} min-w-[160px] sm:min-w-0 md:col-span-2 lg:col-span-1 flex items-end`}
                >
                  <button
                    type="submit"
                    className="min-h-[48px] w-full bg-[#2B1D13] hover:bg-[#3a2a1e] text-white rounded-[20px] font-medium transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Search Homes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </AnimateIn>
      </div>

      <ComingSoonModal
        city={comingSoonCity}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </section>
  );
}
