import Link from "next/link";
import { MUSIC_VIDEOS } from "@/content/music";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

/**
 * Sidebar widget listing Galmudug songs, sitting alongside the Watch
 * (video reports) widget — both are video, so they belong in the same area.
 *
 * Thumbnails are YouTube's own still images; clicking a row opens the video
 * on YouTube, and "All songs" leads to the full gallery at /music, where
 * they play inline.
 */
export default function SongsRail({
  locale,
  dict,
  limit = 6,
}: {
  locale: Locale;
  dict: Dictionary;
  limit?: number;
}) {
  const songs = MUSIC_VIDEOS.slice(0, limit);
  if (songs.length === 0) return null;

  return (
    <section
      aria-labelledby="songs-heading"
      className="rounded-xl border border-sand-200 bg-white p-4 shadow-sm"
    >
      <h2
        id="songs-heading"
        className="flex items-center gap-2 border-b border-sand-200 pb-2 text-base font-extrabold uppercase tracking-wide text-ink"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-acacia-600">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
          </svg>
        </span>
        {dict.music.songsHeading}
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-ink/60">
        {dict.music.songsIntro}
      </p>

      <ul className="mt-3 flex flex-col divide-y divide-sand-200">
        {songs.map((s) => (
          <li key={s.id} className="py-3 first:pt-0 last:pb-0">
            <article className="flex gap-3">
              <a
                href={`https://www.youtube.com/watch?v=${s.id}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${dict.music.play}: ${s.title} — ${s.artist}`}
                className="group relative h-14 w-24 flex-none overflow-hidden rounded-md bg-ocean-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${s.id}/mqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/35">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-acacia-600/95">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </a>
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink">
                  <a
                    href={`https://www.youtube.com/watch?v=${s.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-ocean-600 hover:underline"
                  >
                    {s.title}
                  </a>
                </h3>
                <p className="mt-1 truncate text-xs text-ink/55">
                  {s.artist}
                  {s.year ? ` · ${s.year}` : ""}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <Link
        href={`/${locale}/music`}
        className="mt-3 inline-block text-xs font-bold uppercase tracking-wide text-ocean-600 hover:underline"
      >
        {dict.music.allSongs} →
      </Link>
    </section>
  );
}
