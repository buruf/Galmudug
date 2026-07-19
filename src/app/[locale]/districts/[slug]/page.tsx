import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import WeaveDivider from "@/components/WeaveDivider";
import { DISTRICTS, getDistrict } from "@/content/districts";
import { getDictionary } from "@/lib/i18n";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    DISTRICTS.map((d) => ({ locale, slug: d.slug }))
  );
}

export function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Metadata {
  if (!isLocale(params.locale)) return {};
  const district = getDistrict(params.slug);
  if (!district) return {};
  return pageMetadata({
    locale: params.locale,
    path: `/districts/${district.slug}`,
    title: `${district.name[params.locale]} — ${district.region[params.locale]}`,
    description: district.role[params.locale],
  });
}

export default function DistrictPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const district = getDistrict(params.slug);
  if (!district) notFound();
  const dict = getDictionary(locale);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link
          href={`/${locale}/districts`}
          className="font-semibold text-clay-600 hover:underline"
        >
          ← {dict.districts.backToDistricts}
        </Link>
      </nav>

      <header className="mt-4">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ocean-900">
          {district.name[locale]}
        </h1>
        <p className="mt-1 text-lg text-ink/60">
          {district.altName} · {district.region[locale]}
        </p>
      </header>

      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-sand-200 bg-white p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            {dict.districts.population}
          </dt>
          <dd className="mt-1 font-semibold text-ocean-900">
            {district.population}
          </dd>
        </div>
        <div className="rounded-lg border border-sand-200 bg-white p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            {dict.districts.role}
          </dt>
          <dd className="mt-1 text-sm font-medium text-ocean-900">
            {district.role[locale]}
          </dd>
        </div>
      </dl>

      <WeaveDivider className="mt-8 text-sand-300" />

      <div className="prose-region mt-6">
        {district.body[locale].map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <nav aria-label={dict.districts.title} className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/60">
          {dict.districts.title}
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {DISTRICTS.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/${locale}/districts/${d.slug}`}
                aria-current={d.slug === district.slug ? "page" : undefined}
                className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  d.slug === district.slug
                    ? "bg-ocean-800 text-white"
                    : "bg-sand-100 text-ocean-800 hover:bg-ocean-100"
                }`}
              >
                {d.name[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
