import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { ADSENSE_CLIENT, adsEnabled } from "@/content/site-config";
import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { getDictionary } from "@/lib/i18n";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `Galmudug.com — ${dict.tagline}`,
      template: "%s · Galmudug.com",
    },
    description: dict.home.heroSubtitle,
    icons: { icon: "/icon.svg" },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);

  return (
    <html lang={locale}>
      <head>
        {/* AdSense loader. Google's setup instructions require this in
            <head> on every page, so it is rendered server-side here rather
            than via next/script (which defers into the body). Emitted only
            once a publisher id is configured, so ad-free deployments ship
            no third-party script at all. */}
        {adsEnabled() && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          {dict.nav.skipToContent}
        </a>
        <TopBar locale={locale} dict={dict} />
        <Header locale={locale} dict={dict} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
        <Analytics />
      </body>
    </html>
  );
}
