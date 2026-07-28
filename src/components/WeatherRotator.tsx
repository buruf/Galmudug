"use client";

import { useEffect, useState } from "react";

export interface CityWeather {
  name: string;
  temp: number;
  emoji: string;
}

/**
 * Cycles the top-bar weather chip through Galmudug towns. Readings are
 * fetched on the server (TopBar) and passed in, so this component only
 * handles rotation — no client-side API calls, no layout shift.
 */
export default function WeatherRotator({
  readings,
  intervalMs = 5000,
}: {
  readings: CityWeather[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (readings.length < 2) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Still rotate for reduced-motion users (it's a text swap, not motion),
    // just more slowly so it is easy to read.
    const period = reduce ? intervalMs * 2 : intervalMs;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % readings.length),
      period
    );
    return () => clearInterval(timer);
  }, [readings.length, intervalMs]);

  if (readings.length === 0) return null;
  const current = readings[Math.min(index, readings.length - 1)];

  return (
    <span
      className="flex items-center gap-1.5 whitespace-nowrap"
      aria-live="off"
      title={readings.map((r) => `${r.name} ${r.temp}°C`).join(" · ")}
    >
      <span aria-hidden="true">{current.emoji}</span>
      <span>
        {current.temp}°C · {current.name}
      </span>
    </span>
  );
}
