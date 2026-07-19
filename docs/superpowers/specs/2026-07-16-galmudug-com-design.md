# galmudug.com — Design

**Date:** 2026-07-16 · **Status:** Approved-by-spec (user supplied a complete requirements brief and directed autonomous completion)

## Purpose

A fully bilingual (English + Somali) website about the Galmudug region of Somalia, privately owned and operated. It is explicitly **not** the official Galmudug state government site, and says so in the footer and About page. It combines substantive editorial content about the region with an automated, attribution-first news aggregation pipeline.

## Architecture

- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS. Server components everywhere content is static; small client islands for the language toggle, mobile nav, and admin controls.
- **i18n:** Path-based locales `/en/*` and `/so/*`. `middleware.ts` detects locale (cookie → `Accept-Language` → default `so`) and redirects `/` accordingly. Preference persisted in a `NEXT_LOCALE` cookie. Every page emits `hreflang` alternates (`en`, `so`, `x-default`) via the Metadata API. All UI strings live in typed dictionaries (`src/lib/i18n/en.ts`, `so.ts`) authored natively in each language — no machine-translation placeholders. Editorial content (districts, history, etc.) is data-driven with `{ en, so }` fields.
- **Region content:** Data modules in `src/content/` — geography, history, culture, economy, travel/diaspora, and 8+ district profiles (Dhusamareb, Adado, Abudwak, Galkayo, Hobyo, Harardhere, El Buur, Guriel …). Rendered by shared bilingual page templates.

## News pipeline (`src/lib/news/`)

- `sources.ts` — registry of sources (Garowe Online, Hiiraan, Goobjoog, Radio Dalsan, SONNA, Horseed Media, VOA Somali, BBC Somali) with RSS URL, default language, homepage-scrape fallback config. Adding/removing a source = editing this one file (documented in README).
- `fetcher.ts` — per-source fetch with timeout + retry; RSS/Atom parsed via `fast-xml-parser`; failures are logged and the source is skipped (never throws past the orchestrator).
- `scraper.ts` — cheerio-based headline fallback used only when a source's RSS fails.
- `normalize.ts` — maps raw items to the Article schema: `id, title, summary, url, source, sourceName, publishedAt, category (galmudug|somalia), language (en|so), fetchedAt, hidden, pinned`. Summaries are truncated excerpts — never full articles; every card links out and credits the source.
- `classify.ts` — keyword/place-name matcher (Galmudug, Dhusamareb/Dhuusamarreeb, Gaalkacyo, Hobyo, Cadaado, Caabudwaaq, Xarardheere, Ceelbuur, Guriceel, Galgaduud, Mudug …) → `galmudug` vs `somalia`; language heuristic (source default + Somali stop-word scan).
- `dedupe.ts` — exact URL dedupe + normalized-title token-Jaccard similarity within a 72-hour window across sources.
- `store.ts` — `ArticleStore` interface with a JSON-file implementation (atomic tmp+rename writes, capped size). Swappable for Postgres/KV in production; the interface and swap steps are documented in the README.
- `pipeline.ts` — orchestrator: fetch all sources in parallel (settled), normalize → classify → dedupe → merge with store (preserving admin flags) → persist; returns a per-source run report.
- **Scheduling:** `vercel.json` cron → `GET /api/cron/fetch-news` guarded by `CRON_SECRET` (fail-closed). `npm run fetch:news` for manual/local runs.

## Admin

`/[locale]/admin` — password login (`ADMIN_PASSWORD` env) issuing an HTTP-only signed cookie; article table with hide/pin toggles hitting `/api/admin/articles`. Flags survive pipeline re-runs.

## Design language

Mobile-first, WCAG AA. Identity rooted in the region: Indian Ocean blues, sand and acacia tones, Somali-weave-inspired SVG motifs; system font stack with full Latin coverage (Somali is Latin-script). Semantic HTML, skip links, focus states, reduced-motion respect.

## SEO & quality bar

Per-page metadata + Open Graph, `sitemap.ts` (both locales, all pages), `robots.ts`, NewsArticle/ItemList + Organization JSON-LD, optimized SVG imagery. Vitest suite on classify/dedupe/normalize/store + RSS fixture parsing. README documents architecture, source list, add/remove-source steps, deployment, and the store swap.

## Approaches considered

1. **Next.js + file store (chosen)** — one deployable unit, cron-friendly, zero external infra to demo; store abstraction keeps the Postgres path open.
2. Astro + separate Node worker — great static perf but splits deploy into two units and complicates the admin.
3. WordPress multilingual — fastest editorially, but fails the "distinctive, not a template" and custom-pipeline requirements.
