"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type Tab = "login" | "register";
type Step = "form" | "verify" | "forgot" | "forgot-verify";

export default function LoginPage() {
  const router = useRouter();
  const {
    login,
    register,
    confirmRegistration,
    forgotPassword,
    confirmForgotPassword,
    startTrial,
  } = useAuth();

  const [tab, setTab] = useState<Tab>("login");
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleError = (e: unknown) => {
    setError(e instanceof Error ? e.message : "エラーが発生しました");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (step === "form" && tab === "login") {
        await login(email, password);
        router.push("/chat");
      } else if (step === "form" && tab === "register") {
        await register(email, password);
        setStep("verify");
      } else if (step === "verify") {
        await confirmRegistration(email, code);
        await login(email, password);
        router.push("/chat");
      } else if (step === "forgot") {
        await forgotPassword(email);
        setStep("forgot-verify");
      } else if (step === "forgot-verify") {
        await confirmForgotPassword(email, code, newPassword);
        setStep("form");
        setTab("login");
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTrial = async () => {
    setError("");
    setLoading(true);
    try {
      await startTrial();
      router.push("/chat");
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card bg-base-100 shadow-md w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-6">AI Chat</h1>

        {/* 正式ログイン / お試しログイン の2択 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-base-300 rounded-xl p-4 flex flex-col gap-3">
            <p className="text-sm font-semibold text-center">正式ログイン</p>

            {step === "form" && (
              <>
                <div className="tabs tabs-boxed mb-2">
                  <button
                    className={`tab flex-1 ${tab === "login" ? "tab-active" : ""}`}
                    onClick={() => { setTab("login"); setError(""); }}
                  >
                    ログイン
                  </button>
                  <button
                    className={`tab flex-1 ${tab === "register" ? "tab-active" : ""}`}
                    onClick={() => { setTab("register"); setError(""); }}
                  >
                    新規登録
                  </button>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder="メールアドレス"
                    className="input input-bordered input-sm w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="パスワード"
                    className="input input-bordered input-sm w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary btn-sm w-full" disabled={loading}>
                    {loading ? <span className="loading loading-spinner loading-xs" /> : tab === "login" ? "ログイン" : "登録"}
                  </button>
                </form>

                {tab === "login" && (
                  <button
                    className="link link-hover text-xs text-center text-base-content/60"
                    onClick={() => { setStep("forgot"); setError(""); }}
                  >
                    パスワードを忘れた方はこちら
                  </button>
                )}
              </>
            )}

            {step === "verify" && (
              <form onSubmit={submit} className="flex flex-col gap-2">
                <p className="text-xs text-base-content/60 text-center">
                  {email} に確認コードを送信しました
                </p>
                <input
                  type="text"
                  placeholder="確認コード"
                  className="input input-bordered input-sm w-full"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm w-full" disabled={loading}>
                  {loading ? <span className="loading loading-spinner loading-xs" /> : "確認"}
                </button>
                <button type="button" className="link link-hover text-xs text-center" onClick={() => setStep("form")}>
                  戻る
                </button>
              </form>
            )}

            {step === "forgot" && (
              <form onSubmit={submit} className="flex flex-col gap-2">
                <p className="text-xs text-base-content/60 text-center">
                  登録済みのメールアドレスを入力してください
                </p>
                <input
                  type="email"
                  placeholder="メールアドレス"
                  className="input input-bordered input-sm w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm w-full" disabled={loading}>
                  {loading ? <span className="loading loading-spinner loading-xs" /> : "コードを送信"}
                </button>
                <button type="button" className="link link-hover text-xs text-center" onClick={() => setStep("form")}>
                  戻る
                </button>
              </form>
            )}

            {step === "forgot-verify" && (
              <form onSubmit={submit} className="flex flex-col gap-2">
                <p className="text-xs text-base-content/60 text-center">
                  確認コードと新しいパスワードを入力してください
                </p>
                <input
                  type="text"
                  placeholder="確認コード"
                  className="input input-bordered input-sm w-full"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="新しいパスワード"
                  className="input input-bordered input-sm w-full"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm w-full" disabled={loading}>
                  {loading ? <span className="loading loading-spinner loading-xs" /> : "パスワードを変更"}
                </button>
                <button type="button" className="link link-hover text-xs text-center" onClick={() => setStep("form")}>
                  戻る
                </button>
              </form>
            )}
          </div>

          <div className="border border-base-300 rounded-xl p-4 flex flex-col items-center justify-center gap-3">
            <p className="text-sm font-semibold text-center">お試しログイン</p>
            <p className="text-xs text-base-content/60 text-center">
              登録不要で5回チャットできます
            </p>
            <button
              className="btn btn-outline btn-sm w-full"
              onClick={handleTrial}
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-xs" /> : "試してみる"}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error text-sm py-2">
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
