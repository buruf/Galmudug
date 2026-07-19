import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { runNewsPipeline } from "@/lib/news/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST() {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const report = await runNewsPipeline();
  return NextResponse.json({ report });
}
