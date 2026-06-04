import { siteConfig } from "@/lib/site";
import { getAllPropertyIds } from "@/data/properties";

export default function sitemap() {
  const routes = [
    "/home",
    "/listings",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const staticEntries = routes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/home" ? "weekly" : "monthly",
    priority: path === "/home" ? 1 : 0.8,
  }));

  const propertyEntries = getAllPropertyIds().map((id) => ({
    url: `${siteConfig.url}/listings/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticEntries, ...propertyEntries];
}
