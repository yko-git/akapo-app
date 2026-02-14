import { fetchUserPosts as fetchUserPostsApi } from "@/shared/api/fetchData";
import { Post } from "@/types";

export const fetchUserPosts = (): Promise<Post[] | null> => {
  return fetchUserPostsApi();
};
