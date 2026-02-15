import { fetchPosts as fetchPostsApi } from "@/shared/api/fetchData";
import { Post } from "@/shared/types";

export const fetchPosts = (): Promise<Post[]> => {
  return fetchPostsApi();
};
