import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import FeatureSlider from "@/components/FeatureSlider";
import NewsTicker from "@/components/NewsTicker";
import NewsletterSignup from "@/components/NewsletterSignup";
import OpinionForm from "@/components/OpinionForm";
import { SourceAttribution } from "@/components/NewsFeed";
import WeaveDivider from "@/components/WeaveDivider";
import { DISTRICTS } from "@/content/districts";
import { getDictionary, type Dictionary } from "@/lib/i18n";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getAllVisible, getArticleStore } from "@/lib/news/store";
import { NAV_TOPICS } from "@/lib/news/topics";
import type { Article } from "@/lib/news/types";
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

function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-sand-200">
      <h2 className="-mb-px border-b-[3px] border-ocean-600 pb-2 text-base font-extrabold uppercase tracking-wide text-ink sm:text-lg">
        {title}
      </h2>
      <Link
        href={href}
        className="whitespace-nowrap pb-2 text-xs font-bold uppercase tracking-wide text-ocean-600 hover:underline"
      >
        {linkLabel} →
      </Link>
    </div>
  );
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict: Dictionary = getDictionary(locale);

  const all = await getAllVisible(getArticleStore(), 120);
  const used = new Set<string>();
  const take = (pool: Article[], n: number): Article[] => {
    const picked: Article[] = [];
    for (const a of pool) {
      if (picked.length >= n) break;
      if (used.has(a.id)) continue;
      used.add(a.id);
      picked.push(a);
    }
    return picked;
  };

  // Feature slider: pinned stories first, then the newest with pictures, so
  // the rotation leads with imagery wherever possible.
  const featured = [
    ...all.filter((a) => a.pinned),
    ...all.filter((a) => !a.pinned && a.image),
    ...all.filter((a) => !a.pinned && !a.image),
  ].slice(0, 5);
  featured.forEach((a) => used.add(a.id));
  // Mockup: exactly three boxed cards beside the slider, level with it.
  const topRail = take(all, 3);
  const galmudug = take(all.filter((a) => a.category === "galmudug"), 4);
  const topicSections = NAV_TOPICS.map((topic) => ({
    topic,
    articles: take(all.filter((a) => (a.topic ?? "general") === topic), 3),
  })).filter((s) => s.articles.length >= 2);
  const latest = take(all, 8);

  return (
    <>
      <NewsTicker
        articles={all.filter((a) => a.category === "galmudug")}
        dict={dict}
      />
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
      {all.length === 0 ? (
        <p className="mt-8 rounded-lg border border-sand-200 bg-white p-8 text-ink/60">
          {dict.news.empty}
        </p>
      ) : (
        <>
          {/* Feature slider + top-stories rail: on desktop both columns are
              the same height (the rail's three cards set it), so the slider
              and the cards end level. */}
          <section className="grid items-stretch gap-8 lg:grid-cols-[2fr_1fr]">
            {featured.length > 0 && (
              <FeatureSlider
                articles={featured}
                locale={locale}
                dict={dict}
              />
            )}
            <aside aria-label={dict.news.topStories} className="flex flex-col">
              <h2 className="border-b border-sand-200 pb-2 text-base font-extrabold uppercase tracking-wide text-ink">
                <span className="-mb-px inline-block border-b-[3px] border-ocean-600 pb-2">
                  {dict.news.topStories}
                </span>
              </h2>
              <div className="mt-3 flex flex-1 flex-col gap-3">
                {topRail.map((a) => (
                  <ArticleCard
                    key={a.id}
                    article={a}
                    locale={locale}
                    dict={dict}
                    variant="compact"
                  />
                ))}
              </div>
            </aside>
          </section>

          {/* Galmudug regional block */}
          {galmudug.length > 0 && (
            <section className="mt-12">
              <SectionHeading
                title={dict.news.galmudugTitle}
                href={`/${locale}/news`}
                linkLabel={dict.home.allNews}
              />
              <div className="mt-5 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {galmudug.map((a) => (
                  <ArticleCard key={a.id} article={a} locale={locale} dict={dict} />
                ))}
              </div>
            </section>
          )}

          {/* Topic blocks */}
          {topicSections.map(({ topic, articles }) => (
            <section key={topic} className="mt-12">
              <SectionHeading
                title={dict.topics[topic]}
                href={`/${locale}/news/topic/${topic}`}
                linkLabel={dict.home.allNews}
              />
              <div className="mt-5 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((a) => (
                  <ArticleCard key={a.id} article={a} locale={locale} dict={dict} />
                ))}
              </div>
            </section>
          ))}

          {/* Latest wire */}
          {latest.length > 0 && (
            <section className="mt-12">
              <SectionHeading
                title={dict.news.latestHeading}
                href={`/${locale}/news/somalia`}
                linkLabel={dict.news.somaliaTitle}
              />
              <div className="mt-2 grid gap-x-10 sm:grid-cols-2">
                {latest.map((a) => (
                  <ArticleCard
                    key={a.id}
                    article={a}
                    locale={locale}
                    dict={dict}
                    variant="row"
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <WeaveDivider className="mt-14 text-sand-300" />

      {/* Explore Galmudug band — the encyclopedic side of the site */}
      <section aria-labelledby="explore-heading" className="mt-10">
        <h2
          id="explore-heading"
          className="font-display text-xl font-bold text-ocean-900 sm:text-2xl"
        >
          {dict.home.sectionsTitle}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {(
            [
              [`/${locale}/region`, dict.home.sections.geography],
              [`/${locale}/region/history`, dict.home.sections.history],
              [`/${locale}/region/culture`, dict.home.sections.culture],
              [`/${locale}/region/economy`, dict.home.sections.economy],
              [`/${locale}/region/travel`, dict.home.sections.travel],
            ] as const
          ).map(([href, s]) => (
            <Link
              key={href}
              href={href}
              className="group rounded-lg border border-sand-200 bg-white p-4 transition-colors hover:border-ocean-300"
            >
              <h3 className="font-display font-semibold text-ocean-800 group-hover:text-ocean-600">
                {s.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink/70">
                {s.text}
              </p>
            </Link>
          ))}
          <Link
            href={`/${locale}/music`}
            className="group rounded-lg border border-sand-200 bg-white p-4 transition-colors hover:border-ocean-300"
          >
            <h3 className="font-display font-semibold text-ocean-800 group-hover:text-ocean-600">
              {dict.nav.music}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink/70">
              {dict.music.title}
            </p>
          </Link>
        </div>
        <p className="mt-5 text-sm text-ink/70">
          <span className="font-semibold text-ink/80">{dict.nav.districts}:</span>{" "}
          {DISTRICTS.map((d, i) => (
            <span key={d.slug}>
              {i > 0 && " · "}
              <Link
                href={`/${locale}/districts/${d.slug}`}
                className="text-ocean-700 hover:underline"
              >
                {d.name[locale]}
              </Link>
            </span>
          ))}
        </p>
      </section>

      <NewsletterSignup locale={locale} dict={dict} className="mt-12" />

      <OpinionForm locale={locale} dict={dict} />

      <SourceAttribution dict={dict} />
      </div>
    </>
  );
}
