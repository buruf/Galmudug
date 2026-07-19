import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { JsonFileArticleStore, getVisibleArticles } from "@/lib/news/store";
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
