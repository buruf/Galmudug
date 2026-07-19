import type { Article } from "@/lib/news/types";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { formatDate } from "@/lib/seo";

export default function ArticleCard({
  article,
  locale,
  dict,
}: {
  article: Article;
  locale: Locale;
  dict: Dictionary;
}) {
  const langLabel =
    article.language === "so" ? dict.news.inSomali : dict.news.inEnglish;

  return (
    <article
      lang={article.language}
      className="flex h-full flex-col rounded-xl border border-sand-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        {article.pinned && (
          <span className="rounded-full bg-clay-500 px-2 py-0.5 font-semibold text-white">
            {dict.news.pinned}
          </span>
        )}
        <span className="rounded-full bg-ocean-50 px-2 py-0.5 font-medium text-ocean-800">
          {article.sourceName}
        </span>
        <span className="rounded-full bg-sand-100 px-2 py-0.5 text-ink/60">
          {langLabel}
        </span>
      </div>

      <h3 className="font-display text-lg font-semibold leading-snug text-ink">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-ocean-700 hover:underline"
        >
          {article.title}
        </a>
      </h3>

      {article.summary && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/70">
          {article.summary}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-ink/60">
        <time dateTime={article.publishedAt}>
          {formatDate(article.publishedAt, locale)}
        </time>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-clay-600 hover:underline"
        >
          {dict.news.readAtSource} {article.sourceName} →
        </a>
      </div>
    </article>
  );
}
