import { NEWS_SOURCES } from "./sources";
import { fetchFeed } from "./fetcher";
import { scrapeHeadlines } from "./scraper";
import { normalizeItem } from "./normalize";
import { dedupeArticles } from "./dedupe";
import { getArticleStore, type ArticleStore } from "./store";
import type {
  Article,
  NewsSource,
  PipelineReport,
  RawItem,
  SourceRunReport,
} from "./types";

const MAX_ITEMS_PER_SOURCE = 40;

/**
 * Fetch one source: RSS first (when configured), scrape second — as a
 * fallback for broken feeds, or as the primary method for feedless sources.
 * Never throws — a failing source is reported and skipped so one broken
 * feed can never take the whole pipeline (or site) down.
 */
async function fetchSource(
  source: NewsSource
): Promise<{ report: SourceRunReport; items: RawItem[] }> {
  let rssMessage: string | undefined;

  if (source.feedUrl) {
    try {
      const items = await fetchFeed(source.feedUrl);
      if (items.length > 0) {
        return {
          report: {
            sourceId: source.id,
            ok: true,
            method: "rss",
            itemCount: items.length,
          },
          items: items.slice(0, MAX_ITEMS_PER_SOURCE),
        };
      }
      rssMessage = "Feed parsed but contained no items";
    } catch (rssError) {
      rssMessage = rssError instanceof Error ? rssError.message : String(rssError);
    }
  }

  if (!source.scrape) {
    const error = rssMessage ?? "Source has neither feedUrl nor scrape config";
    console.warn(`[news] ${source.id}: RSS failed (${error}); no fallback`);
    return {
      report: { sourceId: source.id, ok: false, method: "none", itemCount: 0, error },
      items: [],
    };
  }

  try {
    const items = await scrapeHeadlines(source);
    if (rssMessage) {
      console.warn(
        `[news] ${source.id}: RSS failed (${rssMessage}); scrape fallback got ${items.length} items`
      );
    }
    return {
      report: {
        sourceId: source.id,
        ok: items.length > 0,
        method: "scrape",
        itemCount: items.length,
        error: rssMessage ? `rss: ${rssMessage}` : undefined,
      },
      items: items.slice(0, MAX_ITEMS_PER_SOURCE),
    };
  } catch (scrapeError) {
    const scrapeMessage =
      scrapeError instanceof Error ? scrapeError.message : String(scrapeError);
    console.warn(
      `[news] ${source.id}: fetch failed (rss: ${rssMessage ?? "n/a"}; scrape: ${scrapeMessage})`
    );
    return {
      report: {
        sourceId: source.id,
        ok: false,
        method: "none",
        itemCount: 0,
        error: `rss: ${rssMessage ?? "n/a"}; scrape: ${scrapeMessage}`,
      },
      items: [],
    };
  }
}

/**
 * Run the full aggregation: fetch all sources in parallel, normalize,
 * dedupe against store, merge (preserving admin hide/pin flags), persist.
 */
export async function runNewsPipeline(
  store: ArticleStore = getArticleStore(),
  sources: NewsSource[] = NEWS_SOURCES
): Promise<PipelineReport> {
  const now = new Date();
  const results = await Promise.all(sources.map((s) => fetchSource(s)));

  const incoming: Article[] = [];
  for (let i = 0; i < sources.length; i++) {
    for (const raw of results[i].items) {
      const article = normalizeItem(raw, sources[i], now);
      if (article) incoming.push(article);
    }
  }

  const existing = await store.getAll();
  const fresh = dedupeArticles(incoming, existing);

  // Backfill image/topic onto already-stored articles when the same story is
  // still in a feed (older entries predate these fields). Flags stay untouched.
  const incomingById = new Map(incoming.map((a) => [a.id, a]));
  for (const article of existing) {
    const update = incomingById.get(article.id);
    if (!update) continue;
    if (!article.image && update.image) article.image = update.image;
    if (!article.topic && update.topic) article.topic = update.topic;
  }

  await store.replaceAll([...existing, ...fresh]);
  const total = (await store.getAll()).length;

  const report: PipelineReport = {
    ranAt: now.toISOString(),
    sources: results.map((r) => r.report),
    fetched: incoming.length,
    added: fresh.length,
    totalInStore: total,
  };
  console.log(
    `[news] pipeline done: ${report.added} new / ${report.fetched} fetched, ${report.totalInStore} stored`
  );
  return report;
}
