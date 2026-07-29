import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import WeaveDivider from "./WeaveDivider";

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/region`, label: dict.nav.region },
    { href: `/${locale}/districts`, label: dict.nav.districts },
    { href: `/${locale}/news`, label: dict.nav.news },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/privacy`, label: dict.privacy.title },
  ];

  return (
    <footer className="mt-16 border-t border-ocean-900/20 bg-ocean-950 text-sand-100">
      <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
        <WeaveDivider className="text-ocean-700" />
        <div className="mt-6 grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold">
              Galmudug<span className="text-clay-400">.com</span>
            </p>
            <p className="mt-1 text-sm text-sand-200/80">{dict.tagline}</p>
          </div>

          <nav aria-label={dict.footer.sections}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-sand-200/60">
              {dict.footer.sections}
            </h2>
            <ul className="mt-3 space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-sand-100/90 hover:text-white hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-clay-400">
              {dict.footer.disclaimerTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-sand-100/90">
              {dict.footer.disclaimer}
            </p>
            <p className="mt-2 text-sm text-sand-200/70">
              {dict.footer.newsAttribution}
            </p>
          </div>
        </div>

        <p className="mt-10 border-t border-ocean-800 pt-4 text-xs text-sand-200/60">
          {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
