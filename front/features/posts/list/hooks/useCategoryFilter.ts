import { useSearchParams } from "next/navigation";

// カテゴリーフォームのカスタムフック
export const useCategoryFilter = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  // カテゴリが空文字列やnullの場合はnullに変換
  const normalizedCategory =
    category === null || category === "" ? null : category;
  // カテゴリが存在する場合はそのまま、存在しない場合はnullを返す
  return {
    category: normalizedCategory,
    isFiltered: normalizedCategory !== null,
  };
};
