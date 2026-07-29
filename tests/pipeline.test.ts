import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseFeed } from "@/lib/news/fetcher";
import { extractHeadlines } from "@/lib/news/scraper";
import {
  canonicalUrl,
  normalizeItem,
  stripHtml,
  truncateSummary,
} from "@/lib/news/normalize";
import { classifyCategory, detectLanguage, isGalmudugStory } from "@/lib/news/classify";
import { classifyTopic } from "@/lib/news/topics";
import { dedupeArticles, jaccard, titleTokens } from "@/lib/news/dedupe";
import { runNewsPipeline } from "@/lib/news/pipeline";
import type { Article, NewsSource } from "@/lib/news/types";

const fixture = (name: string) =>
  readFileSync(path.join(__dirname, "fixtures", name), "utf8");

const testSource: NewsSource = {
  id: "test-source",
  name: "Test Source",
  homepage: "https://test-site.example.com",
  feedUrl: "https://test-site.example.com/feed",
  language: "en",
  scrape: {
    url: "https://test-site.example.com",
    linkSelector: "article a, h2 a, h3 a",
  },
};

describe("parseFeed", () => {
  it("parses RSS 2.0 with CDATA, entities, and tracking params", () => {
    const items = parseFeed(fixture("rss2.xml"));
    expect(items).toHaveLength(3);
    expect(items[0].title).toContain("Galmudug president opens new hospital");
    expect(items[0].link).toContain("utm_source"); // stripped later, in normalize
    expect(items[0].publishedAt).toBe("Tue, 14 Jul 2026 09:30:00 +0000");
  });

  it("parses Atom feeds, preferring rel=alternate links", () => {
    const items = parseFeed(fixture("atom.xml"));
    expect(items).toHaveLength(2);
    expect(items[0].link).toBe(
      "https://atom-news.example.com/articles/hobyo-fishing"
    );
    expect(items[1].publishedAt).toBe("2026-07-12T10:00:00Z");
  });

  it("throws on non-feed documents", () => {
    expect(() => parseFeed("<html><body>not a feed</body></html>")).toThrow();
  });

  it("parses YouTube channel feeds, unwrapping media:group", () => {
    const items = parseFeed(fixture("youtube.xml"));
    expect(items).toHaveLength(1);
    expect(items[0].link).toBe("https://www.youtube.com/watch?v=edwRM9ZKxg0");
    // Description and thumbnail live inside <media:group>, not on the entry.
    expect(items[0].description).toContain("Xarardheere");
    expect(items[0].image).toBe(
      "https://i2.ytimg.com/vi/edwRM9ZKxg0/hqdefault.jpg"
    );
    // The video's own date, not the channel's 2014 creation date.
    expect(items[0].publishedAt).toBe("2026-07-27T06:33:04+00:00");
  });

  it("flags YouTube stories as video and keeps others unflagged", () => {
    const ytSource = {
      id: "goobjoog-tv",
      name: "Goobjoog TV",
      homepage: "https://www.youtube.com/channel/UCKbzgTa3o3rSh4KiD5BX6Hg",
      feedUrl:
        "https://www.youtube.com/feeds/videos.xml?channel_id=UCKbzgTa3o3rSh4KiD5BX6Hg",
      language: "so" as const,
    };
    const video = normalizeItem(parseFeed(fixture("youtube.xml"))[0], ytSource);
    expect(video?.isVideo).toBe(true);
    expect(video?.category).toBe("galmudug");

    const article = normalizeItem(parseFeed(fixture("rss2.xml"))[0], {
      ...ytSource,
      id: "plain",
      feedUrl: "https://example-news.so/feed",
    });
    expect(article?.isVideo).toBeUndefined();
  });

  it("extracts item images from enclosures and inline <img> tags", () => {
    const items = parseFeed(fixture("rss2.xml"));
    expect(items[0].image).toBe("https://example-news.so/img/hospital.jpg");
    expect(items[1].image).toBe("https://example-news.so/img/shir.jpg");
    expect(items[2].image).toBeUndefined();
  });
});

