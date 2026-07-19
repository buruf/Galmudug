# galmudug.com

A fully bilingual (English + Somali) website about the **Galmudug** region of central Somalia, with an automated, attribution-first news aggregation pipeline.

> **Independence notice:** Galmudug.com is a privately owned, independently operated website. It is **not** the official website of the Galmudug State government and is not affiliated with any government body. This is stated in the site footer and on the About page in both languages.

## Stack

- **Next.js 14 (App Router) + TypeScript + Tailwind CSS**
- News pipeline in plain TypeScript (`fast-xml-parser` for RSS/Atom, `cheerio` for scrape fallbacks)
- JSON-file article store (swappable — see below)
- Vitest for the pipeline test suite

## Getting started

```bash
npm install
cp .env.example .env      # then edit values
npm run fetch:news        # populate the article store from live sources
npm run dev               # http://localhost:3000
npm test                  # pipeline test suite
npm run build && npm start
```

Environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `CRON_SECRET` | Required by `GET /api/cron/fetch-news`. **Fail-closed**: endpoint refuses to run if unset. |
| `ADMIN_PASSWORD` | Enables the `/{locale}/admin` moderation panel (min 8 chars). Unset ⇒ admin disabled. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for hreflang/sitemap/OG URLs. |

## Architecture

```
src/
  middleware.ts            locale detection (cookie → Accept-Language → en) + redirect
  lib/i18n/                typed dictionaries (en.ts, so.ts) — all UI strings, authored natively
  content/                 bilingual editorial content (region pages, district profiles)
  lib/news/                the aggregation pipeline (see below)
  app/[locale]/            all pages, per locale (/en/*, /so/*)
  app/api/cron/fetch-news  scheduled aggregation endpoint (Bearer CRON_SECRET)
  app/api/admin/*          login/logout, hide/pin flags, manual pipeline run
  app/sitemap.ts,robots.ts SEO
tests/                     vitest suite + RSS/Atom/HTML fixtures
scripts/fetch-news.ts      manual pipeline run with per-source report
data/articles.json         runtime article store (gitignored)
```

### Bilingual model

- Path-based locales: `/en/...` and `/so/...`. The bare `/` redirects using the `NEXT_LOCALE` cookie, then `Accept-Language`, then `en`. The header toggle switches locale in place and persists the cookie.
- Every page emits `hreflang` alternates (`en`, `so`, `x-default`) and a canonical URL via `src/lib/seo.ts#pageMetadata`.
- UI strings live in `src/lib/i18n/en.ts` / `so.ts` (typed — a missing Somali key is a compile error). Editorial content in `src/content/` carries `{ en, so }` fields side by side. All Somali copy is authored, not machine-translated.
- `<html lang>` is set per locale; article cards additionally set `lang` per story so screen readers switch voices correctly.

### News pipeline (`src/lib/news/`)

```
sources.ts → fetcher.ts (RSS/Atom) ──fail──> scraper.ts (headline fallback)
                     │
              normalize.ts  (strip HTML, truncate summary, canonical URL, id)
                     │
              classify.ts   (galmudug/somalia by place keywords; en/so detection)
                     │
              dedupe.ts     (exact URL + title-similarity within 72h window)
                     │
              store.ts      (merge, preserve admin flags, atomic write)
```

Behaviour guarantees:

- **Graceful degradation** — a source that is down, blocked, or has changed format is logged and skipped; the pipeline and the site never break because of one source. Every run returns a per-source report (`ok`, `method: rss|scrape|none`, item count, error).
- **Copyright** — only headline + short excerpt (≤280 chars) are stored and shown. Every card links to and names the original publisher. Structured data points at the publisher's URL. The pipeline's user-agent identifies the site and links to the About page.
- **Dedup** — same canonical URL always deduplicates; near-identical titles across sources within 72 h deduplicate (earliest copy wins).
- **Language** — each item is tagged `en`/`so` by marker-word detection with the source's default as fallback, and displayed with a language chip.
- **Moderation** — admin hide/pin flags live on the stored article and survive pipeline re-runs.

### Scheduling

- **Vercel:** `vercel.json` defines a cron hitting `/api/cron/fetch-news` every 2 hours. Set `CRON_SECRET` in project env; Vercel sends it automatically as `Authorization: Bearer …` for cron invocations.
- **Anywhere else:** any scheduler works: `curl -H "Authorization: Bearer $CRON_SECRET" https://your-host/api/cron/fetch-news`, or `npm run fetch:news` from cron/systemd on a node host.

