"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AnimateIn from "./AnimateIn";
import ComingSoonModal from "./ComingSoonModal";
import {
  COMING_SOON_LOCATIONS,
  SEARCH_LOCATIONS,
  isComingSoonLocation,
} from "@/lib/searchLocations";

export default function PropertySearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
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
    if (!location) return;
    if (isComingSoonLocation(location)) {
      setComingSoonCity(location);
      setModalOpen(true);
      return;
    }

    const params = new URLSearchParams();
    params.set("location", location);
    if (propertyType) params.set("propertyType", propertyType);
    if (budget) params.set("budget", budget);
    router.push(`/listings?${params.toString()}`);
  };

  const closeModal = () => {
    setModalOpen(false);
    if (COMING_SOON_LOCATIONS.includes(location)) {
      setLocation("");
    }
  };

  return (
    <section aria-label="Search rental homes">
      <div className="relative -mt-10 z-20">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimateIn animation="scale-in" delay={100} duration={700}>
            <form
              className="bg-white shadow-xl rounded-2xl sm:rounded-3xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 hover:shadow-2xl transition-shadow duration-500"
              role="search"
              onSubmit={handleSubmit}
            >
              <div>
                <label htmlFor="search-location" className="text-sm text-gray-500">
                  Location
                </label>
                <select
                  id="search-location"
                  name="location"
                  value={location}
                  onChange={handleLocationChange}
                  required
                  className="w-full mt-2 min-h-[44px] outline-none text-base sm:text-sm bg-transparent"
                >
                  <option value="">Select location</option>
                  {SEARCH_LOCATIONS.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="search-type" className="text-sm text-gray-500">
                  Property Type
                </label>
                <select
                  id="search-type"
                  name="propertyType"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full mt-2 min-h-[44px] outline-none text-base sm:text-sm bg-transparent"
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

              <div>
                <label htmlFor="search-budget" className="text-sm text-gray-500">
                  Budget
                </label>
                <select
                  id="search-budget"
                  name="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full mt-2 min-h-[44px] outline-none text-base sm:text-sm bg-transparent"
                >
                  <option value="">Any Range</option>
                  <option value="0-30000">Under ₹30,000</option>
                  <option value="30000-50000">₹30,000 – ₹50,000</option>
                  <option value="50000-80000">₹50,000 – ₹80,000</option>
                  <option value="80000+">₹80,000+</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-[#2B1D13] hover:bg-[#3b2b1f] text-white rounded-2xl px-5 py-4 min-h-[48px] w-full sm:col-span-2 lg:col-span-1 lg:mt-0 font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Search Homes
              </button>
            </form>
          </AnimateIn>
        </div>
      </div>

      <ComingSoonModal
        city={comingSoonCity}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </section>
  );
}
