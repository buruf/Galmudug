"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href={`/${locale}`}
          className="flex items-baseline gap-2 font-display text-xl font-bold tracking-tight text-ocean-800"
        >
          <LogoMark />
          <span>
            Galmudug<span className="text-clay-500">.com</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item) ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item)
                  ? "bg-ocean-800 text-white"
                  : "text-ink/80 hover:bg-sand-100 hover:text-ocean-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={switchedPath}
            onClick={rememberLocale}
            aria-label={dict.nav.languageToggleAria}
            className="rounded-full border border-ocean-700 px-3 py-1.5 text-xs font-semibold text-ocean-800 transition-colors hover:bg-ocean-700 hover:text-white"
          >
            {dict.nav.languageToggle}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            className="rounded-md p-2 text-ocean-800 hover:bg-sand-100 md:hidden"
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

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-sand-200 bg-sand-50 px-4 pb-4 pt-2 md:hidden"
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

function LogoMark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      aria-hidden="true"
      className="translate-y-0.5"
    >
      <rect x="1" y="1" width="24" height="24" rx="6" className="fill-ocean-800" />
      <path d="M13 4 L20 13 L13 22 L6 13 Z" className="fill-sand-100" />
      <path d="M13 8 L16.5 13 L13 18 L9.5 13 Z" className="fill-clay-500" />
    </svg>
  );
}
