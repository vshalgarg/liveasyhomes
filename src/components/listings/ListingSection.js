import AnimateIn from "@/components/AnimateIn";
import ListingPropertyCard from "./ListingPropertyCard";

export default function ListingSection({
  id,
  eyebrow,
  title,
  description,
  properties,
  bgClassName = "bg-[#FAF8F5]",
}) {
  if (!properties?.length) return null;

  return (
    <section
      id={id}
      className={`py-14 md:py-20 ${bgClassName}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up">
          <header className="max-w-2xl mb-10 md:mb-14">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#B08B6D] font-medium">
              {eyebrow}
            </p>
            <h2
              id={`${id}-heading`}
              className="text-3xl md:text-4xl font-serif text-[#2B2118] mt-3 leading-tight"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-4 text-gray-600 leading-relaxed text-base md:text-lg">
                {description}
              </p>
            )}
          </header>
        </AnimateIn>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 list-none p-0 m-0">
          {properties.map((property, index) => (
            <AnimateIn
              key={property.id}
              animation="fade-up"
              delay={index * 100}
              className="contents"
            >
              <li id={property.id} className="scroll-mt-28 list-none">
                <ListingPropertyCard
                  property={property}
                  priority={index === 0 && id === "featured"}
                />
              </li>
            </AnimateIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
