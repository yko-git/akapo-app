import { execSync } from "child_process";

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

  for (const path of diff) {
    const parts = path.split("/");
    const featuresIndex = parts.indexOf("features");
    if (featuresIndex !== -1) {
      featureID.push(parts[featuresIndex + 1]);
    }
  }

  return [...new Set(featureID)];
}

// Featureのソースコード収集
function readSourceFiles(): string {
  const getFeatureID = getChangedFeatureIds();
}
