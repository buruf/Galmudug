import type { Article } from "./types";

/** Window within which similar titles from different sources are duplicates. */
const SIMILARITY_WINDOW_MS = 72 * 60 * 60 * 1000;
const SIMILARITY_THRESHOLD = 0.75;

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function titleTokens(title: string): Set<string> {
  return new Set(normalizeTitle(title).split(" ").filter((t) => t.length > 1));
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const t of a) if (b.has(t)) intersection++;
  return intersection / (a.size + b.size - intersection);
}

function isNearDuplicate(a: Article, b: Article): boolean {
  const dt = Math.abs(
    new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );
  if (dt > SIMILARITY_WINDOW_MS) return false;
  return jaccard(titleTokens(a.title), titleTokens(b.title)) >= SIMILARITY_THRESHOLD;
}

/**
 * Deduplicate a batch of incoming articles against themselves and against
 * already-stored articles. Exact same URL (same id) always deduplicates;
 * near-identical titles within a 72h window across sources deduplicate too
 * (the earliest-published copy wins).
 */
export function dedupeArticles(
  incoming: Article[],
  existing: Article[] = []
): Article[] {
  const sorted = [...incoming].sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );

  const existingIds = new Set(existing.map((a) => a.id));
  const kept: Article[] = [];

  for (const candidate of sorted) {
    if (existingIds.has(candidate.id)) continue;
    if (existing.some((e) => isNearDuplicate(candidate, e))) continue;
    if (kept.some((k) => k.id === candidate.id || isNearDuplicate(candidate, k))) {
      continue;
    }
    kept.push(candidate);
  }
  return kept;
}
