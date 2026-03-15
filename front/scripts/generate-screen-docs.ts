// 画面仕様ドキュメント自動生成スクリプト

// 環境変数の読み込み
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { ScreenConfig, screens } from "./screens.config";

// 環境変数の検証
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set");
}

// Claude クライアント初期化
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 日付生成
const today = new Date().toISOString().split("T")[0];

// React コンポーネントのコードを読み込む関数
function readSourceFiles(files: string[]) {
  return files
    .map((filePath) => {
      // ファイルの絶対パスを生成
      const absolutePath = path.resolve(process.cwd(), filePath);

      // ファイルが存在しない場合は警告を出してスキップ
      if (!fs.existsSync(absolutePath)) {
        console.warn(`⚠️ File not found: ${filePath}`);
        return null;
      }
      // React コンポーネントのコードを読み込む
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

// 画面仕様のインデックスを生成する関数
function generateIndexMarkdown(screens: ScreenConfig[]) {
  const lines = [
    "# 画面仕様一覧",
    "",
    "本ディレクトリには、各画面の仕様書を格納しています。",
    "",
    "## 画面一覧",
    "",
    ...screens.map((screen) => {
      const relativePath = path.relative("docs/screens", screen.output);
      return `- [${screen.name}](${relativePath})`;
    }),
    "",
    "<!-- META -->",
    "- 自動生成: scripts/generate-screen-docs.ts",
    `- 最終更新日: ${today}`,
    "<!-- /META -->",
    "",
  ];

  return lines.join("\n");
}

// GitHub Actions から変更されたファイルのリストを受け取る（ローカル実行時は空配列）
const changedFiles =
  process.env.CHANGED_FILES?.split(/\r?\n|,/).filter(Boolean) ?? [];

console.log("Changed files from CI:", changedFiles);

// メイン処理
async function run() {
  // 対象スクリーンの絞り込み
  let targetScreens = screens;
  // 変更されたファイルがある場合は、それらのファイルを含むスクリーンのみを対象とする
  const normalizedChangedFiles = changedFiles.map((file) =>
    file.replace(/^front\//, ""),
  );

  // 変更されたファイルがある場合は、それらのファイルを含むスクリーンのみを対象とする
  if (changedFiles.length > 0) {
    targetScreens = screens.filter((screen) =>
      screen.files.some((file) => normalizedChangedFiles.includes(file)),
    );
  }

  // screenごとに処理を実行
  for (const screen of targetScreens) {
    console.log(`\n📄 Generating: ${screen.id}`);

    // ソースコード取得
    const sourceCode = readSourceFiles(screen.files);
    if (!sourceCode) {
      console.warn(`⚠️ No source files for ${screen.id}, skipped`);
      continue;
    }

    // プロンプト生成
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
2. ![screen](../../docs/screens/${screen.id}.png)
3. URL
4. フォーム項目・表示要素
5. 初期表示・デフォルト値
6. ユーザー操作
7. バリデーション・エラーハンドリング
8. 画面遷移
9. 使用している コンポーネント
10. 使用している Hooks / Stores / API / Schema
11. 補足・制約

<!-- META -->
- 画面ID: ${screen.id}
- 最終更新日: ${today}
<!-- /META -->

# 実装コード
${sourceCode}
`;

    // Claude API にプロンプトを送信して、画面仕様ドキュメントを生成
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
    // Markdown ファイルを書き出す（既存ファイルは完全に上書き）
    fs.mkdirSync(path.dirname(outputPath), { recursive: true }); // 初回生成でも落ちない
    fs.writeFileSync(outputPath, markdown); // 既存ファイルは完全に上書き
  }

  // すべての画面生成が終わったあと、index.md も更新する
  const indexPath = path.resolve(process.cwd(), "docs/screens/index.md");
  const indexMarkdown = generateIndexMarkdown(screens);

  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.writeFileSync(indexPath, indexMarkdown);
}

// エラーがあればキャッチしてログに出す
run().catch((err) => {
  console.error("❌ Failed to generate screen docs");
  console.error(err);
  process.exit(1);
});
