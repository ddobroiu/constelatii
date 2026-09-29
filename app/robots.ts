import type { MetadataRoute } from "next";
import { SITE_URL as BASE_URL } from "@/lib/site";

// /api/ nu are ce căuta în index. Contul și autentificarea NU se blochează aici:
// au meta robots noindex, iar un Disallow l-ar ascunde de crawler.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
