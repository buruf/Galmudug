import type { MetadataRoute } from "next";
import { DISTRICTS } from "@/content/districts";
import { REGION_PAGES } from "@/content/region";
import { locales } from "@/lib/i18n/config";
import { NAV_TOPICS } from "@/lib/news/topics";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/news", priority: 0.9 },
    { path: "/news/somalia", priority: 0.8 },
    ...NAV_TOPICS.map((t) => ({ path: `/news/topic/${t}`, priority: 0.8 })),
    { path: "/region", priority: 0.8 },
    ...REGION_PAGES.filter((p) => p.slug !== "geography").map((p) => ({
      path: `/region/${p.slug}`,
      priority: 0.7,
    })),
    { path: "/districts", priority: 0.8 },
    ...DISTRICTS.map((d) => ({ path: `/districts/${d.slug}`, priority: 0.7 })),
    { path: "/music", priority: 0.7 },
    { path: "/galmudug-day", priority: 0.8 },
    { path: "/about", priority: 0.5 },
    { path: "/privacy", priority: 0.3 },
  ];

  const now = new Date();
  return paths.flatMap(({ path, priority }) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path.startsWith("/news")
        ? ("hourly" as const)
        : ("monthly" as const),
      priority,
      alternates: {
        languages: {
          en: `${SITE_URL}/en${path}`,
          so: `${SITE_URL}/so${path}`,
        },
      },
    }))
  );
}
