// screens.config.ts を唯一の入力としてReact 実装 → 画面仕様書（Markdown）を自動生成するバッチ

// ローカル実行 / CI のどちらでもANTHROPIC_API_KEY を同じコードで扱えるようにする
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { ScreenConfig, screens } from "./screens.config";

// 「設定ミスなのに黙って失敗」を防ぐ
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set");
}

// Claude クライアント初期化
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 日付生成
const today = new Date().toISOString().split("T")[0];

// 「画面に紐づく複数ファイルを、Claude が読みやすい“教材”形式に整形する関数」
function readSourceFiles(files: string[]) {
  return files
    .map((filePath) => {
      const absolutePath = path.resolve(process.cwd(), filePath);

      // 開発途中でファイル構成が揺れても CIを落とさない
      if (!fs.existsSync(absolutePath)) {
        console.warn(`⚠️ File not found: ${filePath}`);
        return null;
      }

      const code = fs.readFileSync(absolutePath, "utf-8");
      return `
### ${filePath}
\`\`\`tsx
${code}
\`\`\`
`;
    })
    .filter(Boolean)
    .join("\n");
}

// すべての画面生成が終わったあと、index.md も更新する
function generateIndexMarkdown(screens: ScreenConfig[]) {
  const lines = [
    "# 画面仕様一覧",
    "",
    "本ディレクトリには、各画面の仕様書を格納しています。",
    "",
    "## 画面一覧",
    "",
    ...screens.map(
      (screen) => `- [${screen.name}](./${path.basename(screen.output)})`,
    ),
    "",
    "<!-- META -->",
    "- 自動生成: scripts/generate-screen-docs.ts",
    `- 最終更新日: ${today}`,
    "<!-- /META -->",
    "",
  ];

  return lines.join("\n");
}

const changedFiles =
  process.env.CHANGED_FILES?.split(",").filter(Boolean) ?? [];

console.log("Changed files from CI:", changedFiles);

async function run() {
  let targetScreens = screens;

  if (changedFiles.length > 0) {
    targetScreens = screens.filter((screen) =>
      screen.files.some((file) =>
        changedFiles.some((changed) => changed.includes(file)),
      ),
    );
  }

  console.log(
    "Screens to generate:",
    targetScreens.map((s) => s.id),
  );

  for (const screen of targetScreens) {
    console.log(`\n📄 Generating: ${screen.id}`);

    // ソースコード取得
    const sourceCode = readSourceFiles(screen.files);
    if (!sourceCode) {
      console.warn(`⚠️ No source files for ${screen.id}, skipped`);
      continue;
    }

    const prompt = `
あなたはシニアなフロントエンドエンジニアです。
以下の React コンポーネントを解析し、
**日本語で** 画面仕様ドキュメントを Markdown 形式で生成してください。

【出力ルール】
- すべて日本語で書くこと
- 推測ではなく、コードから読み取れる内容のみを書く
- 画面仕様として第三者が理解できる粒度にする
- META ブロックは絶対に削除・省略しない

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
8. 使用している コンポーネント
9. 使用している Hooks / Stores / API / Schema
10. 補足・制約

<!-- META -->
- 画面ID: ${screen.id}
- 最終更新日: ${today}
<!-- /META -->

# 実装コード
${sourceCode}
`;

    console.log("📨 Sending request to Claude...");

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2000,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // text だけを安全に結合
    const markdown = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const outputPath = path.resolve(process.cwd(), screen.output);
    // ファイル出力
    fs.mkdirSync(path.dirname(outputPath), { recursive: true }); // 初回生成でも落ちない
    fs.writeFileSync(outputPath, markdown); // 既存ファイルは完全に上書き

    console.log(`✅ Screen spec updated: ${screen.output}`);
  }

  // すべての画面生成が終わったあと
  const indexPath = path.resolve(process.cwd(), "docs/screens/index.md");
  const indexMarkdown = generateIndexMarkdown(screens);

  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.writeFileSync(indexPath, indexMarkdown);

  console.log("📘 Screen index updated: docs/screens/index.md");
}

run().catch((err) => {
  console.error("❌ Failed to generate screen docs");
  console.error(err);
  process.exit(1);
});
