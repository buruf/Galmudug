import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DISTRICTS } from "@/content/districts";
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
    path: "/districts",
    title: dict.districts.title,
    description: dict.districts.metaDescription,
  });
}

export default function DistrictsPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <header className="max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ocean-900">
          {dict.districts.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink/80">
          {dict.districts.intro}
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DISTRICTS.map((d) => (
          <Link
            key={d.slug}
            href={`/${locale}/districts/${d.slug}`}
            className="group flex flex-col rounded-xl border border-sand-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="font-display text-xl font-semibold text-ocean-800 group-hover:text-clay-600">
              {d.name[locale]}
            </h2>
            <p className="mt-0.5 text-sm text-ink/50">
              {d.altName} · {d.region[locale]}
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
              {d.role[locale]}
            </p>
            <dl className="mt-4 border-t border-sand-100 pt-3 text-xs text-ink/60">
              <div className="flex justify-between gap-2">
                <dt className="font-medium">{dict.districts.population}</dt>
                <dd>{d.population}</dd>
              </div>
            </dl>
            <span className="mt-3 text-sm font-semibold text-clay-600">
              {dict.districts.readMore} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
