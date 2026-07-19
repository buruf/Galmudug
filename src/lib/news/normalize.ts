import { createHash } from "node:crypto";
import type { Article, NewsSource, RawItem } from "./types";
import { classifyCategory, detectLanguage } from "./classify";

const MAX_SUMMARY_LENGTH = 280;

/** Strip HTML tags and decode the common entities found in RSS descriptions. */
export function stripHtml(html: string): string {
  const noCdata = html.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  const noTags = noCdata
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(noTags).replace(/\s+/g, " ").trim();
}

export function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#?apos;/gi, "'")
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&rdquo;|&ldquo;/gi, '"')
    .replace(/&ndash;|&mdash;/gi, "–");
}

/** Truncate at a word boundary; never republish full article bodies. */
export function truncateSummary(text: string, max = MAX_SUMMARY_LENGTH): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).trimEnd()}…`;
}

/** Canonicalize a story URL: drop tracking params, fragments, trailing slash. */
export function canonicalUrl(raw: string): string {
  try {
    const u = new URL(raw.trim());
    u.hash = "";
    const params = u.searchParams;
    for (const key of [...params.keys()]) {
      if (/^(utm_|fbclid|gclid|ref$|source$)/i.test(key)) params.delete(key);
    }
    u.search = params.toString() ? `?${params.toString()}` : "";
    let href = u.href;
    if (href.endsWith("/") && u.pathname !== "/") href = href.slice(0, -1);
    return href;
  } catch {
    return raw.trim();
  }
}

export function articleId(url: string): string {
  return createHash("sha1").update(canonicalUrl(url)).digest("hex").slice(0, 16);
}

function parseDate(value: string | undefined, fallback: Date): string {
  if (value) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      // Reject obviously bogus dates (before 2000 or > 1 day in the future).
      const now = Date.now();
      if (d.getTime() > 946684800000 && d.getTime() < now + 86400000) {
        return d.toISOString();
      }
    }
  }
  return fallback.toISOString();
}

/** Map a raw feed/scrape item to the normalized Article schema. */
export function normalizeItem(
  raw: RawItem,
  source: NewsSource,
  now: Date = new Date()
): Article | null {
  const title = stripHtml(raw.title ?? "").trim();
  const url = canonicalUrl(raw.link ?? "");
  if (!title || title.length < 8) return null;
  if (!/^https?:\/\//.test(url)) return null;

  const summary = truncateSummary(stripHtml(raw.description ?? ""));
  const text = `${title} ${summary}`;

  return {
    id: articleId(url),
    title: truncateSummary(title, 200),
    summary,
    url,
    sourceId: source.id,
    sourceName: source.name,
    publishedAt: parseDate(raw.publishedAt, now),
    fetchedAt: now.toISOString(),
    category: source.forceCategory ?? classifyCategory(title, summary),
    language: detectLanguage(text, source.language),
    hidden: false,
    pinned: false,
  };
}
