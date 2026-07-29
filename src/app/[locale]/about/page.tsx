import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WeaveDivider from "@/components/WeaveDivider";
import { OFFICIAL_LINKS } from "@/content/site-config";
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

        {/* Outbound links to the state's own channels. Deliberately inside
            the independence notice so the distinction is unmissable. */}
        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-ink/60">
          {dict.about.officialLinksTitle}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">
          {dict.about.officialLinksBody}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {OFFICIAL_LINKS.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 rounded-md border border-sand-300 bg-white px-3 py-1.5 text-sm font-medium text-ocean-800 transition-colors hover:border-ocean-400 hover:text-ocean-600"
              >
                {link.kind === "facebook" && (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.5 3H12V0H9.5C7 0 5 2 5 4.5V7H2v3h3v6h3v-6h3l.5-3H8V4.5C8 3.7 8.7 3 9.5 3Z" />
                  </svg>
                )}
                {link.label}
                <span aria-hidden="true" className="text-ink/40">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
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
