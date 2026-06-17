import * as fs from "node:fs";
import { execSync } from "child_process";
import path from "path";

const FEATURES_DIR = path.resolve(process.cwd(), "features");

const FEATURE_ROUTES: Record<string, string> = {
  auth: "/login",
  posts: "/",
  comments: "/posts/65",
  users: "/mypage",
  profile: "/profile",
  about: "/about",
};

// git diff で変更された Feature ID を取得
function getChangedFeatureIds(): string[] {
  const before = process.env.GITHUB_EVENT_BEFORE;
  const diffRange = before ? `${before}...HEAD` : "HEAD";
  const diff = execSync(`git diff --name-only ${diffRange}`)
    .toString()
    .split("\n")
    .filter(Boolean);

  const ids: string[] = [];
  for (const filePath of diff) {
    const parts = filePath.split("/");
    const idx = parts.indexOf("features");
    if (idx !== -1 && parts[idx + 1]) {
      ids.push(parts[idx + 1]);
    }
  }
  return [...new Set(ids)];
}

// docs/{id}.md が存在しない Feature ID を取得
function getUndocumentedFeatureIds(): string[] {
  if (!fs.existsSync(FEATURES_DIR)) return [];

  return fs
    .readdirSync(FEATURES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "docs")
    .map((d) => d.name)
    .filter((id) => {
      const docPath = path.join(FEATURES_DIR, id, "docs", `${id}.md`);
      return !fs.existsSync(docPath);
    });
}

// Feature のソースコードを収集（docs/ 配下は除く）
function readSourceFiles(featureId: string): { filePath: string; code: string }[] {
  const featureDir = path.join(FEATURES_DIR, featureId);
  if (!fs.existsSync(featureDir)) return [];

  const files = fs.readdirSync(featureDir, { encoding: "utf8", recursive: true }) as string[];

  return files
    .filter(
      (file) =>
        !file.startsWith("docs") &&
        (file.endsWith(".ts") || file.endsWith(".tsx"))
    )
    .map((file) => ({
      filePath: file,
      code: fs.readFileSync(path.join(featureDir, file), "utf-8"),
    }));
}

function main() {
  const changedIds = getChangedFeatureIds();
  const undocumentedIds = getUndocumentedFeatureIds();

  // 両方をマージして重複排除
  const featureIds = [...new Set([...changedIds, ...undocumentedIds])];

  console.log("Changed features:", changedIds);
  console.log("Undocumented features:", undocumentedIds);
  console.log("Target features:", featureIds);

  const features = featureIds.map((id) => ({
    id,
    name: id,
    route: FEATURE_ROUTES[id] ?? null,
    sources: readSourceFiles(id),
  }));

  const output = {
    generatedAt: new Date().toISOString().split("T")[0],
    features,
  };

  const tmpDir = path.resolve(__dirname, "../../../tmp");
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(path.join(tmpDir, "feature-sources.json"), JSON.stringify(output, null, 2));
  console.log(`Written: ${path.join(tmpDir, "feature-sources.json")}`);
}

main();
