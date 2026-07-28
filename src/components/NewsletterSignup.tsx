"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

type Status = "idle" | "sending" | "sent" | "error" | "rate-limited";

/** Newsletter signup card (dark, sidebar/footer style per the mockups). */
export default function NewsletterSignup({
  locale,
  dict,
  className = "",
}: {
  locale: Locale;
  dict: Dictionary;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const t = dict.newsletter;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, website, locale }),
      });
      if (res.ok) {
        setStatus("sent");
        setEmail("");
      } else if (res.status === 429) {
        setStatus("rate-limited");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className={`rounded-xl bg-ocean-900 p-5 text-white ${className}`}
    >
      <h2 id="newsletter-heading" className="font-display text-lg font-bold">
        {t.title}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ocean-100/90">
        {t.intro}
      </p>

      {status === "sent" ? (
        <p
          role="status"
          className="mt-4 rounded-lg bg-acacia-600/30 px-3 py-2.5 text-sm font-medium text-acacia-100"
        >
          {t.thanks}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <label htmlFor="nl-email" className="sr-only">
            {t.placeholder}
          </label>
          <input
            id="nl-email"
            type="email"
            required
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            className="w-full rounded-lg border border-ocean-600 bg-ocean-950/60 px-3 py-2 text-sm text-white placeholder:text-ocean-300 focus:border-ocean-300 focus:outline-none focus:ring-1 focus:ring-ocean-300"
          />
          {/* Honeypot */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="nl-website">Website</label>
            <input
              id="nl-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          {status === "error" && (
            <p role="alert" className="mt-2 text-sm font-medium text-clay-400">
              {t.error}
            </p>
          )}
          {status === "rate-limited" && (
            <p role="alert" className="mt-2 text-sm font-medium text-clay-400">
              {t.tooMany}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-3 w-full rounded-lg bg-clay-500 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-clay-600 disabled:opacity-50"
          >
            {status === "sending" ? t.sending : t.submit}
          </button>
          <p className="mt-2.5 text-[11px] leading-snug text-ocean-200/80">
            {t.consent}
          </p>
        </form>
      )}
    </section>
  );
}
