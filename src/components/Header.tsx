"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlagStrip } from "@/components/Flags";
import { LogoLockup } from "@/components/Logo";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? `/${locale}`;

  const otherLocale: Locale = locale === "en" ? "so" : "en";
  const switchedPath = pathname.replace(
    new RegExp(`^/${locale}(?=/|$)`),
    `/${otherLocale}`
  );

  const items = [
    { href: `/${locale}`, label: dict.nav.home, exact: true },
    { href: `/${locale}/news`, label: dict.nav.news, newsRoot: true },
    { href: `/${locale}/news/topic/politics`, label: dict.topics.politics },
    { href: `/${locale}/news/topic/sports`, label: dict.topics.sports },
    { href: `/${locale}/news/topic/culture`, label: dict.topics.culture },
    { href: `/${locale}/region`, label: dict.nav.region },
    { href: `/${locale}/districts`, label: dict.nav.districts },
    // Music is intentionally not in the nav: songs live in the Songs widget
    // alongside Watch on the homepage, which links through to /music.
    { href: `/${locale}/about`, label: dict.nav.about },
  ];

  const isActive = (item: { href: string; exact?: boolean; newsRoot?: boolean }) => {
    if (item.exact) return pathname === item.href;
    // The News tab covers the geographic feeds but not the topic pages,
    // which highlight their own tab instead.
    if (item.newsRoot)
      return (
        pathname.startsWith(item.href) && !pathname.includes("/news/topic/")
      );
    return pathname.startsWith(item.href);
  };

  const rememberLocale = () => {
    document.cookie = `NEXT_LOCALE=${otherLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-white/95 shadow-sm backdrop-blur">
      {/* Masthead: logo · inline nav (desktop) · contact + language */}
      <div className="mx-auto flex max-w-content items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <Link href={`/${locale}`} aria-label={dict.siteName} className="shrink-0">
          <LogoLockup strap={dict.strap} />
        </Link>

        <nav aria-label="Main" className="hidden items-center xl:flex">
          {items
            .filter((item) => !item.exact) // logo is the Home link on desktop
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item) ? "page" : undefined}
                className={`whitespace-nowrap border-b-2 px-2 py-1.5 text-[12px] font-bold uppercase tracking-wide transition-colors ${
                  isActive(item)
                    ? "border-ocean-600 text-ocean-600"
                    : "border-transparent text-ink/75 hover:text-ocean-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <FlagStrip dict={dict} locale={locale} showLabel={false} />
          <Link
            href={`/${locale}/about`}
            className="hidden rounded-md bg-ocean-950 px-3.5 py-2 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-ocean-800 xl:inline-block"
          >
            {dict.nav.contact}
          </Link>
          <Link
            href={switchedPath}
            onClick={rememberLocale}
            aria-label={dict.nav.languageToggleAria}
            className="rounded-md border border-ocean-600 px-2.5 py-1.5 text-xs font-semibold text-ocean-700 transition-colors hover:bg-ocean-600 hover:text-white"
          >
            {dict.nav.languageToggle}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            className="rounded-md p-2 text-ocean-800 hover:bg-sand-100 xl:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              {open ? (
                <path
                  d="M4 4 L18 18 M18 4 L4 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6 h16 M3 11 h16 M3 16 h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-sand-200 bg-white px-4 pb-4 pt-2 xl:hidden"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item) ? "page" : undefined}
              className={`block rounded-md px-3 py-2.5 text-base font-medium ${
                isActive(item)
                  ? "bg-ocean-800 text-white"
                  : "text-ink/80 hover:bg-sand-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