describe("topics", () => {
  it("classifies English topics", () => {
    expect(classifyTopic("Parliament approves new election law")).toBe("politics");
    expect(classifyTopic("Security forces repel attack near Hobyo")).toBe("security");
    expect(classifyTopic("Livestock export figures hit record at Bosaso port")).toBe("business");
    expect(classifyTopic("National football team names squad for qualifier")).toBe("sports");
    expect(classifyTopic("Poetry festival celebrates Somali heritage")).toBe("culture");
  });

  it("classifies Somali topics", () => {
    expect(classifyTopic("Madaxweynaha oo baarlamaanka la hadlay")).toBe("politics");
    expect(classifyTopic("Ciidamada oo howlgal ka fuliyay deegaanka")).toBe("security");
    expect(classifyTopic("Ganacsiga xoolaha oo kor u kacay")).toBe("business");
    expect(classifyTopic("Horyaalka kubadda cagta oo billowday")).toBe("sports");
    expect(classifyTopic("Abwaan caan ah oo gabay cusub daabacay")).toBe("culture");
  });

  it("prefers security over politics when both appear", () => {
    expect(
      classifyTopic("Ciidamada dowladda oo weerar ka hortagay, wasiirka oo hadlay")
    ).toBe("security");
  });

  it("falls back to general", () => {
    expect(classifyTopic("Roobab mahiigaan ah oo ka da'ay deegaanno")).toBe("general");
  });

  // Regressions from real mis-filed stories: Somali words whose everyday
  // meaning collides with a topic vocabulary used to hijack the whole story,
  // because a single keyword match won outright.
  it("does not read 'kooxda' (armed group) as a sports team", () => {
    expect(
      classifyTopic("Ciidamada oo howlgal ka fuliyay, kooxda Al-Shabaab oo laga saaray")
    ).toBe("security");
  });

  it("does not read 'garoonka diyaaradaha' (airport) as a stadium", () => {
    expect(
      classifyTopic("Laamiga garoonka diyaaradaha Boosaaso oo hanaan casri ah loo dhisayo")
    ).not.toBe("sports");
  });

  it("does not file ministry news under culture for the word 'Culture'", () => {
    expect(
      classifyTopic(
        "Information Minister visits Mogadishu Port, Ministry of Information, Culture and Tourism said"
      )
    ).not.toBe("culture");
  });

  it("still recognises real sports and culture stories", () => {
    expect(classifyTopic("Kooxda Juventus oo tartanka kubadda cagta ku guuleysatay")).toBe("sports");
    expect(
      classifyTopic("Abwaan caan ah oo gabay ka tiriyay suugaanta iyo dhaqanka Soomaalida")
    ).toBe("culture");
  });

  it("matches inflected Somali verbs for attacks", () => {
    expect(classifyTopic("Xuutiyiinta oo weeraray maraakiib shidaal ah")).toBe("security");
  });

  it("requires more than one weak signal to leave general", () => {
    // "port" alone is weak: a passing mention must not file a story as business.
    expect(classifyTopic("Delegation visits the port before returning home")).toBe(
      "general"
    );
  });
});

describe("scrape fallback", () => {
  it("extracts on-site headlines, absolutizes URLs, drops externals and dupes", () => {
    const items = extractHeadlines(fixture("homepage.html"), testSource);
    expect(items).toHaveLength(2);
    expect(items[0].link).toBe(
      "https://test-site.example.com/2026/07/galkayo-airport-expansion-project-begins"
    );
    expect(items.some((i) => i.link.includes("other-site"))).toBe(false);
  });
});

describe("normalize", () => {
  it("strips HTML, decodes entities, truncates at word boundaries", () => {
    expect(stripHtml("<p>Hello <b>world</b> &amp; friends</p>")).toBe(
      "Hello world & friends"
    );
    const long = "word ".repeat(100).trim();
    const truncated = truncateSummary(long, 50);
    expect(truncated.length).toBeLessThanOrEqual(51);
    expect(truncated.endsWith("…")).toBe(true);
  });

  it("canonicalizes URLs (tracking params, fragments, trailing slash)", () => {
    expect(
      canonicalUrl("https://x.so/story?utm_source=rss&id=5#section")
    ).toBe("https://x.so/story?id=5");
    expect(canonicalUrl("https://x.so/story/")).toBe("https://x.so/story");
  });

  it("normalizes a full RSS item into the Article schema", () => {
    const items = parseFeed(fixture("rss2.xml"));
    const article = normalizeItem(items[0], testSource);
    expect(article).not.toBeNull();
    expect(article!.category).toBe("galmudug");
    expect(article!.language).toBe("en");
    expect(article!.url).not.toContain("utm_");
    expect(article!.summary).not.toContain("<");
    expect(article!.hidden).toBe(false);
    expect(article!.publishedAt).toBe("2026-07-14T09:30:00.000Z");
  });

  it("honors forceCategory for inherently regional sources", () => {
    const statehouse: NewsSource = {
      ...testSource,
      id: "galmudug-statehouse",
      forceCategory: "galmudug",
    };
    const article = normalizeItem(
      {
        title: "President signs new education bill into law",
        link: "https://test-site.example.com/education-bill",
      },
      statehouse
    );
    // No Galmudug keyword in the text — category comes from the source.
    expect(article!.category).toBe("galmudug");
  });

  it("rejects items with tiny titles or invalid links", () => {
    const items = parseFeed(fixture("rss2.xml"));
    expect(normalizeItem(items[2], testSource)).toBeNull();
    expect(
      normalizeItem({ title: "A perfectly reasonable headline", link: "not-a-url" }, testSource)
    ).toBeNull();
  });
});

