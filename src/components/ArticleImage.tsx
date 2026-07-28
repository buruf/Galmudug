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
  fallback = "banner",
}: {
  src?: string;
  sourceName: string;
  className?: string;
  /**
   * What to show when there is no image (or it fails to load):
   * "banner" = the Galmudug News watermark; "plain" = nothing, letting the
   * parent's own background show (used by the hero so the watermark never
   * competes with the overlaid headline).
   */
  fallback?: "banner" | "plain";
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div
      className={`relative overflow-hidden ${
        fallback === "banner" ? "bg-ocean-100" : ""
      } ${className}`}
    >
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
      ) : fallback === "banner" ? (
        <Placeholder />
      ) : null}
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
      <defs>
        <linearGradient id="gm-ph-sky" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#2b6fc6" />
          <stop offset="55%" stopColor="#245ba3" />
          <stop offset="100%" stopColor="#1e3e6b" />
        </linearGradient>
      </defs>

      <rect width="320" height="180" fill="url(#gm-ph-sky)" />

      {/* Star field echoing the flag's five-pointed star */}
      <g fill="#ffffff" opacity="0.09">
        <circle cx="42" cy="34" r="1.6" />
        <circle cx="96" cy="22" r="1.1" />
        <circle cx="150" cy="38" r="1.3" />
        <circle cx="228" cy="26" r="1.5" />
        <circle cx="278" cy="44" r="1.1" />
      </g>

      {/* Layered coastline: the ocean the region sits on */}
      <path
        d="M0 120 Q60 104 130 118 T320 112 V180 H0 Z"
        fill="#ffffff"
        opacity="0.07"
      />
      <path
        d="M0 140 Q80 126 165 141 T320 134 V180 H0 Z"
        fill="#ffffff"
        opacity="0.09"
      />
      <path
        d="M0 160 Q90 148 190 161 T320 156 V180 H0 Z"
        fill="#ffffff"
        opacity="0.12"
      />

      {/* Flag star, sitting above the wordmark */}
      <polygon
        points="160,52 163.5,62.8 174.9,62.8 165.7,69.4 169.2,80.2 160,73.5 150.8,80.2 154.3,69.4 145.1,62.8 156.5,62.8"
        fill="#ffffff"
        opacity="0.9"
      />

      <text
        x="160"
        y="106"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="25"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        fontWeight="800"
        letterSpacing="-0.5"
      >
        GALMUDUG
        <tspan fill="#4ecb8a">.COM</tspan>
      </text>
      <text
        x="160"
        y="124"
        textAnchor="middle"
        fill="#ffffff"
        opacity="0.6"
        fontSize="8.5"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        fontWeight="600"
        letterSpacing="3.5"
      >
        WARARKA GOBOLKA
      </text>
    </svg>
  );
}
