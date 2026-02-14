import { deletePost as deletePostApi } from "@/shared/api/fetchData";

export const deletePost = ({ id }: { id: number }): Promise<void> => {
  return deletePostApi({ id });
};
