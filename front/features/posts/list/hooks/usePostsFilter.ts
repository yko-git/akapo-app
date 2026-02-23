import { useSearchParams } from "next/navigation";

// ユーザー別投稿一覧のフィルタリングを管理するカスタムフック
export const usePostsFilter = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");

  // ユーザーが null または空文字の場合は null に変換
  const normalizedUserPosts = userId === null || userId === "" ? null : userId;
  // フィルタリングが適用されているかどうかを判定
  return {
    userId: normalizedUserPosts,
    isFiltered: normalizedUserPosts !== null,
  };
};
