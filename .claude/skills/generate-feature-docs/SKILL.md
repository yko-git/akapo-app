---
name: generate-feature-docs
user-invocable: true
description: Feature単位のソースコードを解析し、日本語の仕様ドキュメントを自動生成する。git diffで変更されたFeatureおよびdocsがまだ存在しないFeatureを対象にする。「仕様書を生成して」「ドキュメントを更新して」「feature-docsを作って」と言われたとき、またはFeatureのコードを修正したあとに必ずこのスキルを使うこと。
---

## Additional resources

- For complete API details, see [scripts/prepare-feature-sources.ts](scripts/prepare-feature-sources.ts)

# generate-feature-docs

Feature仕様ドキュメントを自動生成する

## Instructions

このスキルは、Feature単位のソースコードを解析し、日本語の仕様ドキュメントを自動生成します。
スキル実行時に事前処理→スクリーンショット→ドキュメント生成→事後処理の全フローを完結させます。

### 対象Featureの決定ルール

以下の**両方**を対象とする:

1. **git diff で変更があった Feature**（`GITHUB_EVENT_BEFORE` 環境変数を使用。ローカルは `HEAD` との差分）
2. **`features/{id}/docs/{id}.md` が存在しない Feature**（新規 Feature や未生成のもの）

### 実行フロー

**ステップ1: 事前処理（ソースコード収集）**

```bash
npm run prepare:feature-sources
```

を実行して `.claude/tmp/feature-sources.json` を生成する。

このスクリプトは:
- git diff で変更された Feature を検出
- `features/{id}/docs/{id}.md` が存在しない Feature を追加検出
- 各 Feature の `features/{id}/` 配下のソースコード（`.ts` / `.tsx`、`docs/` 除く）を収集
- `.claude/tmp/feature-sources.json` に出力

**ステップ1.5: スクリーンショット生成（ローカルのみ）**

CI環境（`GITHUB_ACTIONS=true`）ではスキップする。
ローカルでは開発サーバーが起動していることを確認してから:

```bash
npm run prepare:screenshots
```

スクリーンショットは `docs/screens/{feature.id}.png` に保存される。

**ステップ2: ドキュメント生成**

`.claude/tmp/feature-sources.json` を読み込み、各 Feature についてドキュメントを生成する。

各 Feature のソースファイルを以下の形式に整形:

```
### {filePath}
\`\`\`tsx
{code}
\`\`\`
```

以下のプロンプトでドキュメントを生成:

---

あなたはシニアなフロントエンドエンジニアです。
以下の React コンポーネント・フック・ストアを解析し、
**日本語で** Feature仕様ドキュメントを Markdown 形式で生成してください。

【出力ルール】
- すべて日本語で書くこと
- 推測ではなく、コードから読み取れる内容のみを書く
- Feature単位でドメインロジックを説明する粒度にする
- META ブロックは絶対に削除・省略しない
- Markdownのみ出力すること（前後に説明文を付けない）

# Feature名

{feature.name}

# 必須構成（この順序で出力すること）

![feature](../../../docs/screens/{feature.id}.png)

## Feature概要
## 主要な責務
## 提供するコンポーネント
## 提供するHooks
## 状態管理（Store）
## 使用している外部依存
## 使用されている箇所（routes）
## 補足・制約

<!-- META -->
Feature ID: {feature.id}
最終更新日: {generatedAt}
<!-- /META -->

# 実装コード

{formatted source code}

---

生成された Markdown を **直接** `features/{feature.id}/docs/{feature.id}.md` に書き込む。
`features/{feature.id}/docs/` ディレクトリが存在しない場合は作成する。
Write ツールを使用してファイルを作成する。

**ステップ3: 事後処理（インデックス更新）**

```bash
npm run apply:feature-docs
```

を実行して `features/docs/index.md` を更新する。
既存エントリは保持し、今回対象の Feature のみ追加・上書きする。

### 重要事項

- ドキュメントは日本語で生成すること
- コードから読み取れる事実のみを記述すること
- META ブロックは必ず含めること
- 4つのステップを順番に実行し、全フローを完結させること

### CI環境での実行

**重要: CI環境（GitHub Actions）では、ユーザー承認を一切求めず、完全自動で実行してください。**

CI環境の判定: `GITHUB_ACTIONS=true` の場合はCI環境

CI環境での動作:
- **ステップ1.5（スクリーンショット）はスキップ**
- ドキュメント生成・ファイル書き込みは承認なしで自動実行
- すべての操作をユーザーへの確認なしで完全自動実行
