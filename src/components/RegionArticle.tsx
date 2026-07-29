import Link from "next/link";
import WeaveDivider from "@/components/WeaveDivider";
import { REGION_PAGES, type RegionPage } from "@/content/region";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

const HREF: Record<string, string> = {
  geography: "/region",
  history: "/region/history",
  culture: "/region/culture",
  economy: "/region/economy",
  travel: "/region/travel",
};

export function regionHref(locale: Locale, slug: string): string {
  return `/${locale}${HREF[slug] ?? "/region"}`;
}

/**
 * Short nav label for a region page. The dictionary already carries these
 * for the homepage cards ("Geography" / "Juqraafi"), so the switcher reuses
 * them instead of the long page titles ("Geography of Galmudug").
 */
function SHORT_LABEL(dict: Dictionary, slug: string): string | undefined {
  const sections = dict.home.sections as Record<string, { title: string }>;
  return sections[slug]?.title;
}

export default function RegionArticle({
  page,
  locale,
  dict,
  children,
}: {
  page: RegionPage;
  locale: Locale;
  dict: Dictionary;
  /** Optional extra content rendered after the article sections. */
  children?: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clay-600">
          {dict.nav.region}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ocean-900">
          {page.title[locale]}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink/80">
          {page.intro[locale]}
        </p>
      </header>

      {/* Section switcher sits above the article so readers can see the other
          Region pages and move between them without scrolling to the end. */}
      <nav
        aria-label={dict.home.sectionsTitle}
        className="mt-6 border-y border-sand-200 py-3"
      >
        <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {REGION_PAGES.map((p) => (
            <li key={p.slug} className="shrink-0">
              <Link
                href={regionHref(locale, p.slug)}
                aria-current={p.slug === page.slug ? "page" : undefined}
                className={`inline-block whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  p.slug === page.slug
                    ? "bg-ocean-700 text-white"
                    : "bg-sand-100 text-ocean-800 hover:bg-ocean-100"
                }`}
              >
                {/* Short labels ("Geography") rather than the full page titles
                    ("Geography of Galmudug"), so the row stays on one line. */}
                {SHORT_LABEL(dict, p.slug) ?? p.title[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <WeaveDivider className="mt-6 text-sand-300" />

      {page.sections.map((section) => (
        <section key={section.heading.en} className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-ocean-800">
            {section.heading[locale]}
          </h2>
          <div className="prose-region mt-4">
            {section.body[locale].map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      {children}

      <nav
        aria-label={dict.home.sectionsTitle}
        className="mt-14 rounded-xl border border-sand-200 bg-sand-100/60 p-5"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/60">
          {dict.home.sectionsTitle}
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {REGION_PAGES.map((p) => (
            <li key={p.slug}>
              <Link
                href={regionHref(locale, p.slug)}
                aria-current={p.slug === page.slug ? "page" : undefined}
                className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  p.slug === page.slug
                    ? "bg-ocean-800 text-white"
                    : "bg-white text-ocean-800 hover:bg-ocean-100"
                }`}
              >
                {p.title[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
