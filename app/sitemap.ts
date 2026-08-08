import type { MetadataRoute } from "next";
import { COUNTIES } from "@/lib/seo/counties";
import { PILLARS } from "@/lib/seo/pillars";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/chestionar", "/harta", "/articole"].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const pillarRoutes = PILLARS.map((p) => ({
    url: `${BASE_URL}/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const countyRoutes = COUNTIES.map((c) => ({
    url: `${BASE_URL}/constelatii-familiale/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...pillarRoutes, ...countyRoutes];
}
