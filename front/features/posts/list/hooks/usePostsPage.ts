import { useSearchParams } from "next/navigation";

// ページネーションの状態を管理するカスタムフック
export const usePostsPage = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  // ページ番号と表示件数を数値に変換
  const normalizedPage = Math.max(Number(page), 1);
  const normalizedLimit = Math.max(Number(limit), 1);
  const offset = (normalizedPage - 1) * normalizedLimit;

  // フィルタリングが適用されているかどうかを判定
  return {
    page: normalizedPage, // ページ番号は1以上に制限
    limit: normalizedLimit, // 表示件数は1以上に制限
    offset: offset, // オフセットの計算
  };
};
