import { NextRequest, NextResponse } from "next/server";

const TRIAL_COOKIE = "trial_uuid";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const trialUuid = request.cookies.get(TRIAL_COOKIE)?.value ?? null;

  if (!trialUuid) {
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
      Cookie: `${TRIAL_COOKIE}=${trialUuid}`,
    },
    body: JSON.stringify(body),
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
