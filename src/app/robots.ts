import type { MetadataRoute } from "next";

const BASE_URL = "https://superviber.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin UI already 404s and carries noindex in production, and the
      // API has nothing crawlable; keep both out of the crawl budget anyway.
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
