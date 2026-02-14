import { fetchComments as fetchCommentsApi } from "@/shared/api/fetchData";

export const fetchComments = ({ postId }: { postId: number }) => {
  return fetchCommentsApi({ postId });
};
