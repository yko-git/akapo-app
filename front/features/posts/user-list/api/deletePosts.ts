import { deletePost as deletePostApi } from "@/api/fetchData";

export const deletePost = ({ id }: { id: number }): Promise<void> => {
  return deletePostApi({ id });
};
