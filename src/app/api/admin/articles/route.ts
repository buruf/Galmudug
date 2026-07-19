import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getArticleStore } from "@/lib/news/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const articles = await getArticleStore().getAll();
  return NextResponse.json({ articles });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { id?: string; hidden?: boolean; pinned?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (typeof body.id !== "string") {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const flags: { hidden?: boolean; pinned?: boolean } = {};
  if (typeof body.hidden === "boolean") flags.hidden = body.hidden;
  if (typeof body.pinned === "boolean") flags.pinned = body.pinned;
  if (Object.keys(flags).length === 0) {
    return NextResponse.json({ error: "no flags" }, { status: 400 });
  }

  const updated = await getArticleStore().setFlags(body.id, flags);
  if (!updated) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ article: updated });
}
