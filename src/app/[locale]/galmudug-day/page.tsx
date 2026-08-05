import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Countdown from "@/components/Countdown";
import { GalmudugFlag } from "@/components/Flags";
import MusicGallery from "@/components/MusicGallery";
import WeaveDivider from "@/components/WeaveDivider";
import {
  MILESTONES,
  YEAR_HIGHLIGHTS,
  nextGalmudugDay,
} from "@/content/galmudug-day";
import { MUSIC_VIDEOS } from "@/content/music";
import TikTokGallery from "@/components/TikTokGallery";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { getTikTokPreviews } from "@/lib/tiktok";

// The countdown target depends on "now", so never statically cache the page.
export const dynamic = "force-dynamic";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  const { anniversary } = nextGalmudugDay();
  return pageMetadata({
    locale: params.locale,
    path: "/galmudug-day",
    title: dict.galmudugDay.title.replace("{n}", String(anniversary)),
    description: dict.galmudugDay.metaDescription,
  });
}

export default async function GalmudugDayPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const dict = getDictionary(locale);
  const { date, anniversary, isToday } = nextGalmudugDay();
  const tiktoks = await getTikTokPreviews();

  // Songs whose titles reference the day itself lead the section.
  const daySongs = MUSIC_VIDEOS.filter((v) =>
    /14 august|reer galmudug|dhashii galmudug|boqortooyo/i.test(
      `${v.title} ${v.artist}`
    )
  ).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: dict.galmudugDay.title.replace("{n}", String(anniversary)),
    startDate: date.toISOString(),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Galmudug, Somalia",
      address: { "@type": "PostalAddress", addressCountry: "SO" },
    },
    description: dict.galmudugDay.metaDescription,
  };

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Countdown
        targetMs={date.getTime()}
        anniversary={anniversary}
        isToday={isToday}
        locale={locale}
        dict={dict}
        variant="hero"
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div>
          <p className="text-lg leading-relaxed text-ink/85">
            {dict.galmudugDay.intro}
          </p>
        </div>
        <figure className="mx-auto w-full max-w-xs">
          <GalmudugFlag label={dict.region.symbols.galmudugAlt} />
          <figcaption className="mt-2 text-center text-sm text-ink/60">
            {dict.region.symbols.galmudugCaption}
          </figcaption>
        </figure>
      </div>

      <WeaveDivider className="mt-10 text-sand-300" />

      {/* Timeline */}
      <section aria-labelledby="timeline" className="mt-10">
        <h2
          id="timeline"
          className="border-b border-sand-200 pb-2 text-base font-extrabold uppercase tracking-wide text-ink sm:text-lg"
        >
          <span className="-mb-px inline-block border-b-[3px] border-ocean-600 pb-2">
            {dict.galmudugDay.timelineTitle}
          </span>
        </h2>
        <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MILESTONES.map((m) => (
            <li
              key={m.year}
              className="rounded-xl border border-sand-200 bg-white p-5 shadow-sm"
            >
              <span className="font-display text-3xl font-extrabold text-ocean-600">
                {m.year}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink">
                {m.title[locale]}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                {m.body[locale]}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Year in review — every claim attributed */}
      <section aria-labelledby="review" className="mt-12">
        <h2
          id="review"
          className="border-b border-sand-200 pb-2 text-base font-extrabold uppercase tracking-wide text-ink sm:text-lg"
        >
          <span className="-mb-px inline-block border-b-[3px] border-ocean-600 pb-2">
            {dict.galmudugDay.reviewTitle}
          </span>
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/70">
          {dict.galmudugDay.reviewIntro}
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {YEAR_HIGHLIGHTS.map((h) => (
            <article
              key={h.sourceUrl}
              className="flex flex-col rounded-xl border border-sand-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-display text-lg font-bold leading-snug text-ink">
                {h.title[locale]}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/75">
                {h.body[locale]}
              </p>
              <p className="mt-3 text-xs text-ink/55">
                {dict.galmudugDay.sourceLabel}{" "}
                <a
                  href={h.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ocean-700 hover:underline"
                >
                  {h.sourceName} ↗
                </a>
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Songs of the day */}
      {daySongs.length > 0 && (
        <section aria-labelledby="day-songs" className="mt-12">
          <div className="flex items-end justify-between gap-4 border-b border-sand-200">
            <h2
              id="day-songs"
              className="-mb-px border-b-[3px] border-ocean-600 pb-2 text-base font-extrabold uppercase tracking-wide text-ink sm:text-lg"
            >
              {dict.galmudugDay.songsTitle}
            </h2>
            <Link
              href={`/${locale}/music`}
              className="whitespace-nowrap pb-2 text-xs font-bold uppercase tracking-wide text-ocean-600 hover:underline"
            >
              {dict.galmudugDay.songsCta} →
            </Link>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/70">
            {dict.galmudugDay.songsIntro}
          </p>
          <MusicGallery videos={daySongs} dict={dict} />
        </section>
      )}

      {/* Clips circulating on TikTok for the day */}
      {tiktoks.length > 0 && (
        <section aria-labelledby="tiktok-clips" className="mt-12">
          <h2
            id="tiktok-clips"
            className="border-b border-sand-200 pb-2 text-base font-extrabold uppercase tracking-wide text-ink sm:text-lg"
          >
            <span className="-mb-px inline-block border-b-[3px] border-ocean-600 pb-2">
              {dict.tiktok.title}
            </span>
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/70">
            {dict.tiktok.intro}
          </p>
          <TikTokGallery clips={tiktoks} dict={dict} />
        </section>
      )}
    </div>
  );
}
