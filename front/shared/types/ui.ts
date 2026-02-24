import { PostWithComments } from "../stores";

// 選択肢の型
export type SelectOption = {
  value: string;
  label: string;
};

export type PostListProps = {
  posts: PostWithComments[];
};

export type FilterNavProps = {
  categoryFilter: string | null;
  userNameFilter: string | null;
};
