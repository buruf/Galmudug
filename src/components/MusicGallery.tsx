"use client";

import { useState } from "react";
import type { MusicVideo } from "@/content/music";
import type { Dictionary } from "@/lib/i18n";

/**
 * Gallery of YouTube music videos. Each card shows the video thumbnail and
 * loads the actual player only when the visitor clicks play (facade pattern),
 * so the page stays fast and no third-party player loads until asked for.
 */
export default function MusicGallery({
  videos,
  dict,
}: {
  videos: MusicVideo[];
  dict: Dictionary;
}) {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <MusicCard key={v.id} video={v} dict={dict} />
      ))}
    </div>
  );
}

function MusicCard({ video, dict }: { video: MusicVideo; dict: Dictionary }) {
  const [playing, setPlaying] = useState(false);
  const t = dict.music;
  const credit = video.year ? `${video.artist} · ${video.year}` : video.artist;

  return (
    <figure className="flex flex-col overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-video bg-ocean-900">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={`${video.title} — ${video.artist}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${t.play}: ${video.title} — ${video.artist}`}
            className="group absolute inset-0 h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-500/95 shadow-lg transition-transform group-hover:scale-110">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex flex-1 flex-col p-4">
        <h2 className="font-display text-lg font-semibold leading-snug text-ink">
          {video.title}
        </h2>
        <p className="mt-1 text-sm font-medium text-ocean-700">{credit}</p>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-clay-600 hover:underline"
        >
          {t.watchOnYoutube} →
        </a>
      </figcaption>
    </figure>
  );
}
