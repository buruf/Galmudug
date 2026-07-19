import * as cheerio from "cheerio";
import type { NewsSource, RawItem } from "./types";
import { fetchWithTimeout } from "./fetcher";

const MAX_SCRAPED_ITEMS = 15;
const MIN_TITLE_LENGTH = 25;

/**
 * Headline-scrape fallback for when a source's RSS feed is unavailable.
 * Deliberately conservative: it only extracts headline + link from the
 * source's own listing page, never article bodies.
 */
export async function scrapeHeadlines(source: NewsSource): Promise<RawItem[]> {
  if (!source.scrape) return [];
  const res = await fetchWithTimeout(source.scrape.url);
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${source.scrape.url}`);
  const html = await res.text();
  return extractHeadlines(html, source);
}

export function extractHeadlines(html: string, source: NewsSource): RawItem[] {
  if (!source.scrape) return [];
  const $ = cheerio.load(html);
  const seen = new Set<string>();
  const items: RawItem[] = [];

  $(source.scrape.linkSelector).each((_, el) => {
    if (items.length >= MAX_SCRAPED_ITEMS) return false;
    const $el = $(el);
    const href = $el.attr("href");
    const title = $el.text().replace(/\s+/g, " ").trim();
    if (!href || title.length < MIN_TITLE_LENGTH) return;

    let absolute: string;
    try {
      absolute = new URL(href, source.homepage).href;
    } catch {
      return;
    }
    // Stay on the source's own site; skip nav/category/anchor links.
    if (!absolute.startsWith("http")) return;
    if (new URL(absolute).hostname.replace(/^www\./, "") !==
        new URL(source.homepage).hostname.replace(/^www\./, "")) {
      return;
    }
    if (seen.has(absolute)) return;
    seen.add(absolute);
    items.push({ title, link: absolute });
  });

  return items;
}
