"use client";

import { useState } from "react";

/**
 * Article thumbnail with graceful degradation: sources' images load lazily
 * and hot-link back to the publisher; on error (or when a story has no
 * image) we render a branded placeholder so the layout never breaks.
 */
export default function ArticleImage({
  src,
  sourceName,
  className = "",
}: {
  src?: string;
  sourceName: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div className={`relative overflow-hidden bg-ocean-100 ${className}`}>
      {showImage ? (
        // Plain <img>: source domains are unknown/varied, so Next image
        // optimization is not applicable. Alt is empty by design — the
        // adjacent headline is the accessible text for the story.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Placeholder />
      )}
    </div>
  );
}

/**
 * Quiet "Galmudug News" watermark banner for stories without an image.
 * Deliberately light and low-contrast so it never competes with headline
 * text laid over it (e.g. the front-page hero).
 */
function Placeholder() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="320" height="180" className="fill-ocean-50" />
      <path
        d="M0 130 Q80 110 160 128 T320 126 V180 H0 Z"
        className="fill-ocean-100"
        opacity="0.9"
      />
      <path
        d="M0 152 Q100 138 200 152 T320 150 V180 H0 Z"
        className="fill-ocean-200"
        opacity="0.6"
      />
      <g className="fill-ocean-200" opacity="0.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d={`M${i * 44 + 8} 24 l8 -7 l8 7 l-8 7 Z`} />
        ))}
      </g>
      <text
        x="160"
        y="92"
        textAnchor="middle"
        className="fill-ocean-500"
        opacity="0.85"
        fontSize="30"
        fontFamily="system-ui, sans-serif"
        fontWeight="700"
      >
        Galmudug
      </text>
      <text
        x="160"
        y="116"
        textAnchor="middle"
        className="fill-ocean-400"
        opacity="0.8"
        fontSize="13"
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
        letterSpacing="7"
      >
        NEWS
      </text>
    </svg>
  );
}
