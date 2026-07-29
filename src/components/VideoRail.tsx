import ArticleImage from "@/components/ArticleImage";
import { timeAgo } from "@/lib/dates";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Article } from "@/lib/news/types";

/**
 * Sidebar widget listing recent video reports. Videos come from the
 * YouTube channel feeds (see sources.ts) and are marked `isVideo`, so they
 * can be pulled out of the main article flow and grouped here.
 */
export default function VideoRail({
  videos,
  locale,
  dict,
}: {
  videos: Article[];
  locale: Locale;
  dict: Dictionary;
}) {
  if (videos.length === 0) return null;

  return (
    <section
      aria-labelledby="videos-heading"
      className="rounded-xl border border-sand-200 bg-white p-4 shadow-sm"
    >
      <h2
        id="videos-heading"
        className="flex items-center gap-2 border-b border-sand-200 pb-2 text-base font-extrabold uppercase tracking-wide text-ink"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-clay-500">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        {dict.news.videosHeading}
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-ink/60">
        {dict.news.videosIntro}
      </p>

      <ul className="mt-3 flex flex-col divide-y divide-sand-200">
        {videos.map((v) => (
          <li key={v.id} className="py-3 first:pt-0 last:pb-0">
            <article lang={v.language} className="flex gap-3">
              <ArticleImage
                src={v.image}
                sourceName={v.sourceName}
                isVideo
                className="h-14 w-24 flex-none rounded-md"
              />
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink">
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ocean-600 hover:underline"
                  >
                    {v.title}
                  </a>
                </h3>
                <p className="mt-1 truncate text-xs text-ink/55">
                  {v.sourceName} · {timeAgo(v.publishedAt, locale)}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
