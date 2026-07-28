import { NextRequest, NextResponse } from "next/server";
import { getNewsletterStore, normalizeEmail } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

/** Per-IP throttle (in-memory, per instance). */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function allow(ip: string, now = Date.now()): boolean {
  const stamps = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (stamps.length >= MAX_PER_WINDOW) {
    recent.set(ip, stamps);
    return false;
  }
  stamps.push(now);
  recent.set(ip, stamps);
  if (recent.size > 5000) {
    for (const [key, value] of recent) {
      if (value.every((t) => now - t >= WINDOW_MS)) recent.delete(key);
    }
  }
  return true;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  // Honeypot — bots fill it, humans never see it.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!allow(ip)) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  await getNewsletterStore().add({
    email,
    locale: body.locale === "so" ? "so" : "en",
    createdAt: new Date().toISOString(),
  });
  // Idempotent success: already-subscribed looks identical to new signup,
  // so the endpoint can't be used to probe who is on the list.
  return NextResponse.json({ ok: true }, { status: 201 });
}