describe("classify", () => {
  it("detects Galmudug stories across spellings", () => {
    expect(isGalmudugStory("Fighting reported near Dhuusamarreeb")).toBe(true);
    expect(isGalmudugStory("New port study for Hobyo announced")).toBe(true);
    expect(isGalmudugStory("Ciidamada oo galay Xarardheere")).toBe(true);
    expect(isGalmudugStory("Wararka Gaalkacyo iyo Cadaado")).toBe(true);
    expect(isGalmudugStory("Parliament session held in Mogadishu")).toBe(false);
  });

  it("does not match keywords inside other words", () => {
    expect(isGalmudugStory("The smudugly report")).toBe(false);
  });

  it("classifies category from title + summary", () => {
    expect(classifyCategory("Somalia elections", "talks continue in Galkayo")).toBe(
      "galmudug"
    );
    expect(classifyCategory("Somalia elections", "talks in Baidoa")).toBe("somalia");
  });

  it("detects Somali language via marker words", () => {
    expect(
      detectLanguage("Madaxweynaha ayaa maanta kulan la qaatay wasiirrada", "en")
    ).toBe("so");
    expect(
      detectLanguage("The president met with ministers today in the capital", "en")
    ).toBe("en");
    // Falls back to source default when ambiguous
    expect(detectLanguage("Breaking update", "so")).toBe("so");
  });
});

function makeArticle(overrides: Partial<Article>): Article {
  return {
    id: Math.random().toString(36).slice(2, 18),
    title: "Some default title here",
    summary: "",
    url: `https://example.so/${Math.random().toString(36).slice(2)}`,
    sourceId: "test-source",
    sourceName: "Test Source",
    publishedAt: "2026-07-14T09:00:00.000Z",
    fetchedAt: "2026-07-14T10:00:00.000Z",
    category: "somalia",
    language: "en",
    hidden: false,
    pinned: false,
    ...overrides,
  };
}

describe("dedupe", () => {
  it("computes jaccard similarity on title tokens", () => {
    const a = titleTokens("Galmudug president opens new hospital in Dhusamareb");
    const b = titleTokens("Galmudug President Opens New Hospital In Dhusamareb!");
    expect(jaccard(a, b)).toBe(1);
  });

  it("drops exact-URL duplicates against the store", () => {
    const existing = makeArticle({ id: "aaaa", url: "https://x.so/1" });
    const incoming = makeArticle({ id: "aaaa", url: "https://x.so/1" });
    expect(dedupeArticles([incoming], [existing])).toHaveLength(0);
  });

  it("drops near-identical titles across sources within the window", () => {
    const a = makeArticle({
      title: "Galmudug forces retake coastal village after clashes",
      publishedAt: "2026-07-14T08:00:00.000Z",
    });
    const b = makeArticle({
      title: "Galmudug forces retake coastal village after clashes today",
      sourceId: "other",
      publishedAt: "2026-07-14T11:00:00.000Z",
    });
    const kept = dedupeArticles([a, b]);
    expect(kept).toHaveLength(1);
    // Earliest-published copy wins
    expect(kept[0].publishedAt).toBe("2026-07-14T08:00:00.000Z");
  });

  it("keeps similar titles when far apart in time", () => {
    const a = makeArticle({
      title: "Drought update issued for central regions",
      publishedAt: "2026-06-01T08:00:00.000Z",
    });
    const b = makeArticle({
      title: "Drought update issued for central regions",
      publishedAt: "2026-07-14T08:00:00.000Z",
    });
    expect(dedupeArticles([a, b])).toHaveLength(2);
  });

  it("keeps genuinely different stories", () => {
    const a = makeArticle({ title: "New school opens in Adado town" });
    const b = makeArticle({ title: "Fishing cooperative launched in Hobyo" });
    expect(dedupeArticles([a, b])).toHaveLength(2);
  });
});

describe("pipeline source retirement", () => {
  it("drops stored articles whose source is no longer configured", async () => {
    const keep = {
      id: "keep-1",
      title: "Story from a source we still read",
      summary: "",
      url: "https://goobjoog.com/a",
      sourceId: "goobjoog",
      sourceName: "Goobjoog News",
      publishedAt: "2026-07-20T00:00:00.000Z",
      fetchedAt: "2026-07-20T00:00:00.000Z",
      category: "somalia" as const,
      language: "so" as const,
      hidden: false,
      pinned: false,
    };
    const retired = { ...keep, id: "retired-1", sourceId: "voa-somali" };

    let saved: typeof keep[] = [];
    const store = {
      getAll: async () => (saved.length ? saved : [keep, retired]),
      replaceAll: async (articles: typeof keep[]) => {
        saved = articles;
      },
      setFlags: async () => null,
    };

    // No sources configured to fetch: only the retirement pass runs.
    await runNewsPipeline(store, [
      { id: "goobjoog", name: "Goobjoog News", homepage: "https://goobjoog.com", language: "so" },
    ]);

    expect(saved.map((a) => a.id)).toEqual(["keep-1"]);
  });
});
