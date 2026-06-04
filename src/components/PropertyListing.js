import { properties, getPropertiesBySection } from "@/data/properties";
import ListingHero from "./listings/ListingHero";
import ListingFilters from "./listings/ListingFilters";
import ListingMap from "./listings/ListingMap";
import ListingSection from "./listings/ListingSection";
import ListingCTA from "./listings/ListingCTA";

const sections = [
  {
    id: "featured",
    eyebrow: "Editor's Picks",
    title: "Handpicked for you",
    description:
      "Our most loved homes — verified, beautifully furnished, and ready for a peaceful move-in.",
    bgClassName: "bg-white",
    getProperties: () => getPropertiesBySection("featured"),
  },
  {
    id: "new",
    eyebrow: "Just Listed",
    title: "New arrivals",
    description:
      "Freshly added homes in prime neighbourhoods. Be the first to experience them.",
    bgClassName: "bg-[#FAF8F5]",
    getProperties: () => getPropertiesBySection("new"),
  },
];

export default function PropertyListing() {
  return (
    <>
      <ListingHero totalCount={properties.length} />
      <ListingFilters />
      <ListingMap properties={properties} />

      {sections.map((section) => (
        <ListingSection
          key={section.id}
          id={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          properties={section.getProperties()}
          bgClassName={section.bgClassName}
        />
      ))}

      <ListingCTA />
    </>
  );
}
