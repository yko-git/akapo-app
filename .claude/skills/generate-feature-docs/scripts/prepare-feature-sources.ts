import * as fs from "node:fs";
import { execSync } from "child_process";
import path from "path";

// 変更されたFeatureの検出
function getChangedFeatureIds(): string[] {
  // CI: GITHUB_EVENT_BEFORE があれば git diff {before}...HEAD
  // ローカル: git diff HEAD（未コミットの変更）
  const before = process.env.GITHUB_EVENT_BEFORE;
  const diffRange = before ? `${before}...HEAD` : `HEAD`;
  const featureID = [];
  // git diff で変更ファイルを取得
  const diff = execSync(`git diff --name-only ${diffRange}`)
    .toString()
    .split("\n")
    .filter(Boolean);

  for (const filePath of diff) {
    const parts = filePath.split("/");
    const featuresIndex = parts.indexOf("features");
    if (featuresIndex !== -1) {
      featureID.push(parts[featuresIndex + 1]);
    }
  }

  return [...new Set(featureID)];
}

// Featureのソースコード収集
function readSourceFiles(
  featureId: string,
): { filePath: string; code: string }[] {
  // process.cwd()で現在の作業ディレクトリを取得し、path.resolveでそれを基準にfeatures/featureIdを結合して絶対パスを生成
  const featureDir = path.resolve(process.cwd(), "features", featureId);
  const files = fs.readdirSync(featureDir, {
    encoding: "utf8",
    recursive: true,
  });

  const sources = files
    .filter(
      (file) =>
        !file.startsWith("docs") &&
        (file.endsWith(".ts") || file.endsWith(".tsx")),
    )
    .map((file) => ({
      filePath: file,
      code: fs.readFileSync(path.resolve(featureDir, file), "utf-8"), // readFileSync（同期処理メソッド）で同期的にファイルを読み込む
    }));

  return sources;
}

// 各 Feature のルートを設定
const FEATURE_ROUTES: Record<string, string> = {
  auth: "/login",
  posts: "/",
  comments: "/posts/65",
  users: "/mypage",
  profile: "/profile",
  about: "/about",
};

function main() {
  // 1. 変更された Feature ID を取得（--all フラグで全件対象）
  const all = process.argv.includes("--all");
  const featureIds = all ? Object.keys(FEATURE_ROUTES) : getChangedFeatureIds();
  // 2. 各 Feature のソースコードを収集
  const features = featureIds.map((id) => ({
    id,
    name: id,
    route: FEATURE_ROUTES[id] ?? null,
    sources: readSourceFiles(id),
  }));
  // 3. JSON に出力
  const output = {
    generatedAt: new Date().toISOString().split("T")[0],
    features,
  };
  fs.mkdirSync(path.resolve(__dirname, "../../../tmp"), { recursive: true });
  const featurePath = path.resolve(
    __dirname,
    "../../../tmp/feature-sources.json",
  );
  fs.writeFileSync(featurePath, JSON.stringify(output, null, 2));
}

main();
