import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getOpinionStore } from "@/lib/opinions";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const opinions = await getOpinionStore().getAll();
  return NextResponse.json({ opinions });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: { id?: string; read?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (typeof body.id !== "string" || typeof body.read !== "boolean") {
    return NextResponse.json({ error: "id and read required" }, { status: 400 });
  }
  const updated = await getOpinionStore().setRead(body.id, body.read);
  if (!updated) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ opinion: updated });
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (typeof body.id !== "string") {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const removed = await getOpinionStore().remove(body.id);
  if (!removed) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
