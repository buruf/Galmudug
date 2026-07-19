import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsFeed from "@/components/NewsFeed";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { getArticleStore, getVisibleByTopic } from "@/lib/news/store";
import { isArticleTopic, NAV_TOPICS } from "@/lib/news/topics";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Params {
  params: { locale: string; topic: string };
}

export function generateMetadata({ params }: Params): Metadata {
  if (!isLocale(params.locale) || !isArticleTopic(params.topic)) return {};
  const dict = getDictionary(params.locale);
  return pageMetadata({
    locale: params.locale,
    path: `/news/topic/${params.topic}`,
    title: `${dict.topics[params.topic]} — ${dict.nav.news}`,
    description: dict.news.topicIntro,
  });
}

export default async function TopicNewsPage({ params }: Params) {
  if (!isLocale(params.locale)) notFound();
  const topic = params.topic;
  // Only the five editorial topics get pages; "general" lives in the main feeds.
  if (!isArticleTopic(topic) || !NAV_TOPICS.includes(topic)) notFound();

  const dict = getDictionary(params.locale);
  const articles = await getVisibleByTopic(getArticleStore(), topic);
  return (
    <NewsFeed
      articles={articles}
      active={{ topic }}
      locale={params.locale}
      dict={dict}
    />
  );
}
