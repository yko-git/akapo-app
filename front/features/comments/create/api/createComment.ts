import { createComment as createCommentApi } from "@/api/fetchData";
import { Comment, NewComment } from "@/types";

export const createComment = (
  postId: number,
  postData: NewComment,
): Promise<Comment> => {
  return createCommentApi(postId, postData);
};
