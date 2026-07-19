"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/lib/news/types";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export default function AdminPanel({
  locale,
  dict,
  authed,
  initialArticles,
}: {
  locale: Locale;
  dict: Dictionary;
  authed: boolean;
  initialArticles: Article[];
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState(initialArticles);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

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

      {sorted.length === 0 ? (
        <p className="mt-8 rounded-lg border border-sand-200 bg-white p-6 text-ink/60">
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
