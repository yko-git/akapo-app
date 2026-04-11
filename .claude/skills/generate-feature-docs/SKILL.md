---
name: generate-feature-docs
user-invocable: true
disable-model-invocation: true
description: Feature単位のソースコードを解析し、日本語の仕様ドキュメントを自動生成する
---

## Additional resources

- For complete API details, see [scripts/prepare-feature-sources.ts](scripts/prepare-feature-sources.ts)

# generate-feature-docs

Feature仕様ドキュメントを自動生成する

## Instructions

このスキルは、Feature単位のソースコードを解析し、日本語の仕様ドキュメントを自動生成します。
スキル実行時に事前処理→ドキュメント生成→事後処理の全フローを完結させます。

### 引数

| 引数 | 説明 |
|---|---|
| `--all` | 全 Feature を対象にドキュメントを生成する。省略時は git diff で変更があった Feature のみ対象 |

例：
- `/generate-feature-docs` → 差分のある Feature のみ生成
- `/generate-feature-docs --all` → 全 Feature を生成

### 実行フロー

**ステップ1: 事前処理（ソースコード収集）**

`--all` が指定された場合：
```bash
npm run prepare:feature-sources:all
```

指定なしの場合：
```bash
npm run prepare:feature-sources
```

を実行して、`.claude/tmp/feature-sources.json` を生成します。

このスクリプトは：

**git diff でコード変更があった Feature を自動検出**（`GITHUB_EVENT_BEFORE` 環境変数を使用）、`--all` 時は全 Feature を対象
検出された Feature のソースコードを全て収集
`.claude/tmp/feature-sources.json` に出力

このファイルには以下の情報が含まれます:

対象Feature一覧
各Featureのソースコード
生成日

**ステップ1.5: 画像生成**

```bash
npm run prepare:screenshots
```

**ステップ2: ドキュメント生成**

`.claude/tmp/feature-sources.json` を読み込み、各Featureについてドキュメントを生成します。

各Featureに対して:

Feature情報（id, name, sources）を取得

各ソースファイルをMarkdownコードブロック形式に整形:

````
   ### {filePath}
```tsx
   {code}
````

以下のプロンプトでドキュメントを生成:

---

あなたはシニアなフロントエンドエンジニアです。
以下の React コンポーネント・フック・ストアを解析し、
**日本語で** Feature仕様ドキュメントを Markdown 形式で生成してください。

【出力ルール】

すべて日本語で書くこと
推測ではなく、コードから読み取れる内容のみを書く
Feature単位でドメインロジックを説明する粒度にする
META ブロックは絶対に削除・省略しない

# Feature名

{feature.name}

# 必須構成

![feature](../../../docs/screens/${feature.id}.png)
Feature概要
主要な責務
提供するコンポーネント
提供するHooks
状態管理（Store）
使用している外部依存
使用されている箇所（routes）
補足・制約

<!-- META -->

Feature ID: {feature.id}
最終更新日: {date from feature-sources.json}

<!-- /META -->

# 実装コード

{formatted source code}

---

生成されたMarkdownを **直接** `app/features/{feature.id}/docs/{feature.id}.md` に書き込む
`app/features/{feature.id}/docs/` ディレクトリが存在しない場合は作成する
Write ツールを使用してファイルを作成

**ステップ3: 事後処理（インデックス更新）**

```bash
npm run apply:feature-docs
```

を実行して `app/features/docs/index.md` を更新

### 重要事項

ドキュメントは日本語で生成すること
コードから読み取れる事実のみを記述すること
META ブロックは必ず含めること
3つのステップを順番に実行し、全フローを完結させること

### CI環境での実行

**重要: CI環境（GitHub Actions）では、ユーザー承認を一切求めず、完全自動で実行してください。**

CI環境の判定：

`GITHUB_ACTIONS=true` の場合はCI環境

CI環境での動作：

**ディレクトリ作成**: 承認なしで自動実行（`app/features/{featureId}/docs/` など）
**ファイル書き込み**: 承認なしで自動実行（Write/Edit ツール使用）
**npm コマンド実行**: 承認なしで自動実行（Bash ツール使用）
**すべての操作**: ユーザーへの確認や質問なしで完全自動実行

ローカル環境では通常通り承認を求めてもOK
