import { promises as fs } from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n/config";

const MAX_SUBSCRIBERS = 20_000;

/**
 * Newsletter subscriber list.
 *
 * NOTE: this collects and stores the list only — no sending service is
 * wired up yet. The list is viewable/exportable from the admin panel so it
 * can be imported into a mailing provider later.
 */
export interface Subscriber {
  /** Normalized (lowercased, trimmed) email — also the dedupe key. */
  email: string;
  locale: Locale;
  createdAt: string;
}

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length > 200) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null;
  return email;
}

export interface NewsletterStore {
  getAll(): Promise<Subscriber[]>;
  /** Add if new; returns false when the email was already subscribed. */
  add(sub: Subscriber): Promise<boolean>;
  remove(email: string): Promise<boolean>;
}

function upsert(list: Subscriber[], sub: Subscriber): Subscriber[] | null {
  if (list.some((s) => s.email === sub.email)) return null;
  return [sub, ...list].slice(0, MAX_SUBSCRIBERS);
}

export class JsonFileNewsletterStore implements NewsletterStore {
  constructor(
    private readonly filePath: string = path.join(
      process.cwd(),
      "data",
      "subscribers.json"
    )
  ) {}

  async getAll(): Promise<Subscriber[]> {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as { subscribers?: Subscriber[] };
      return Array.isArray(parsed.subscribers) ? parsed.subscribers : [];
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException)?.code !== "ENOENT") {
        console.error("[newsletter] unreadable store, starting empty:", err);
      }
      return [];
    }
  }

  private async writeAll(subscribers: Subscriber[]): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const tmp = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify({ subscribers }, null, 2), "utf8");
    await fs.rename(tmp, this.filePath);
  }

  async add(sub: Subscriber): Promise<boolean> {
    const next = upsert(await this.getAll(), sub);
    if (!next) return false;
    await this.writeAll(next);
    return true;
  }

  async remove(email: string): Promise<boolean> {
    const all = await this.getAll();
    const next = all.filter((s) => s.email !== email);
    if (next.length === all.length) return false;
    await this.writeAll(next);
    return true;
  }
}

/** Upstash REST-backed store (same protocol as the article store). */
export class RedisNewsletterStore implements NewsletterStore {
  constructor(
    private readonly url: string,
    private readonly token: string,
    private readonly key: string = "galmudug:subscribers:v1"
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

  async getAll(): Promise<Subscriber[]> {
    const raw = await this.command<string | null>(["GET", this.key]);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as { subscribers?: Subscriber[] };
      return Array.isArray(parsed.subscribers) ? parsed.subscribers : [];
    } catch (err) {
      console.error("[newsletter] unreadable redis payload, starting empty:", err);
      return [];
    }
  }

  private async writeAll(subscribers: Subscriber[]): Promise<void> {
    await this.command(["SET", this.key, JSON.stringify({ subscribers })]);
  }

  async add(sub: Subscriber): Promise<boolean> {
    const next = upsert(await this.getAll(), sub);
    if (!next) return false;
    await this.writeAll(next);
    return true;
  }

  async remove(email: string): Promise<boolean> {
    const all = await this.getAll();
    const next = all.filter((s) => s.email !== email);
    if (next.length === all.length) return false;
    await this.writeAll(next);
    return true;
  }
}

let defaultStore: NewsletterStore | null = null;

export function getNewsletterStore(): NewsletterStore {
  if (!defaultStore) {
    const url =
      process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
    const token =
      process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
    defaultStore =
      url && token
        ? new RedisNewsletterStore(url, token)
        : new JsonFileNewsletterStore();
  }
  return defaultStore;
}
