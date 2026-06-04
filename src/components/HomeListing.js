import Link from "next/link";
import PropertyCard from "./PropertyCard";
import AnimateIn from "./AnimateIn";
import { getPropertiesBySection } from "@/data/properties";

const properties = getPropertiesBySection("featured").map((p) => ({
  ...p,
  image: p.images[0],
}));

export default function HomeListing() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {properties.map((property, index) => (
            <AnimateIn
              key={property.id}
              animation="fade-up"
              delay={index * 100}
              className="contents"
            >
              <PropertyCard property={property} />
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
