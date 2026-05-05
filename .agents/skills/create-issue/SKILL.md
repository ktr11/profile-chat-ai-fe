---
name: create-issue
description: 会話の内容・PRの未完了タスク・議論の結論などをもとに、ktr11/profile-chat-ai-docs にissueを作成する。「issueにして」「issueつくって」のような依頼で使う。
---

# Create Issue

会話の内容や参照リソース（PR・ドキュメントなど）をもとに、`ktr11/profile-chat-ai-docs` に issue を作成します。

## 手順

1. 必要に応じて `gh pr view <number> --repo <owner>/<repo>` などで追加情報を取得する
2. 会話の文脈から issue の内容を組み立てる
3. 内容をユーザーに確認してから `gh issue create --repo ktr11/profile-chat-ai-docs --title "..." --body "..."` で作成する

## issueの構成

- **タイトル**: 対応内容を端的に表す日本語
- **## 背景**: なぜこのissueが必要か
- **## 対応方針**: 具体的に何をするか
- **## 関連**: 元のPR・会話・ドキュメントへのリンク（あれば）

## 注意

- `gh issue create` の実行前にユーザーの確認を取る
- 作成後は issue の URL を返す
