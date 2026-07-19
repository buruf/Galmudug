import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://galmudug.com"
).replace(/\/$/, "");

/**
 * Build page metadata with canonical + hreflang alternates for both locales.
 * `path` is the locale-relative path, e.g. "" (home), "/news", "/districts/hobyo".
 */
export function pageMetadata(opts: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const { locale, path, title, description } = opts;
  const canonical = `${SITE_URL}/${locale}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}/en${path}`,
        so: `${SITE_URL}/so${path}`,
        "x-default": `${SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Galmudug.com",
      locale: locale === "so" ? "so_SO" : "en_GB",
      alternateLocale: locale === "so" ? "en_GB" : "so_SO",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function formatDate(iso: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === "so" ? "so" : "en-GB", {
      dateStyle: "medium",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}
