"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { startTrial } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    setError("");
    setLoading(true);
    try {
      await startTrial();
      router.push("/chat");
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card bg-base-100 shadow-md w-full max-w-sm p-8 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">AI Chat</h1>
        <p className="text-sm text-base-content/60 text-center">
          登録不要でチャットを試せます
        </p>
        <button
          className="btn btn-primary w-full"
          onClick={handleStart}
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner loading-sm" /> : "試してみる"}
        </button>
        {error && (
          <div className="alert alert-error text-sm py-2 w-full">
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