## News sources

| Source | Default lang | Primary method | Notes |
| --- | --- | --- | --- |
| Garowe Online | en | scrape fallback | RSS endpoint currently returns HTTP 500 |
| Hiiraan Online | en | scrape fallback | RSS exists but serves an empty channel |
| Goobjoog News | so | RSS | WordPress feed |
| Radio Dalsan | so | RSS | WordPress feed |
| SONNA | so | scrape fallback | Feed URL serves HTML |
| Horseed Media | so | RSS | WordPress feed |
| VOA Somali | so | RSS | `voasomali.com/api/` |
| BBC Somali | so | RSS | `feeds.bbci.co.uk/somali/rss.xml` |
| Radio Muqdisho | so | RSS | WordPress feed |
| SNTV | so | RSS | WordPress feed |
| Galmudug State House | so | RSS | `forceCategory: galmudug` — all stories are regional |
| Cadaado District | so | RSS | `forceCategory: galmudug` — all stories are regional |
| Hobyo Port | en | scrape only | No RSS at all (`feedUrl` omitted); scrapes `/news`; `forceCategory: galmudug` |

### Adding / removing a source

Edit **one file**: `src/lib/news/sources.ts`.

```ts
{
  id: "my-source",                    // unique, kebab-case
  name: "My Source",                  // shown on cards and in attribution lists
  homepage: "https://mysource.so",
  feedUrl: "https://mysource.so/feed/", // omit entirely for scrape-only sources
  language: "so",                     // default item language
  forceCategory: "galmudug",          // optional: skip keyword classification
                                      // (for inherently regional sources)
  scrape: {                           // fallback when RSS fails; primary if no feedUrl
    url: "https://mysource.so",
    linkSelector: "article a, h2 a, h3 a",  // CSS selector for story anchors
  },
},
```

Remove a source by deleting its entry. The pipeline, the sources lists on the news/About pages, and the tests all read from this registry. Run `npm run fetch:news` afterwards to verify the per-source report.

### Galmudug keyword filter

`src/lib/news/classify.ts` holds the place-name list (Galmudug, Dhusamareb/Dhuusamarreeb, Galkayo/Gaalkacyo, Hobyo, Adado/Cadaado, Abudwak/Caabudwaaq, Harardhere/Xarardheere, El Buur/Ceelbuur, Guriel/Guriceel, Galgaduud, Mudug, and more, in both spelling traditions). Matching is word-boundary-aware and case-insensitive. Everything else from these sources lands in the Somalia national feed.

## Swapping the article store

`src/lib/news/store.ts` defines the `ArticleStore` interface (`getAll`, `replaceAll`, `setFlags`). The default `JsonFileArticleStore` persists to `data/articles.json` with atomic writes — fine for a single Node host. On serverless (Vercel) the filesystem is ephemeral, so implement the interface against Postgres/Neon/KV and return it from `getArticleStore()`. Nothing else in the app touches storage directly.

## Admin

`/{en|so}/admin` — password login (`ADMIN_PASSWORD`), HTTP-only HMAC session cookie (12 h), timing-safe comparisons. Admins can hide/unhide, pin/unpin stories, and trigger a pipeline run. The admin page is `noindex` and disallowed in `robots.txt`.

## Accessibility & SEO

- Semantic landmarks, skip link, `aria-current` nav states, focus-visible rings, reduced-motion support, WCAG-AA colour contrast, `lang` attributes per locale and per article.
- Per-page titles/descriptions, canonical + hreflang alternates, Open Graph, `sitemap.xml` (both locales with language alternates), `robots.txt`, JSON-LD (`WebSite`, `ItemList` of `NewsArticle` crediting original publishers).
- All imagery is inline SVG (zero image requests); system font stack renders Somali (Latin script) natively.

## Tests

`npm test` covers: RSS 2.0/Atom parsing (fixtures), scrape extraction (on-site filtering, absolutization, dedupe), normalization (HTML stripping, entity decoding, summary truncation, URL canonicalization, junk rejection), classification (keyword boundaries, both spelling traditions, language detection), dedupe (URL + similarity window semantics), and the store (persistence, flag survival across re-runs, visible-feed ordering).
