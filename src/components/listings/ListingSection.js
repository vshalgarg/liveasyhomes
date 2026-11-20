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
      className={`py-8 md:py-10 ${bgClassName}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimateIn animation="fade-up">
          <header className="mb-5 md:mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#B08B6D] font-medium">
                {eyebrow}
              </p>
              <h2
                id={`${id}-heading`}
                className="text-xl md:text-2xl font-serif text-[#2B2118] mt-1 leading-tight"
              >
                {title}
              </h2>
            </div>
            {description && (
              <p className="text-sm text-gray-600 leading-snug max-w-md sm:text-right">
                {description}
              </p>
            )}
          </header>
        </AnimateIn>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 list-none p-0 m-0">
          {properties.map((property, index) => (
            <AnimateIn
              key={property.id}
              animation="fade-up"
              delay={index * 80}
              className="contents"
            >
              <li id={property.id} className="scroll-mt-24 list-none">
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
