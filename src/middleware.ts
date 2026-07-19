import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n/config";

const LOCALE_COOKIE = "NEXT_LOCALE";

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.split(";")[0].trim().toLowerCase().slice(0, 2);
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathLocale = pathname.split("/")[1];
  if (isLocale(pathLocale)) {
    // Visiting a locale path updates the persisted preference.
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== pathLocale) {
      response.cookies.set(LOCALE_COOKIE, pathLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  // No locale in the path: redirect to the preferred one.
  const locale = preferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next internals, and files with extensions.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
