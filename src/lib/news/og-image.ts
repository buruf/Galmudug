import { fetchWithTimeout } from "./fetcher";

/**
 * OpenGraph image backfill.
 *
 * Most Somali feeds ship headline + summary but no image, so ~75% of stories
 * fell back to the placeholder banner. Publishers do set <meta og:image> on
 * the article page itself, so for stories that arrive without one we fetch
 * the page and read that tag.
 *
 * Constraints this is built around:
 *  - it runs inside the 2-hourly cron, so the work is capped and parallel;
 *  - only genuinely NEW articles are ever fetched (an article keeps its
 *    image forever once resolved), so steady-state cost is a handful of
 *    requests per run;
 *  - every failure is swallowed — a story simply keeps the placeholder.
 */

const OG_TIMEOUT_MS = 8_000;
/** Read only the head of the document; og tags live in <head>. */
const MAX_HTML_BYTES = 120_000;

/** Upper bound on lookups per pipeline run, to bound cron duration. */
export const MAX_OG_LOOKUPS_PER_RUN = 40;
/** How many lookups run at once. */
const CONCURRENCY = 6;

const META_PATTERNS = [
  /<meta[^>]+property=["']og:image(?::url)?["'][^>]*content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image(?::url)?["']/i,
  /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]*content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]*name=["']twitter:image(?::src)?["']/i,
];

/** Reject data URIs, spacers, and other non-usable candidates. */
function usableImageUrl(raw: string, pageUrl: string): string | undefined {
  const value = raw.trim();
  if (!value || value.startsWith("data:")) return undefined;
  let absolute: string;
  try {
    absolute = new URL(value, pageUrl).href;
  } catch {
    return undefined;
  }
  if (!/^https?:\/\//i.test(absolute)) return undefined;
  // Common tracking/spacer pixels and logos are not worth showing.
  if (/(^|\/)(1x1|pixel|spacer|blank)\.(gif|png|jpg)/i.test(absolute)) {
    return undefined;
  }
  return absolute;
}

/** Fetch one article page and extract its OpenGraph image. Never throws. */
export async function fetchOgImage(pageUrl: string): Promise<string | undefined> {
  try {
    const res = await fetchWithTimeout(pageUrl, OG_TIMEOUT_MS);
    if (!res.ok) return undefined;
    const type = res.headers.get("content-type") ?? "";
    if (type && !type.includes("html")) return undefined;

    const html = (await res.text()).slice(0, MAX_HTML_BYTES);
    for (const pattern of META_PATTERNS) {
      const match = pattern.exec(html);
      if (match?.[1]) {
        const url = usableImageUrl(match[1], pageUrl);
        if (url) return url;
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Resolve images for the given items in bounded parallel batches, mutating
 * each item's `image` in place when one is found. Returns how many were
 * filled, for the pipeline report.
 */
export async function backfillImages(
  items: { url: string; image?: string; imageChecked?: boolean }[],
  limit = MAX_OG_LOOKUPS_PER_RUN
): Promise<number> {
  // `imageChecked` keeps a page that simply has no og:image from consuming a
  // lookup slot on every run — without it the same failures would be retried
  // forever and the backlog would never drain.
  const pending = items
    .filter((item) => !item.image && !item.imageChecked)
    .slice(0, limit);
  let filled = 0;

  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    const batch = pending.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((item) => fetchOgImage(item.url))
    );
    results.forEach((image, index) => {
      batch[index].imageChecked = true;
      if (image) {
        batch[index].image = image;
        filled++;
      }
    });
  }

  return filled;
}
