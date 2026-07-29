import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return pageMetadata({
    locale: params.locale,
    path: "/privacy",
    title: dict.privacy.title,
    description: dict.privacy.metaDescription,
  });
}

export default function PrivacyPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const dict = getDictionary(params.locale);
  const t = dict.privacy;

  const sections: Array<{ title: string; body: string; extra?: React.ReactNode }> = [
    { title: t.collectTitle, body: t.collectBody },
    { title: t.analyticsTitle, body: t.analyticsBody },
    {
      title: t.adsTitle,
      body: t.adsBody,
      extra: (
        <ul className="mt-3 space-y-1 text-sm">
          <li>
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean-700 hover:underline"
            >
              {t.adsLink} ↗
            </a>
          </li>
          <li>
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean-700 hover:underline"
            >
              {t.adsPartnerLink} ↗
            </a>
          </li>
        </ul>
      ),
    },
    { title: t.cookiesTitle, body: t.cookiesBody },
    { title: t.newsTitle, body: t.newsBody },
    { title: t.rightsTitle, body: t.rightsBody },
    { title: t.contactTitle, body: t.contactBody },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold tracking-tight text-ocean-900">
        {t.title}
      </h1>
      <p className="mt-2 text-sm text-ink/50">
        {t.updated}: {t.updatedValue}
      </p>
      <p className="mt-5 text-lg leading-relaxed text-ink/80">{t.intro}</p>

      {sections.map((s) => (
        <section key={s.title} className="mt-9">
          <h2 className="font-display text-xl font-semibold text-ocean-800">
            {s.title}
          </h2>
          <p className="mt-2.5 leading-relaxed text-ink/85">{s.body}</p>
          {s.extra}
        </section>
      ))}
    </article>
  );
}
