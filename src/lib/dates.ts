import type { Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/seo";

/**
 * Newsroom-style relative timestamp, hand-localized for both site languages
 * (Intl.RelativeTimeFormat has no reliable Somali data across runtimes).
 * Falls back to the absolute date beyond 7 days.
 */
export function timeAgo(
  iso: string,
  locale: Locale,
  now: Date = new Date()
): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = now.getTime() - then;
  const minutes = Math.round(diffMs / 60_000);
  const hours = Math.round(diffMs / 3_600_000);
  const days = Math.round(diffMs / 86_400_000);

  if (locale === "so") {
    if (minutes < 1) return "hadda";
    if (minutes < 60)
      return minutes === 1 ? "daqiiqad ka hor" : `${minutes} daqiiqo ka hor`;
    if (hours < 24)
      return hours === 1 ? "saacad ka hor" : `${hours} saacadood ka hor`;
    if (days === 1) return "shalay";
    if (days <= 7) return `${days} maalmood ka hor`;
    return formatDate(iso, locale);
  }

  if (minutes < 1) return "just now";
  if (minutes < 60) return minutes === 1 ? "1 min ago" : `${minutes} min ago`;
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  if (days === 1) return "yesterday";
  if (days <= 7) return `${days} days ago`;
  return formatDate(iso, locale);
}
