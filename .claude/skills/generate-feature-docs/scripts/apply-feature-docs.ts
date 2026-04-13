import * as fs from "node:fs";
import path from "node:path";

type FeatureSource = {
  id: string;
  name: string;
};

const INDEX_PATH = path.resolve(
  __dirname,
  "../../../../front/features/docs/index.md"
);

// 既存の index.md からエントリを読み込む
function loadExistingEntries(): Map<string, string> {
  const entries = new Map<string, string>();
  if (!fs.existsSync(INDEX_PATH)) return entries;

  for (const line of fs.readFileSync(INDEX_PATH, "utf-8").split("\n")) {
    const match = line.match(/^- \[(.+?)\]\((.+?)\)$/);
    if (match) entries.set(match[1], match[2]);
  }
  return entries;
}

function generateIndexContent(): string {
  const featurePath = path.resolve(__dirname, "../../../tmp/feature-sources.json");
  const sourceData = JSON.parse(fs.readFileSync(featurePath, "utf-8"));

  // 既存エントリに今回の対象を上書き・追加
  const entries = loadExistingEntries();
  for (const f of sourceData.features as FeatureSource[]) {
    entries.set(f.id, `../${f.name}/docs/${f.name}.md`);
  }

  const featureLinks = [...entries.entries()]
    .map(([id, link]) => `- [${id}](${link})`)
    .join("\n");

  return `# Feature一覧\n\n${featureLinks}`;
}

function main() {
  const indexContent = generateIndexContent();
  fs.mkdirSync(path.dirname(INDEX_PATH), { recursive: true });
  fs.writeFileSync(INDEX_PATH, indexContent);
  console.log(`Updated: ${INDEX_PATH}`);
}

main();
