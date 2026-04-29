# CLAUDE.md — エージェント向けコンテキストファイル

このファイルは Claude Code および AI エージェントが本リポジトリを理解するための「真実の源（Single Source of Truth）」です。

## プロジェクト概要

**profile-chat-ai-fe** は、AIポートフォリオチャットアプリ「profile-chat-ai」のフロントエンド（Next.js）リポジトリです。  
ブラウザ向け UI と、Python AIバックエンドへの SSE 中継 BFF（Route Handlers）を担います。

設計ドキュメントは [`profile-chat-ai-docs/`](./profile-chat-ai-docs/) を参照してください。

## システム内での役割

```
ブラウザ
  │
  ▼
【このリポジトリ】
Next.js (App Router)   ← UI + BFF
  │  Tailwind CSS + DaisyUI
  │  Route Handlers — SSE 中継 / 認証ゲート
  │
  ▼ HTTP SSE
FastAPI (Python)       ← AIバックエンド（別リポジトリ）
  │  LangGraph + Amazon Bedrock (Claude Haiku 3.5)
  ├── Amazon DynamoDB（チェックポインター）
  └── Amazon S3 Vectors（RAG ストア）
```

## 技術スタック

| 項目 | 内容 |
|-----|------|
| フレームワーク | Next.js 14+ — App Router, TypeScript |
| UI ライブラリ | Tailwind CSS + DaisyUI |
| パッケージマネージャ | pnpm |
| Node.js 管理 | fnm（`.node-version` で固定） |
| BFF | Next.js Route Handlers（Edge Runtime） |
| 主要ランタイム設定 | `"use client"` / `"use server"` 明示 |

## ディレクトリ構造

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # SSE 中継 BFF（Edge Runtime）
│   ├── chat/
│   │   └── page.tsx            # チャット画面
│   ├── components/
│   │   ├── ChatBubble.tsx      # DaisyUI chat-bubble ラッパー
│   │   └── ChatInput.tsx       # 入力フォーム
│   ├── hooks/
│   │   └── useChat.ts          # SSE ストリーミング受信フック
│   └── layout.tsx              # テーマ永続化（DaisyUI data-theme）
├── lib/
│   └── session.ts              # セッション ID 管理
profile-chat-ai-docs/           # シンボリックリンク（別リポジトリ）
```

## ビルド・開発コマンド

```bash
# 依存関係インストール
pnpm install

# 開発サーバー起動（http://localhost:3000）
pnpm dev

# 型チェック
pnpm tsc --noEmit

# リント
pnpm lint

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start
```

## 環境変数

`.env.local` に以下を設定します（`.env.local.example` を参照）。

| 変数名 | 説明 | 例 |
|-------|------|----|
| `PYTHON_API_URL` | AIバックエンドの URL | `http://localhost:8000` |
| `INTERNAL_API_KEY` | BFF からバックエンドへの内部認証トークン | `secret-token` |
| `NEXTAUTH_SECRET` | NextAuth.js シークレット（認証使用時） | — |

## コーディング規約

### ファイル・コンポーネント
- コンポーネントは `PascalCase`、フック・ユーティリティは `camelCase`
- Server Component がデフォルト。クライアント操作が必要な場合のみ `"use client"` を宣言
- Route Handler は `export const runtime = "edge"` で Edge Runtime を使用

### SSE ストリーミング
- BFF の Route Handler は Python API のレスポンス `body` を `ReadableStream` として直接パイプ
- フロントの SSE 受信は `useChat` フックに集約する
- SSE イベントタイプ: `token` / `tool_start` / `tool_end` / `done` / `error`（仕様は [`docs/api/streaming-spec.md`](./profile-chat-ai-docs/docs/api/streaming-spec.md) を参照）

### UI / スタイル
- スタイルは Tailwind CSS + DaisyUI の意味論的クラスを優先する
- `chat`, `chat-bubble`, `btn`, `input`, `navbar`, `loading` などの DaisyUI コンポーネントクラスを活用
- テーマ切り替えは `<html data-theme="...">` 属性のみで制御し、CSS 変数は直接操作しない

### 型安全
- `any` 型は使用しない。外部 API のレスポンスは `zod` 等でバリデーションする
- SSE イベントのペイロード型は共通の型定義ファイルで管理する

## 重要な設計方針

1. **SSE 中継**: BFF は Python API のストリームを `ReadableStream` でそのままクライアントへパイプする。バッファリングしない
2. **認証ゲート**: `INTERNAL_API_KEY` はサーバーサイドのみで保持し、クライアントに露出させない
3. **セッション管理**: `session_id` は `localStorage` またはクッキーで保持し、LangGraph のチェックポインタと対応させる
4. **テーマ永続化**: `localStorage` の `"theme"` キーに保存し、`layout.tsx` の `useEffect` で `data-theme` に反映する

## 関連リポジトリ

| リポジトリ | 役割 |
|-----------|------|
| `profile-chat-ai-fe`（本リポジトリ） | Next.js FE + BFF |
| `profile-chat-api`（別リポジトリ） | FastAPI + LangGraph AIバックエンド |
| `profile-chat-ai-docs`（別リポジトリ・ローカルではシンボリックリンクで参照） | 設計・仕様ドキュメント |

## 参照ドキュメント

- [システム全体構成](./profile-chat-ai-docs/docs/architecture/overall.md)
- [SSE ストリーミング仕様](./profile-chat-ai-docs/docs/api/streaming-spec.md)
- [フロントエンド UI 設計指針](./profile-chat-ai-docs/docs/frontend/ui-design.md)
- [ローカル開発環境構築](./profile-chat-ai-docs/docs/development/local-setup.md)
- [AWS リソース設計](./profile-chat-ai-docs/docs/infrastructure/aws-resources.md)
