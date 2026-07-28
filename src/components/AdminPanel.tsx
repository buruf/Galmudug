"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/lib/news/types";
import type { Opinion } from "@/lib/opinions";
import type { Subscriber } from "@/lib/newsletter";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export default function AdminPanel({
  locale,
  dict,
  authed,
  initialArticles,
  initialOpinions,
  initialSubscribers,
}: {
  locale: Locale;
  dict: Dictionary;
  authed: boolean;
  initialArticles: Article[];
  initialOpinions: Opinion[];
  initialSubscribers: Subscriber[];
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState(initialArticles);
  const [opinions, setOpinions] = useState(initialOpinions);
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [copied, setCopied] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function removeSubscriber(email: string) {
    setBusyId(email);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.email !== email));
      }
    } finally {
      setBusyId(null);
    }
  }

  async function copyEmails() {
    try {
      await navigator.clipboard.writeText(
        subscribers.map((s) => s.email).join("\n")
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  async function setOpinionRead(id: string, read: boolean) {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/opinions", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, read }),
      });
      if (res.ok) {
        setOpinions((prev) =>
          prev.map((o) => (o.id === id ? { ...o, read } : o))
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function deleteOpinion(id: string) {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/opinions", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setOpinions((prev) => prev.filter((o) => o.id !== id));
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      setError(dict.admin.wrongPassword);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function toggleFlag(id: string, flag: "hidden" | "pinned", value: boolean) {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, [flag]: value }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, [flag]: value } : a))
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function runPipeline() {
    setRunning(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/refresh", { method: "POST" });
      if (res.ok) {
        setNotice(dict.admin.refreshDone);
        router.refresh();
        const fresh = await fetch("/api/admin/articles").then((r) =>
          r.ok ? r.json() : null
        );
        if (fresh?.articles) setArticles(fresh.articles);
      }
    } finally {
      setRunning(false);
    }
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-ocean-900">
          {dict.admin.loginTitle}
        </h1>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-ink/80"
            >
              {dict.admin.password}
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-sand-300 bg-white px-3 py-2 text-ink shadow-sm"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm font-medium text-clay-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-ocean-800 px-4 py-2.5 font-semibold text-white hover:bg-ocean-700"
          >
            {dict.admin.signIn}
          </button>
        </form>
      </div>
    );
  }

  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ocean-900">
          {dict.admin.title}
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={runPipeline}
            disabled={running}
            className="rounded-lg bg-acacia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-acacia-700 disabled:opacity-50"
          >
            {running ? "…" : dict.admin.refresh}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-sand-300 px-4 py-2 text-sm font-semibold text-ink/70 hover:bg-sand-100"
          >
            {dict.admin.signOut}
          </button>
        </div>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-ink/70">{dict.admin.intro}</p>
      {notice && (
        <p role="status" className="mt-3 text-sm font-medium text-acacia-600">
          {notice}
        </p>
      )}

      {/* Reader messages */}
      <section aria-labelledby="opinions-heading" className="mt-10">
        <h2
          id="opinions-heading"
          className="flex items-center gap-2 font-display text-xl font-bold text-ocean-900"
        >
          {dict.admin.opinionsTitle}
          {opinions.filter((o) => !o.read).length > 0 && (
            <span className="rounded-full bg-clay-500 px-2 py-0.5 text-xs font-bold text-white">
              {opinions.filter((o) => !o.read).length} {dict.admin.unreadBadge}
            </span>
          )}
        </h2>
        {opinions.length === 0 ? (
          <p className="mt-4 rounded-lg border border-sand-200 bg-white p-6 text-ink/60">
            {dict.admin.noOpinions}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-sand-200 rounded-xl border border-sand-200 bg-white">
            {opinions.map((o) => (
              <li
                key={o.id}
                className={`p-4 ${o.read ? "" : "bg-ocean-50/60"}`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink/60">
                  {!o.read && (
                    <span className="rounded bg-clay-500 px-1.5 py-0.5 font-bold uppercase text-white">
                      {dict.admin.unreadBadge}
                    </span>
                  )}
                  <span className="font-semibold text-ink/80">
                    {o.name || "—"}
                  </span>
                  {o.email && (
                    <a
                      href={`mailto:${o.email}`}
                      className="text-ocean-700 hover:underline"
                    >
                      {o.email}
                    </a>
                  )}
                  <span>· {o.locale.toUpperCase()}</span>
                  <span>· {o.createdAt.slice(0, 16).replace("T", " ")}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                  {o.message}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === o.id}
                    onClick={() => setOpinionRead(o.id, !o.read)}
                    className="rounded-md border border-sand-300 px-3 py-1.5 text-xs font-semibold text-ink/70 hover:bg-sand-100 disabled:opacity-50"
                  >
                    {o.read ? dict.admin.markUnread : dict.admin.markRead}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === o.id}
                    onClick={() => deleteOpinion(o.id)}
                    className="rounded-md border border-clay-500/40 px-3 py-1.5 text-xs font-semibold text-clay-600 hover:bg-clay-500/10 disabled:opacity-50"
                  >
                    {dict.admin.deleteOpinion}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Newsletter subscribers */}
      <section aria-labelledby="subscribers-heading" className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="subscribers-heading"
            className="flex items-center gap-2 font-display text-xl font-bold text-ocean-900"
          >
            {dict.admin.subscribersTitle}
            <span className="rounded-full bg-ocean-100 px-2 py-0.5 text-xs font-bold text-ocean-800">
              {subscribers.length}
            </span>
          </h2>
          {subscribers.length > 0 && (
            <button
              type="button"
              onClick={copyEmails}
              className="rounded-md border border-sand-300 px-3 py-1.5 text-xs font-semibold text-ink/70 hover:bg-sand-100"
            >
              {copied ? dict.admin.copiedEmails : dict.admin.copyEmails}
            </button>
          )}
        </div>
        <p className="mt-1.5 text-sm text-ink/60">{dict.admin.subscribersNote}</p>
        {subscribers.length === 0 ? (
          <p className="mt-4 rounded-lg border border-sand-200 bg-white p-6 text-ink/60">
            {dict.admin.noSubscribers}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-sand-200 rounded-xl border border-sand-200 bg-white">
            {subscribers.map((s) => (
              <li
                key={s.email}
                className="flex flex-wrap items-center gap-3 px-4 py-2.5"
              >
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                  {s.email}
                </span>
                <span className="text-xs uppercase text-ink/40">{s.locale}</span>
                <span className="text-xs text-ink/40">
                  {s.createdAt.slice(0, 10)}
                </span>
                <button
                  type="button"
                  disabled={busyId === s.email}
                  onClick={() => removeSubscriber(s.email)}
                  className="rounded-md border border-sand-300 px-2.5 py-1 text-xs font-semibold text-ink/70 hover:bg-sand-100 disabled:opacity-50"
                >
                  {dict.admin.removeSubscriber}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <h2 className="mt-10 font-display text-xl font-bold text-ocean-900">
        {dict.admin.articlesTitle}
      </h2>
      {sorted.length === 0 ? (
        <p className="mt-4 rounded-lg border border-sand-200 bg-white p-6 text-ink/60">
          {dict.admin.empty}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-sand-200 rounded-xl border border-sand-200 bg-white">
          {sorted.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {a.title}
                  </a>
                </p>
                <p className="mt-0.5 text-xs text-ink/50">
                  {a.sourceName} · {a.category} · {a.language} ·{" "}
                  {a.publishedAt.slice(0, 10)}
                  {a.hidden && (
                    <span className="ml-2 rounded bg-ink/10 px-1.5 py-0.5 font-semibold">
                      {dict.admin.hiddenBadge}
                    </span>
                  )}
                  {a.pinned && (
                    <span className="ml-2 rounded bg-clay-500/15 px-1.5 py-0.5 font-semibold text-clay-700">
                      {dict.admin.pinnedBadge}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  disabled={busyId === a.id}
                  onClick={() => toggleFlag(a.id, "pinned", !a.pinned)}
                  className="rounded-md border border-sand-300 px-3 py-1.5 text-xs font-semibold text-ink/70 hover:bg-sand-100 disabled:opacity-50"
                >
                  {a.pinned ? dict.admin.unpin : dict.admin.pin}
                </button>
                <button
                  type="button"
                  disabled={busyId === a.id}
                  onClick={() => toggleFlag(a.id, "hidden", !a.hidden)}
                  className="rounded-md border border-sand-300 px-3 py-1.5 text-xs font-semibold text-ink/70 hover:bg-sand-100 disabled:opacity-50"
                >
                  {a.hidden ? dict.admin.unhide : dict.admin.hide}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
