import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const TRIAL_COOKIE = "trial_uuid";

async function callChatAiSession(trialUuid?: string): Promise<Response> {
  const chatAiApiUrl = process.env.PYTHON_API_URL;
  if (!chatAiApiUrl) {
    throw new Error("PYTHON_API_URL is not set");
  }
  return fetch(`${chatAiApiUrl}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(trialUuid ? { Cookie: `${TRIAL_COOKIE}=${trialUuid}` } : {}),
    },
  });
}

export async function GET(request: NextRequest) {
  const trialUuid = request.cookies.get(TRIAL_COOKIE)?.value;
  if (!trialUuid) {
    return NextResponse.json({ error: "No trial session" }, { status: 401 });
  }

  try {
    const upstream = await callChatAiSession(trialUuid);
    if (!upstream.ok) {
      return NextResponse.json({ error: "Failed to fetch session" }, { status: upstream.status });
    }

    const data = await upstream.json();
    return NextResponse.json({ chatCount: data.chat_count, chatLimit: data.chat_limit });
  } catch (e) {
    const message = (e as Error).message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const upstream = await callChatAiSession();
    if (!upstream.ok) {
      return NextResponse.json({ error: "Failed to create session" }, { status: upstream.status });
    }

    const data = await upstream.json();

    const setCookieHeader = upstream.headers.get("set-cookie");
    const response = NextResponse.json({ chatCount: data.chat_count, chatLimit: data.chat_limit });
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader);
    }
    return response;
  } catch (e) {
    const message = (e as Error).message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
