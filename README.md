# profile-chat-ai-fe

AIエージェント搭載ポートフォリオアプリ「profile-chat-ai」の **フロントエンド（Next.js）** リポジトリです。

## 概要

Next.js App Router で構築したチャット UI と、Python バックエンド（FastAPI）への JSON 中継 BFF を提供します。  
プロジェクト横断の設計ドキュメントは [`profile-chat-ai-docs`](https://github.com/ktr11/profile-chat-ai-docs) を参照してください。

## 技術スタック

| 項目 | 内容 |
|-----|------|
| フレームワーク | Next.js 14+ (App Router / TypeScript) |
| UI | Tailwind CSS + DaisyUI |
| パッケージマネージャ | pnpm |
| Node.js 管理 | fnm |
| BFF | Next.js Route Handlers (Node.js Runtime) |

## クイックスタート

```bash
# Node.js バージョン合わせ（fnm 使用）
fnm use

# 依存関係インストール
pnpm install

# 環境変数設定
cp .env.local.example .env.local
# PYTHON_API_URL=http://localhost:8000 を編集

# 開発サーバー起動
pnpm dev
```

http://localhost:3000 でアプリが起動します。AIバックエンドも別途起動が必要です（`profile-chat-api` リポジトリを参照）。

## 主要コマンド

```bash
pnpm dev        # 開発サーバー
pnpm build      # 本番ビルド
pnpm start      # 本番サーバー
pnpm lint       # ESLint
pnpm tsc --noEmit  # 型チェック
```

## ドキュメント

| ドキュメント | 内容 |
|------------|------|
| [CLAUDE.md](./CLAUDE.md) | AIエージェント向け開発ガイド（ビルドコマンド・規約・設計方針） |
| [UI 設計指針](./docs/ui-design.md) | DaisyUI コンポーネント設計 |
| [システム全体構成](https://github.com/ktr11/profile-chat-ai-docs/blob/main/docs/architecture/overall.md) | アーキテクチャ図・データフロー |
