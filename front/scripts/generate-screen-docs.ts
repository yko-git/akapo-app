import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import { screens } from "./screens.config";
import { execSync } from "child_process";

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set");
}

function getBaseRef(): string {
  // GitHub Actions (PR)
  if (process.env.GITHUB_BASE_REF) {
    return `origin/${process.env.GITHUB_BASE_REF}`;
  }

  // ローカル・CI（develop があればそれ）
  try {
    execSync("git show-ref --verify --quiet refs/remotes/origin/develop");
    return "origin/develop";
  } catch {}

  // 最後の保険
  return "HEAD~1";
}

// git diffを取るユーティリティ
function hasDiff(files: string[]): boolean {
  const baseRef = getBaseRef();
  const fileList = files.join(" ");

  try {
    const diff = execSync(
      `git diff --name-only ${baseRef}...HEAD -- ${fileList}`,
      { encoding: "utf-8" },
    ).trim();

    if (diff) {
      console.log(`📝 Diff detected against ${baseRef}`);
      console.log(diff);
    }

    return diff.length > 0;
  } catch (err) {
    console.warn(`⚠️ git diff failed, fallback skipped`);
    return true; // 失敗時は安全側（生成する）
  }
}

/**
 * ファイルを安全に読む（存在しない場合はスキップ）
 */
function readSourceFiles(files: string[]) {
  return files
    .map((filePath) => {
      const fullPath = path.resolve(process.cwd(), filePath);

      // ファイル存在チェック（開発途中・リファクタ途中にCIが落ちないように）
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

    // diffがなければcontinueする
    if (!hasDiff(screen.files)) {
      console.log(`⏭ No changes: ${screen.id}`);
      continue;
    }

    console.log(`\n📄 Generating: ${screen.id}`);

    const sourceCode = readSourceFiles(screen.files);
    if (!sourceCode) {
      console.warn(`⚠️ No source files for ${screen.id}, skipped`);
      continue;
    }
    const outputPath = path.resolve(process.cwd(), screen.output);

    // フル生成 / 差分生成のモード分岐
    const isDiffMode = fs.existsSync(outputPath);

    // 既存 md を読む
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
`
      : `
あなたはフロントエンドエンジニアです。
以下の React / Next.js の実装コードを解析し、
「画面仕様書」を **日本語のMarkdown** で生成してください。

# 画面名
${screen.name}

# 出力ルール
- Markdown形式
- 見出し構成は以下を必ず含める
  1. 画面概要
  2. URL
  3. 使用コンポーネント
  4. フォーム項目・表示要素
  5. 初期表示・デフォルト値
  6. ユーザー操作
  7. API連携
  8. バリデーション・エラーハンドリング
  9. 補足・制約
- 推測ではなく、コードから読み取れる内容を元に記述する
- 不明な点は「コード上では不明」と明記する

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

    // Claude SDKの型エラー対策
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
