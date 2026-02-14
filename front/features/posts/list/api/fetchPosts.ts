import { fetchPosts as fetchPostsApi } from "@/shared/api/fetchData";
import { Post } from "@/types";

export const fetchPosts = (): Promise<Post[]> => {
  return fetchPostsApi();
};
