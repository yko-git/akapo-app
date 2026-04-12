import Anthropic from "@anthropic-ai/sdk";
import * as fs from "node:fs";
import * as path from "node:path";

const client = new Anthropic();

type FeatureSource = {
  id: string;
  name: string;
  sources: { filePath: string; code: string }[];
};

type SourceData = {
  generatedAt: string;
  features: FeatureSource[];
};

function formatSources(sources: FeatureSource["sources"]): string {
  return sources
    .map((s) => `### ${s.filePath}\n\`\`\`tsx\n${s.code}\`\`\``)
    .join("\n\n");
}

function buildPrompt(feature: FeatureSource, generatedAt: string): string {
  return `あなたはシニアなフロントエンドエンジニアです。
以下の React コンポーネント・フック・ストアを解析し、
**日本語で** Feature仕様ドキュメントを Markdown 形式で生成してください。

【出力ルール】
- すべて日本語で書くこと
- 推測ではなく、コードから読み取れる内容のみを書く
- Feature単位でドメインロジックを説明する粒度にする
- META ブロックは絶対に削除・省略しない
- Markdownのみ出力すること（前後に説明文を付けない）

# Feature名

${feature.name}

# 必須構成（この順序で出力すること）

\`\`\`
# Feature名
{name}

![feature](../../../docs/screens/${feature.id}.png)

## Feature概要
## 主要な責務
## 提供するコンポーネント
## 提供するHooks
## 状態管理（Store）
## 使用している外部依存
## 使用されている箇所（routes）
## 補足・制約

<!-- META -->
Feature ID: ${feature.id}
最終更新日: ${generatedAt}
<!-- /META -->

# 実装コード
{formatted source code}
\`\`\`

# 実装コード

${formatSources(feature.sources)}`;
}

async function generateDoc(
  feature: FeatureSource,
  generatedAt: string,
): Promise<string> {
  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: buildPrompt(feature, generatedAt),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text;
}

async function main() {
  const featurePath = path.resolve(
    __dirname,
    "../../../tmp/feature-sources.json",
  );
  const sourceData: SourceData = JSON.parse(
    fs.readFileSync(featurePath, "utf-8"),
  );

  if (sourceData.features.length === 0) {
    console.log("No features to generate docs for.");
    return;
  }

  for (const feature of sourceData.features) {
    console.log(`Generating docs for: ${feature.id}`);

    const docContent = await generateDoc(feature, sourceData.generatedAt);

    const docsDir = path.resolve(
      __dirname,
      `../../../../front/features/${feature.id}/docs`,
    );
    fs.mkdirSync(docsDir, { recursive: true });

    const docPath = path.join(docsDir, `${feature.id}.md`);
    fs.writeFileSync(docPath, docContent);
    console.log(`Written: ${docPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
