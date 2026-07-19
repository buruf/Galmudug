import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  JsonFileArticleStore,
  RedisArticleStore,
  getVisibleArticles,
} from "@/lib/news/store";
import type { Article } from "@/lib/news/types";

let dir: string;
let store: JsonFileArticleStore;

function article(overrides: Partial<Article>): Article {
  return {
    id: Math.random().toString(36).slice(2, 18),
    title: "Title",
    summary: "",
    url: "https://x.so/a",
    sourceId: "s",
    sourceName: "S",
    publishedAt: "2026-07-14T09:00:00.000Z",
    fetchedAt: "2026-07-14T09:00:00.000Z",
    category: "galmudug",
    language: "en",
    hidden: false,
    pinned: false,
    ...overrides,
  };
}

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), "gm-store-"));
  store = new JsonFileArticleStore(path.join(dir, "articles.json"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("JsonFileArticleStore", () => {
  it("returns empty when no file exists", async () => {
    expect(await store.getAll()).toEqual([]);
  });

  it("persists and reads back articles", async () => {
    await store.replaceAll([article({ id: "one" }), article({ id: "two" })]);
    const all = await store.getAll();
    expect(all.map((a) => a.id).sort()).toEqual(["one", "two"]);
  });

  it("updates moderation flags and they survive a re-run merge", async () => {
    await store.replaceAll([article({ id: "one" })]);
    const updated = await store.setFlags("one", { hidden: true, pinned: true });
    expect(updated?.hidden).toBe(true);

    // Simulate a pipeline re-run: existing articles + new batch replaceAll
    const existing = await store.getAll();
    await store.replaceAll([...existing, article({ id: "three" })]);
    const after = await store.getAll();
    expect(after.find((a) => a.id === "one")?.hidden).toBe(true);
    expect(after.find((a) => a.id === "one")?.pinned).toBe(true);
  });

  it("returns null for unknown ids", async () => {
    expect(await store.setFlags("nope", { hidden: true })).toBeNull();
  });
});

describe("RedisArticleStore", () => {
  /** Minimal fake Upstash REST endpoint backed by a Map. */
  const kv = new Map<string, string>();

  beforeEach(() => {
    kv.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: unknown, init?: RequestInit) => {
        const [cmd, key, value] = JSON.parse(String(init?.body)) as string[];
        let result: string | null = null;
        if (cmd === "GET") result = kv.get(key) ?? null;
        if (cmd === "SET") {
          kv.set(key, value);
          result = "OK";
        }
        return {
          ok: true,
          json: async () => ({ result }),
        } as Response;
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const redisStore = () => new RedisArticleStore("https://fake.upstash.io", "token");

  it("returns empty when the key does not exist", async () => {
    expect(await redisStore().getAll()).toEqual([]);
  });

  it("persists and reads back articles through the REST protocol", async () => {
    const store = redisStore();
    await store.replaceAll([article({ id: "one" }), article({ id: "two" })]);
    const all = await store.getAll();
    expect(all.map((a) => a.id).sort()).toEqual(["one", "two"]);
  });

  it("updates moderation flags", async () => {
    const store = redisStore();
    await store.replaceAll([article({ id: "one" })]);
    const updated = await store.setFlags("one", { pinned: true });
    expect(updated?.pinned).toBe(true);
    expect((await store.getAll())[0].pinned).toBe(true);
  });

  it("starts empty on a corrupt payload instead of crashing", async () => {
    kv.set("galmudug:articles:v1", "{not json");
    expect(await redisStore().getAll()).toEqual([]);
  });

  it("throws on HTTP errors so the pipeline can report the source run", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 500 }) as Response)
    );
    await expect(redisStore().getAll()).rejects.toThrow("Redis HTTP 500");
  });
});

describe("getVisibleArticles", () => {
  it("filters hidden, sorts pinned first then newest", async () => {
    await store.replaceAll([
      article({ id: "old", publishedAt: "2026-07-10T00:00:00.000Z" }),
      article({ id: "new", publishedAt: "2026-07-14T00:00:00.000Z" }),
      article({
        id: "pinned",
        publishedAt: "2026-07-01T00:00:00.000Z",
        pinned: true,
      }),
      article({ id: "hidden", hidden: true }),
      article({ id: "national", category: "somalia" }),
    ]);
    const visible = await getVisibleArticles(store, "galmudug");
    expect(visible.map((a) => a.id)).toEqual(["pinned", "new", "old"]);
  });
});
