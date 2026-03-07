import { createComment as createCommentApi } from "@/shared/api/fetchData";
import { Comment, NewComment } from "@/shared/types";

export const createComment = (
  postId: number,
  postData: NewComment,
): Promise<Comment> => {
  return createCommentApi(postId, postData);
};
