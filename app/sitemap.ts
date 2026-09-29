import type { MetadataRoute } from "next";
import { PILLARS } from "@/lib/seo/pillars";
import { SITE_URL as BASE_URL } from "@/lib/site";

// Doar paginile indexabile. Paginile pe județe (/constelatii-familiale/*) sunt
// noindex și lipsesc intenționat (vezi lib/seo/counties.ts), la fel contul,
// autentificarea și înregistrarea. Fără lastModified: nu avem o dată reală de
// modificare pe pagină, iar new Date() la fiecare cerere ar fi fals.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/chestionar", "/harta", "/articole", "/pachete", "/contact", "/termeni-si-conditii", "/politica-de-confidentialitate", "/politica-cookies"].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const pillarRoutes = PILLARS.map((p) => ({
    url: `${BASE_URL}/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...pillarRoutes];
}
