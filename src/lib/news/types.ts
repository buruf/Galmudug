export type ArticleCategory = "galmudug" | "somalia";
export type ArticleLanguage = "en" | "so";

/** Normalized article schema shared by the pipeline, store, and UI. */
export interface Article {
  /** Stable id derived from the canonical article URL. */
  id: string;
  title: string;
  /** Short excerpt only — full articles stay with the original publisher. */
  summary: string;
  /** Link to the original story at the source. */
  url: string;
  sourceId: string;
  sourceName: string;
  /** ISO 8601 */
  publishedAt: string;
  /** ISO 8601 — when our pipeline ingested it. */
  fetchedAt: string;
  category: ArticleCategory;
  language: ArticleLanguage;
  /** Admin moderation flags — preserved across pipeline re-runs. */
  hidden: boolean;
  pinned: boolean;
}

/** A raw item as it comes out of an RSS/Atom feed or a scrape fallback. */
export interface RawItem {
  title: string;
  link: string;
  description?: string;
  publishedAt?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  homepage: string;
  /** RSS/Atom feed. Omit for scrape-only sources (then `scrape` is required). */
  feedUrl?: string;
  /** Default language of the source's content. */
  language: ArticleLanguage;
  /**
   * Force every story from this source into one category, bypassing keyword
   * classification. Use for sources that are inherently regional (e.g. the
   * Galmudug state house or a district site).
   */
  forceCategory?: ArticleCategory;
  /** Scrape config: fallback when the feed fails, primary when there is no feed. */
  scrape?: {
    url: string;
    /** CSS selector for anchor elements pointing at stories. */
    linkSelector: string;
  };
}

export interface SourceRunReport {
  sourceId: string;
  ok: boolean;
  method: "rss" | "scrape" | "none";
  itemCount: number;
  error?: string;
}

export interface PipelineReport {
  ranAt: string;
  sources: SourceRunReport[];
  fetched: number;
  added: number;
  totalInStore: number;
}
