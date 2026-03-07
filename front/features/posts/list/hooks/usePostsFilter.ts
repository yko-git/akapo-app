import { useSearchParams } from "next/navigation";

// ユーザー別投稿一覧のフィルタリングを管理するカスタムフック
export const usePostsFilter = () => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("user");

  // ユーザーが null または空文字の場合は null に変換
  const normalizedUserPosts =
    userName === null || userName === "" ? null : userName;
  // フィルタリングが適用されているかどうかを判定
  return {
    userName: normalizedUserPosts,
    isFiltered: normalizedUserPosts !== null,
  };
};
