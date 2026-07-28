"use client";

import { useRef, useState } from "react";
import type { Article } from "@/lib/news/types";
import type { Dictionary } from "@/lib/i18n";

/**
 * Breaking-news ticker per the mockup: navy label chip, headlines on a
 * white bar, browse arrows at right. Auto-scrolls (CSS marquee) until the
 * visitor uses an arrow, then switches to manual scrolling. Reduced-motion
 * visitors get the static, manually scrollable version from the start.
 */
export default function NewsTicker({
  articles,
  dict,
}: {
  articles: Article[];
  dict: Dictionary;
}) {
  const [manual, setManual] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  if (articles.length === 0) return null;
  const items = articles.slice(0, 6);

  const nudge = (dir: 1 | -1) => {
    setManual(true);
    // Wait a tick so the container is scrollable before nudging.
    requestAnimationFrame(() => {
      scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
    });
  };

  const row = (hidden: boolean) => (
    <span className="flex items-center gap-8" aria-hidden={hidden || undefined}>
      {items.map((a) => (
        <a
          key={`${hidden}-${a.id}`}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={hidden ? -1 : undefined}
          className="flex items-center gap-2.5 text-sm font-medium text-ink/85 hover:text-ocean-600 hover:underline"
        >
          <span aria-hidden="true" className="text-xs text-ocean-500">
            ●
          </span>
          {a.title}
        </a>
      ))}
    </span>
  );

  return (
    <div className="border-b border-sand-200 bg-white">
      <div className="mx-auto flex max-w-content items-center gap-4 px-4 py-2.5 sm:px-6">
        <span className="flex shrink-0 items-center gap-1.5 rounded bg-ocean-950 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
          {dict.news.latestHeading}
          <span aria-hidden="true" className="text-ocean-400">
            ●
          </span>
        </span>
        <div
          ref={scroller}
          className={`relative flex-1 ${
            manual
              ? "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "overflow-hidden"
          }`}
        >
          <div className={manual ? "flex w-max" : "ticker-track"}>
            {row(false)}
            {!manual && row(true)}
          </div>
        </div>
        <div className="hidden shrink-0 gap-1.5 sm:flex">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label={dict.news.tickerBack}
            className="rounded border border-sand-300 p-1.5 text-ink/60 transition-colors hover:border-ocean-400 hover:text-ocean-600"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M10 3 L5 8 L10 13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label={dict.news.tickerForward}
            className="rounded border border-sand-300 p-1.5 text-ink/60 transition-colors hover:border-ocean-400 hover:text-ocean-600"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M6 3 L11 8 L6 13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
