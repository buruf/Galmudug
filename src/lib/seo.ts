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

/**
 * Short month names for both languages. Intl has no reliable "so" data and
 * resolves differently on the server than in browsers, which produced a
 * hydration mismatch once dates rendered inside client components — so both
 * languages are formatted deterministically here.
 */
const MONTHS_SHORT: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  so: ["Jan", "Feb", "Mar", "Abr", "May", "Jun", "Lul", "Ago", "Seb", "Okt", "Nof", "Des"],
};

export function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  const month = MONTHS_SHORT[locale][d.getUTCMonth()];
  return locale === "so"
    ? `${d.getUTCDate()}-${month}-${d.getUTCFullYear()}`
    : `${d.getUTCDate()} ${month} ${d.getUTCFullYear()}`;
}
