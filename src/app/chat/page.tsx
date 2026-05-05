"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}

const TRIAL_LIMIT = 5;
const TRIAL_COUNT_COOKIE = "trial-chat-count";
const TRIAL_IDENTITY_COOKIE = "trial-identity-id";

const INITIAL_MESSAGES: Message[] = [
  {
    id: 0,
    role: "ai",
    content:
      "こんにちは！私は Kentaro.T のポートフォリオに関する質問に答えるAIアシスタントです。経歴・スキル・プロジェクトについて何でもお気軽にどうぞ。",
  },
];

const MOCK_AI_RESPONSE =
  "ご質問ありがとうございます。私は Kentaro.T のポートフォリオチャットAIです。バックエンドの準備が整い次第、詳しくお答えできるようになります。もうしばらくお待ちください！";

const TRIAL_LIMIT_MESSAGE =
  "お試し利用の5回分をご利用いただきました。続きをご利用になる場合は、正式ログインをお願いします。";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
}

export default function ChatPage() {
  const router = useRouter();
  const { authState, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [trialCount, setTrialCount] = useState(() =>
    parseInt(getCookie(TRIAL_COUNT_COOKIE) ?? "0", 10)
  );
  const [trialExhausted, setTrialExhausted] = useState(
    () => parseInt(getCookie(TRIAL_COUNT_COOKIE) ?? "0", 10) >= TRIAL_LIMIT
  );

  useEffect(() => {
    if (authState.type === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (authState.type === "trial") {
      // trial Identity ID を Cookie にセット（Middleware が読む）
      setCookie(TRIAL_IDENTITY_COOKIE, authState.user.identityId);
    }
  }, [authState, router]);

  const handleSend = (text: string) => {
    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    let aiContent = MOCK_AI_RESPONSE;
    let nextCount = trialCount;

    if (authState.type === "trial") {
      nextCount = trialCount + 1;
      setCookie(TRIAL_COUNT_COOKIE, String(nextCount));
      setTrialCount(nextCount);

      if (nextCount >= TRIAL_LIMIT) {
        aiContent = MOCK_AI_RESPONSE + "\n\n" + TRIAL_LIMIT_MESSAGE;
        setTrialExhausted(true);
      }
    }

    const aiMsg: Message = { id: Date.now() + 1, role: "ai", content: aiContent };
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (authState.type === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-base-200">
      <header className="navbar bg-base-100 border-b border-base-200 px-4">
        <div className="navbar-start text-xl font-bold">AI Chat</div>
        <div className="navbar-end gap-2">
          {authState.type === "trial" && (
            <span className="text-xs text-base-content/50">
              お試し {Math.min(trialCount, TRIAL_LIMIT)}/{TRIAL_LIMIT}
            </span>
          )}
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg.content} isUser={msg.role === "user"} />
        ))}
      </div>

      <ChatInput onSend={handleSend} disabled={trialExhausted} />
    </div>
  );
}
