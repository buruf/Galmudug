"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function partsUntil(target: number, now: number): Parts {
  const ms = Math.max(0, target - now);
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

/**
 * Live countdown to Galmudug Day.
 *
 * The target instant is computed on the server and passed in as a timestamp,
 * so the server and client agree on the date regardless of the visitor's
 * timezone. Ticking starts after mount to avoid a hydration mismatch: the
 * first paint shows the server-rendered day count.
 */
export default function Countdown({
  targetMs,
  anniversary,
  isToday,
  locale,
  dict,
  variant = "banner",
}: {
  targetMs: number;
  anniversary: number;
  isToday: boolean;
  locale: Locale;
  dict: Dictionary;
  variant?: "banner" | "hero";
}) {
  const t = dict.galmudugDay;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = partsUntil(targetMs, now ?? Date.now());
  const units: Array<[number, string]> = [
    [parts.days, t.days],
    [parts.hours, t.hours],
    [parts.minutes, t.minutes],
    [parts.seconds, t.seconds],
  ];

  const celebrating = isToday;
  const isHero = variant === "hero";

  return (
    <section
      aria-label={t.countdownLabel}
      className={`relative overflow-hidden rounded-xl bg-ocean-900 text-white ${
        isHero ? "px-5 py-8 sm:px-8 sm:py-10" : "px-5 py-5 sm:px-6"
      }`}
    >
      <Stars />
      <div
        className={`relative flex flex-wrap items-center gap-x-6 gap-y-4 ${
          isHero ? "justify-center text-center" : "justify-between"
        }`}
      >
        <div className={isHero ? "w-full" : ""}>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-acacia-300">
            {celebrating ? t.todayEyebrow : t.eyebrow}
          </p>
          <p
            className={`mt-1 font-display font-extrabold leading-tight ${
              isHero ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
            }`}
          >
            {celebrating
              ? t.todayTitle.replace("{n}", String(anniversary))
              : t.title.replace("{n}", String(anniversary))}
          </p>
        </div>

        {celebrating ? (
          <p className={`text-sand-100/90 ${isHero ? "w-full" : "max-w-md"}`}>
            {t.todayBody}
          </p>
        ) : (
          <div
            className="flex gap-2 sm:gap-3"
            // The seconds tick every second; announcing that would be hostile
            // to screen readers, so the live region is off and the label
            // above carries the meaning.
            aria-hidden="true"
          >
            {units.map(([value, label]) => (
              <div
                key={label}
                className={`rounded-lg bg-white/10 px-3 py-2 text-center backdrop-blur-sm ${
                  isHero ? "min-w-[74px] sm:min-w-[88px]" : "min-w-[58px]"
                }`}
              >
                <div
                  className={`font-display font-extrabold tabular-nums ${
                    isHero ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
                  }`}
                >
                  {String(value).padStart(2, "0")}
                </div>
                <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-sand-200/80">
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isHero && (
          <Link
            href={`/${locale}/galmudug-day`}
            className="rounded-md border border-white/40 px-4 py-2 text-[12px] font-bold uppercase tracking-wide transition-colors hover:bg-white/10"
          >
            {t.cta}
          </Link>
        )}
      </div>
    </section>
  );
}

/** Faint star field echoing the flag's stars. */
function Stars() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.13]"
      viewBox="0 0 400 120"
      preserveAspectRatio="xMidYMid slice"
    >
      {Array.from({ length: 14 }).map((_, i) => {
        const x = 12 + i * 29;
        const y = i % 3 === 0 ? 22 : i % 3 === 1 ? 62 : 96;
        return (
          <path
            key={i}
            transform={`translate(${x} ${y}) scale(${i % 2 ? 0.55 : 0.8})`}
            d="M0 -10 L2.9 -3.1 L10 -3.1 L4.2 1.2 L6.2 8.1 L0 4 L-6.2 8.1 L-4.2 1.2 L-10 -3.1 L-2.9 -3.1 Z"
            className="fill-white"
          />
        );
      })}
    </svg>
  );
}
