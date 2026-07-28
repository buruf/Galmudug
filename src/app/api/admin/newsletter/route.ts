import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getNewsletterStore } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const subscribers = await getNewsletterStore().getAll();
  return NextResponse.json({ subscribers });
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (typeof body.email !== "string") {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }
  const removed = await getNewsletterStore().remove(body.email.toLowerCase());
  if (!removed) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
