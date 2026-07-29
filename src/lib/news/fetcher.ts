import { XMLParser } from "fast-xml-parser";
import type { RawItem } from "./types";

const FETCH_TIMEOUT_MS = 12_000;
const USER_AGENT =
  "GalmudugComAggregator/1.0 (+https://galmudug.com/en/about; headline aggregation with attribution)";

export async function fetchWithTimeout(
  url: string,
  timeoutMs = FETCH_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept:
          "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html;q=0.8, */*;q=0.5",
      },
      redirect: "follow",
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  parseTagValue: false,
});

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function textOf(node: unknown): string {
  if (node === undefined || node === null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (typeof node === "object") {
    const o = node as Record<string, unknown>;
    if (typeof o["#text"] === "string" || typeof o["#text"] === "number") {
      return String(o["#text"]);
    }
    if (typeof o["__cdata"] === "string") return o["__cdata"];
  }
  return "";
}

function atomLink(node: unknown): string {
  const links = asArray(node as Record<string, unknown> | Record<string, unknown>[]);
  // Prefer rel="alternate" (or unspecified rel), fall back to the first href.
  for (const l of links) {
    if (typeof l === "string") return l;
    const rel = l["@_rel"];
    if (!rel || rel === "alternate") {
      const href = l["@_href"];
      if (typeof href === "string") return href;
    }
  }
  for (const l of links) {
    if (typeof l === "object" && typeof l["@_href"] === "string") return l["@_href"];
  }
  return "";
}

/** Attribute url of the first usable node in enclosure/media:* fields. */
function mediaUrl(node: unknown): string {
  for (const m of asArray(node as Record<string, unknown> | Record<string, unknown>[])) {
    if (typeof m !== "object" || m === null) continue;
    const o = m as Record<string, unknown>;
    const type = typeof o["@_type"] === "string" ? (o["@_type"] as string) : "";
    if (type && !type.startsWith("image/") && o["@_medium"] !== "image") continue;
    const url = o["@_url"];
    if (typeof url === "string" && /^https?:\/\//.test(url)) return url;
  }
  return "";
}

/** First <img src> inside an HTML fragment (description/content:encoded). */
function inlineImage(html: string): string {
  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(html);
  const src = match?.[1] ?? "";
  return /^https?:\/\//.test(src) ? src : "";
}

/**
 * YouTube (and some other Atom feeds) nest media under <media:group> rather
 * than putting media:* directly on the entry.
 */
function mediaGroup(item: Record<string, unknown>): Record<string, unknown> {
  const group = item["media:group"];
  return group && typeof group === "object"
    ? (group as Record<string, unknown>)
    : {};
}

/** Best-effort image for one feed item; empty string when none found. */
function itemImage(item: Record<string, unknown>, html: string): string | undefined {
  const group = mediaGroup(item);
  const url =
    mediaUrl(item.enclosure) ||
    mediaUrl(item["media:content"]) ||
    mediaUrl(item["media:thumbnail"]) ||
    mediaUrl(group["media:thumbnail"]) ||
    mediaUrl(group["media:content"]) ||
    inlineImage(html);
  return url || undefined;
}

/**
 * Parse RSS 2.0, RSS 1.0 (RDF), or Atom into raw items.
 * Throws on documents that are not recognizable feeds.
 */
export function parseFeed(xml: string): RawItem[] {
  const doc = parser.parse(xml);

  // RSS 2.0: rss.channel.item[]
  const rssItems = asArray(doc?.rss?.channel?.item);
  if (rssItems.length > 0) {
    return rssItems.map((item: Record<string, unknown>) => {
      const rawHtml = `${textOf(item.description)} ${textOf(item["content:encoded"])}`;
      return {
        title: textOf(item.title),
        link: textOf(item.link) || textOf(item.guid),
        description: textOf(item.description) || textOf(item["content:encoded"]),
        publishedAt: textOf(item.pubDate) || textOf(item["dc:date"]) || undefined,
        image: itemImage(item, rawHtml),
      };
    });
  }

  // Atom: feed.entry[]
  const atomEntries = asArray(doc?.feed?.entry);
  if (atomEntries.length > 0) {
    return atomEntries.map((entry: Record<string, unknown>) => {
      // YouTube puts the blurb in media:group/media:description and leaves
      // summary/content empty.
      const groupDescription = textOf(mediaGroup(entry)["media:description"]);
      const rawHtml = `${textOf(entry.summary)} ${textOf(entry.content)}`;
      return {
        title: textOf(entry.title),
        link: atomLink(entry.link),
        description:
          textOf(entry.summary) || textOf(entry.content) || groupDescription,
        publishedAt:
          textOf(entry.published) || textOf(entry.updated) || undefined,
        image: itemImage(entry, rawHtml),
      };
    });
  }

  // RSS 1.0 / RDF: rdf:RDF.item[]
  const rdfItems = asArray(doc?.["rdf:RDF"]?.item);
  if (rdfItems.length > 0) {
    return rdfItems.map((item: Record<string, unknown>) => ({
      title: textOf(item.title),
      link: textOf(item.link),
      description: textOf(item.description),
      publishedAt: textOf(item["dc:date"]) || undefined,
    }));
  }

  if (doc?.rss || doc?.feed || doc?.["rdf:RDF"]) return []; // valid but empty feed

  throw new Error("Document is not a recognizable RSS/Atom feed");
}

/** Fetch and parse a feed URL. One retry on network failure. */
export async function fetchFeed(feedUrl: string): Promise<RawItem[]> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetchWithTimeout(feedUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status} from ${feedUrl}`);
      const xml = await res.text();
      return parseFeed(xml);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
