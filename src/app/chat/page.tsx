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

const INITIAL_MESSAGES: Message[] = [
  {
    id: 0,
    role: "ai",
    content:
      "こんにちは！私は Kentaro.T のポートフォリオに関する質問に答えるAIアシスタントです。経歴・スキル・プロジェクトについて何でもお気軽にどうぞ。",
  },
];

const TRIAL_LIMIT_MESSAGE =
  "お試し利用の上限に達しました。続きをご利用になる場合は、正式ログインをお願いします。";

export default function ChatPage() {
  const router = useRouter();
  const { authState, logout, updateCount } = useAuth();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (authState.type === "unauthenticated") {
      router.push("/login");
    }
  }, [authState.type, router]);

  const handleSend = async (text: string) => {
    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.status === 403) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: "ai", content: TRIAL_LIMIT_MESSAGE },
        ]);
        return;
      }

      const data = await res.json();
      updateCount(data.chat_count, data.chat_limit);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", content: data.reply },
      ]);
    } finally {
      setSending(false);
    }
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
          {authState.type === "trial" && authState.chatLimit > 0 && (
            <span className="text-xs text-base-content/50">
              お試し {Math.min(authState.chatCount, authState.chatLimit)}/{authState.chatLimit}
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

      <ChatInput onSend={handleSend} disabled={(authState.type === "trial" && authState.chatCount >= authState.chatLimit) || sending} />
    </div>
  );
}
