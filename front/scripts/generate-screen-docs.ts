import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { screens } from "./screens.config";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set");
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function readSourceFiles(files: string[]) {
  return files
    .map((filePath) => {
      const absolutePath = path.resolve(process.cwd(), filePath);
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

async function run() {
  for (const screen of screens) {
    console.log(`\n📄 Generating: ${screen.id}`);

    const sourceCode = readSourceFiles(screen.files);
    if (!sourceCode) {
      console.warn(`⚠️ No source files for ${screen.id}, skipped`);
      continue;
    }

    const today = new Date().toISOString().split("T")[0];

    const prompt = `
あなたはシニアなフロントエンドエンジニアです。
以下の React コンポーネントを解析し、
**日本語で** 画面仕様ドキュメントを Markdown 形式で生成してください。

【出力ルール】
- すべて日本語で書くこと
- 推測ではなく、コードから読み取れる内容のみを書く
- 画面仕様として第三者が理解できる粒度にする

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
9. 使用している Hooks / Stores
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

    const markdown = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const outputPath = path.resolve(process.cwd(), screen.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, markdown);

    console.log(`✅ Screen spec updated: ${screen.output}`);
  }
}

run().catch((err) => {
  console.error("❌ Failed to generate screen docs");
  console.error(err);
  process.exit(1);
});
