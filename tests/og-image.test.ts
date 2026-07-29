import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { backfillImages, fetchOgImage } from "@/lib/news/og-image";

type Item = { url: string; image?: string; imageChecked?: boolean };

function htmlResponse(body: string, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 404,
    headers: { get: () => "text/html; charset=utf-8" },
    text: async () => body,
  } as unknown as Response;
}

describe("fetchOgImage", () => {
  afterEach(() => vi.unstubAllGlobals());

  const stub = (response: Response | Error) =>
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        if (response instanceof Error) throw response;
        return response;
      })
    );

  it("reads og:image", async () => {
    stub(
      htmlResponse(
        `<head><meta property="og:image" content="https://x.so/a.jpg"></head>`
      )
    );
    expect(await fetchOgImage("https://x.so/story")).toBe("https://x.so/a.jpg");
  });

  it("reads reversed attribute order", async () => {
    stub(
      htmlResponse(
        `<meta content="https://x.so/b.jpg" property="og:image">`
      )
    );
    expect(await fetchOgImage("https://x.so/story")).toBe("https://x.so/b.jpg");
  });

  it("falls back to twitter:image", async () => {
    stub(htmlResponse(`<meta name="twitter:image" content="/rel/c.jpg">`));
    expect(await fetchOgImage("https://x.so/news/story")).toBe("https://x.so/rel/c.jpg");
  });

  it("resolves relative URLs against the article URL", async () => {
    stub(htmlResponse(`<meta property="og:image" content="/img/d.png">`));
    expect(await fetchOgImage("https://x.so/a/b")).toBe("https://x.so/img/d.png");
  });

  it("rejects data URIs and tracking pixels", async () => {
    stub(htmlResponse(`<meta property="og:image" content="data:image/gif;base64,AA">`));
    expect(await fetchOgImage("https://x.so/s")).toBeUndefined();

    stub(htmlResponse(`<meta property="og:image" content="https://x.so/1x1.gif">`));
    expect(await fetchOgImage("https://x.so/s")).toBeUndefined();
  });

  it("returns undefined when the page has no image tag", async () => {
    stub(htmlResponse(`<head><title>No image here</title></head>`));
    expect(await fetchOgImage("https://x.so/s")).toBeUndefined();
  });

  it("never throws on network or HTTP failure", async () => {
    stub(new Error("ECONNRESET"));
    await expect(fetchOgImage("https://x.so/s")).resolves.toBeUndefined();

    stub(htmlResponse("", false));
    await expect(fetchOgImage("https://x.so/s")).resolves.toBeUndefined();
  });
});

describe("backfillImages", () => {
  beforeEach(() =>
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        htmlResponse(
          url.includes("has-image")
            ? `<meta property="og:image" content="https://x.so/pic.jpg">`
            : `<html>nothing</html>`
        )
      )
    )
  );
  afterEach(() => vi.unstubAllGlobals());

  it("fills only the items missing an image", async () => {
    const items: Item[] = [
      { url: "https://x.so/has-image/1" },
      { url: "https://x.so/has-image/2", image: "https://x.so/existing.jpg" },
    ];
    const filled = await backfillImages(items);
    expect(filled).toBe(1);
    expect(items[0].image).toBe("https://x.so/pic.jpg");
    expect(items[1].image).toBe("https://x.so/existing.jpg"); // untouched
  });

  it("marks attempted items so failures are not retried forever", async () => {
    const items: Item[] = [{ url: "https://x.so/no-image/1" }];
    await backfillImages(items);
    expect(items[0].image).toBeUndefined();
    expect(items[0].imageChecked).toBe(true);

    // A second pass must not spend another lookup on it.
    const calls = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.length;
    await backfillImages(items);
    expect((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBe(calls);
  });

  it("respects the per-run lookup cap", async () => {
    const items: Item[] = Array.from({ length: 10 }, (_, i) => ({
      url: `https://x.so/has-image/${i}`,
    }));
    const filled = await backfillImages(items, 4);
    expect(filled).toBe(4);
    expect(items.filter((i) => i.image).length).toBe(4);
  });
});
