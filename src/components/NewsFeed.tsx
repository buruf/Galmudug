import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { NEWS_SOURCES } from "@/lib/news/sources";
import type { Article, ArticleCategory } from "@/lib/news/types";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export default function NewsFeed({
  articles,
  category,
  locale,
  dict,
}: {
  articles: Article[];
  category: ArticleCategory;
  locale: Locale;
  dict: Dictionary;
}) {
  const title =
    category === "galmudug" ? dict.news.galmudugTitle : dict.news.somaliaTitle;
  const intro =
    category === "galmudug" ? dict.news.galmudugIntro : dict.news.somaliaIntro;

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

      {/* Feed tabs */}
      <nav aria-label={dict.nav.news} className="mt-8 flex gap-2">
        <Link
          href={`/${locale}/news`}
          aria-current={category === "galmudug" ? "page" : undefined}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            category === "galmudug"
              ? "bg-ocean-800 text-white"
              : "bg-sand-100 text-ocean-800 hover:bg-ocean-100"
          }`}
        >
          {dict.news.tabGalmudug}
        </Link>
        <Link
          href={`/${locale}/news/somalia`}
          aria-current={category === "somalia" ? "page" : undefined}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            category === "somalia"
              ? "bg-ocean-800 text-white"
              : "bg-sand-100 text-ocean-800 hover:bg-ocean-100"
          }`}
        >
          {dict.news.tabSomalia}
        </Link>
      </nav>

      {articles.length === 0 ? (
        <p className="mt-8 rounded-lg border border-sand-200 bg-white p-8 text-ink/60">
          {dict.news.empty}
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} locale={locale} dict={dict} />
          ))}
        </div>
      )}

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
    </div>
  );
}
