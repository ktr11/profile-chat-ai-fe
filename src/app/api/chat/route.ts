import { NextRequest, NextResponse } from "next/server";

const TRIAL_COOKIE = "trial-identity-id";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const trialId = request.cookies.get(TRIAL_COOKIE)?.value ?? null;

  if (!trialId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pythonApiUrl = process.env.PYTHON_API_URL;
  if (!pythonApiUrl) {
    return NextResponse.json({ error: "PYTHON_API_URL is not set" }, { status: 500 });
  }

  const body = await request.json();

  const upstream = await fetch(`${pythonApiUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-API-Key": process.env.INTERNAL_API_KEY ?? "",
      "X-User-Id": `trial:${trialId}`,
    },
    body: JSON.stringify(body),
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
