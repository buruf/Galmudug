"use client";

import { useState } from "react";
import { cleanCaption, type TikTokPreview } from "@/lib/tiktok";
import type { Dictionary } from "@/lib/i18n";

/**
 * Gallery of TikTok clips using the same click-to-play facade as the music
 * gallery: a poster card up front, and TikTok's player loaded only when the
 * visitor asks for it. Nothing from TikTok runs on the page until then.
 */
export default function TikTokGallery({
  clips,
  dict,
}: {
  clips: TikTokPreview[];
  dict: Dictionary;
}) {
  if (clips.length === 0) return null;
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {clips.map((clip) => (
        <TikTokCard key={clip.id} clip={clip} dict={dict} />
      ))}
    </div>
  );
}

function TikTokCard({
  clip,
  dict,
}: {
  clip: TikTokPreview;
  dict: Dictionary;
}) {
  const [playing, setPlaying] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const t = dict.tiktok;
  const caption = cleanCaption(clip.caption);
  const showPoster = clip.thumbnail && !posterFailed;

  return (
    <figure className="flex flex-col overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[9/16] bg-ocean-900">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.tiktok.com/embed/v2/${clip.id}`}
            title={`${clip.author} — TikTok`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${t.play}: ${clip.author}`}
            className="group absolute inset-0 h-full w-full"
          >
            {showPoster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={clip.thumbnail}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setPosterFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <PosterFallback />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-500/95 shadow-lg transition-transform group-hover:scale-110">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="white"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex flex-1 flex-col p-4">
        <p className="font-display font-semibold leading-snug text-ink">
          @{clip.handle}
        </p>
        {caption && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink/70">
            {caption}
          </p>
        )}
        <a
          href={`https://www.tiktok.com/@${clip.handle}/video/${clip.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-clay-600 hover:underline"
        >
          {t.watchOnTikTok} →
        </a>
      </figcaption>
    </figure>
  );
}

/** Branded poster used when TikTok's signed thumbnail URL has expired. */
function PosterFallback() {
  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox="0 0 180 320"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="180" height="320" className="fill-ocean-800" />
      <path
        d="M0 232 Q45 214 90 230 T180 228 V320 H0 Z"
        className="fill-ocean-700"
        opacity="0.8"
      />
      <g className="fill-white" opacity="0.16">
        {Array.from({ length: 5 }).map((_, i) => (
          <path
            key={i}
            transform={`translate(${26 + i * 32} ${58 + (i % 2) * 26}) scale(0.8)`}
            d="M0 -10 L2.9 -3.1 L10 -3.1 L4.2 1.2 L6.2 8.1 L0 4 L-6.2 8.1 L-4.2 1.2 L-10 -3.1 L-2.9 -3.1 Z"
          />
        ))}
      </g>
      <text
        x="90"
        y="170"
        textAnchor="middle"
        className="fill-white"
        opacity="0.9"
        fontSize="20"
        fontFamily="system-ui, sans-serif"
        fontWeight="700"
      >
        14 Agoosto
      </text>
    </svg>
  );
}
