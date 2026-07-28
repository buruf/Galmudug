import { SOCIAL_LINKS, WEATHER_CITIES } from "@/content/site-config";
import WeatherRotator, { type CityWeather } from "@/components/WeatherRotator";
import { formatFullDate } from "@/lib/dates";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

/** WMO weather code → emoji (coarse buckets are plenty for a chip). */
function weatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌦️";
  if (code <= 82) return "🌧️";
  return "⛈️";
}

/**
 * Live temperatures for every configured Galmudug town via Open-Meteo
 * (keyless), cached 30 minutes. Towns that fail are simply dropped — the
 * top bar must never break the page or show invented data.
 */
async function Weather({ locale }: { locale: Locale }) {
  const results = await Promise.all(
    WEATHER_CITIES.map(async (city): Promise<CityWeather | null> => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,weather_code`;
        const res = await fetch(url, { next: { revalidate: 1800 } });
        if (!res.ok) return null;
        const data = (await res.json()) as {
          current?: { temperature_2m?: number; weather_code?: number };
        };
        const temp = data.current?.temperature_2m;
        if (typeof temp !== "number") return null;
        return {
          name: city.name[locale],
          temp: Math.round(temp),
          emoji: weatherEmoji(data.current?.weather_code ?? 0),
        };
      } catch {
        return null;
      }
    })
  );

  const readings = results.filter((r): r is CityWeather => r !== null);
  if (readings.length === 0) return null;
  return <WeatherRotator readings={readings} />;
}

function SocialIcon({ id }: { id: string }) {
  // Minimal single-path glyphs; sized for the 16px top-bar row.
  const paths: Record<string, string> = {
    facebook:
      "M9.5 3H12V0H9.5C7 0 5 2 5 4.5V7H2v3h3v6h3v-6h3l.5-3H8V4.5C8 3.7 8.7 3 9.5 3Z",
    x: "M12.6 0H15L9.8 6.8 16 16h-4.8L7.4 10.3 3 16H.6l5.6-7.3L0 0h4.9l3.4 5.2L12.6 0Zm-1.7 14.4h1.3L4.2 1.5H2.8l8.1 12.9Z",
    youtube:
      "M15.7 4.3c-.2-1-.8-1.7-1.7-1.9C12.5 2 8 2 8 2s-4.5 0-6 .4c-.9.2-1.5.9-1.7 1.9C0 5.8 0 8 0 8s0 2.2.3 3.7c.2 1 .8 1.7 1.7 1.9C3.5 14 8 14 8 14s4.5 0 6-.4c.9-.2 1.5-.9 1.7-1.9.3-1.5.3-3.7.3-3.7s0-2.2-.3-3.7ZM6.4 10.7V5.3L10.6 8l-4.2 2.7Z",
    instagram:
      "M8 1.4c2.1 0 2.4 0 3.3.1 2.1.1 3.1 1.1 3.2 3.2 0 .9.1 1.1.1 3.3s0 2.4-.1 3.3c-.1 2.1-1.1 3.1-3.2 3.2-.9 0-1.1.1-3.3.1s-2.4 0-3.3-.1c-2.1-.1-3.1-1.1-3.2-3.2 0-.9-.1-1.1-.1-3.3s0-2.4.1-3.3C1.6 2.6 2.6 1.6 4.7 1.5c.9 0 1.2-.1 3.3-.1ZM8 0C5.8 0 5.6 0 4.7.1 1.8.2.2 1.8.1 4.7 0 5.6 0 5.8 0 8s0 2.4.1 3.3c.1 2.9 1.7 4.5 4.6 4.6.9 0 1.1.1 3.3.1s2.4 0 3.3-.1c2.9-.1 4.5-1.7 4.6-4.6 0-.9.1-1.1.1-3.3s0-2.4-.1-3.3C15.8 1.8 14.2.2 11.3.1 10.4 0 10.2 0 8 0Zm0 3.9a4.1 4.1 0 1 0 0 8.2 4.1 4.1 0 0 0 0-8.2Zm0 6.8a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm4.3-7.9a1 1 0 1 0 0 1.9 1 1 0 0 0 0-1.9Z",
    telegram:
      "M16 1.5 13.6 14c-.2.8-.6 1-1.3.6l-3.6-2.7-1.8 1.7c-.2.2-.4.4-.7.4l.3-3.8L13.3 4c.3-.3-.1-.4-.5-.2L4.3 9.2.6 8c-.8-.2-.8-.8.2-1.2L14.9.6c.7-.2 1.3.2 1.1.9Z",
    tiktok:
      "M11.5 0h-2.7v10.8c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3 1-2.3 2.3-2.3c.3 0 .5 0 .8.1V5.9c-.3 0-.5-.1-.8-.1C3.7 5.8 1.5 8 1.5 10.8S3.7 15.8 6.5 15.8s5-2.2 5-5V5.4c1 .7 2.2 1.2 3.5 1.2V3.9c-2 0-3.5-1.7-3.5-3.9Z",
  };
  const d = paths[id];
  if (!d) return null;
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/** Dark utility bar above the masthead: date, socials, live weather. */
export default function TopBar({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <div className="bg-ocean-950 text-ocean-100">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-1.5 text-xs sm:px-6">
        <p className="whitespace-nowrap font-medium">
          {formatFullDate(new Date(), locale)}
        </p>
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.length > 0 && (
            <ul className="flex items-center gap-3" aria-label="Social media">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-ocean-200 transition-colors hover:text-white"
                  >
                    <SocialIcon id={s.id} />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <Weather locale={locale} />
        </div>
      </div>
      <span className="sr-only">{dict.siteName}</span>
    </div>
  );
}
