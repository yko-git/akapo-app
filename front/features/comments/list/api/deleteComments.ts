import { deleteComments as deleteCommentsApi } from "@/api/fetchData";

export const deleteComments = ({
  postId,
  commentId,
}: {
  postId: number;
  commentId: number;
}): Promise<void> => {
  return deleteCommentsApi({ postId, commentId });
};
