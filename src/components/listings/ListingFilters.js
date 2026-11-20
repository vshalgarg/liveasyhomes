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
  "min-w-[160px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-start";

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
      className="pt-4 pb-6 md:pt-5 md:pb-7 bg-[#F8F5F1]"
      aria-label="Search and filter properties"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up" immediate delay={80}>
          <div className="rounded-2xl border border-[#E8E0D8]/90 bg-white/80 backdrop-blur-sm shadow-[0_6px_24px_rgba(43,33,24,0.04)] overflow-hidden">
            <form
              role="search"
              onSubmit={handleSubmit}
              aria-label="Filter rental properties"
              className="p-3 sm:p-4"
            >
              <div className="mb-2.5 flex items-center gap-2 px-0.5">
                <SlidersHorizontal
                  className="h-3.5 w-3.5 text-[#B08B6D]"
                  aria-hidden="true"
                />
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#B08B6D] font-medium m-0">
                  Refine results
                </p>
              </div>

              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-3 overflow-x-auto md:overflow-visible pb-1 md:pb-0 -mx-0.5 px-0.5 md:mx-0 md:px-0 snap-x snap-mandatory scroll-smooth [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D1CBC4]">
                <div className={fieldClass}>
                  <label
                    htmlFor="filter-location"
                    className="text-[11px] uppercase tracking-wider text-gray-500"
                  >
                    Location
                  </label>
                  <select
                    id="filter-location"
                    name="location"
                    value={location}
                    onChange={handleLocationChange}
                    className="w-full mt-1.5 min-h-[44px] px-3 rounded-xl bg-[#FAF8F5] border border-[#E0D6CC] outline-none text-sm text-[#2B2118] focus:border-[#B08B6D] focus:bg-white transition"
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
                    className="text-[11px] uppercase tracking-wider text-gray-500"
                  >
                    Type
                  </label>
                  <select
                    id="filter-type"
                    name="propertyType"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full mt-1.5 min-h-[44px] px-3 rounded-xl bg-[#FAF8F5] border border-[#E0D6CC] outline-none text-sm text-[#2B2118] focus:border-[#B08B6D] focus:bg-white transition"
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
                    className="text-[11px] uppercase tracking-wider text-gray-500"
                  >
                    Budget
                  </label>
                  <select
                    id="filter-budget"
                    name="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full mt-1.5 min-h-[44px] px-3 rounded-xl bg-[#FAF8F5] border border-[#E0D6CC] outline-none text-sm text-[#2B2118] focus:border-[#B08B6D] focus:bg-white transition"
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
                    className="text-[11px] uppercase tracking-wider text-gray-500"
                  >
                    Beds
                  </label>
                  <select
                    id="filter-beds"
                    name="beds"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className="w-full mt-1.5 min-h-[44px] px-3 rounded-xl bg-[#FAF8F5] border border-[#E0D6CC] outline-none text-sm text-[#2B2118] focus:border-[#B08B6D] focus:bg-white transition"
                  >
                    <option value="">Any</option>
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3+ Beds</option>
                  </select>
                </div>

                <div
                  className={`${fieldClass} min-w-[140px] sm:min-w-0 md:col-span-2 lg:col-span-1 flex items-end`}
                >
                  <button
                    type="submit"
                    className="min-h-[44px] w-full bg-[#2B1D13] hover:bg-[#3a2a1e] text-white rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Search
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
