import type { Article } from "@/lib/news/types";
import type { Dictionary } from "@/lib/i18n";

/**
 * Breaking-news ticker: latest headlines scrolling in a single row.
 * Server-rendered; motion handled in CSS (.ticker-track) with a
 * prefers-reduced-motion fallback. Content is rendered twice for a
 * seamless loop, with the second copy aria-hidden.
 */
export default function NewsTicker({
  articles,
  dict,
}: {
  articles: Article[];
  dict: Dictionary;
}) {
  if (articles.length === 0) return null;

  const items = articles.slice(0, 6);
  const row = (hidden: boolean) => (
    <span
      className="flex items-center gap-10"
      aria-hidden={hidden || undefined}
    >
      {items.map((a) => (
        <a
          key={`${hidden}-${a.id}`}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={hidden ? -1 : undefined}
          className="flex items-center gap-2 text-sm text-white/90 hover:text-white hover:underline"
        >
          <span aria-hidden="true" className="text-clay-400">
            ●
          </span>
          {a.title}
        </a>
      ))}
    </span>
  );

  return (
    <div className="bg-ocean-800">
      <div className="mx-auto flex max-w-content items-center gap-4 px-4 py-2 sm:px-6">
        <span className="shrink-0 rounded bg-clay-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          {dict.news.latestHeading}
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track">
            {row(false)}
            {row(true)}
          </div>
        </div>
      </div>
    </div>
  );
}
