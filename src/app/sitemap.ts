import type { MetadataRoute } from "next";
import { PACKAGES } from "@/lib/retreat";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/book", "/faqs", "/contact", "/privacy", "/cancellation"];
  return [
    ...routes.map((path) => ({
      url: `${SITE_URL}${path || "/"}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...PACKAGES.map((pkg) => ({
      url: `${SITE_URL}/book/${pkg.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
