import { promises as fs } from "node:fs";
import path from "node:path";
import type { Article, ArticleCategory } from "./types";

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

interface StoreFileShape {
  version: 1;
  updatedAt: string;
  articles: Article[];
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
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as StoreFileShape;
      if (!Array.isArray(parsed.articles)) return [];
      return parsed.articles;
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return [];
      // Corrupt store file: log and start fresh rather than crash the site.
      console.error("[news-store] unreadable store file, starting empty:", err);
      return [];
    }
  }

  async replaceAll(articles: Article[]): Promise<void> {
    const trimmed = [...articles]
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, MAX_STORED_ARTICLES);

    const payload: StoreFileShape = {
      version: 1,
      updatedAt: new Date().toISOString(),
      articles: trimmed,
    };

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

let defaultStore: ArticleStore | null = null;

export function getArticleStore(): ArticleStore {
  if (!defaultStore) defaultStore = new JsonFileArticleStore();
  return defaultStore;
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
