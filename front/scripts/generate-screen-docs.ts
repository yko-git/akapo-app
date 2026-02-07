import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import { screens } from "./screens.config";
import { execSync } from "child_process";

dotenv.config();

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set");
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const FORCE_REGENERATE = process.env.FORCE_REGENERATE === "true";

/**
 * 差分比較の base ref を決定
 */
function getBaseRef(): string {
  // GitHub Actions（PR）
  if (process.env.GITHUB_BASE_REF) {
    return `origin/${process.env.GITHUB_BASE_REF}`;
  }

  // ローカル / CI（develop があれば）
  try {
    execSync("git show-ref --verify --quiet refs/remotes/origin/develop");
    return "origin/develop";
  } catch {}

  // フォールバック
  return "HEAD~1";
}

/**
 * 対象ファイルに git 差分があるか
 */
function hasGitDiff(files: string[]): boolean {
  const baseRef = getBaseRef();
  const fileList = files.join(" ");

  try {
    const diff = execSync(
      `git diff --name-only ${baseRef}...HEAD -- ${fileList}`,
      { encoding: "utf-8" },
    ).trim();

    if (diff) {
      console.log(`📝 Git diff detected against ${baseRef}`);
      console.log(diff);
    }

    return diff.length > 0;
  } catch {
    console.warn("⚠️ git diff failed, fallback to generate");
    return true;
  }
}

/**
 * ソースコードを安全に読む
 */
function readSourceFiles(files: string[]) {
  return files
    .map((filePath) => {
      const fullPath = path.resolve(process.cwd(), filePath);
      if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️ File not found, skipped: ${filePath}`);
        return null;
      }
      return `// ===== ${filePath} =====\n${fs.readFileSync(fullPath, "utf-8")}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

async function generateScreenDoc() {
  for (const screen of screens) {
    console.log(`\n📄 Checking: ${screen.id}`);

    // Git 差分がなければ即スキップ
    if (!FORCE_REGENERATE && !hasGitDiff(screen.files)) {
      console.log(`⏭ No git changes: ${screen.id}`);
      continue;
    }

    const sourceCode = readSourceFiles(screen.files);
    if (!sourceCode) {
      console.warn(`⚠️ No source files for ${screen.id}, skipped`);
      continue;
    }

    const outputPath = path.resolve(process.cwd(), screen.output);
    const hasExistingDoc = fs.existsSync(outputPath);
    const existingDoc = hasExistingDoc
      ? fs.readFileSync(outputPath, "utf-8")
      : "";

    /**
     * ===== フェーズ1：UI差分判定 =====
     */
    if (hasExistingDoc) {
      const diffCheckPrompt = `
あなたはUI仕様レビュー担当です。

以下の「既存の画面仕様書」と「変更後の実装コード」を比較し、
**UI仕様として意味のある変更があるかどうか**を判定してください。

## 既存の画面仕様書
${existingDoc}

## 変更後の実装コード
${sourceCode}

# 判定基準（UIとして意味があるもの）
- UI文言の変更（例：タイトル → 題名）
- 表示項目の追加・削除
- 操作手順の変更
- バリデーション挙動の変更
- 画面遷移の変更

# 無視するもの
- 実装の書き方の変更
- hooks / stores の追加・削除・変更（UIに影響しない限り）
- リファクタのみ
- UIに影響しない内部処理

# 出力形式（必ずJSONのみ）
{
  "hasDiff": true | false,
  "reason": "UI上の差分内容を1文で"
}
`;

      const diffCheckResponse = await client.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 300,
        messages: [{ role: "user", content: diffCheckPrompt }],
      });

      const diffJsonText = diffCheckResponse.content
        .filter((c) => c.type === "text")
        .map((c: any) => c.text)
        .join("");

      let diffResult: { hasDiff: boolean; reason: string };
      try {
        diffResult = JSON.parse(diffJsonText);
      } catch {
        console.warn("⚠️ Failed to parse diff JSON, fallback to generate");
        diffResult = { hasDiff: true, reason: "判定失敗のため更新" };
      }

      if (!diffResult.hasDiff) {
        console.log(`⏭ UI差分なし: ${screen.id}`);
        console.log(`理由: ${diffResult.reason}`);
        continue; // ★ md を一切書き換えない
      }

      console.log(`✏️ UI差分あり: ${diffResult.reason}`);
    }

    /**
     * ===== フェーズ2：仕様書生成 / 更新 =====
     */
    console.log(`📄 Generating: ${screen.id}`);

    const today = new Date().toISOString().split("T")[0];

    const prompt = hasExistingDoc
      ? `
あなたはプロダクト仕様書を書くUXエンジニアです。

以下は **既存の画面仕様書** です。
この内容を維持したまま、
**UI仕様として意味のある変更点のみ**を反映してください。

## 既存の画面仕様書
${existingDoc}

## 変更後の実装コード
${sourceCode}

# 重要ルール
- UIの文言・表示・操作・画面遷移・バリデーション挙動のみを書く
- あわせて「使用している Hooks / Stores」セクションを更新する
- Hooks / Stores の名前と責務は記載してよい
- ただしコード断片・型定義・実装詳細は書かない
- UI上の変更がない箇所は書き換えない
- 見出し構成は変更しない
- META ブロック内の「最終更新日」のみ ${today} に更新する
- 変更点は「変更内容」セクションに簡潔に列挙する
`
      : `
あなたはプロダクト仕様書を書くUXエンジニアです。

以下の実装コードを解析し、
画面仕様書を **日本語Markdown** で作成してください。

# 画面名
${screen.name}

# 必須構成
1. 画面概要
2. URL
3. フォーム項目・表示要素
4. 初期表示・デフォルト値
5. ユーザー操作
6. バリデーション・エラーハンドリング
7. 画面遷移
8. 使用しているコンポーネント
9. 使用している Hooks / Stores
10. 補足・制約

<!-- META -->
- 画面ID: ${screen.id}
- 最終更新日: ${today}
<!-- /META -->

# 実装コード
${sourceCode}
`;

    const response = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const markdown = response.content
      .filter((c) => c.type === "text")
      .map((c: any) => c.text)
      .join("");

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, markdown);

    console.log(`✅ Updated: ${screen.output}`);
  }
}

generateScreenDoc().catch((err) => {
  console.error("❌ Failed to generate screen docs");
  console.error(err);
  process.exit(1);
});
