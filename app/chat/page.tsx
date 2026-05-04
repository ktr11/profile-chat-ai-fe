"use client";

import { useState } from "react";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";

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

const MOCK_AI_RESPONSE =
  "ご質問ありがとうございます。私は Kentaro.T のポートフォリオチャットAIです。バックエンドの準備が整い次第、詳しくお答えできるようになります。もうしばらくお待ちください！";

export default function ChatPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const handleSend = (text: string) => {
    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    const aiMsg: Message = {
      id: Date.now() + 1,
      role: "ai",
      content: MOCK_AI_RESPONSE,
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-base-200 gap-6">
        <div className="card bg-base-100 shadow-md p-8 flex flex-col items-center gap-4 w-80">
          <h1 className="text-2xl font-bold">AI Chat</h1>
          <p className="text-base-content/70 text-center">
            チャットを利用するにはログインが必要です。
          </p>
          <button className="btn btn-primary w-full" onClick={() => setLoggedIn(true)}>
            ログイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-base-200">
      <header className="navbar bg-base-100 border-b border-base-200 px-4">
        <div className="navbar-start text-xl font-bold">AI Chat</div>
        <div className="navbar-end">
          <button className="btn btn-ghost btn-sm" onClick={() => setLoggedIn(false)}>
            ログアウト
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg.content} isUser={msg.role === "user"} />
        ))}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
}
