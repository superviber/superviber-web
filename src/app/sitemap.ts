import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://superviber.com";

/**
 * Canonical routes only. /demo/alignment is deliberately absent: it 307s to
 * /alignment/demo, and listing a redirect invites crawlers to index the wrong
 * URL. /admin is absent for the same reason robots.ts disallows it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/alignment`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/alignment/demo`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/player`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    // Frontmatter dates are authored by hand, so ignore anything unparseable
    // rather than emitting an invalid lastmod.
    lastModified: Number.isNaN(Date.parse(post.date))
      ? undefined
      : new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...posts];
}
