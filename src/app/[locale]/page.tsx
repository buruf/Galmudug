import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import WeaveDivider from "@/components/WeaveDivider";
import { DISTRICTS } from "@/content/districts";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { getArticleStore, getVisibleArticles } from "@/lib/news/store";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return pageMetadata({
    locale: params.locale,
    path: "",
    title: `Galmudug.com — ${dict.tagline}`,
    description: dict.home.heroSubtitle,
  });
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const dict = getDictionary(locale);
  const latest = await getVisibleArticles(getArticleStore(), "galmudug", 6);

  const facts = [
    { label: dict.home.facts.capital, value: dict.home.facts.capitalValue },
    { label: dict.home.facts.largestCity, value: dict.home.facts.largestCityValue },
    { label: dict.home.facts.formed, value: dict.home.facts.formedValue },
    { label: dict.home.facts.regions, value: dict.home.facts.regionsValue },
    { label: dict.home.facts.coastline, value: dict.home.facts.coastlineValue },
    { label: dict.home.facts.economy, value: dict.home.facts.economyValue },
  ];

  const sections = [
    { href: `/${locale}/region`, ...dict.home.sections.geography },
    { href: `/${locale}/region/history`, ...dict.home.sections.history },
    { href: `/${locale}/region/culture`, ...dict.home.sections.culture },
    { href: `/${locale}/region/economy`, ...dict.home.sections.economy },
    { href: `/${locale}/region/travel`, ...dict.home.sections.travel },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ocean-900 text-white">
        <HeroBackdrop />
        <div className="relative mx-auto max-w-content px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sand-200/80">
            {dict.tagline}
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-tight sm:text-7xl">
            {dict.home.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sand-100/90">
            {dict.home.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/region`}
              className="rounded-lg bg-clay-500 px-5 py-3 font-semibold text-white shadow transition-colors hover:bg-clay-600"
            >
              {dict.home.exploreRegion}
            </Link>
            <Link
              href={`/${locale}/news`}
              className="rounded-lg border border-sand-100/40 px-5 py-3 font-semibold text-sand-50 transition-colors hover:bg-white/10"
            >
              {dict.nav.news}
            </Link>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section aria-labelledby="facts-heading" className="bg-sand-100/60">
        <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
          <h2
            id="facts-heading"
            className="font-display text-2xl font-bold text-ocean-900"
          >
            {dict.home.factsTitle}
          </h2>
          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {facts.map((f) => (
              <div
                key={f.label}
                className="rounded-lg border border-sand-200 bg-white p-4"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {f.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ocean-900">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Learn */}
      <section aria-labelledby="learn-heading">
        <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
          <h2
            id="learn-heading"
            className="font-display text-2xl font-bold text-ocean-900"
          >
            {dict.home.sectionsTitle}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-xl border border-sand-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="font-display text-lg font-semibold text-ocean-800 group-hover:text-clay-600">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {s.text}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <WeaveDivider />

      {/* Districts */}
      <section aria-labelledby="districts-heading" className="bg-ocean-50/50">
        <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
          <h2
            id="districts-heading"
            className="font-display text-2xl font-bold text-ocean-900"
          >
            {dict.home.districtsTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-ink/70">{dict.home.districtsSubtitle}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DISTRICTS.slice(0, 4).map((d) => (
              <Link
                key={d.slug}
                href={`/${locale}/districts/${d.slug}`}
                className="group rounded-xl border border-sand-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="font-display text-lg font-semibold text-ocean-800 group-hover:text-clay-600">
                  {d.name[locale]}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink/50">
                  {d.region[locale]}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {d.role[locale]}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href={`/${locale}/districts`}
              className="font-semibold text-clay-600 hover:underline"
            >
              {dict.home.viewAllDistricts} →
            </Link>
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section aria-labelledby="news-heading">
        <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id="news-heading"
              className="font-display text-2xl font-bold text-ocean-900"
            >
              {dict.home.latestNews}
            </h2>
            <Link
              href={`/${locale}/news`}
              className="whitespace-nowrap text-sm font-semibold text-clay-600 hover:underline"
            >
              {dict.home.allNews} →
            </Link>
          </div>
          {latest.length === 0 ? (
            <p className="mt-6 rounded-lg border border-sand-200 bg-white p-6 text-ink/60">
              {dict.news.empty}
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((a) => (
                <ArticleCard key={a.id} article={a} locale={locale} dict={dict} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/** Abstract dune-and-ocean horizon, drawn inline so it costs no requests. */
function HeroBackdrop() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMax slice"
      viewBox="0 0 1200 600"
    >
      <rect width="1200" height="600" className="fill-ocean-900" />
      <path
        d="M0 420 Q300 360 600 410 T1200 400 V600 H0 Z"
        className="fill-ocean-800"
        opacity="0.8"
      />
      <path
        d="M0 470 Q300 430 650 470 T1200 460 V600 H0 Z"
        className="fill-ocean-700"
        opacity="0.6"
      />
      <path
        d="M0 530 Q400 490 800 530 T1200 520 V600 H0 Z"
        className="fill-sand-300"
        opacity="0.35"
      />
      <circle cx="950" cy="150" r="70" className="fill-sand-100" opacity="0.15" />
      <g opacity="0.12" className="fill-sand-100">
        {Array.from({ length: 24 }).map((_, i) => (
          <path
            key={i}
            d={`M${i * 50 + 10} ${80 + (i % 3) * 15} l10 -8 l10 8 l-10 8 Z`}
          />
        ))}
      </g>
    </svg>
  );
}
