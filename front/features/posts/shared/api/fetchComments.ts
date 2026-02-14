import { fetchComments as fetchCommentsApi } from "@/api/fetchData";

export const fetchComments = ({ postId }: { postId: number }) => {
  return fetchCommentsApi({ postId });
};
