"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PropertyCard from "./PropertyCard";
import AnimateIn from "./AnimateIn";
import { listProperties } from "@/lib/api/properties";

export default function HomeListing() {
  const [properties, setProperties] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const featured = await listProperties({ section: "featured", size: 6 });
        let items = (featured.content || []).filter((p) => p.isActive !== false);

        if (items.length < 3) {
          const latest = await listProperties({ size: 9 });
          const seen = new Set(items.map((p) => p.id));
          for (const property of latest.content || []) {
            if (property.isActive === false || seen.has(property.id)) continue;
            items.push(property);
            seen.add(property.id);
            if (items.length >= 6) break;
          }
        }

        if (!cancelled) setProperties(items.slice(0, 6));
      } catch {
        if (!cancelled) setProperties([]);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className="py-16 md:py-20 bg-white"
      aria-labelledby="featured-homes-heading"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 md:mb-12">
            <div>
              <p className="uppercase text-sm tracking-widest text-[#B08B6D]">
                Featured Homes
              </p>

              <h2
                id="featured-homes-heading"
                className="text-3xl md:text-4xl font-serif mt-3 text-[#2B2118]"
              >
                Handpicked homes for you
              </h2>
            </div>

            <Link
              href="/listings"
              className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center border border-gray-300 px-6 py-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-center"
            >
              View All Properties
            </Link>
          </div>
        </AnimateIn>

        {!ready && (
          <p className="text-sm text-gray-500">Loading homes…</p>
        )}

        {ready && properties.length === 0 && (
          <p className="text-sm text-gray-600">
            No published homes yet. Check back soon.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {properties.map((property, index) => (
            <AnimateIn
              key={property.id}
              animation="fade-up"
              delay={index * 100}
              className="contents"
            >
              <PropertyCard
                property={{
                  ...property,
                  image: property.image || property.images?.[0],
                }}
              />
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
