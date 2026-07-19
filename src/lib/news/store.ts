import { promises as fs } from "node:fs";
import path from "node:path";
import type { Article, ArticleCategory, ArticleTopic } from "./types";

const MAX_STORED_ARTICLES = 1200;

/**
 * Storage interface for aggregated articles.
 *
 * The default implementation persists to a JSON file, which works locally
 * and on any Node host with a writable disk. For serverless production
 * (e.g. Vercel), implement this interface against Postgres/KV and swap it
 * in `getArticleStore()` — see README "Swapping the article store".
 */
export interface ArticleStore {
  getAll(): Promise<Article[]>;
  /** Replace the full article list (pipeline merge output). */
  replaceAll(articles: Article[]): Promise<void>;
  /** Update moderation flags on one article. */
  setFlags(
    id: string,
    flags: Partial<Pick<Article, "hidden" | "pinned">>
  ): Promise<Article | null>;
}

interface StorePayload {
  version: 1;
  updatedAt: string;
  articles: Article[];
}

/** Newest-first, capped at MAX_STORED_ARTICLES. Shared by all store backends. */
function toPayload(articles: Article[]): StorePayload {
  const trimmed = [...articles]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, MAX_STORED_ARTICLES);
  return { version: 1, updatedAt: new Date().toISOString(), articles: trimmed };
}

function articlesFrom(raw: string, label: string): Article[] {
  try {
    const parsed = JSON.parse(raw) as StorePayload;
    return Array.isArray(parsed.articles) ? parsed.articles : [];
  } catch (err) {
    // Corrupt payload: log and start fresh rather than crash the site.
    console.error(`[news-store] unreadable ${label} payload, starting empty:`, err);
    return [];
  }
}

export class JsonFileArticleStore implements ArticleStore {
  constructor(
    private readonly filePath: string = path.join(
      process.cwd(),
      "data",
      "articles.json"
    )
  ) {}

  async getAll(): Promise<Article[]> {
    let raw: string;
    try {
      raw = await fs.readFile(this.filePath, "utf8");
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return [];
      console.error("[news-store] unreadable store file, starting empty:", err);
      return [];
    }
    return articlesFrom(raw, "store file");
  }

  async replaceAll(articles: Article[]): Promise<void> {
    const payload = toPayload(articles);
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    // Atomic-ish write: temp file then rename, so readers never see a torn file.
    const tmp = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(payload, null, 2), "utf8");
    await fs.rename(tmp, this.filePath);
  }

  async setFlags(
    id: string,
    flags: Partial<Pick<Article, "hidden" | "pinned">>
  ): Promise<Article | null> {
    const articles = await this.getAll();
    const target = articles.find((a) => a.id === id);
    if (!target) return null;
    if (flags.hidden !== undefined) target.hidden = flags.hidden;
    if (flags.pinned !== undefined) target.pinned = flags.pinned;
    await this.replaceAll(articles);
    return target;
  }
}

/**
 * Redis-backed store for serverless hosting (Vercel + Upstash Redis).
 * Talks to the Upstash REST API with plain fetch — no client dependency.
 * The whole article list lives under one key as a JSON payload; writes are
 * infrequent (2-hourly cron + occasional admin flag) so read-modify-write
 * is acceptable here.
 */
export class RedisArticleStore implements ArticleStore {
  constructor(
    private readonly url: string,
    private readonly token: string,
    private readonly key: string = "galmudug:articles:v1"
  ) {}

  private async command<T>(cmd: string[]): Promise<T> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(cmd),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Redis HTTP ${res.status}`);
    const data = (await res.json()) as { result?: T; error?: string };
    if (data.error) throw new Error(`Redis: ${data.error}`);
    return data.result as T;
  }

  async getAll(): Promise<Article[]> {
    const raw = await this.command<string | null>(["GET", this.key]);
    if (!raw) return [];
    return articlesFrom(raw, "redis");
  }

  async replaceAll(articles: Article[]): Promise<void> {
    await this.command(["SET", this.key, JSON.stringify(toPayload(articles))]);
  }

  async setFlags(
    id: string,
    flags: Partial<Pick<Article, "hidden" | "pinned">>
  ): Promise<Article | null> {
    const articles = await this.getAll();
    const target = articles.find((a) => a.id === id);
    if (!target) return null;
    if (flags.hidden !== undefined) target.hidden = flags.hidden;
    if (flags.pinned !== undefined) target.pinned = flags.pinned;
    await this.replaceAll(articles);
    return target;
  }
}

let defaultStore: ArticleStore | null = null;

/**
 * Store selection: Redis when Upstash env vars are present (set
 * automatically when the Upstash integration is connected to the Vercel
 * project; both Upstash and legacy Vercel KV names are honored), otherwise
 * the JSON file store for local dev and disk-backed hosts.
 */
export function getArticleStore(): ArticleStore {
  if (!defaultStore) {
    const url =
      process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
    const token =
      process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
    if (url && token) {
      console.log("[news-store] using Redis article store");
      defaultStore = new RedisArticleStore(url, token);
    } else {
      defaultStore = new JsonFileArticleStore();
    }
  }
  return defaultStore;
}

function sortForFeed(articles: Article[]): Article[] {
  return articles.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

/** All visible articles, both categories, pinned first then newest. */
export async function getAllVisible(
  store: ArticleStore,
  limit = 120
): Promise<Article[]> {
  const all = await store.getAll();
  return sortForFeed(all.filter((a) => !a.hidden)).slice(0, limit);
}

/** Visible articles for one topic (stored pre-topic articles count as general). */
export async function getVisibleByTopic(
  store: ArticleStore,
  topic: ArticleTopic,
  limit = 60
): Promise<Article[]> {
  const all = await store.getAll();
  return sortForFeed(
    all.filter((a) => !a.hidden && (a.topic ?? "general") === topic)
  ).slice(0, limit);
}

/** Public feed query: visible articles for one category, pinned first. */
export async function getVisibleArticles(
  store: ArticleStore,
  category: ArticleCategory,
  limit = 60
): Promise<Article[]> {
  const all = await store.getAll();
  return all
    .filter((a) => a.category === category && !a.hidden)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, limit);
}
