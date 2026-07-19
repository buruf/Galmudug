import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RegionArticle from "@/components/RegionArticle";
import { REGION_PAGES, getRegionPage } from "@/content/region";
import { getDictionary } from "@/lib/i18n";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

const SUB_PAGES = REGION_PAGES.filter((p) => p.slug !== "geography");

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    SUB_PAGES.map((p) => ({ locale, slug: p.slug }))
  );
}

export function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Metadata {
  if (!isLocale(params.locale)) return {};
  const page = getRegionPage(params.slug);
  if (!page || page.slug === "geography") return {};
  return pageMetadata({
    locale: params.locale,
    path: `/region/${page.slug}`,
    title: page.title[params.locale],
    description: page.metaDescription[params.locale],
  });
}

export default function RegionSubPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const page = getRegionPage(params.slug);
  if (!page || page.slug === "geography") notFound();
  return (
    <RegionArticle
      page={page}
      locale={params.locale}
      dict={getDictionary(params.locale)}
    />
  );
}
