import Link from "next/link";

// Root not-found: rendered outside the [locale] layout, so it is bilingual.
export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-sand-50 px-4 text-ink">
        <div className="text-center">
          <p className="font-display text-6xl font-bold text-ocean-800">404</p>
          <h1 className="mt-4 text-xl font-semibold">
            Page not found · Bog lama helin
          </h1>
          <p className="mt-2 text-ink/70">
            The page you are looking for does not exist.
            <br />
            <span lang="so">Boggii aad raadinaysay ma jiro ama waa la raray.</span>
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/en"
              className="rounded-lg bg-ocean-800 px-4 py-2 font-semibold text-white hover:bg-ocean-700"
            >
              English homepage
            </Link>
            <Link
              href="/so"
              lang="so"
              className="rounded-lg bg-clay-500 px-4 py-2 font-semibold text-white hover:bg-clay-600"
            >
              Bogga hore
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
