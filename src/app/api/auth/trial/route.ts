import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const IS_PROD = process.env.NODE_ENV === "production";

export async function GET(request: NextRequest) {
  const identityId = request.cookies.get("trial-identity-id")?.value;
  if (!identityId) {
    return NextResponse.json({ error: "No trial session" }, { status: 401 });
  }
  return NextResponse.json({ identityId });
}

export async function POST() {
  const identityId = randomUUID();

  const response = NextResponse.json({ ok: true, identityId });
  response.cookies.set("trial-identity-id", identityId, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  return response;
}
