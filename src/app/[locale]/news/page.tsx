import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsFeed from "@/components/NewsFeed";
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
    path: "/news",
    title: dict.news.galmudugTitle,
    description: dict.news.galmudugIntro,
  });
}

export default async function GalmudugNewsPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const dict = getDictionary(params.locale);
  const articles = await getVisibleArticles(getArticleStore(), "galmudug");
  return (
    <NewsFeed
      articles={articles}
      active={{ category: "galmudug" }}
      locale={params.locale}
      dict={dict}
    />
  );
}
