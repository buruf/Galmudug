import { NextRequest, NextResponse } from "next/server";
import { getOpinionStore, validateOpinionInput } from "@/lib/opinions";

export const dynamic = "force-dynamic";

/** Per-IP submission throttle (in-memory, per instance — good enough here). */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const recent = new Map<string, number[]>();

function allow(ip: string, now = Date.now()): boolean {
  const stamps = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (stamps.length >= MAX_PER_WINDOW) {
    recent.set(ip, stamps);
    return false;
  }
  stamps.push(now);
  recent.set(ip, stamps);
  // Keep the map from growing unbounded.
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

  // Honeypot: real users never fill this hidden field. Pretend success so
  // bots learn nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const input = validateOpinionInput(body);
  if (!input) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!allow(ip)) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  await getOpinionStore().add(input);
  return NextResponse.json({ ok: true }, { status: 201 });
}
