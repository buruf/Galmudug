"use client";

import { useEffect, useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import type { Article } from "@/lib/news/types";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

/**
 * Feature slider: rotates through the top headlines, one at a time.
 *
 * Height is driven by the sibling top-stories rail (see the homepage grid),
 * so the slider and the three cards always end level. Auto-advance pauses on
 * hover/focus and is disabled entirely for reduced-motion visitors, who can
 * still use the dots.
 */
export default function FeatureSlider({
  articles,
  locale,
  dict,
  intervalMs = 6000,
}: {
  articles: Article[];
  locale: Locale;
  dict: Dictionary;
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (articles.length < 2 || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % articles.length),
      intervalMs
    );
    return () => clearInterval(timer);
  }, [articles.length, paused, intervalMs]);

  if (articles.length === 0) return null;
  const current = articles[Math.min(index, articles.length - 1)];

  return (
    <div
      className="relative h-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={dict.news.topStories}
    >
      <ArticleCard
        key={current.id}
        article={current}
        locale={locale}
        dict={dict}
        variant="hero"
      />

      {articles.length > 1 && (
        <div className="absolute bottom-3 right-3 z-10 flex gap-1.5 sm:bottom-4 sm:right-5">
          {articles.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}/${articles.length}`}
              aria-current={i === index ? "true" : undefined}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
