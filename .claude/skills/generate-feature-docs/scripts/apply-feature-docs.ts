import * as fs from "node:fs";
import path from "node:path";
// app/features/docs/index.md を更新する

type FeatureSource = {
  id: string;
  name: string;
};

function generateIndexContent(): string {
  const featurePath = path.resolve(
    __dirname,
    "../../../tmp/feature-sources.json",
  );
  const sourceData = JSON.parse(fs.readFileSync(featurePath, "utf-8"));
  const featureLinks = sourceData.features
    .map((f: FeatureSource) => `- [${f.id}](../${f.name}/docs/${f.name}.md)`)
    .join("\n");

  return `# Feature一覧\n\n${featureLinks}`;
}

function main() {
  const indexContent = generateIndexContent();
  fs.mkdirSync(path.resolve(__dirname, "../../../../front/features/docs"), {
    recursive: true,
  });
  fs.writeFileSync(
    path.resolve(__dirname, "../../../../front/features/docs/index.md"),
    indexContent,
  );
}
main();
