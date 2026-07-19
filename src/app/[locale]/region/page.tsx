import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FlagsBlock from "@/components/Flags";
import RegionArticle from "@/components/RegionArticle";
import { getRegionPage } from "@/content/region";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  if (!isLocale(params.locale)) return {};
  const page = getRegionPage("geography")!;
  return pageMetadata({
    locale: params.locale,
    path: "/region",
    title: page.title[params.locale],
    description: page.metaDescription[params.locale],
  });
}

export default function GeographyPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const page = getRegionPage("geography");
  if (!page) notFound();
  const dict = getDictionary(params.locale);
  return (
    <RegionArticle page={page} locale={params.locale} dict={dict}>
      <FlagsBlock dict={dict} />
    </RegionArticle>
  );
}
