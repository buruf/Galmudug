import ArticleImage from "@/components/ArticleImage";
import { timeAgo } from "@/lib/dates";
import { formatDate } from "@/lib/seo";
import type { Article, ArticleTopic } from "@/lib/news/types";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export type ArticleCardVariant = "hero" | "standard" | "compact" | "row";

const TOPIC_CHIP: Record<ArticleTopic, string> = {
  politics: "bg-ocean-700 text-white",
  security: "bg-clay-600 text-white",
  business: "bg-acacia-600 text-white",
  sports: "bg-acacia-500 text-white",
  culture: "bg-sand-700 text-white",
  general: "bg-sand-200 text-ink/70",
};

function Meta({
  article,
  locale,
  dict,
  className = "",
}: {
  article: Article;
  locale: Locale;
  dict: Dictionary;
  className?: string;
}) {
  const topic = article.topic ?? "general";
  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`}>
      {article.pinned && (
        <span className="rounded-sm bg-clay-500 px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
          {dict.news.pinned}
        </span>
      )}
      {topic !== "general" && (
        <span
          className={`rounded-sm px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${TOPIC_CHIP[topic]}`}
        >
          {dict.topics[topic]}
        </span>
      )}
      <span className="font-semibold text-ocean-700">{article.sourceName}</span>
      <span aria-hidden="true" className="text-ink/30">
        ·
      </span>
      <time
        dateTime={article.publishedAt}
        title={formatDate(article.publishedAt, locale)}
        className="text-ink/60"
      >
        {timeAgo(article.publishedAt, locale)}
      </time>
    </div>
  );
}

function StoryLink({
  article,
  className = "",
}: {
  article: Article;
  className?: string;
}) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`hover:text-ocean-600 hover:underline ${className}`}
    >
      {article.title}
    </a>
  );
}

/**
 * News card in four sizes:
 * - hero: front-page lead — large image, big headline, summary
 * - standard: section grids — image top, clamped summary
 * - compact: rails/sidebars — small thumbnail left
 * - row: dense lists — headline + meta only, no image
 */
export default function ArticleCard({
  article,
  locale,
  dict,
  variant = "standard",
}: {
  article: Article;
  locale: Locale;
  dict: Dictionary;
  variant?: ArticleCardVariant;
}) {
  if (variant === "hero") {
    return (
      <article lang={article.language} className="group">
        <ArticleImage
          src={article.image}
          sourceName={article.sourceName}
          className="aspect-video w-full rounded-xl"
        />
        <Meta article={article} locale={locale} dict={dict} className="mt-3 text-sm" />
        <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
          <StoryLink article={article} />
        </h2>
        {article.summary && (
          <p className="mt-3 line-clamp-3 leading-relaxed text-ink/75">
            {article.summary}
          </p>
        )}
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article
        lang={article.language}
        className="flex gap-3 border-b border-sand-200 pb-3 last:border-b-0 last:pb-0"
      >
        <ArticleImage
          src={article.image}
          sourceName={article.sourceName}
          className="h-16 w-24 flex-none rounded-md"
        />
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">
            <StoryLink article={article} />
          </h3>
          <Meta article={article} locale={locale} dict={dict} className="mt-1 text-xs" />
        </div>
      </article>
    );
  }

  if (variant === "row") {
    return (
      <article
        lang={article.language}
        className="border-b border-sand-200 py-2.5 last:border-b-0"
      >
        <h3 className="text-[15px] font-semibold leading-snug text-ink">
          <StoryLink article={article} />
        </h3>
        <Meta article={article} locale={locale} dict={dict} className="mt-1 text-xs" />
      </article>
    );
  }

  return (
    <article lang={article.language} className="flex h-full flex-col">
      <ArticleImage
        src={article.image}
        sourceName={article.sourceName}
        className="aspect-[16/9] w-full rounded-lg"
      />
      <Meta article={article} locale={locale} dict={dict} className="mt-2.5 text-xs" />
      <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-ink">
        <StoryLink article={article} />
      </h3>
      {article.summary && (
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/70">
          {article.summary}
        </p>
      )}
    </article>
  );
}
