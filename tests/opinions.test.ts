import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { JsonFileOpinionStore, validateOpinionInput } from "@/lib/opinions";

describe("validateOpinionInput", () => {
  it("accepts a plain message and trims fields", () => {
    const out = validateOpinionInput({
      name: "  Ayaan  ",
      email: "ayaan@example.com",
      message: "  I really like the new districts section.  ",
      locale: "so",
    });
    expect(out).toEqual({
      name: "Ayaan",
      email: "ayaan@example.com",
      message: "I really like the new districts section.",
      locale: "so",
    });
  });

  it("rejects short, missing, or oversize messages", () => {
    expect(validateOpinionInput({ message: "hi" })).toBeNull();
    expect(validateOpinionInput({})).toBeNull();
    expect(validateOpinionInput({ message: "x".repeat(2001) })).toBeNull();
  });

  it("rejects malformed emails but allows empty ones", () => {
    expect(
      validateOpinionInput({ message: "long enough message", email: "not-an-email" })
    ).toBeNull();
    expect(
      validateOpinionInput({ message: "long enough message", email: "" })
    ).not.toBeNull();
  });

  it("defaults unknown locales to en", () => {
    expect(
      validateOpinionInput({ message: "long enough message", locale: "xx" })?.locale
    ).toBe("en");
  });
});

describe("JsonFileOpinionStore", () => {
  let dir: string;
  let store: JsonFileOpinionStore;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "gm-opinions-"));
    store = new JsonFileOpinionStore(path.join(dir, "opinions.json"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("adds, reads back, marks read, and deletes", async () => {
    const added = await store.add({
      name: "Cali",
      email: "",
      message: "Waan jeclahay bogga cusub, mahadsanidin.",
      locale: "so",
    });
    expect(added.read).toBe(false);

    let all = await store.getAll();
    expect(all).toHaveLength(1);

    const updated = await store.setRead(added.id, true);
    expect(updated?.read).toBe(true);

    expect(await store.remove(added.id)).toBe(true);
    all = await store.getAll();
    expect(all).toHaveLength(0);
    expect(await store.remove("nope")).toBe(false);
  });

  it("newest submissions come first", async () => {
    const a = await store.add({ name: "", email: "", message: "first message here", locale: "en" });
    await new Promise((r) => setTimeout(r, 5));
    const b = await store.add({ name: "", email: "", message: "second message here", locale: "en" });
    const all = await store.getAll();
    expect(all.map((o) => o.id)).toEqual([b.id, a.id]);
  });
});
