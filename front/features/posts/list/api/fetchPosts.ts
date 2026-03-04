import { fetchPosts as fetchPostsApi } from "@/shared/api/fetchData";
import { Post } from "@/shared/types";

export const fetchPosts = ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) => {
  return fetchPostsApi({ limit, offset });
};
