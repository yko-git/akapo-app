import * as fs from "node:fs";
// app/features/docs/index.md を更新する

type FeatureSource = {
  id: string;
  name: string;
};

function generateIndexContent(): string {
  const sourceDataPath = ".claude/tmp/feature-sources.json";
  const sourceData = JSON.parse(fs.readFileSync(sourceDataPath, "utf-8"));
  const featureLinks = sourceData.features
    .map((f: FeatureSource) => `- [${f.id}](../${f.name}/docs/feature.md)`)
    .join("\n");

  return `# Feature一覧\n\n${featureLinks}`;
}

function main() {
  const indexContent = generateIndexContent();
  fs.mkdirSync("app/features/docs", { recursive: true });
  fs.writeFileSync("app/features/docs/index.md", indexContent);
}
main();
