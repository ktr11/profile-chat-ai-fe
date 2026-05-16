import { http, HttpResponse } from "msw";

const PYTHON_API_URL = process.env.MOCK_API_URL ?? "http://localhost:8000";

export const handlers = [
  http.post(`${PYTHON_API_URL}/chat`, () => {
    return HttpResponse.json(
      { reply: "こんにちは！", chat_count: 1, chat_limit: 10 },
      { status: 200 }
    );
  }),

  http.post(`${PYTHON_API_URL}/session`, ({ request }) => {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader?.includes("trial_uuid=")) {
      return HttpResponse.json(
        { chat_count: 1, chat_limit: 10 },
        {
          status: 200,
          headers: { "set-cookie": "trial_uuid=test-uuid; HttpOnly; Path=/" },
        }
      );
    }
    return HttpResponse.json(
      { chat_count: 0, chat_limit: 10 },
      {
        status: 200,
        headers: { "set-cookie": "trial_uuid=new-uuid; HttpOnly; Path=/" },
      }
    );
  }),
];
