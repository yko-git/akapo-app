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

/**
 * git diff の比較元を決定
 */
function getBaseRef(): string {
  // GitHub Actions (PR)
  if (process.env.GITHUB_BASE_REF) {
    return `origin/${process.env.GITHUB_BASE_REF}`;
  }

  // ローカル・CI（origin/develop があればそれ）
  try {
    execSync("git show-ref --verify --quiet refs/remotes/origin/develop");
    return "origin/develop";
  } catch {}

  // 最後の保険
  return "HEAD~1";
}

/**
 * 差分があったファイル一覧を取得
 */
function getDiffFiles(files: string[]): string[] {
  const baseRef = getBaseRef();
  const fileList = files.join(" ");

  try {
    const diff = execSync(
      `git diff --name-only ${baseRef}...HEAD -- ${fileList}`,
      { encoding: "utf-8" },
    )
      .trim()
      .split("\n")
      .filter(Boolean);

    if (diff.length > 0) {
      console.log(`📝 Diff detected against ${baseRef}`);
      diff.forEach((f) => console.log(` - ${f}`));
    }

    return diff;
  } catch {
    console.warn("⚠️ git diff failed, fallback generate");
    return ["__UNKNOWN__"];
  }
}

/**
 * ファイルを安全に読む（存在しない場合はスキップ）
 */
function readSourceFiles(files: string[]): string {
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

function today(): string {
  return new Date().toISOString().split("T")[0];
}

async function generateScreenDoc() {
  for (const screen of screens) {
    console.log(`\n📄 Checking: ${screen.id}`);

    const diffFiles = getDiffFiles(screen.files);

    // 差分がなければスキップ
    if (diffFiles.length === 0) {
      console.log(`⏭ No changes: ${screen.id}`);
      continue;
    }

    console.log(`📄 Generating: ${screen.id}`);

    const sourceCode = readSourceFiles(screen.files);
    if (!sourceCode) {
      console.warn(`⚠️ No source files for ${screen.id}, skipped`);
      continue;
    }

    const outputPath = path.resolve(process.cwd(), screen.output);
    const isDiffMode = fs.existsSync(outputPath);
    const existingDoc = isDiffMode ? fs.readFileSync(outputPath, "utf-8") : "";

    const prompt = isDiffMode
      ? `
あなたはフロントエンドエンジニアです。

以下は **既存の画面仕様書** です。
この内容をベースに、
**実装コードの変更点のみを反映して更新してください。**

## 既存の画面仕様書
${existingDoc}

## 実装コード（変更後）
${sourceCode}

# 更新ルール
- 変更がない記述は残す
- 変更・追加された仕様のみを更新する
- 削除された挙動があれば反映する
- 不明な点は「コード上では不明」と明記する
- 既存仕様書の見出し構造は維持する
- META ブロック内の「最終更新日」は必ず今日の日付に更新する
- META ブロック以外は、変更点がある箇所のみ更新する
`
      : `
あなたはフロントエンドエンジニアです。
以下の React / Next.js の実装コードを解析し、
「画面仕様書」を **日本語のMarkdown** で生成してください。

# 画面仕様書：${screen.name}

<!-- META -->
- 画面ID: ${screen.id}
- 最終更新日: ${today()}
<!-- /META -->

---

## 画面概要

## URL

## 使用コンポーネント

## フォーム項目・表示要素

## 初期表示・デフォルト値

## ユーザー操作

## API連携

## バリデーション・エラーハンドリング

## 補足・制約

# 出力ルール
- 推測ではなく、コードから読み取れる内容を元に記述する
- 不明な点は「コード上では不明」と明記する

## 変更があったファイル
${diffFiles.map((f) => `- ${f}`).join("\n")}

# 実装コード
${sourceCode}
`;

    console.log("📨 Sending request to Claude...");

    const response = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
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
