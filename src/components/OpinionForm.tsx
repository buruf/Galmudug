"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

type Status = "idle" | "sending" | "sent" | "error" | "rate-limited";

export default function OpinionForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/opinions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, message, website, locale }),
      });
      if (res.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else if (res.status === 429) {
        setStatus("rate-limited");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const t = dict.opinion;
  const inputClass =
    "mt-1 w-full rounded-lg border border-sand-300 bg-white px-3 py-2 text-ink shadow-sm placeholder:text-ink/40 focus:border-ocean-500 focus:outline-none focus:ring-1 focus:ring-ocean-500";

  return (
    <section
      aria-labelledby="opinion-heading"
      className="mt-12 rounded-xl border border-sand-200 bg-sand-100/60 p-6 sm:p-8"
    >
      <h2
        id="opinion-heading"
        className="font-display text-xl font-bold text-ocean-900 sm:text-2xl"
      >
        {t.title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
        {t.intro}
      </p>

      {status === "sent" ? (
        <p
          role="status"
          className="mt-5 rounded-lg border border-acacia-300 bg-acacia-50 p-4 font-medium text-acacia-800"
        >
          {t.thanks}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="op-name" className="block text-sm font-medium text-ink/80">
                {t.name}
              </label>
              <input
                id="op-name"
                type="text"
                autoComplete="name"
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="op-email" className="block text-sm font-medium text-ink/80">
                {t.email}
              </label>
              <input
                id="op-email"
                type="email"
                autoComplete="email"
                maxLength={200}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Honeypot — visually hidden from real users, tempting to bots. */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="op-website">Website</label>
            <input
              id="op-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="op-message" className="block text-sm font-medium text-ink/80">
              {t.message}
            </label>
            <textarea
              id="op-message"
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputClass}
            />
          </div>

          {status === "error" && (
            <p role="alert" className="mt-3 text-sm font-medium text-clay-600">
              {t.error}
            </p>
          )}
          {status === "rate-limited" && (
            <p role="alert" className="mt-3 text-sm font-medium text-clay-600">
              {t.tooMany}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-4 rounded-lg bg-ocean-800 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-ocean-700 disabled:opacity-50"
          >
            {status === "sending" ? t.sending : t.submit}
          </button>
        </form>
      )}
    </section>
  );
}
