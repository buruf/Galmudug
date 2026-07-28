import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MusicGallery from "@/components/MusicGallery";
import { MUSIC_VIDEOS } from "@/content/music";
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
    path: "/music",
    title: dict.music.title,
    description: dict.music.metaDescription,
  });
}

export default function MusicPage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const dict = getDictionary(locale);

  // ItemList of VideoObjects, pointing at the original YouTube videos.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: dict.music.title,
    itemListElement: MUSIC_VIDEOS.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: `${v.title} — ${v.artist}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
        embedUrl: `https://www.youtube.com/embed/${v.id}`,
        ...(v.year ? { uploadDate: `${v.year}-01-01` } : {}),
      },
    })),
  };

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clay-600">
          {dict.nav.music}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ocean-900">
          {dict.music.title}
        </h1>
        <p className="mt-4 leading-relaxed text-ink/80">{dict.music.intro}</p>
      </header>

      <MusicGallery videos={MUSIC_VIDEOS} dict={dict} />

      <footer className="mt-12 rounded-xl border border-sand-200 bg-sand-100/60 p-6">
        <p className="text-sm text-ink/70">{dict.music.attribution}</p>
      </footer>
    </div>
  );
}
