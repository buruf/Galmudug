import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { NEWS_SOURCES } from "@/lib/news/sources";
import { NAV_TOPICS } from "@/lib/news/topics";
import type { Article, ArticleCategory, ArticleTopic } from "@/lib/news/types";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

/** Active feed: one of the two geographic feeds, or an editorial topic. */
export type FeedKey =
  | { category: ArticleCategory }
  | { topic: ArticleTopic };

export function feedTitle(key: FeedKey, dict: Dictionary): string {
  if ("category" in key) {
    return key.category === "galmudug"
      ? dict.news.galmudugTitle
      : dict.news.somaliaTitle;
  }
  return dict.topics[key.topic];
}

function feedIntro(key: FeedKey, dict: Dictionary): string {
  if ("category" in key) {
    return key.category === "galmudug"
      ? dict.news.galmudugIntro
      : dict.news.somaliaIntro;
  }
  return dict.news.topicIntro;
}

export function SourceAttribution({ dict }: { dict: Dictionary }) {
  return (
    <footer className="mt-12 rounded-xl border border-sand-200 bg-sand-100/60 p-6">
      <p className="text-sm text-ink/70">{dict.news.attribution}</p>
      <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-ink/60">
        {dict.news.sourcesHeading}
      </h2>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {NEWS_SOURCES.map((s) => (
          <li key={s.id}>
            <a
              href={s.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean-700 hover:underline"
            >
              {s.name}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}

function FeedNav({
  active,
  locale,
  dict,
}: {
  active: FeedKey;
  locale: Locale;
  dict: Dictionary;
}) {
  const activeCategory = "category" in active ? active.category : null;
  const activeTopic = "topic" in active ? active.topic : null;

  const tab = (href: string, label: string, current: boolean) => (
    <Link
      key={href}
      href={href}
      aria-current={current ? "page" : undefined}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
        current
          ? "bg-ocean-800 text-white"
          : "bg-sand-100 text-ocean-800 hover:bg-ocean-100"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav
      aria-label={dict.news.topicsLabel}
      className="mt-8 flex flex-wrap items-center gap-2"
    >
      {tab(`/${locale}/news`, dict.news.tabGalmudug, activeCategory === "galmudug")}
      {tab(
        `/${locale}/news/somalia`,
        dict.news.tabSomalia,
        activeCategory === "somalia"
      )}
      <span aria-hidden="true" className="mx-1 h-5 w-px bg-sand-300" />
      {NAV_TOPICS.map((t) =>
        tab(`/${locale}/news/topic/${t}`, dict.topics[t], activeTopic === t)
      )}
    </nav>
  );
}

export default function NewsFeed({
  articles,
  active,
  locale,
  dict,
}: {
  articles: Article[];
  active: FeedKey;
  locale: Locale;
  dict: Dictionary;
}) {
  const title = feedTitle(active, dict);
  const intro = feedIntro(active, dict);

  // NewsArticle ItemList structured data, pointing at the ORIGINAL publishers.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListElement: articles.slice(0, 20).map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "NewsArticle",
        headline: a.title,
        url: a.url,
        datePublished: a.publishedAt,
        inLanguage: a.language,
        ...(a.image ? { image: a.image } : {}),
        publisher: { "@type": "Organization", name: a.sourceName },
      },
    })),
  };

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ocean-900">
          {title}
        </h1>
        <p className="mt-4 leading-relaxed text-ink/80">{intro}</p>
      </header>

      <FeedNav active={active} locale={locale} dict={dict} />

      {articles.length === 0 ? (
        <p className="mt-8 rounded-lg border border-sand-200 bg-white p-8 text-ink/60">
          {dict.news.empty}
        </p>
      ) : (
        <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} locale={locale} dict={dict} />
          ))}
        </div>
      )}

      <SourceAttribution dict={dict} />
    </div>
  );
}
