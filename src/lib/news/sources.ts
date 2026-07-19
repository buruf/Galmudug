import type { NewsSource } from "./types";

/**
 * Registry of aggregated news sources.
 *
 * To ADD a source: append an entry here (id must be unique, kebab-case).
 * To REMOVE one: delete its entry. Nothing else needs to change — the
 * pipeline, feeds page, and tests all read from this list.
 *
 * `language` is the source's default; individual items are re-detected
 * (see classify.ts) so mixed-language feeds still tag correctly.
 * `scrape` is an optional fallback used only when the RSS feed fails.
 */
export const NEWS_SOURCES: NewsSource[] = [
  {
    id: "garowe-online",
    name: "Garowe Online",
    homepage: "https://www.garoweonline.com",
    feedUrl: "https://www.garoweonline.com/en/rss",
    language: "en",
    scrape: {
      url: "https://www.garoweonline.com/en",
      linkSelector: "a[href*='/en/news/']",
    },
  },
  {
    id: "hiiraan-online",
    name: "Hiiraan Online",
    homepage: "https://www.hiiraan.com",
    feedUrl: "https://www.hiiraan.com/rss.xml",
    language: "en",
    scrape: {
      url: "https://www.hiiraan.com",
      linkSelector: "a[href*='/news4/']",
    },
  },
  {
    id: "goobjoog",
    name: "Goobjoog News",
    homepage: "https://goobjoog.com",
    feedUrl: "https://goobjoog.com/feed/",
    language: "so",
    scrape: {
      url: "https://goobjoog.com",
      linkSelector: "article a, h2 a, h3 a",
    },
  },
  {
    id: "radio-dalsan",
    name: "Radio Dalsan",
    homepage: "https://www.radiodalsan.com",
    feedUrl: "https://www.radiodalsan.com/feed/",
    language: "so",
    scrape: {
      url: "https://www.radiodalsan.com",
      linkSelector: "article a, h2 a, h3 a",
    },
  },
  {
    id: "sonna",
    name: "SONNA",
    homepage: "https://sonna.so",
    feedUrl: "https://sonna.so/feed/",
    language: "so",
    scrape: {
      url: "https://sonna.so",
      linkSelector: "a[href*='/article/']",
    },
  },
  {
    id: "horseed-media",
    name: "Horseed Media",
    homepage: "https://horseedmedia.net",
    feedUrl: "https://horseedmedia.net/feed/",
    language: "so",
    scrape: {
      url: "https://horseedmedia.net",
      linkSelector: "article a, h2 a, h3 a",
    },
  },
  {
    id: "voa-somali",
    name: "VOA Somali",
    homepage: "https://www.voasomali.com",
    feedUrl: "https://www.voasomali.com/api/",
    language: "so",
    scrape: {
      url: "https://www.voasomali.com",
      linkSelector: "a[href*='/a/']",
    },
  },
  {
    id: "bbc-somali",
    name: "BBC Somali",
    homepage: "https://www.bbc.com/somali",
    feedUrl: "https://feeds.bbci.co.uk/somali/rss.xml",
    language: "so",
    scrape: {
      url: "https://www.bbc.com/somali",
      linkSelector: "a[href*='/somali/articles/']",
    },
  },
  {
    id: "radio-muqdisho",
    name: "Radio Muqdisho",
    homepage: "https://radiomuqdisho.so",
    feedUrl: "https://radiomuqdisho.so/feed/",
    language: "so",
    scrape: {
      url: "https://radiomuqdisho.so",
      linkSelector: "article a, h2 a, h3 a",
    },
  },
  {
    id: "sntv",
    name: "SNTV",
    homepage: "https://sntv.so",
    feedUrl: "https://sntv.so/feed/",
    language: "so",
    scrape: {
      url: "https://sntv.so",
      linkSelector: "article a, h2 a, h3 a",
    },
  },
  // Official Galmudug institutions: everything they publish is regional news,
  // so classification is bypassed via forceCategory.
  {
    id: "galmudug-statehouse",
    name: "Galmudug State House",
    homepage: "https://statehouse.gm.so",
    feedUrl: "https://statehouse.gm.so/feed/",
    language: "so",
    forceCategory: "galmudug",
    scrape: {
      url: "https://statehouse.gm.so",
      linkSelector: "article a, h2 a, h3 a",
    },
  },
  {
    id: "cadaado-district",
    name: "Cadaado District",
    homepage: "https://cadaado.gm.so",
    feedUrl: "https://cadaado.gm.so/feed/",
    language: "so",
    forceCategory: "galmudug",
    scrape: {
      url: "https://cadaado.gm.so",
      linkSelector: "article a, h2 a, h3 a",
    },
  },
  // Hobyo Port has no RSS feed at all — scrape-only source.
  {
    id: "hobyo-port",
    name: "Hobyo Port",
    homepage: "https://hobyoport.info",
    language: "en",
    forceCategory: "galmudug",
    scrape: {
      url: "https://hobyoport.info/news",
      linkSelector: "a[href*='/news/view/']",
    },
  },
];

export function getSource(id: string): NewsSource | undefined {
  return NEWS_SOURCES.find((s) => s.id === id);
}
