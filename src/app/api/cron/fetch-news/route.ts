import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { runNewsPipeline } from "@/lib/news/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  // Fail closed: without a configured secret, the endpoint never runs.
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const report = await runNewsPipeline();
    return NextResponse.json({ ok: true, report });
  } catch (err) {
    // The pipeline itself never throws for a single bad source; this guards
    // against store-level failures so cron reports them instead of 500-looping.
    console.error("[cron/fetch-news] pipeline failed:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}
