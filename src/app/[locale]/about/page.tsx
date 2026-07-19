import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WeaveDivider from "@/components/WeaveDivider";
import { NEWS_SOURCES } from "@/lib/news/sources";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return pageMetadata({
    locale: params.locale,
    path: "/about",
    title: dict.about.title,
    description: dict.about.metaDescription,
  });
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const dict = getDictionary(params.locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Galmudug.com",
    url: SITE_URL,
    inLanguage: ["en", "so"],
    description: dict.about.metaDescription,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="font-display text-4xl font-bold tracking-tight text-ocean-900">
        {dict.about.title}
      </h1>

      <section
        aria-labelledby="independence"
        className="mt-8 rounded-xl border-2 border-clay-500/40 bg-clay-500/5 p-6"
      >
        <h2
          id="independence"
          className="font-display text-xl font-semibold text-clay-700"
        >
          {dict.about.independenceTitle}
        </h2>
        <p className="mt-3 leading-relaxed text-ink/90">
          {dict.about.independenceBody1}
        </p>
        <p className="mt-3 leading-relaxed text-ink/90">
          {dict.about.independenceBody2}
        </p>
      </section>

      <WeaveDivider className="mt-8 text-sand-300" />

      <section aria-labelledby="mission" className="mt-6">
        <h2
          id="mission"
          className="font-display text-2xl font-semibold text-ocean-800"
        >
          {dict.about.missionTitle}
        </h2>
        <p className="mt-3 leading-relaxed text-ink/90">{dict.about.missionBody}</p>
      </section>

      <section aria-labelledby="news-how" className="mt-10">
        <h2
          id="news-how"
          className="font-display text-2xl font-semibold text-ocean-800"
        >
          {dict.about.newsTitle}
        </h2>
        <p className="mt-3 leading-relaxed text-ink/90">{dict.about.newsBody1}</p>
        <p className="mt-3 leading-relaxed text-ink/90">{dict.about.newsBody2}</p>
        <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-ink/60">
          {dict.news.sourcesHeading}
        </h3>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {NEWS_SOURCES.map((s) => (
            <li key={s.id}>
              <a
                href={s.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ocean-700 hover:underline"
              >
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="corrections" className="mt-10">
        <h2
          id="corrections"
          className="font-display text-2xl font-semibold text-ocean-800"
        >
          {dict.about.correctionsTitle}
        </h2>
        <p className="mt-3 leading-relaxed text-ink/90">
          {dict.about.correctionsBody}
        </p>
      </section>

      <section aria-labelledby="contact" className="mt-10">
        <h2
          id="contact"
          className="font-display text-2xl font-semibold text-ocean-800"
        >
          {dict.about.contactTitle}
        </h2>
        <p className="mt-3 leading-relaxed text-ink/90">{dict.about.contactBody}</p>
      </section>
    </article>
  );
}
