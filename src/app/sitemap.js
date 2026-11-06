import { siteConfig } from "@/lib/site";
import { getAllPropertyIds } from "@/data/properties";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function getApiPropertyIds() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/properties?size=50`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const content = Array.isArray(data)
      ? data
      : Array.isArray(data?.content)
        ? data.content
        : [];
    return content.map((p) => p.id).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: "/home", changeFrequency: "weekly", priority: 1 },
    { path: "/listings", changeFrequency: "daily", priority: 0.95 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  const staticEntries = staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const staticIds = getAllPropertyIds();
  const apiIds = await getApiPropertyIds();
  const allIds = [...new Set([...staticIds, ...apiIds])];

  const propertyEntries = allIds.map((id) => ({
    url: `${siteConfig.url}/listings/${id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticEntries, ...propertyEntries];
}
