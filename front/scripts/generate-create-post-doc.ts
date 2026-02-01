import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";

// ========= 設定 =========
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 対象ファイル
const FILES = [
  "app/posts/new/page.tsx",
  "components/posts/createPost/index.tsx",
];

// 出力先
const OUTPUT_PATH = "docs/screens/create-post.md";

// プロンプト
const PROMPT_PATH = "prompt.txt";

// ========= 実行 =========
async function run() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const prompt = fs.readFileSync(PROMPT_PATH, "utf-8");

  const codeBlocks = FILES.map((filePath) => {
    const absolutePath = path.resolve(filePath);
    const code = fs.readFileSync(absolutePath, "utf-8");

    return `
### ${filePath}
\`\`\`tsx
${code}
\`\`\`
`;
  }).join("\n");

  const message = `${prompt}

Below are the source files:

${codeBlocks}
`;

  console.log("📨 Sending request to Claude...");

  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 2000,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });

  const markdown = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, markdown);

  console.log(`✅ Screen spec updated: ${OUTPUT_PATH}`);
}

run().catch((err) => {
  console.error("❌ Failed to generate screen doc");
  console.error(err);
  process.exit(1);
});
