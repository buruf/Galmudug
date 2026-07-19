import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n/config";

const MAX_STORED_OPINIONS = 500;

/** A reader-submitted opinion/feedback message. */
export interface Opinion {
  id: string;
  /** Reader-provided, optional. */
  name: string;
  /** Reader-provided, optional — only so the admin can reply. */
  email: string;
  message: string;
  /** UI language it was submitted from. */
  locale: Locale;
  createdAt: string;
  read: boolean;
}

export interface OpinionInput {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  locale?: unknown;
}

/** Validate/trim a public submission; returns null when unacceptable. */
export function validateOpinionInput(
  body: OpinionInput
): Pick<Opinion, "name" | "email" | "message" | "locale"> | null {
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (message.length < 10 || message.length > 2000) return null;
  const name =
    typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email =
    typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  const locale = body.locale === "so" ? "so" : "en";
  return { name, email, message, locale };
}

export interface OpinionStore {
  getAll(): Promise<Opinion[]>;
  add(input: Pick<Opinion, "name" | "email" | "message" | "locale">): Promise<Opinion>;
  setRead(id: string, read: boolean): Promise<Opinion | null>;
  remove(id: string): Promise<boolean>;
}

function newOpinion(
  input: Pick<Opinion, "name" | "email" | "message" | "locale">
): Opinion {
  return {
    id: randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
    read: false,
  };
}

function trim(opinions: Opinion[]): Opinion[] {
  return [...opinions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, MAX_STORED_OPINIONS);
}

export class JsonFileOpinionStore implements OpinionStore {
  constructor(
    private readonly filePath: string = path.join(
      process.cwd(),
      "data",
      "opinions.json"
    )
  ) {}

  async getAll(): Promise<Opinion[]> {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as { opinions?: Opinion[] };
      return Array.isArray(parsed.opinions) ? parsed.opinions : [];
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException)?.code !== "ENOENT") {
        console.error("[opinions] unreadable store, starting empty:", err);
      }
      return [];
    }
  }

  private async writeAll(opinions: Opinion[]): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const tmp = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(
      tmp,
      JSON.stringify({ opinions: trim(opinions) }, null, 2),
      "utf8"
    );
    await fs.rename(tmp, this.filePath);
  }

  async add(input: Pick<Opinion, "name" | "email" | "message" | "locale">) {
    const opinion = newOpinion(input);
    const all = await this.getAll();
    await this.writeAll([opinion, ...all]);
    return opinion;
  }

  async setRead(id: string, read: boolean): Promise<Opinion | null> {
    const all = await this.getAll();
    const target = all.find((o) => o.id === id);
    if (!target) return null;
    target.read = read;
    await this.writeAll(all);
    return target;
  }

  async remove(id: string): Promise<boolean> {
    const all = await this.getAll();
    const next = all.filter((o) => o.id !== id);
    if (next.length === all.length) return false;
    await this.writeAll(next);
    return true;
  }
}

/** Upstash REST-backed store, same protocol as RedisArticleStore. */
export class RedisOpinionStore implements OpinionStore {
  constructor(
    private readonly url: string,
    private readonly token: string,
    private readonly key: string = "galmudug:opinions:v1"
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

  async getAll(): Promise<Opinion[]> {
    const raw = await this.command<string | null>(["GET", this.key]);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as { opinions?: Opinion[] };
      return Array.isArray(parsed.opinions) ? parsed.opinions : [];
    } catch (err) {
      console.error("[opinions] unreadable redis payload, starting empty:", err);
      return [];
    }
  }

  private async writeAll(opinions: Opinion[]): Promise<void> {
    await this.command([
      "SET",
      this.key,
      JSON.stringify({ opinions: trim(opinions) }),
    ]);
  }

  async add(input: Pick<Opinion, "name" | "email" | "message" | "locale">) {
    const opinion = newOpinion(input);
    const all = await this.getAll();
    await this.writeAll([opinion, ...all]);
    return opinion;
  }

  async setRead(id: string, read: boolean): Promise<Opinion | null> {
    const all = await this.getAll();
    const target = all.find((o) => o.id === id);
    if (!target) return null;
    target.read = read;
    await this.writeAll(all);
    return target;
  }

  async remove(id: string): Promise<boolean> {
    const all = await this.getAll();
    const next = all.filter((o) => o.id !== id);
    if (next.length === all.length) return false;
    await this.writeAll(next);
    return true;
  }
}

let defaultStore: OpinionStore | null = null;

export function getOpinionStore(): OpinionStore {
  if (!defaultStore) {
    const url =
      process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
    const token =
      process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
    defaultStore =
      url && token
        ? new RedisOpinionStore(url, token)
        : new JsonFileOpinionStore();
  }
  return defaultStore;
}
