import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPanel from "@/components/AdminPanel";
import { isAdminConfigured, isAdminRequest } from "@/lib/admin-auth";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { getArticleStore } from "@/lib/news/store";
import { getOpinionStore } from "@/lib/opinions";
import { getNewsletterStore } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return { title: "Admin", robots: { index: false, follow: false } };
}

export default async function AdminPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const dict = getDictionary(params.locale);

  if (!isAdminConfigured()) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-ocean-900">
          {dict.admin.title}
        </h1>
        <p className="mt-4 rounded-lg border border-clay-500/40 bg-clay-500/5 p-4 text-ink/80">
          {dict.admin.notConfigured}
        </p>
      </div>
    );
  }

  const authed = isAdminRequest();
  const [articles, opinions, subscribers] = authed
    ? await Promise.all([
        getArticleStore().getAll(),
        getOpinionStore().getAll(),
        getNewsletterStore().getAll(),
      ])
    : [[], [], []];

  return (
    <AdminPanel
      locale={params.locale}
      dict={dict}
      authed={authed}
      initialArticles={articles}
      initialOpinions={opinions}
      initialSubscribers={subscribers}
    />
  );
}
