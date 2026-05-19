# フロントエンド UI 設計指針

## DaisyUI 採用の理由

### Tailwind CSS 単体の課題

Tailwind CSS は強力なユーティリティファーストフレームワークですが、チャット UI のような複雑なコンポーネントをゼロから組むと、クラス名が肥大化しやすい問題があります。

```html
<!-- Tailwind CSS 単体: クラス名が冗長 -->
<div class="flex flex-col max-w-xs rounded-2xl bg-blue-500 text-white px-4 py-2
            text-sm leading-relaxed shadow-md ml-auto mr-2 mt-1">
  こんにちは！
</div>
```

### DaisyUI の解決策

DaisyUI は Tailwind CSS のプラグインとして動作し、意味論的なコンポーネントクラスを提供します。

```html
<!-- DaisyUI: シンプルで読みやすい -->
<div class="chat chat-end">
  <div class="chat-bubble chat-bubble-primary">こんにちは！</div>
</div>
```

### 設定

Tailwind CSS v4 + DaisyUI プラグイン構文を使用しています。

```css
/* src/app/globals.css */
@import "tailwindcss";
@plugin "daisyui" {
  themes: light;
}
```

テーマは `light` 固定です。

## チャット UI コンポーネント設計

### コンポーネント構成

```
src/app/chat/page.tsx     — チャットページ（状態管理・API通信）
src/components/ChatBubble.tsx — メッセージ吹き出し
src/components/ChatInput.tsx  — メッセージ入力フォーム
```

### ChatBubble

ユーザーと AI のメッセージを DaisyUI の `chat` コンポーネントで表示します。

```tsx
// src/components/ChatBubble.tsx
interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

export default function ChatBubble({ message, isUser }: ChatBubbleProps) {
  return (
    <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
      <div className={`chat-bubble ${isUser ? "chat-bubble-primary" : ""}`}>
        {message}
      </div>
    </div>
  );
}
```

- ユーザーメッセージ: 右寄せ（`chat-end`）+ primary カラー
- AI メッセージ: 左寄せ（`chat-start`）+ デフォルトカラー

### ChatInput

メッセージ入力フォーム。DaisyUI の `input` と `btn` クラスを使用。

```tsx
// src/components/ChatInput.tsx
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}
```

- `disabled` で送信中やチャット上限到達時に入力を無効化
- 空文字の送信を防止（`!input.trim()` チェック）
- フォーム送信後に入力欄を自動クリア

### ChatPage（チャット画面全体）

```tsx
// src/app/chat/page.tsx の構成
<div className="flex flex-col h-screen bg-base-200">
  <header>  — ナビバー（タイトル + お試し回数表示 + ログアウト）
  <div>     — メッセージ一覧（スクロール可能）
  <ChatInput> — 入力フォーム（画面下部固定）
</div>
```

#### 主な機能

- **初期メッセージ**: AI からの挨拶メッセージを表示
- **チャット制限**: お試しユーザーは上限（デフォルト5回/日）に達すると入力が無効化
- **認証チェック**: 未認証時は `/login` にリダイレクト
- **送信中状態**: `sending` フラグで二重送信を防止

#### API 通信

現在は JSON ポーリング方式です（SSE ストリーミングは将来実装予定）。

```
POST /api/chat → BFF Route Handler → FastAPI POST /chat
レスポンス: { reply: string, chat_count: number, chat_limit: number }
```

## 使用している DaisyUI コンポーネント

| クラス | 用途 |
|--------|------|
| `chat`, `chat-start`, `chat-end` | メッセージの左右配置 |
| `chat-bubble`, `chat-bubble-primary` | メッセージ吹き出し |
| `input`, `input-bordered` | テキスト入力 |
| `btn`, `btn-primary`, `btn-ghost`, `btn-sm` | ボタン |
| `navbar`, `navbar-start`, `navbar-end` | ヘッダーナビ |
| `loading`, `loading-spinner`, `loading-lg` | ローディング表示 |
| `bg-base-100`, `bg-base-200`, `border-base-300` | 背景・ボーダー |
