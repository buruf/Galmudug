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
  // NOTE: VOA Somali (voasomali.com) was removed on 2026-07-28. The site
  // itself is reachable and still publishing, but it is unusable as a source:
  //   * every feed under /rssfeeds is frozen — the freshest carries items
  //     from March 2025, most are years older;
  //   * scraping the homepage returns its "most read" widget, which mixes
  //     stories from 2019 through today and exposes no dates. Undated scraped
  //     items fall back to "now" (see normalize.ts), so those would surface as
  //     today's breaking news.
  // Re-add only if VOA restores a dated, current feed.
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
  {
    id: "caasimada",
    name: "Caasimada Online",
    homepage: "https://caasimada.net",
    feedUrl: "https://caasimada.net/feed/",
    language: "so",
    scrape: {
      url: "https://caasimada.net",
      linkSelector: "article a, h2 a, h3 a",
    },
  },
  {
    id: "shabelle",
    name: "Shabelle Media",
    homepage: "https://www.shabellemedia.com",
    feedUrl: "https://www.shabellemedia.com/feed/",
    language: "so",
    scrape: {
      url: "https://www.shabellemedia.com",
      linkSelector: "article a, h2 a, h3 a",
    },
  },
  {
    // Covers northern Mudug and Gaalkacyo, a city split between Puntland and
    // Galmudug — so it carries Galmudug stories the Mogadishu outlets miss.
    id: "puntland-post",
    name: "Puntland Post",
    homepage: "https://www.puntlandpost.net",
    feedUrl: "https://www.puntlandpost.net/feed/",
    language: "so",
    scrape: {
      url: "https://www.puntlandpost.net",
      linkSelector: "article a, h2 a, h3 a",
    },
  },
  // ---------------------------------------------------------------------
  // Video sources. YouTube publishes a per-channel Atom feed at
  //   https://www.youtube.com/feeds/videos.xml?channel_id=<UC...>
  // (15 most recent uploads, with media:thumbnail + media:description).
  //
  // These matter because a lot of Galmudug reporting — campaign rallies,
  // district events, port works — is filmed and uploaded but never written
  // up as an article. Items are tagged isVideo via their youtube.com URL.
  //
  // To find a channel_id: open the channel page and read the "channelId"
  // value in its HTML. Only add channels that still upload; several official
  // Galmudug channels are dormant (Galmudug State TV last posted in 2024).
  // ---------------------------------------------------------------------
  {
    id: "goobjoog-tv",
    name: "Goobjoog TV",
    homepage: "https://www.youtube.com/channel/UCKbzgTa3o3rSh4KiD5BX6Hg",
    feedUrl:
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCKbzgTa3o3rSh4KiD5BX6Hg",
    language: "so",
  },
  {
    id: "sntv-tv",
    name: "SNTV (video)",
    homepage: "https://www.youtube.com/channel/UCi5fZhV7tPitSjnhEHJirGA",
    feedUrl:
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCi5fZhV7tPitSjnhEHJirGA",
    language: "so",
  },
  {
    id: "dalsan-tv",
    name: "Dalsan TV",
    homepage: "https://www.youtube.com/channel/UCqwifYpVBdo91WFD_ubnGGQ",
    feedUrl:
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCqwifYpVBdo91WFD_ubnGGQ",
    language: "so",
  },
  {
    id: "bbc-somali-tv",
    name: "BBC Somali (video)",
    homepage: "https://www.youtube.com/channel/UC_QuRsbRQpaC4iS8WlxW0NA",
    feedUrl:
      "https://www.youtube.com/feeds/videos.xml?channel_id=UC_QuRsbRQpaC4iS8WlxW0NA",
    language: "so",
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
