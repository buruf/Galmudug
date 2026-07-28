import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  JsonFileNewsletterStore,
  normalizeEmail,
} from "@/lib/newsletter";

describe("normalizeEmail", () => {
  it("lowercases and trims valid emails", () => {
    expect(normalizeEmail("  Reader@Example.COM ")).toBe("reader@example.com");
  });

  it("rejects invalid shapes", () => {
    expect(normalizeEmail("not-an-email")).toBeNull();
    expect(normalizeEmail("a@b")).toBeNull();
    expect(normalizeEmail("a b@c.com")).toBeNull();
    expect(normalizeEmail(42)).toBeNull();
    expect(normalizeEmail(`${"x".repeat(200)}@a.com`)).toBeNull();
  });
});

describe("JsonFileNewsletterStore", () => {
  let dir: string;
  let store: JsonFileNewsletterStore;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "gm-nl-"));
    store = new JsonFileNewsletterStore(path.join(dir, "subscribers.json"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  const sub = (email: string) => ({
    email,
    locale: "so" as const,
    createdAt: "2026-07-27T10:00:00.000Z",
  });

  it("adds and reads back subscribers", async () => {
    expect(await store.add(sub("a@example.com"))).toBe(true);
    expect(await store.add(sub("b@example.com"))).toBe(true);
    const all = await store.getAll();
    expect(all.map((s) => s.email).sort()).toEqual([
      "a@example.com",
      "b@example.com",
    ]);
  });

  it("dedupes by email", async () => {
    expect(await store.add(sub("a@example.com"))).toBe(true);
    expect(await store.add(sub("a@example.com"))).toBe(false);
    expect((await store.getAll()).length).toBe(1);
  });

  it("removes subscribers", async () => {
    await store.add(sub("a@example.com"));
    expect(await store.remove("a@example.com")).toBe(true);
    expect(await store.remove("a@example.com")).toBe(false);
    expect(await store.getAll()).toEqual([]);
  });
});
