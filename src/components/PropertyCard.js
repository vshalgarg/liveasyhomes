import Image from "next/image";
import Link from "next/link";

export default function PropertyCard({ property }) {
  const alt = `${property.title} rental in ${property.location}`;
  const href = property.id ? `/listings/${property.id}` : "/listings";

  return (
    <article className="bg-white rounded-3xl overflow-hidden shadow-md hover-lift hover:shadow-xl h-full">
      <Link
        href={href}
        className="block h-full"
        aria-label={`View ${property.title} in ${property.location}`}
      >
        <div className="relative h-[220px] sm:h-[260px] overflow-hidden">
          <Image
            src={property.image}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        <div className="p-5">
          <p className="text-[#8A6A55] font-semibold text-lg sm:text-xl">
            ₹{property.price}/mo
          </p>

          <h3 className="text-lg sm:text-xl font-semibold mt-2 text-[#2B2118]">
            {property.title}
          </h3>

          <p className="text-gray-500 mt-2">{property.location}</p>

          <ul className="flex flex-wrap justify-between gap-2 mt-5 text-sm text-gray-600 list-none p-0">
            <li>{property.beds} Beds</li>
            <li>{property.baths} Baths</li>
            <li>{property.area} sqft</li>
          </ul>
        </div>
      </Link>
    </article>
  );
}
