import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "gm_admin";

function adminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.length >= 8 ? pw : null;
}

export function isAdminConfigured(): boolean {
  return adminPassword() !== null;
}

/** Session token = HMAC of a fixed label keyed by the admin password. */
export function sessionToken(): string | null {
  const pw = adminPassword();
  if (!pw) return null;
  return createHmac("sha256", pw).update("galmudug-admin-session-v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function verifyPassword(candidate: string): boolean {
  const pw = adminPassword();
  if (!pw) return false;
  return safeEqual(candidate, pw);
}

export function isAdminRequest(): boolean {
  const expected = sessionToken();
  if (!expected) return false;
  const cookie = cookies().get(ADMIN_COOKIE)?.value;
  if (!cookie) return false;
  return safeEqual(cookie, expected);
}
