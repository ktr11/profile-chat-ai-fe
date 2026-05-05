---
name: create-pr
description: 現在のブランチの変更内容をもとに、現在のリポジトリに PR を作成する。「PR作成して」「PRつくって」のような依頼で使う。
---

# Create PR

現在のブランチの変更内容をもとに、現在のリポジトリに PR を作成します。

## 手順

1. `git status` と `git log main..HEAD --oneline` と `git diff main...HEAD --stat` で変更の全体像を把握する
2. 会話の文脈と変更内容から PR のタイトル・本文を組み立てる
3. 内容をユーザーに確認してから `gh pr create` で作成する

## PRの構成

- **タイトル**: `<type>: <端的な日本語説明>`（例: `feat: チャット画面にローディング表示を追加`）
  - type は `feat` / `fix` / `refactor` / `docs` / `chore` から選ぶ
- **## 概要**: 変更内容を箇条書きで3点以内
- **## 動作確認**: 動作確認手順のチェックリスト
- **##リンク**: 対応 issueや関連prがあればリンクを列挙する。なければナシを書く。prの内容でissueが完了になるならば、 `Closes <URL>`を追記。

## 注意

- `gh pr create` の実行前にユーザーの確認を取る
- ブランチが remote に push 済みであることを前提とする。未 push の場合はユーザーに伝える
- 作成後は PR の URL を返す
